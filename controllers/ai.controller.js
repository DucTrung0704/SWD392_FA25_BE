/**
 * Generate questions using AI
 * POST /api/ai/generate-questions
 */
export const generateQuestions = async (req, res) => {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        success: false,
        message: 'AI service is not configured. Please set OPENAI_API_KEY in .env file.'
      });
    }

    // Dynamic import to avoid errors if package not installed
    let OpenAI;
    let openai;
    try {
      const openaiModule = await import('openai');
      OpenAI = openaiModule.default;
      openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    } catch (importError) {
      return res.status(503).json({
        success: false,
        message: 'OpenAI package not installed. Please run: npm install openai'
      });
    }

    const { topic, subject, difficulty, count = 5, tag } = req.body;

    // Validate input
    if (!topic || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Topic and subject are required'
      });
    }

    // Validate count (1-10)
    const questionCount = Math.min(Math.max(parseInt(count) || 5, 1), 10);
    const difficultyLevel = difficulty || 'medium';
    const questionTag = tag || 'other';

    // Create prompt for AI
    const systemPrompt = `You are an expert educator creating educational multiple-choice questions. 
Generate questions in JSON format with the following structure:
{
  "questions": [
    {
      "question": "The question text",
      "options": {
        "A": "Option A text",
        "B": "Option B text",
        "C": "Option C text",
        "D": "Option D text"
      },
      "correctOption": "A",
      "answer": "The correct answer text (same as the correct option)",
      "explanation": "Brief explanation of why this is correct",
      "tag": "${questionTag}",
      "difficulty": "${difficultyLevel}"
    }
  ]
}

Requirements:
- Generate exactly ${questionCount} questions
- All questions must be about ${topic} in ${subject}
- Difficulty level: ${difficultyLevel}
- Each question must have 4 options (A, B, C, D)
- Only return valid JSON, no markdown formatting
- Make questions educational and appropriate for students`;

    const userPrompt = `Generate ${questionCount} ${difficultyLevel} level multiple-choice questions about ${topic} in the subject of ${subject}. 
Make sure the questions are clear, educational, and test understanding of the topic.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    // Parse AI response
    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    // Parse JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (parseError) {
      // Try to extract JSON from markdown if present
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON response from AI');
      }
    }

    // Validate and format questions
    const questions = parsedResponse.questions || parsedResponse.question || [];
    
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('No questions generated');
    }

    // Valid tags and difficulties
    const validTags = ['geometry', 'algebra', 'probability', 'calculus', 'statistics', 'other'];
    const validDifficulties = ['easy', 'medium', 'hard'];
    
    // Normalize tag - map common variations to valid tags
    const normalizeTag = (tag) => {
      if (!tag) return questionTag;
      const lowerTag = tag.toLowerCase();
      // Map common variations
      if (lowerTag.includes('geometry') || lowerTag.includes('hình học')) return 'geometry';
      if (lowerTag.includes('algebra') || lowerTag.includes('đại số')) return 'algebra';
      if (lowerTag.includes('probability') || lowerTag.includes('xác suất')) return 'probability';
      if (lowerTag.includes('calculus') || lowerTag.includes('giải tích')) return 'calculus';
      if (lowerTag.includes('statistics') || lowerTag.includes('thống kê')) return 'statistics';
      // Default to provided tag if valid, otherwise use questionTag
      return validTags.includes(lowerTag) ? lowerTag : questionTag;
    };
    
    // Normalize difficulty
    const normalizeDifficulty = (diff) => {
      if (!diff) return difficultyLevel;
      const lowerDiff = diff.toLowerCase();
      return validDifficulties.includes(lowerDiff) ? lowerDiff : difficultyLevel;
    };

    // Format questions to match our schema
    const formattedQuestions = questions.map((q, index) => ({
      question: q.question || `Question ${index + 1}`,
      answer: q.answer || (q.options && q.options[q.correctOption]) || '',
      options: q.options || { A: '', B: '', C: '', D: '' },
      correctOption: q.correctOption || 'A',
      tag: normalizeTag(q.tag),
      difficulty: normalizeDifficulty(q.difficulty),
      explanation: q.explanation || '',
      isActive: true
    }));

    res.json({
      success: true,
      message: `Generated ${formattedQuestions.length} questions successfully`,
      questions: formattedQuestions,
      count: formattedQuestions.length
    });

  } catch (error) {
    console.error('Error generating questions with AI:', error);
    
    // Handle OpenAI API errors
    if (error.status || error.response) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || 'OpenAI API error',
        error: error.type || 'api_error'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate questions',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Generate flashcards using AI
 * POST /api/ai/generate-flashcards
 */
export const generateFlashcards = async (req, res) => {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        success: false,
        message: 'AI service is not configured. Please set OPENAI_API_KEY in .env file.'
      });
    }

    // Dynamic import to avoid errors if package not installed
    let OpenAI;
    let openai;
    try {
      const openaiModule = await import('openai');
      OpenAI = openaiModule.default;
      openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    } catch (importError) {
      return res.status(503).json({
        success: false,
        message: 'OpenAI package not installed. Please run: npm install openai'
      });
    }

    const { topic, subject, difficulty, count = 5, tag } = req.body;

    // Validate input
    if (!topic || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Topic and subject are required'
      });
    }

    // Validate count (1-20 for flashcards, can be more than questions)
    const flashcardCount = Math.min(Math.max(parseInt(count) || 5, 1), 20);
    const difficultyLevel = difficulty || 'medium';
    const flashcardTag = tag || 'other';

    // Create prompt for AI - flashcards are simpler than questions
    const systemPrompt = `You are an expert educator creating educational flashcards. 
Generate flashcards in JSON format with the following structure:
{
  "flashcards": [
    {
      "question": "The question or term on the front of the card",
      "answer": "The answer or definition on the back of the card",
      "tag": "${flashcardTag}",
      "status": "${difficultyLevel}"
    }
  ]
}

Requirements:
- Generate exactly ${flashcardCount} flashcards
- All flashcards must be about ${topic} in ${subject}
- Difficulty level: ${difficultyLevel}
- Question should be clear and concise (front of card)
- Answer should be informative and educational (back of card)
- Only return valid JSON, no markdown formatting
- Make flashcards educational and appropriate for students
- Questions can be terms, concepts, or short questions
- Answers should be definitions, explanations, or concise responses`;

    const userPrompt = `Generate ${flashcardCount} ${difficultyLevel} level flashcards about ${topic} in the subject of ${subject}. 
Each flashcard should have a clear question/term on the front and an informative answer/definition on the back.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 3000,
      response_format: { type: 'json_object' }
    });

    // Parse AI response
    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    // Parse JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (parseError) {
      // Try to extract JSON from markdown if present
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON response from AI');
      }
    }

    // Validate and format flashcards
    const flashcards = parsedResponse.flashcards || parsedResponse.flashcard || [];
    
    if (!Array.isArray(flashcards) || flashcards.length === 0) {
      throw new Error('No flashcards generated');
    }

    // Valid tags and difficulties
    const validTags = ['geometry', 'algebra', 'probability', 'calculus', 'statistics', 'other'];
    const validDifficulties = ['easy', 'medium', 'hard'];
    
    // Normalize tag - map common variations to valid tags
    const normalizeTag = (tag) => {
      if (!tag) return flashcardTag;
      const lowerTag = tag.toLowerCase();
      // Map common variations
      if (lowerTag.includes('geometry') || lowerTag.includes('hình học')) return 'geometry';
      if (lowerTag.includes('algebra') || lowerTag.includes('đại số')) return 'algebra';
      if (lowerTag.includes('probability') || lowerTag.includes('xác suất')) return 'probability';
      if (lowerTag.includes('calculus') || lowerTag.includes('giải tích')) return 'calculus';
      if (lowerTag.includes('statistics') || lowerTag.includes('thống kê')) return 'statistics';
      // Default to provided tag if valid, otherwise use flashcardTag
      return validTags.includes(lowerTag) ? lowerTag : flashcardTag;
    };
    
    // Normalize difficulty/status
    const normalizeStatus = (status) => {
      if (!status) return difficultyLevel;
      const lowerStatus = status.toLowerCase();
      return validDifficulties.includes(lowerStatus) ? lowerStatus : difficultyLevel;
    };

    // Format flashcards to match our schema
    const formattedFlashcards = flashcards.map((fc, index) => ({
      question: fc.question || `Flashcard ${index + 1}`,
      answer: fc.answer || '',
      tag: normalizeTag(fc.tag),
      status: normalizeStatus(fc.status || fc.difficulty)
    }));

    res.json({
      success: true,
      message: `Generated ${formattedFlashcards.length} flashcards successfully`,
      flashcards: formattedFlashcards,
      count: formattedFlashcards.length
    });

  } catch (error) {
    console.error('Error generating flashcards with AI:', error);
    
    // Handle OpenAI API errors
    if (error.status || error.response) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || 'OpenAI API error',
        error: error.type || 'api_error'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate flashcards',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Health check for AI service
 * GET /api/ai/health
 */
export const aiHealthCheck = async (req, res) => {
  try {
    // Simple test to check if API key is valid
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        success: false,
        message: 'OpenAI API key not configured',
        configured: false
      });
    }

    // Check if package is installed
    try {
      await import('openai');
      res.json({
        success: true,
        message: 'AI service is available',
        configured: true,
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo'
      });
    } catch (importError) {
      res.status(503).json({
        success: false,
        message: 'OpenAI package not installed',
        configured: false,
        installCommand: 'npm install openai'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'AI service health check failed',
      error: error.message
    });
  }
};
