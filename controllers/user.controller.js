import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role = 'Student' } = req.body;
        
        // Validate role
        const validRoles = ['Admin', 'Teacher', 'Student'];
        if (role && !validRoles.includes(role)) {
            return res.status(400).json({ 
                message: 'Invalid role. Must be Admin, Teacher, or Student',
                validRoles: validRoles
            });
        }

        // Check if email already exists
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(400).json({ 
                message: 'Email already exists',
                code: 'EMAIL_EXISTS'
            });
        }

        // Hash password
        const hashed = await bcrypt.hash(password, 10);
        
        // Create user
        const user = await User.create({ 
            name: name.trim(), 
            email: email.toLowerCase().trim(), 
            password: hashed, 
            role: role || 'Student'
        });

        // Return user without password
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            created_at: user.created_at
        };

        res.status(201).json({ 
            message: 'User registered successfully', 
            user: userResponse 
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                message: 'Validation error', 
                errors: errors 
            });
        }
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email (case insensitive)
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ 
                message: 'User not found',
                code: 'USER_NOT_FOUND'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({ 
                message: 'Account is deactivated',
                code: 'ACCOUNT_DEACTIVATED'
            });
        }

        // Verify password
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ 
                message: 'Invalid credentials',
                code: 'INVALID_CREDENTIALS'
            });
        }

        // Update last login
        await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user._id, 
                role: user.role,
                email: user.email,
                name: user.name
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Return user data without password
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            lastLogin: user.lastLogin,
            created_at: user.created_at
        };

        res.json({ 
            message: 'Login successful', 
            token, 
            user: userResponse 
        });
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
        const validRoles = ['Admin', 'Teacher', 'Student'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ 
                message: 'Invalid role. Must be Admin, Teacher, or Student',
                validRoles: validRoles
            });
        }
        
        // Prevent admin from changing their own role
        if (req.user.id === id && role !== 'Admin') {
            return res.status(400).json({ 
                message: 'Cannot change your own role from Admin' 
            });
        }
        
        const user = await User.findByIdAndUpdate(
            id,
            { 
                role,
                updated_at: new Date()
            },
            { new: true, select: '-password' }
        );
        
        if (!user) {
            return res.status(404).json({ 
                message: 'User not found',
                code: 'USER_NOT_FOUND'
            });
        }
        
        res.json({
            message: 'User role updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                updated_at: user.updated_at
            }
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
