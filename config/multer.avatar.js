import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure directory exists
const avatarsDir = 'upload/avatars/';
if (!fs.existsSync(avatarsDir)) {
    fs.mkdirSync(avatarsDir, { recursive: true });
}

// Cấu hình nơi lưu file avatar
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, avatarsDir);
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    },
});

const uploadAvatar = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        console.log('File filter check:', { filename: file.originalname, mimetype: file.mimetype });
        const allowed = /jpeg|jpg|png|gif/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if (ext && mime) {
            cb(null, true);
        } else {
            console.error('File type not allowed:', { ext, mime });
            cb(new Error('Only image files are allowed!'));
        }
    },
});

export default uploadAvatar;
