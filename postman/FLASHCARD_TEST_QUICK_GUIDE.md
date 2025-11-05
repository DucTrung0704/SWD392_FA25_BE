# Flashcard API - Quick Test Guide

Hướng dẫn nhanh để test Flashcard API với dữ liệu JSON đã chuẩn bị.

## 📋 Các Endpoints

### 👨‍🏫 Teacher Routes (Cần token Teacher/Admin)
- `POST /api/flashcard/teacher/create` - Tạo flashcard mới
- `PUT /api/flashcard/teacher/update/:id` - Cập nhật flashcard
- `DELETE /api/flashcard/teacher/delete/:id` - Xóa flashcard

### 👩‍🎓 Student Routes (Cần token)
- `GET /api/flashcard/student/all` - Lấy tất cả flashcards
- `GET /api/flashcard/student/:id` - Lấy flashcard theo ID
- `GET /api/flashcard/student/deck/:deckId` - Lấy flashcards theo deck

## 🚀 Copy & Paste JSON để Test

### 1️⃣ Tạo Flashcard (POST /api/flashcard/teacher/create)

**Basic Example:**
```json
{
    "deck_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "question": "What is 2 + 2?",
    "answer": "4",
    "tag": "arithmetic",
    "note": "Basic addition problem"
}
```

**Minimal (chỉ cần question và answer):**
```json
{
    "deck_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "question": "What is the capital of France?",
    "answer": "Paris"
}
```

**Long Content:**
```json
{
    "deck_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "question": "Explain the Pythagorean theorem and provide an example.",
    "answer": "The Pythagorean theorem states that in a right triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides. Formula: a² + b² = c². Example: In a right triangle with sides a=3 and b=4, the hypotenuse c = √(3² + 4²) = √25 = 5.",
    "tag": "geometry",
    "note": "Important theorem for right triangles"
}
```

**Math Formula:**
```json
{
    "deck_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "question": "What is the derivative of f(x) = x²?",
    "answer": "f'(x) = 2x",
    "tag": "calculus",
    "note": "Power rule for derivatives"
}
```

### 2️⃣ Cập nhật Flashcard (PUT /api/flashcard/teacher/update/:id)

**Cập nhật tất cả:**
```json
{
    "question": "What is 3 + 3?",
    "answer": "6",
    "tag": "arithmetic-updated",
    "note": "Updated note"
}
```

**Chỉ cập nhật question:**
```json
{
    "question": "What is 4 + 4?"
}
```

**Chỉ cập nhật answer:**
```json
{
    "answer": "8"
}
```

**Cập nhật question và answer:**
```json
{
    "question": "What is 5 + 5?",
    "answer": "10"
}
```

### 3️⃣ Lấy Flashcards theo Deck (GET /api/flashcard/student/deck/:deckId)

Không cần body, chỉ cần:
- **URL**: `/api/flashcard/student/deck/{deckId}`
- **Headers**: `Authorization: Bearer YOUR_TOKEN`

**Lưu ý:** Student chỉ có thể xem flashcards từ decks có `isPublic: true`

## ⚠️ Test Cases - Invalid Data

### Missing Required Fields
```json
// Missing deck_id
{
    "question": "What is 2 + 2?",
    "answer": "4"
}
```

```json
// Missing question
{
    "deck_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "answer": "4"
}
```

```json
// Missing answer
{
    "deck_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "question": "What is 2 + 2?"
}
```

### Empty Fields
```json
// Empty question
{
    "deck_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "question": "",
    "answer": "4"
}
```

## 📊 Expected Responses

### ✅ Create Success (201)
```json
{
    "message": "Flashcard created successfully",
    "card": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
        "deck_id": "65a1b2c3d4e5f6g7h8i9j0k1",
        "question": "What is 2 + 2?",
        "answer": "4",
        "tag": "arithmetic",
        "note": "Basic addition problem",
        "created_at": "2024-01-15T10:30:00.000Z"
    }
}
```

### ✅ Get All Success (200)
```json
{
    "count": 5,
    "flashcards": [
        {
            "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
            "deck_id": "65a1b2c3d4e5f6g7h8i9j0k1",
            "question": "What is 2 + 2?",
            "answer": "4",
            "tag": "arithmetic",
            "note": "Basic addition problem",
            "created_at": "2024-01-15T10:30:00.000Z"
        }
    ]
}
```

### ✅ Get by Deck Success (200)
```json
{
    "deck_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "count": 3,
    "flashcards": [
        {
            "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
            "deck_id": "65a1b2c3d4e5f6g7h8i9j0k1",
            "question": "What is 2 + 2?",
            "answer": "4",
            "tag": "arithmetic",
            "note": "Basic addition problem",
            "created_at": "2024-01-15T10:30:00.000Z"
        }
    ]
}
```

### ✅ Update Success (200)
```json
{
    "message": "Flashcard updated successfully",
    "card": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
        "deck_id": "65a1b2c3d4e5f6g7h8i9j0k1",
        "question": "What is 3 + 3?",
        "answer": "6",
        "tag": "arithmetic-updated",
        "note": "Updated note",
        "created_at": "2024-01-15T10:30:00.000Z"
    }
}
```

### ✅ Delete Success (200)
```json
{
    "message": "Flashcard deleted successfully"
}
```

### ❌ Error - Missing Required Field (400)
```json
{
    "message": "Question is required"
}
```

### ❌ Error - Not Found (404)
```json
{
    "message": "Flashcard not found"
}
```

### ❌ Error - Access Denied (403)
```json
{
    "message": "Access denied. This deck is not public"
}
```

## 🔄 Test Workflow

### 1. Chuẩn bị Deck trước
```json
POST /api/deck/teacher/create
{
    "title": "Math Basics",
    "description": "Basic mathematics",
    "isPublic": true,
    "difficulty": "easy"
}
```
→ Copy `_id` của deck để dùng làm `deck_id`

### 2. Tạo Flashcard
```json
POST /api/flashcard/teacher/create
{
    "deck_id": "PASTE_DECK_ID_HERE",
    "question": "What is 2 + 2?",
    "answer": "4"
}
```
→ Copy `_id` của flashcard để update/delete sau

### 3. Xem Flashcards
```
GET /api/flashcard/student/deck/{deckId}
```

### 4. Cập nhật Flashcard
```json
PUT /api/flashcard/teacher/update/{flashcardId}
{
    "question": "Updated question",
    "answer": "Updated answer"
}
```

### 5. Xóa Flashcard
```
DELETE /api/flashcard/teacher/delete/{flashcardId}
```

## 🎯 Test Permission Scenarios

### Scenario: Student không thể xem private deck flashcards

1. **Tạo private deck:**
```json
POST /api/deck/teacher/create
{
    "title": "Private Deck",
    "isPublic": false
}
```

2. **Tạo flashcard trong private deck:**
```json
POST /api/flashcard/teacher/create
{
    "deck_id": "{privateDeckId}",
    "question": "Private question",
    "answer": "Private answer"
}
```

3. **Student thử xem (với student token):**
```
GET /api/flashcard/student/deck/{privateDeckId}
```
→ Expected: **403 Forbidden**

4. **Chuyển deck sang public:**
```json
PUT /api/deck/teacher/update/{privateDeckId}
{
    "isPublic": true
}
```

5. **Student xem lại:**
```
GET /api/flashcard/student/deck/{privateDeckId}
```
→ Expected: **200 OK**

## 📝 Lưu ý

1. **Required Fields:**
   - `deck_id` (MongoDB ObjectId)
   - `question` (String, không được rỗng)
   - `answer` (String, không được rỗng)

2. **Optional Fields:**
   - `tag` (String, mặc định: "")
   - `note` (String, mặc định: "")

3. **Permissions:**
   - Teacher/Admin: Có thể tạo, update, delete tất cả flashcards
   - Student: Chỉ có thể xem flashcards từ decks có `isPublic: true`

4. **Validation:**
   - `deck_id` phải là valid MongoDB ObjectId
   - `question` và `answer` không được rỗng
   - Student không thể xem flashcards từ private decks

Happy Testing! 🚀
