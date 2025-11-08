# AI Integration Setup Guide

## 📦 Backend Setup

### 1. Install OpenAI Package
```bash
cd SWD392_FA25_BE
npm install openai
```

### 2. Environment Variables
Thêm vào file `.env`:
```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo
# Hoặc sử dụng GPT-4 (đắt hơn nhưng tốt hơn):
# OPENAI_MODEL=gpt-4
```

### 3. Get OpenAI API Key
1. Đăng ký tại: https://platform.openai.com/
2. Tạo API key tại: https://platform.openai.com/api-keys
3. Copy key và paste vào `.env`

### 4. Test API
```bash
# Start backend
npm run dev

# Test health check
curl http://localhost:3000/api/ai/health
```

## 💰 Pricing
- **GPT-3.5 Turbo**: ~$0.002/1K tokens (rẻ, đủ dùng)
- **GPT-4**: ~$0.03/1K tokens (đắt hơn, tốt hơn)

**Ước tính**: 1000 questions/tháng ≈ $10-20 với GPT-3.5

## 🔒 Security Notes
- **KHÔNG** commit `.env` file
- API key phải được bảo mật
- Sử dụng rate limiting để tránh abuse

## ✅ Verification
Sau khi setup, test bằng cách:
1. Mở Question Bank
2. Click "Generate with AI"
3. Nhập topic và generate

Nếu có lỗi, check:
- API key đúng chưa?
- Backend đang chạy?
- Network connection?

