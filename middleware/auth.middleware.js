import jwt from "jsonwebtoken";

// Middleware xác thực JWT token
export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
};

// Middleware phân quyền role
export const allowRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                message: "Authentication required",
                code: "AUTH_REQUIRED"
            });
        }

        const userRole = req.user.role;
        
        // Validate role exists
        const validRoles = ['Admin', 'Teacher', 'Student'];
        if (!validRoles.includes(userRole)) {
            return res.status(403).json({ 
                message: "Invalid user role",
                code: "INVALID_ROLE",
                userRole: userRole
            });
        }
        
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ 
                message: `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${userRole}`,
                code: "INSUFFICIENT_PERMISSIONS",
                requiredRoles: allowedRoles,
                userRole: userRole
            });
        }
        
        next();
    };
};

// Middleware kiểm tra quyền sở hữu tài nguyên
export const checkOwnership = (resourceField = 'created_by') => {
    return (req, res, next) => {
        const userId = req.user.id;
        const userRole = req.user.role;
        
        // Admin có thể truy cập tất cả
        if (userRole === 'Admin') {
            return next();
        }
        
        // Kiểm tra quyền sở hữu cho Teacher và Student
        const resourceId = req.params.id;
        if (!resourceId) {
            return res.status(400).json({ message: "Resource ID required" });
        }
        
        // Lưu thông tin để controller có thể sử dụng
        req.ownershipCheck = {
            userId,
            userRole,
            resourceField
        };
        
        next();
    };
};

// Middleware kiểm tra quyền Admin
export const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }
    
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ 
            message: "Admin access required",
            userRole: req.user.role
        });
    }
    
    next();
};

// Middleware kiểm tra quyền Teacher hoặc Admin
export const requireTeacherOrAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }
    
    const userRole = req.user.role;
    if (!['Teacher', 'Admin'].includes(userRole)) {
        return res.status(403).json({ 
            message: "Teacher or Admin access required",
            userRole: userRole
        });
    }
    
    next();
};