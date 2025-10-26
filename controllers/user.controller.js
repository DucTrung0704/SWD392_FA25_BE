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

// Admin functions
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ created_at: -1 });
        res.json({
            message: 'All users retrieved successfully',
            users,
            total: users.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({
            message: 'User retrieved successfully',
            user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        
        // Validate role
        if (!['Admin', 'Teacher', 'Student'].includes(role)) {
            return res.status(400).json({ 
                message: 'Invalid role. Must be Admin, Teacher, or Student' 
            });
        }
        
        const user = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true, select: '-password' }
        );
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({
            message: 'User role updated successfully',
            user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Prevent admin from deleting themselves
        if (req.user.id === id) {
            return res.status(400).json({ 
                message: 'Cannot delete your own account' 
            });
        }
        
        const user = await User.findByIdAndDelete(id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({
            message: 'User deleted successfully',
            deletedUser: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { 
    registerUser, 
    loginUser, 
    updateUser, 
    getUserProfile,
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser
};
