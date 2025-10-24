import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email already exists' });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed, role });
        res.status(201).json({ message: 'User registered', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.json({ message: 'Login success', token, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.user.id; // From JWT token
        const { name, email } = req.body;
        
        console.log('Update request received:', { userId, name, email, file: req.file });
        
        // Check if email is being changed and if it already exists
        if (email) {
            const existingUser = await User.findOne({ email, _id: { $ne: userId } });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already exists' });
            }
        }

        // Prepare update data
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        
        // Handle avatar upload
        if (req.file) {
            console.log('File uploaded:', req.file);
            updateData.avatar = `/upload/avatars/${req.file.filename}`;
        }

        console.log('Update data:', updateData);

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, select: '-password' } // Exclude password from response
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ 
            message: 'User updated successfully', 
            user: updatedUser 
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: error.message, stack: error.stack });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // From JWT token
        
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ 
            message: 'User profile retrieved successfully', 
            user 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { registerUser, loginUser, updateUser, getUserProfile };
