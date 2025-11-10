# 🔧 Hướng dẫn sửa lỗi MongoDB Connection

## ❌ Vấn đề
Backend không kết nối được với MongoDB.

## ✅ Giải pháp

### Bước 1: Kiểm tra file `.env`

Đảm bảo file `.env` trong thư mục `SWD392_FA25_BE` có biến môi trường MongoDB:

```env
MONGODB_URI=mongodb://localhost:27017/flashlearn
```

**Lưu ý**: 
- Nếu bạn dùng `MONGO_URI` (không có "DB") cũng được, code đã hỗ trợ cả hai
- Nhưng khuyến nghị dùng `MONGODB_URI` để nhất quán với documentation

### Bước 2: Kiểm tra MongoDB đang chạy

#### Windows:
```powershell
# Kiểm tra service MongoDB
Get-Service MongoDB

# Hoặc kiểm tra process
Get-Process mongod
```

#### Mac/Linux:
```bash
# Kiểm tra MongoDB service
sudo systemctl status mongod

# Hoặc kiểm tra process
ps aux | grep mongod
```

### Bước 3: Khởi động MongoDB (nếu chưa chạy)

#### Windows:
```powershell
# Khởi động service
Start-Service MongoDB

# Hoặc chạy thủ công
mongod
```

#### Mac/Linux:
```bash
# Khởi động service
sudo systemctl start mongod

# Hoặc chạy thủ công
mongod
```

### Bước 4: Kiểm tra kết nối

1. Mở terminal trong thư mục `SWD392_FA25_BE`
2. Chạy backend:
   ```bash
   npm run dev
   ```
3. Xem log - nếu thấy:
   - ✅ `MongoDB Connected Successfully` → Đã kết nối thành công!
   - ❌ `MongoDB Connection Error` → Xem thông báo lỗi chi tiết

## 🔍 Các lỗi thường gặp

### Lỗi 1: "MONGODB_URI không được cấu hình"
**Nguyên nhân**: File `.env` thiếu biến `MONGODB_URI`

**Giải pháp**: Thêm vào file `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/flashlearn
```

### Lỗi 2: "ECONNREFUSED" hoặc "Connection refused"
**Nguyên nhân**: MongoDB chưa được khởi động

**Giải pháp**: Khởi động MongoDB (xem Bước 3)

### Lỗi 3: "Authentication failed"
**Nguyên nhân**: MongoDB yêu cầu authentication nhưng connection string không có username/password

**Giải pháp**: Cập nhật connection string:
```env
MONGODB_URI=mongodb://username:password@localhost:27017/flashlearn
```

### Lỗi 4: "Port 27017 already in use"
**Nguyên nhân**: Có process khác đang dùng port 27017

**Giải pháp**: 
- Tìm và kill process đang dùng port 27017
- Hoặc đổi port MongoDB trong connection string

## 📝 Connection String Examples

### Local MongoDB (mặc định):
```env
MONGODB_URI=mongodb://localhost:27017/flashlearn
```

### MongoDB với authentication:
```env
MONGODB_URI=mongodb://username:password@localhost:27017/flashlearn
```

### MongoDB Atlas (Cloud):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/flashlearn
```

### MongoDB với port khác:
```env
MONGODB_URI=mongodb://localhost:27018/flashlearn
```

## ✅ Checklist

- [ ] File `.env` có biến `MONGODB_URI` hoặc `MONGO_URI`
- [ ] MongoDB đã được cài đặt
- [ ] MongoDB service đang chạy
- [ ] Connection string đúng format
- [ ] Port MongoDB (27017) không bị block bởi firewall
- [ ] Đã restart backend sau khi sửa `.env`

## 🆘 Vẫn không được?

1. Kiểm tra log chi tiết trong terminal khi chạy `npm run dev`
2. Thử kết nối MongoDB bằng MongoDB Compass hoặc `mongosh`:
   ```bash
   mongosh mongodb://localhost:27017/flashlearn
   ```
3. Kiểm tra firewall/antivirus có block port 27017 không
4. Thử tạo database mới:
   ```env
   MONGODB_URI=mongodb://localhost:27017/flashlearn_new
   ```

