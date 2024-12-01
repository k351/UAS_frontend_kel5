const express = require('express');
const router = express.Router();
const path = require('path');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public Routes
router.get('/', (req, res) => res.sendFile(path.join(__dirname, '../../view/pages/index.html')));
router.get('/login', (req, res) => res.sendFile(path.join(__dirname, '../../view/pages/login.html')));
router.get('/signup', (req, res) => res.sendFile(path.join(__dirname, '../../view/pages/signup.html')));
router.get('/shop', (req, res) => res.sendFile(path.join(__dirname, '../../view/pages/shop.html')));

// Protected Routes
router.get('/wishlist', verifyToken, (req, res) => res.sendFile(path.join(__dirname, '../../view/pages/wishlist.html')));
router.get('/checkout', verifyToken, (req, res) => res.sendFile(path.join(__dirname, '../../view/pages/checkout.html')));
router.get('/cart', verifyToken, (req, res) => res.sendFile(path.join(__dirname, '../../view/pages/cart.html')));
router.get('/product/:id', (req, res) => res.sendFile(path.join(__dirname, '../../view/pages/product.html')));

// Admin Routes
router.get('/admin-dashboard', verifyToken, isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../../view/pages/admin-dashboard.html'));
});
module.exports = router;