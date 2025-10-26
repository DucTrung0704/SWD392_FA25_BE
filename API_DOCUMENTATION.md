# MathFlash API Documentation

## 🎯 Tổng Quan
MathFlash API là hệ thống học tập với flashcard, hỗ trợ 3 role: **Teacher**, **Admin**, và **Student**. API được thiết kế với phân quyền rõ ràng và bảo mật cao.

## 🔐 Hệ Thống Role

### **3 Role Chính:**
- **🔴 Admin**: Quản trị viên - Toàn quyền hệ thống
- **🟡 Teacher**: Giáo viên - Tạo và quản lý nội dung học tập  
- **🟢 Student**: Học sinh - Học tập và xem nội dung

### **Phân Quyền Chi Tiết:**
| Chức năng | Admin | Teacher | Student |
|-----------|-------|---------|---------|
| Quản lý User | ✅ | ❌ | ❌ |
| Tạo nội dung | ✅ | ✅ | ❌ |
| Học tập | ✅ | ✅ | ✅ |
| Xem thống kê | ✅ | ❌ | ❌ |

## 📚 Swagger UI Documentation

### **Truy cập Documentation:**
1. Khởi động server:
   ```bash
   npm start
   # hoặc development
   npm run dev
   ```

2. Mở trình duyệt và truy cập:
   ```
   http://localhost:5000/api-docs
   ```

### **Tính năng Swagger:**
- ✅ **Test API trực tiếp**: Test tất cả endpoints từ trình duyệt
- ✅ **Authentication**: Hỗ trợ JWT Bearer token
- ✅ **Ví dụ Request/Response**: Xem ví dụ cho mỗi endpoint
- ✅ **Schema Validation**: Xem chi tiết data models
- ✅ **Role-based Access**: Documentation rõ ràng về phân quyền
- ✅ **Tổ chức tốt**: Tất cả docs tập trung trong `swagger/` folder

## 🔑 Authentication

Hầu hết endpoints cần xác thực. Để test protected endpoints:

1. **Đăng ký hoặc đăng nhập**:
   ```bash
   POST /api/user/register
   POST /api/user/login
   ```

2. **Copy JWT token** từ response

3. **Authorize trong Swagger UI**:
   - Click nút "Authorize"
   - Nhập `Bearer <your-token>`
   - Click "Authorize"

## 📋 API Endpoints

### **🔓 Public Endpoints (Không cần xác thực)**
```
POST /api/user/register    - Đăng ký user mới
POST /api/user/login       - Đăng nhập
```

### **🔒 Protected Endpoints**

#### **👤 User Management**
```
GET  /api/user/profile                    - Xem profile (Tất cả role)
PUT  /api/user/update                     - Cập nhật profile (Tất cả role)

# Admin Only
GET    /api/user/admin/all                - Xem tất cả user
GET    /api/user/admin/:id                 - Xem chi tiết user
PUT    /api/user/admin/update-role/:id     - Thay đổi role user
DELETE /api/user/admin/delete/:id          - Xóa user

# Teacher & Admin
GET    /api/user/teacher/students          - Xem danh sách học sinh
```

#### **📚 Deck Management**
```
# Student & Tất cả role
GET    /api/deck/all                       - Xem tất cả deck
GET    /api/deck/all/:id                   - Xem chi tiết deck

# Teacher & Admin
POST   /api/deck/teacher/create            - Tạo deck mới
GET    /api/deck/teacher/my-decks          - Xem deck của mình
PUT    /api/deck/teacher/update/:id       - Sửa deck (chỉ của mình)
DELETE /api/deck/teacher/delete/:id        - Xóa deck (chỉ của mình)

# Admin Only
GET    /api/deck/admin/all                 - Xem tất cả deck
DELETE /api/deck/admin/delete/:id          - Xóa deck bất kỳ
```

#### **🎴 Flashcard Management**
```
# Student & Tất cả role
GET    /api/flashcard/student/all          - Xem tất cả flashcard
GET    /api/flashcard/student/:id         - Xem chi tiết flashcard
GET    /api/flashcard/student/deck/:deckId - Xem flashcard theo deck

# Teacher & Admin
POST   /api/flashcard/teacher/create       - Tạo flashcard mới
PUT    /api/flashcard/teacher/update/:id   - Sửa flashcard (chỉ của mình)
DELETE /api/flashcard/teacher/delete/:id   - Xóa flashcard (chỉ của mình)

# Admin Only
GET    /api/flashcard/admin/all            - Xem tất cả flashcard
DELETE /api/flashcard/admin/delete/:id     - Xóa flashcard bất kỳ
```

## 📁 File Uploads

Để tạo và cập nhật flashcard, có thể upload hình ảnh sử dụng multipart/form-data:

- `question_image` - Hình ảnh mặt trước
- `answer_image` - Hình ảnh mặt sau

## 🖥️ Server Information

- **Development Server**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/

## 📖 Documentation Files

### **Tài liệu chính:**
- `ROLE_SYSTEM.md` - Chi tiết hệ thống role và phân quyền
- `ROLE_PERMISSIONS.md` - Ma trận phân quyền chi tiết
- `API_DOCUMENTATION.md` - Tài liệu API này

### **Cấu trúc Swagger:**
```
swagger/
├── swagger.config.js          # Cấu hình Swagger chính
└── docs/                      # Tài liệu API endpoints
    ├── user.routes.js         # User endpoints
    ├── deck.routes.js         # Deck endpoints
    └── flashcard.routes.js    # Flashcard endpoints
```

## 🔧 Error Handling

### **Error Codes thường gặp:**
```json
{
  "AUTH_REQUIRED": "Authentication required",
  "INVALID_ROLE": "Invalid user role",
  "INSUFFICIENT_PERMISSIONS": "Access denied",
  "EMAIL_EXISTS": "Email already exists",
  "USER_NOT_FOUND": "User not found",
  "ACCOUNT_DEACTIVATED": "Account is deactivated"
}
```

### **Response Format:**
```json
{
  "message": "Success message",
  "code": "SUCCESS_CODE",
  "data": { ... },
  "user": { ... },
  "token": "jwt_token"
}
```

## 🚀 Quick Start

### **1. Đăng ký User:**
```bash
POST /api/user/register
{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "password123",
  "role": "Student"  # Optional, default: Student
}
```

### **2. Đăng nhập:**
```bash
POST /api/user/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### **3. Sử dụng Token:**
```bash
GET /api/user/profile
Headers: {
  "Authorization": "Bearer <your-token>"
}
```

## ⚠️ Lưu Ý Quan Trọng

1. **Role Validation**: Luôn validate role ở cả frontend và backend
2. **Ownership Check**: Teacher chỉ quản lý nội dung do mình tạo
3. **Token Security**: JWT token hết hạn sau 7 ngày
4. **Case Insensitive**: Email không phân biệt hoa thường
5. **Admin Protection**: Admin không thể tự thay đổi role của mình

API đã sẵn sàng để sử dụng với hệ thống phân quyền hoàn chỉnh! 🎉
