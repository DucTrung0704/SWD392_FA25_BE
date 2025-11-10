import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // Kiểm tra xem biến môi trường có tồn tại không
        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
        
        if (!mongoUri) {
            console.error('❌ MongoDB Connection Error: MONGODB_URI hoặc MONGO_URI không được cấu hình trong file .env');
            console.error('💡 Vui lòng thêm vào file .env:');
            console.error('   MONGODB_URI=mongodb://localhost:27017/flashlearn');
            process.exit(1);
        }

        await mongoose.connect(mongoUri);
        console.log('✅ MongoDB Connected Successfully');
        console.log(`📊 Database: ${mongoose.connection.name}`);
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        console.error('💡 Kiểm tra lại:');
        console.error('   1. MongoDB đã được cài đặt và đang chạy?');
        console.error('   2. MONGODB_URI trong file .env có đúng không?');
        console.error('   3. Port MongoDB (mặc định 27017) có đang mở không?');
        process.exit(1);
    }
};

export default connectDB;
