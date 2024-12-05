const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.schema');
const { verifyToken } = require('../middleware/auth');

router.post('/register', async (req, res) => {
    try {
        const { email, password, name, phoneNumber, address, role = 'user' } = req.body;

        // Validasi apakah semua field penting diisi
        if (!email || !password || !name || !phoneNumber || !address) {
            return res.status(400).json({ message: 'All fields are required, including address' });
        }

        // Validasi address memiliki subfield
        const { street, city, country } = address;
        if (!street || !city || !country) {
            return res.status(400).json({
                message: 'Address must include street, city, and country'
            });
        }

        // Periksa apakah email sudah terdaftar
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Simpan user ke database
        const user = new User({
            email,
            password: hashedPassword,
            name,
            phoneNumber,
            address, // Simpan address sesuai input
            role,
            cart: []
        });

        await user.save();

        // Buat JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Kirim token ke cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Received email:", email, "Received password:", password);

        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found");
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log("Stored hashed password:", user.password);
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Is password match:", isMatch);

        if (!isMatch) {
            console.log("Password does not match");
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log("User authenticated successfully");
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });
        
        res.status(200).json({
            loginSuccess: {
                token,
                username: user.name,
                userId: user._id,
            },
            redirect: user.role === 'admin' ? '/#!/admin-dashboard' : '/',
        });
    } catch (error) {
        console.error("Server error:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
});


// Logout Route
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ redirect: '/' });
});

// Get User Route (Protected)
router.get('/api/user', verifyToken, async (req, res) => {
    try {
        // Cari user berdasarkan ID dari token
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Fetch user error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;