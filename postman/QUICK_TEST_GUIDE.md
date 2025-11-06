# Quick Test Guide - MathFlash API

## 📦 Import vào Postman

1. Mở Postman
2. Click **Import** → Chọn file `postman/COMPLETE_API_COLLECTION.json`
3. Collection sẽ xuất hiện với tất cả endpoints

## 🔑 Setup Authentication

1. Login với user account (Student/Teacher/Admin)
2. Copy JWT token từ response
3. Trong Postman:
   - Click vào collection **MathFlash Complete API Collection**
   - Tab **Variables**
   - Set `authToken` = token của bạn
   - Save

Hoặc set trong từng request:
- Header: `Authorization: Bearer YOUR_TOKEN`

## 📝 Test Workflow Hoàn Chỉnh

### Bước 1: Tạo Deck (Teacher)
```
POST /api/deck/teacher/create
{
    "title": "Math Basics",
    "description": "Basic math",
    "isPublic": true,
    "difficulty": "easy"
}
```
→ Copy `_id` → Set vào variable `deckId`

### Bước 2: Tạo Flashcards (Teacher)
Tạo ít nhất 4 flashcards để có đủ options khi generate:

```
POST /api/flashcard/teacher/create
{
    "deck_id": "{{deckId}}",
    "question": "What is 2 + 2?",
    "answer": "4",
    "tag": "algebra",
    "status": "easy"
}
```
→ Copy `_id` → Set vào `flashcardId1`, `flashcardId2`, etc.

Tạo thêm 3 flashcards nữa với question/answer khác nhau.

### Bước 3: Tạo Exam (Teacher)
```
POST /api/exam/teacher/create
{
    "title": "Test Exam",
    "description": "Test exam",
    "flashcards": ["{{flashcardId1}}", "{{flashcardId2}}", "{{flashcardId3}}", "{{flashcardId4}}"],
    "time_limit": 60,
    "isPublic": true
}
```
→ Copy `_id` → Set vào `examId`

### Bước 4: Student làm bài
```
POST /api/submission/student/start/{{examId}}
```
→ Hệ thống tự động generate 4 options cho mỗi flashcard
→ Copy `submission._id` → Set vào `submissionId`

### Bước 5: Nộp câu trả lời
```
POST /api/submission/student/submit-answer/{{submissionId}}
{
    "flashcard_id": "{{flashcardId1}}",
    "selected_option": "B"
}
```

### Bước 6: Nộp bài và xem kết quả
```
POST /api/submission/student/finish/{{submissionId}}
```
→ Hệ thống tự động chấm điểm và trả về kết quả chi tiết

## 📋 JSON Test Data

Xem file `postman/COMPLETE_API_TEST_DATA.json` để có đầy đủ các ví dụ JSON.

## 🔍 Swagger Documentation

Truy cập: `http://localhost:3000/api-docs` để xem Swagger UI với đầy đủ API documentation.

## ⚡ Quick Copy-Paste Examples

### Tạo Flashcard đơn giản:
```json
{
    "deck_id": "PASTE_DECK_ID",
    "question": "What is 2 + 2?",
    "answer": "4",
    "tag": "algebra",
    "status": "easy"
}
```

### Tạo Exam:
```json
{
    "title": "Math Final Exam",
    "description": "Final exam",
    "flashcards": ["FLASHCARD_ID_1", "FLASHCARD_ID_2", "FLASHCARD_ID_3", "FLASHCARD_ID_4"],
    "time_limit": 90,
    "isPublic": true
}
```

### Nộp câu trả lời:
```json
{
    "flashcard_id": "FLASHCARD_ID",
    "selected_option": "B"
}
```

Happy Testing! 🚀


