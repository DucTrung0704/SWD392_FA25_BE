# Hệ Thống Role - Teacher, Admin, Student

## 📋 Tổng Quan
Hệ thống được thiết kế với **3 role chính**: **Teacher**, **Admin**, và **Student**. Mỗi role có quyền hạn và chức năng riêng biệt, đảm bảo tính bảo mật và phân quyền rõ ràng.

## 👥 Chi Tiết Các Role

### 🔴 ADMIN (Quản trị viên)
**Quyền cao nhất - Toàn quyền hệ thống**

#### Đặc điểm:
- **Mặc định**: Không có user Admin mặc định, cần được tạo thủ công
- **Quyền hạn**: Toàn quyền truy cập và quản lý hệ thống
- **Bảo mật**: Không thể tự thay đổi role từ Admin sang role khác

#### Quyền hạn chi tiết:
- ✅ **Quản lý User**: Xem, tạo, sửa, xóa tất cả user
- ✅ **Quản lý Role**: Thay đổi role của bất kỳ user nào (trừ chính mình)
- ✅ **Quản lý Nội dung**: Xem, sửa, xóa tất cả deck và flashcard
- ✅ **Quản lý Hệ thống**: Backup, restore, cấu hình
- ✅ **Báo cáo**: Xem thống kê tổng quan hệ thống

---

### 🟡 TEACHER (Giáo viên)
**Quyền tạo và quản lý nội dung học tập**

#### Đặc điểm:
- **Mặc định**: Có thể được tạo khi đăng ký hoặc được Admin phân quyền
- **Quyền hạn**: Tạo và quản lý nội dung học tập
- **Giới hạn**: Chỉ quản lý nội dung do mình tạo

#### Quyền hạn chi tiết:
- ✅ **Tạo Nội dung**: Tạo deck, flashcard, bài kiểm tra
- ✅ **Quản lý Nội dung**: Sửa, xóa nội dung do mình tạo
- ✅ **Xem Học sinh**: Xem danh sách học sinh trong hệ thống
- ✅ **Theo dõi Tiến độ**: Xem tiến độ học tập của học sinh
- ❌ **Không thể**: Thay đổi role, xóa user khác, truy cập admin

---

### 🟢 STUDENT (Học sinh)
**Quyền học tập và xem nội dung**

#### Đặc điểm:
- **Mặc định**: Role mặc định khi đăng ký
- **Quyền hạn**: Học tập và xem nội dung
- **Giới hạn**: Chỉ xem và học, không tạo nội dung

#### Quyền hạn chi tiết:
- ✅ **Học tập**: Xem deck, flashcard, làm bài kiểm tra
- ✅ **Theo dõi Tiến độ**: Xem tiến độ học tập của bản thân
- ✅ **Cập nhật Profile**: Sửa thông tin cá nhân, avatar
- ❌ **Không thể**: Tạo nội dung, xem thông tin user khác, truy cập admin

---

## 🔐 Validation và Bảo Mật

### 1. **Role Validation**
```javascript
const validRoles = ['Admin', 'Teacher', 'Student'];
if (!validRoles.includes(role)) {
    return res.status(400).json({ 
        message: 'Invalid role. Must be Admin, Teacher, or Student',
        validRoles: validRoles
    });
}
```

### 2. **User Model Schema**
```javascript
role: {
    type: String,
    enum: {
        values: ['Admin', 'Teacher', 'Student'],
        message: 'Role must be Admin, Teacher, or Student'
    },
    default: 'Student',
    required: true
}
```

### 3. **Middleware Phân Quyền**
- `allowRoles('Admin')` - Chỉ Admin
- `allowRoles('Teacher', 'Admin')` - Teacher và Admin
- `allowRoles('Student', 'Teacher', 'Admin')` - Tất cả role

---

## 📊 Ma Trận Phân Quyền Chi Tiết

| Chức năng | Admin | Teacher | Student |
|-----------|-------|---------|---------|
| **🔐 Authentication** |
| Đăng ký | ✅ | ✅ | ✅ |
| Đăng nhập | ✅ | ✅ | ✅ |
| **👤 User Management** |
| Xem profile | ✅ | ✅ | ✅ |
| Cập nhật profile | ✅ | ✅ | ✅ |
| Xem tất cả user | ✅ | ❌ | ❌ |
| Tạo user | ✅ | ❌ | ❌ |
| Sửa user | ✅ | ❌ | ❌ |
| Xóa user | ✅ | ❌ | ❌ |
| Thay đổi role | ✅ | ❌ | ❌ |
| **📚 Content Management** |
| Xem deck/flashcard | ✅ | ✅ | ✅ |
| Tạo deck/flashcard | ✅ | ✅ | ❌ |
| Sửa nội dung của mình | ✅ | ✅ | ❌ |
| Sửa nội dung của người khác | ✅ | ❌ | ❌ |
| Xóa nội dung của mình | ✅ | ✅ | ❌ |
| Xóa nội dung của người khác | ✅ | ❌ | ❌ |
| **📈 Analytics & Reports** |
| Xem thống kê tổng quan | ✅ | ❌ | ❌ |
| Xem tiến độ học sinh | ✅ | ✅ | ❌ |
| Xem tiến độ của mình | ✅ | ✅ | ✅ |
| **⚙️ System Management** |
| Backup/Restore | ✅ | ❌ | ❌ |
| Cấu hình hệ thống | ✅ | ❌ | ❌ |
| Quản lý hệ thống | ✅ | ❌ | ❌ |

---

## 🚀 API Endpoints theo Role

### **🔓 Public Endpoints (Không cần xác thực)**
```
POST /api/user/register    - Đăng ký user mới
POST /api/user/login       - Đăng nhập
```

### **🔒 Protected Endpoints (Cần xác thực)**

#### **👤 User Profile (Tất cả role)**
```
GET  /api/user/profile     - Xem profile
PUT  /api/user/update      - Cập nhật profile
```

#### **👨‍💼 Admin Only**
```
GET    /api/user/admin/all              - Xem tất cả user
GET    /api/user/admin/:id               - Xem chi tiết user
PUT    /api/user/admin/update-role/:id   - Thay đổi role user
DELETE /api/user/admin/delete/:id        - Xóa user
GET    /api/deck/admin/all               - Xem tất cả deck
DELETE /api/deck/admin/delete/:id        - Xóa deck
GET    /api/flashcard/admin/all          - Xem tất cả flashcard
DELETE /api/flashcard/admin/delete/:id   - Xóa flashcard
```

#### **👨‍🏫 Teacher & Admin**
```
POST   /api/deck/teacher/create          - Tạo deck mới
GET    /api/deck/teacher/my-decks        - Xem deck của mình
PUT    /api/deck/teacher/update/:id      - Sửa deck (chỉ của mình)
DELETE /api/deck/teacher/delete/:id      - Xóa deck (chỉ của mình)
POST   /api/flashcard/teacher/create     - Tạo flashcard mới
PUT    /api/flashcard/teacher/update/:id - Sửa flashcard (chỉ của mình)
DELETE /api/flashcard/teacher/delete/:id - Xóa flashcard (chỉ của mình)
GET    /api/user/teacher/students        - Xem danh sách học sinh
```

#### **👩‍🎓 Student (và tất cả role)**
```
GET    /api/deck/all                     - Xem tất cả deck
GET    /api/deck/all/:id                  - Xem chi tiết deck
GET    /api/flashcard/student/all         - Xem tất cả flashcard
GET    /api/flashcard/student/:id         - Xem chi tiết flashcard
GET    /api/flashcard/student/deck/:deckId - Xem flashcard theo deck
```

---

## 🔧 Cách Sử Dụng

### 1. **Đăng ký User với Role**
```javascript
// Đăng ký Student (mặc định)
const student = await fetch('/api/user/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
    // role không cần chỉ định, mặc định là 'Student'
  })
});

// Đăng ký Teacher
const teacher = await fetch('/api/user/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'Teacher'
  })
});
```

### 2. **Thay đổi Role (Admin only)**
```javascript
const response = await fetch('/api/user/admin/update-role/userId', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    role: 'Teacher'
  })
});
```

### 3. **Kiểm tra Quyền Truy cập**
```javascript
const response = await fetch('/api/deck/teacher/create', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(deckData)
});

if (response.status === 403) {
  const error = await response.json();
  console.log('Access denied:', error.message);
  console.log('Required roles:', error.requiredRoles);
  console.log('Your role:', error.userRole);
}
```

---

## ⚠️ Lưu Ý Quan Trọng

### **Bảo Mật**
1. **Role Validation**: Luôn validate role ở cả frontend và backend
2. **Ownership Check**: Kiểm tra quyền sở hữu trước khi sửa/xóa
3. **Token Security**: JWT token hết hạn sau 7 ngày
4. **Input Validation**: Validate tất cả input từ client

### **Quy Tắc Business**
1. **Admin Protection**: Admin không thể tự thay đổi role của mình
2. **Default Role**: User mới mặc định là Student
3. **Content Ownership**: Teacher chỉ quản lý nội dung do mình tạo
4. **Case Insensitive**: Email được lưu và tìm kiếm không phân biệt hoa thường

### **Error Handling**
```javascript
// Các error code thường gặp
{
  "AUTH_REQUIRED": "Authentication required",
  "INVALID_ROLE": "Invalid user role", 
  "INSUFFICIENT_PERMISSIONS": "Access denied",
  "EMAIL_EXISTS": "Email already exists",
  "USER_NOT_FOUND": "User not found",
  "ACCOUNT_DEACTIVATED": "Account is deactivated"
}
```

---

## 🔄 Mở Rộng Hệ Thống

### **Thêm Role mới:**
1. Cập nhật `validRoles` array trong tất cả file
2. Cập nhật enum trong `user.model.js`
3. Thêm middleware phân quyền mới
4. Cập nhật routes với phân quyền phù hợp
5. Cập nhật ma trận phân quyền

### **Thêm chức năng mới:**
1. Xác định role nào được phép truy cập
2. Thêm middleware phân quyền phù hợp
3. Implement controller với kiểm tra quyền hạn
4. Test với các role khác nhau
5. Cập nhật documentation

Hệ thống role hiện tại đã được tối ưu hóa với validation chặt chẽ và bảo mật cao! 🎉
