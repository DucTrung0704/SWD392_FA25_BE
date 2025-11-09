# 🔑 Hướng dẫn lấy OpenAI API Key

## 📝 Bước 1: Đăng ký tài khoản OpenAI

1. Truy cập: https://platform.openai.com/
2. Click **"Sign up"** hoặc **"Log in"** nếu đã có tài khoản
3. Đăng ký bằng:
   - Email + Password
   - Hoặc Google/Microsoft account

## 💳 Bước 2: Nạp tiền vào tài khoản (Billing)

⚠️ **Lưu ý**: OpenAI yêu cầu nạp tiền trước khi sử dụng API

1. Sau khi đăng nhập, vào: https://platform.openai.com/account/billing
2. Click **"Add payment method"**
3. Nhập thông tin thẻ (Visa/Mastercard)
4. Nạp tối thiểu **$5** (hoặc số tiền bạn muốn)

💡 **Tip**: GPT-3.5 rất rẻ (~$0.002/1K tokens), $5 có thể dùng được rất nhiều!

## 🔑 Bước 3: Tạo API Key

1. Vào trang API Keys: https://platform.openai.com/api-keys
2. Click **"Create new secret key"**
3. Đặt tên cho key (ví dụ: "FlashLearn Project")
4. Click **"Create secret key"**
5. ⚠️ **QUAN TRỌNG**: Copy key ngay lập tức! Bạn sẽ không thể xem lại key này sau khi đóng popup.

Key sẽ có dạng: `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## 📋 Bước 4: Thêm vào project

### Backend (.env file)
```env
OPENAI_API_KEY=sk-proj-your-actual-key-here
OPENAI_MODEL=gpt-3.5-turbo
```

### Ví dụ:
```env
OPENAI_API_KEY=sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
OPENAI_MODEL=gpt-3.5-turbo
```

## ✅ Bước 5: Uncomment AI routes

Sau khi có API key, mở file `app.js` và uncomment:

```javascript
// Từ:
// import aiRoutes from './routes/ai.routes.js';
// app.use('/api/ai', aiRoutes);

// Thành:
import aiRoutes from './routes/ai.routes.js';
app.use('/api/ai', aiRoutes);
```

## 🚀 Bước 6: Restart backend

```bash
cd SWD392_FA25_BE
npm run dev
```

## 💰 Chi phí ước tính

### GPT-3.5 Turbo (Recommended)
- **Input**: $0.50 / 1M tokens
- **Output**: $1.50 / 1M tokens
- **1 câu hỏi**: ~500-1000 tokens
- **1000 câu hỏi**: ~$1-2

### GPT-4 (Tốt hơn nhưng đắt hơn)
- **Input**: $30 / 1M tokens
- **Output**: $60 / 1M tokens
- **1 câu hỏi**: ~500-1000 tokens
- **1000 câu hỏi**: ~$30-60

## 🔒 Bảo mật

⚠️ **QUAN TRỌNG**:
- ❌ **KHÔNG** commit API key lên Git
- ❌ **KHÔNG** chia sẻ key với người khác
- ✅ Thêm `.env` vào `.gitignore`
- ✅ Sử dụng environment variables

## 🧪 Test API Key

Sau khi setup, test bằng cách:

1. Mở Question Bank
2. Click "Generate with AI"
3. Nhập topic và generate
4. Nếu thành công → API key đúng! ✅
5. Nếu lỗi → Kiểm tra lại key hoặc billing

## ❓ Troubleshooting

### Lỗi: "Incorrect API key provided"
→ Kiểm tra lại key trong `.env`, đảm bảo không có khoảng trắng

### Lỗi: "You exceeded your current quota"
→ Nạp thêm tiền vào tài khoản

### Lỗi: "Rate limit exceeded"
→ Đợi vài phút rồi thử lại, hoặc upgrade plan

## 📚 Tài liệu tham khảo

- OpenAI Platform: https://platform.openai.com/
- API Documentation: https://platform.openai.com/docs
- Pricing: https://openai.com/pricing
- Billing: https://platform.openai.com/account/billing

---

**Lưu ý**: Nếu không muốn dùng OpenAI (miễn phí), có thể dùng:
- **Ollama** (local, free): https://ollama.ai/
- **Google Gemini** (free tier): https://ai.google.dev/

