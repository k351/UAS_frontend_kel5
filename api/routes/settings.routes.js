const express = require('express');
const User = require('../models/user.schema');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

// Endpoint untuk mendapatkan data profil pengguna
router.get('/settings', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user settings:', error);
        res.status(500).json({ message: 'Failed to fetch user settings.' });
    }
});

module.exports = router;