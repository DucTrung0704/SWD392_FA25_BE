# 🔧 Quick Fix cho lỗi HTTP 500

## Vấn đề
Lỗi HTTP 500 xảy ra vì AI routes đang cố import OpenAI package chưa được cài đặt.

## ✅ Giải pháp tạm thời
Đã comment out AI routes trong `app.js`. Backend sẽ chạy bình thường.

## 🚀 Để bật lại AI features:

### 1. Cài đặt OpenAI package
```bash
cd SWD392_FA25_BE
npm install openai
```

### 2. Thêm API key vào `.env`
```env
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-3.5-turbo
```

### 3. Uncomment trong `app.js`
Tìm dòng:
```javascript
// import aiRoutes from './routes/ai.routes.js';
```

Và đổi thành:
```javascript
import aiRoutes from './routes/ai.routes.js';
```

Và:
```javascript
// app.use('/api/ai', aiRoutes);
```

Thành:
```javascript
app.use('/api/ai', aiRoutes);
```

### 4. Restart backend
```bash
npm run dev
```

## ✅ Hiện tại
- ✅ Backend sẽ chạy bình thường
- ✅ Login sẽ hoạt động
- ⚠️ AI features tạm thời disabled (cho đến khi cài openai)

