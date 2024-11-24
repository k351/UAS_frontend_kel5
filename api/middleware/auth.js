const jwt = require('jsonwebtoken');
const User = require('../models/user.schema.js');

exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.redirect('/login');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.redirect('/login');
        }

        req.user = user;
        next();
    } catch (error) {
        return res.redirect('/');
    }
};

exports.isAdmin = async (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.redirect('/');
    }
};