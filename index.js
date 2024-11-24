const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { verifyToken, isAdmin } = require('./middleware/auth');
const User = require('./models/user.schema.js');
const Wishlist = require('./models/wishlist.schema.js')

const app = express();
const port = 5500;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Static file serving
app.use(express.static(path.join(__dirname, 'view')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/controllers', express.static(path.join(__dirname, 'controllers')));
app.use('/images', express.static(path.join(__dirname, 'images')));

mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// Public Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'view/index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'view/login.html')));
app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, 'view/signup.html')));

// Protected Routes
app.get('/shop', verifyToken, (req, res) => res.sendFile(path.join(__dirname, 'view/shop.html')));
app.get('/wishlist', verifyToken, (req, res) => res.sendFile(path.join(__dirname, 'view/wishlist.html')));
app.get('/checkout', verifyToken, (req, res) => res.sendFile(path.join(__dirname, 'view/checkout.html')));
app.get('/cart', verifyToken, (req, res) => res.sendFile(path.join(__dirname, 'view/cart.html')));
app.get('/product', verifyToken, (req, res) => res.sendFile(path.join(__dirname, 'view/product.html')));

// Admin Routes
app.get('/admin-dashboard', verifyToken, isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'view/admin-dashboard.html'));
});

// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name, role = 'user' } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            email,
            password: hashedPassword,
            name,
            role
        });

        await user.save();

        // Create token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
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
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare password using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        if (user.role === 'admin') {
            res.json({ redirect: '/admin-dashboard' });
        } else {
            res.json({ redirect: '/' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ redirect: '/' });
});

// Add item to wishlist
app.post('/api/wishlist', verifyToken, async (req, res) => {
    const { userId, productId } = req.body;

    try {
        // Find the user's wishlist
        let wishlist = await Wishlist.findOne({ userId });

        // If no wishlist exists, create a new one
        if (!wishlist) {
            wishlist = new Wishlist({ userId, products: [productId] });
            await wishlist.save();
        } else {
            // Check if the product is already in the wishlist to avoid duplicates
            if (wishlist.products.includes(productId)) {
                return res.status(400).json({ message: 'Item is already in the wishlist' });
            }

            // Add the product to the existing wishlist
            wishlist.products.push(productId);
            await wishlist.save();
        }

        res.json({ success: true, message: 'Item added to wishlist' });
    } catch (error) {
        console.error('Error adding item to wishlist:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get wishlist items for a user
app.get('/api/wishlist/:userId', verifyToken, async (req, res) => {
    const { userId } = req.params;

    try {
        // Find the user's wishlist and populate product details
        const wishlist = await Wishlist.findOne({ userId }).populate('products');
        if (!wishlist) {
            return res.json([]); // Return an empty array if no wishlist is found
        }

        res.json(wishlist.products);
    } catch (error) {
        console.error('Error fetching wishlist items:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
