# Hệ Thống Phân Quyền Role-Based Access Control (RBAC)

## 📋 Tổng Quan
Hệ thống phân quyền được thiết kế với 3 role chính: **Admin**, **Teacher**, và **Student**. Mỗi role có quyền hạn và chức năng riêng biệt.

## 👥 Các Role và Quyền Hạn

### 🔴 ADMIN (Quản trị viên)
**Quyền cao nhất - Toàn quyền hệ thống**

#### Quyền hạn:
- ✅ **Quản lý người dùng**: Xem, tạo, sửa, xóa tất cả user
- ✅ **Quản lý role**: Thay đổi role của bất kỳ user nào
- ✅ **Quản lý nội dung**: Xem, sửa, xóa tất cả deck và flashcard
- ✅ **Truy cập hệ thống**: Xem thống kê tổng quan, báo cáo
- ✅ **Bảo trì hệ thống**: Backup, restore, cấu hình

#### API Endpoints:
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

---

### 🟡 TEACHER (Giáo viên)
**Quyền tạo và quản lý nội dung học tập**

#### Quyền hạn:
- ✅ **Tạo nội dung**: Tạo deck, flashcard, bài kiểm tra
- ✅ **Quản lý nội dung**: Sửa, xóa nội dung do mình tạo
- ✅ **Xem học sinh**: Xem danh sách học sinh trong hệ thống
- ✅ **Theo dõi tiến độ**: Xem tiến độ học tập của học sinh
- ❌ **Không thể**: Thay đổi role, xóa user khác, truy cập admin

#### API Endpoints:
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

---

### 🟢 STUDENT (Học sinh)
**Quyền học tập và xem nội dung**

#### Quyền hạn:
- ✅ **Học tập**: Xem deck, flashcard, làm bài kiểm tra
- ✅ **Theo dõi tiến độ**: Xem tiến độ học tập của bản thân
- ✅ **Cập nhật profile**: Sửa thông tin cá nhân, avatar
- ❌ **Không thể**: Tạo nội dung, xem thông tin user khác, truy cập admin

#### API Endpoints:
```
GET    /api/deck/all                     - Xem tất cả deck
GET    /api/deck/all/:id                  - Xem chi tiết deck
GET    /api/flashcard/student/all         - Xem tất cả flashcard
GET    /api/flashcard/student/:id         - Xem chi tiết flashcard
GET    /api/flashcard/student/deck/:deckId - Xem flashcard theo deck
GET    /api/user/profile                  - Xem profile của mình
PUT    /api/user/update                   - Cập nhật profile
```

---

## 🔐 Middleware Phân Quyền

### 1. `verifyToken`
- **Mục đích**: Xác thực JWT token
- **Sử dụng**: Tất cả route cần đăng nhập
```javascript
router.get('/protected', verifyToken, controller);
```

### 2. `allowRoles(...roles)`
- **Mục đích**: Kiểm tra role cụ thể
- **Sử dụng**: Route chỉ dành cho role nhất định
```javascript
router.get('/admin-only', verifyToken, allowRoles('Admin'), controller);
router.get('/teacher-admin', verifyToken, allowRoles('Teacher', 'Admin'), controller);
```

### 3. `requireAdmin`
- **Mục đích**: Chỉ cho phép Admin
- **Sử dụng**: Route quản trị hệ thống
```javascript
router.delete('/admin/delete/:id', verifyToken, requireAdmin, controller);
```

### 4. `requireTeacherOrAdmin`
- **Mục đích**: Cho phép Teacher và Admin
- **Sử dụng**: Route tạo/sửa nội dung
```javascript
router.post('/teacher/create', verifyToken, requireTeacherOrAdmin, controller);
```

### 5. `checkOwnership(resourceField)`
- **Mục đích**: Kiểm tra quyền sở hữu tài nguyên
- **Sử dụng**: Đảm bảo user chỉ sửa/xóa tài nguyên của mình
```javascript
router.put('/update/:id', verifyToken, requireTeacherOrAdmin, checkOwnership(), controller);
```

---

## 📊 Ma Trận Phân Quyền

| Chức năng | Admin | Teacher | Student |
|-----------|-------|---------|---------|
| **Quản lý User** |
| Xem tất cả user | ✅ | ❌ | ❌ |
| Tạo user | ✅ | ❌ | ❌ |
| Sửa user | ✅ | ❌ | ❌ |
| Xóa user | ✅ | ❌ | ❌ |
| Thay đổi role | ✅ | ❌ | ❌ |
| **Quản lý Nội dung** |
| Tạo deck/flashcard | ✅ | ✅ | ❌ |
| Sửa nội dung của mình | ✅ | ✅ | ❌ |
| Sửa nội dung của người khác | ✅ | ❌ | ❌ |
| Xóa nội dung của mình | ✅ | ✅ | ❌ |
| Xóa nội dung của người khác | ✅ | ❌ | ❌ |
| **Học tập** |
| Xem deck/flashcard | ✅ | ✅ | ✅ |
| Làm bài kiểm tra | ✅ | ✅ | ✅ |
| Xem tiến độ học tập | ✅ | ✅ | ✅ (chỉ của mình) |
| **Hệ thống** |
| Xem thống kê tổng quan | ✅ | ❌ | ❌ |
| Backup/Restore | ✅ | ❌ | ❌ |
| Cấu hình hệ thống | ✅ | ❌ | ❌ |

---

## 🚀 Cách Sử Dụng

### 1. Đăng nhập và nhận token
```javascript
const response = await fetch('/api/user/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const { token, user } = await response.json();
```

### 2. Sử dụng token cho các API call
```javascript
const response = await fetch('/api/deck/teacher/create', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(deckData)
});
```

### 3. Xử lý lỗi phân quyền
```javascript
if (response.status === 403) {
  const error = await response.json();
  console.log('Access denied:', error.message);
  console.log('Required role:', error.requiredRoles);
  console.log('Your role:', error.userRole);
}
```

---

## ⚠️ Lưu Ý Bảo Mật

1. **Token Expiration**: JWT token hết hạn sau 7 ngày
2. **Role Validation**: Luôn validate role ở cả frontend và backend
3. **Ownership Check**: Kiểm tra quyền sở hữu trước khi sửa/xóa
4. **Input Validation**: Validate tất cả input từ client
5. **Error Handling**: Không expose thông tin nhạy cảm trong error message

---

## 🔄 Cập Nhật và Mở Rộng

### Thêm Role mới:
1. Cập nhật enum trong `user.model.js`
2. Thêm middleware mới trong `auth.middleware.js`
3. Cập nhật routes với phân quyền phù hợp
4. Cập nhật ma trận phân quyền

### Thêm chức năng mới:
1. Xác định role nào được phép truy cập
2. Thêm middleware phân quyền phù hợp
3. Implement controller với kiểm tra quyền hạn
4. Test với các role khác nhau
