const jwt = require('jsonwebtoken');
const User = require('../models/user.schema.js');

exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Authentication required', redirect: '/login' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(403).json({ message: 'User not found', redirect: '/login' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', redirect: '/' });
    }
};

exports.optionalVerify = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);

            if (user) {
                req.user = user;
            }
        }
        next();
    } catch (error) {
        req.user = null;
        next();
    }
};

exports.checkAdmin = async (req, res) => {
    if (req.user && req.user.role === 'admin') {
        res.status(200).json({ role: 'admin' });
    } else {
        res.status(403).json({ message: 'Admin privileges required' });
    }
};

exports.isAdmin = async (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.redirect('/');
    }
};