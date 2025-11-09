# 🔧 Hướng dẫn Setup Environment Variables

## 📌 Tại sao cần file `.env`?

File `.env` chứa các thông tin nhạy cảm như:
- API keys (OpenAI, etc.)
- Database credentials
- JWT secrets

**⚠️ QUAN TRỌNG**: File `.env` **KHÔNG BAO GIỜ** được commit lên Git!

## 🚀 Setup cho thành viên mới

### Bước 1: Clone project về máy
```bash
git clone <repository-url>
cd SWD392_FA25_BE
```

### Bước 2: Copy file template
```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Mac/Linux
cp .env.example .env
```

### Bước 3: Mở file `.env` và điền thông tin

1. **Database**: Cập nhật `MONGODB_URI` nếu cần
2. **JWT Secret**: Đổi `JWT_SECRET` thành một chuỗi ngẫu nhiên mạnh
3. **OpenAI API Key** (nếu muốn dùng AI features):
   - Xem hướng dẫn: `HOW_TO_GET_OPENAI_API_KEY.md`
   - Thêm `OPENAI_API_KEY` của bạn vào file `.env`

### Bước 4: Cài đặt dependencies
```bash
npm install
```

### Bước 5: Chạy project
```bash
npm run dev
```

## ✅ Checklist

- [ ] Đã copy `.env.example` thành `.env`
- [ ] Đã cập nhật `MONGODB_URI`
- [ ] Đã đổi `JWT_SECRET`
- [ ] (Optional) Đã thêm `OPENAI_API_KEY` nếu muốn dùng AI
- [ ] Đã chạy `npm install`
- [ ] Project chạy thành công

## 🔒 Bảo mật

- ✅ File `.env` đã được thêm vào `.gitignore`
- ✅ Mỗi thành viên tự tạo file `.env` riêng
- ✅ Code AI (routes, controllers) có thể push lên Git an toàn
- ❌ **KHÔNG BAO GIỜ** commit file `.env`

## 📝 Lưu ý

- Nếu bạn pull code mới và thấy có thêm biến môi trường mới trong `.env.example`, hãy cập nhật file `.env` của bạn
- Nếu gặp lỗi "API key not configured", kiểm tra lại file `.env` có đúng format không

