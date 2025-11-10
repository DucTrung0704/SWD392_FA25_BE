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
      let errorMessage = error.message || 'OpenAI API error';
      
      // Provide more specific error messages
      if (errorMessage.includes('Incorrect API key') || errorMessage.includes('Invalid API key')) {
        errorMessage = 'API key không hợp lệ. Vui lòng kiểm tra lại OPENAI_API_KEY trong file .env';
      } else if (errorMessage.includes('quota') || errorMessage.includes('billing')) {
        errorMessage = 'Tài khoản OpenAI đã hết quota hoặc chưa nạp tiền. Vui lòng kiểm tra billing tại https://platform.openai.com/account/billing';
      } else if (errorMessage.includes('rate limit')) {
        errorMessage = 'Đã vượt quá giới hạn rate limit. Vui lòng thử lại sau vài phút.';
      }
      
      return res.status(error.status || 500).json({
        success: false,
        message: errorMessage,
        error: error.type || 'api_error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Không thể tạo câu hỏi. Vui lòng thử lại.',
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
      let errorMessage = error.message || 'OpenAI API error';
      
      // Provide more specific error messages
      if (errorMessage.includes('Incorrect API key') || errorMessage.includes('Invalid API key')) {
        errorMessage = 'API key không hợp lệ. Vui lòng kiểm tra lại OPENAI_API_KEY trong file .env';
      } else if (errorMessage.includes('quota') || errorMessage.includes('billing')) {
        errorMessage = 'Tài khoản OpenAI đã hết quota hoặc chưa nạp tiền. Vui lòng kiểm tra billing tại https://platform.openai.com/account/billing';
      } else if (errorMessage.includes('rate limit')) {
        errorMessage = 'Đã vượt quá giới hạn rate limit. Vui lòng thử lại sau vài phút.';
      }
      
      return res.status(error.status || 500).json({
        success: false,
        message: errorMessage,
        error: error.type || 'api_error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Không thể tạo flashcard. Vui lòng thử lại.',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Validate/Review a question using AI
 * POST /api/ai/validate-question
 */
export const validateQuestion = async (req, res) => {
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

    const { question, options, correctOption, answer, tag, difficulty, subject, explanation } = req.body;

    // Validate input
    if (!question || !options || !correctOption) {
      return res.status(400).json({
        success: false,
        message: 'Question, options, and correctOption are required'
      });
    }

    // Create prompt for AI to validate the question
    const systemPrompt = `You are an expert educator reviewing multiple-choice questions. 
Your task is to evaluate the quality, clarity, and educational value of a question.

IMPORTANT: You must carefully check if the marked correct answer is actually correct based on the question content. If the answer is wrong, you MUST clearly state this.

CRITICAL: If the subject is Mathematics, you MUST check if the question is actually related to Mathematics. If the question is NOT about Mathematics (e.g., it's about history, literature, science, etc.), you MUST set "isSubjectRelevant" to false and clearly state this in the feedback.

Analyze the question and provide feedback in JSON format:
{
  "isValid": true/false,
  "overallScore": 0-100,
  "isSubjectRelevant": true/false,
  "subjectRelevance": "Is this question actually about ${subject || 'Mathematics'}? If NO, clearly state 'Câu hỏi này không liên quan đến ${subject || 'Toán học'}' or 'This question is not related to ${subject || 'Mathematics'}'. If YES, state 'Câu hỏi liên quan đến ${subject || 'Toán học'}' or 'This question is related to ${subject || 'Mathematics'}'. Be specific about why.",
  "feedback": {
    "clarity": "Is the question clear and unambiguous?",
    "difficulty": "Does the difficulty match the stated level?",
    "options": "Are all options plausible? Are distractors effective?",
    "correctness": "CRITICAL: Is the marked correct answer actually correct? If NO, clearly state 'Đáp án không đúng' or 'The answer is incorrect'. If YES, state 'Đáp án đúng' or 'The answer is correct'. Be specific about why.",
    "educationalValue": "Does this question test understanding effectively?"
  },
  "suggestions": [
    "Specific suggestions for improvement"
  ],
  "strengths": [
    "What the question does well"
  ],
  "issues": [
    "Any problems or concerns. If the answer is wrong, include 'Đáp án được đánh dấu không đúng' or 'The marked answer is incorrect'. If the question is not about ${subject || 'Mathematics'}, include 'Câu hỏi này không liên quan đến ${subject || 'Toán học'}' or 'This question is not related to ${subject || 'Mathematics'}'"
  ],
  "recommendedDifficulty": "easy/medium/hard",
  "isReady": true/false,
  "isAnswerCorrect": true/false,
  "correctOption": "A/B/C/D - The actual correct option based on the question. Return the option letter (A, B, C, or D) that is the correct answer. If the marked answer is correct, return the same option. If wrong, return the actual correct option."
}

Be thorough but constructive. Provide specific, actionable feedback. If the answer is wrong, make it VERY clear in the correctness field and set isAnswerCorrect to false. If the question is not about ${subject || 'Mathematics'}, make it VERY clear and set isSubjectRelevant to false.`;

    const userPrompt = `Please review this multiple-choice question:

Question: ${question}

Options:
A: ${options.A || ''}
B: ${options.B || ''}
C: ${options.C || ''}
D: ${options.D || ''}

Correct Answer: ${correctOption}
${answer ? `Answer Text: ${answer}` : ''}
${tag ? `Tag: ${tag}` : ''}
${difficulty ? `Stated Difficulty: ${difficulty}` : ''}
${subject ? `Subject: ${subject}` : ''}
${explanation ? `Explanation: ${explanation}` : ''}

Please evaluate:
1. Is the question clear and well-written?
2. Are all options (A, B, C, D) plausible?
3. Is the marked correct answer (${correctOption}) actually correct? If not, which option (A, B, C, or D) is the correct answer?
4. Does the difficulty level match the question complexity?
5. Are there any ambiguities or issues?
6. What improvements could be made?

CRITICAL: You must determine which option (A, B, C, or D) is the actual correct answer based on the question content. Return this in the "correctOption" field. If the marked answer is correct, return the same option. If wrong, return the actual correct option.

Provide your analysis in the JSON format specified.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3, // Lower temperature for more consistent evaluation
      max_tokens: 1500,
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

    // Format response
    const aiCorrectOption = parsedResponse.correctOption || correctOption; // AI's suggested correct option
    const isAnswerCorrect = parsedResponse.isAnswerCorrect !== false && 
                           (aiCorrectOption.toUpperCase() === correctOption.toUpperCase()); // Default to true if not specified
    const correctnessFeedback = parsedResponse.feedback?.correctness || '';
    const correctnessLower = correctnessFeedback.toLowerCase();
    
    // Check if AI explicitly says answer is wrong
    const answerIsIncorrect = parsedResponse.isAnswerCorrect === false ||
                              correctnessLower.includes('không đúng') ||
                              correctnessLower.includes('sai') ||
                              correctnessLower.includes('incorrect') ||
                              correctnessLower.includes('wrong') ||
                              correctnessLower.includes('không chính xác') ||
                              correctnessLower.includes('the answer is incorrect') ||
                              correctnessLower.includes('the marked answer is incorrect') ||
                              (aiCorrectOption.toUpperCase() !== correctOption.toUpperCase());

    // Check if question is relevant to subject
    const isSubjectRelevant = parsedResponse.isSubjectRelevant !== false; // Default to true if not specified
    const subjectRelevanceFeedback = parsedResponse.subjectRelevance || '';
    const subjectRelevanceLower = subjectRelevanceFeedback.toLowerCase();
    const subjectIsNotRelevant = parsedResponse.isSubjectRelevant === false ||
                                 subjectRelevanceLower.includes('không liên quan') ||
                                 subjectRelevanceLower.includes('not related') ||
                                 subjectRelevanceLower.includes('không phải') ||
                                 subjectRelevanceLower.includes('is not about');

    const validationResult = {
      isValid: parsedResponse.isValid !== false && !answerIsIncorrect && isSubjectRelevant && !subjectIsNotRelevant,
      overallScore: parsedResponse.overallScore || 0,
      feedback: parsedResponse.feedback || {},
      suggestions: parsedResponse.suggestions || [],
      strengths: parsedResponse.strengths || [],
      issues: parsedResponse.issues || [],
      recommendedDifficulty: parsedResponse.recommendedDifficulty || difficulty || 'medium',
      isReady: parsedResponse.isReady !== false && !answerIsIncorrect && isSubjectRelevant && !subjectIsNotRelevant,
      isAnswerCorrect: !answerIsIncorrect,
      isSubjectRelevant: isSubjectRelevant && !subjectIsNotRelevant,
      subjectRelevance: parsedResponse.subjectRelevance || subjectRelevanceFeedback,
      correctOption: aiCorrectOption.toUpperCase(), // AI's suggested correct option
      currentOption: correctOption.toUpperCase() // Current marked option
    };

    res.json({
      success: true,
      message: 'Question validation completed',
      validation: validationResult
    });

  } catch (error) {
    console.error('Error validating question with AI:', error);
    
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
      message: error.message || 'Failed to validate question',
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
