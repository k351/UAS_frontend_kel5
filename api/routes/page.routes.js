const express = require('express');
const router = express.Router();
const path = require('path');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public Routes
router.get('/', (req, res) => res.sendFile(path.join(__dirname, '../../view/index.html')));
router.get('/login', (req, res) => res.sendFile(path.join(__dirname, '../../view/login.html')));
router.get('/signup', (req, res) => res.sendFile(path.join(__dirname, '../../view/signup.html')));

// Protected Routes
router.get('/shop', (req, res) => res.sendFile(path.join(__dirname, '../../view/shop.html')));
router.get('/wishlist', verifyToken, (req, res) => res.sendFile(path.join(__dirname, '../../view/wishlist.html')));
router.get('/checkout', verifyToken, (req, res) => res.sendFile(path.join(__dirname, '../../view/checkout.html')));
router.get('/cart', verifyToken, (req, res) => res.sendFile(path.join(__dirname, '../../view/cart.html')));
router.get('/product', (req, res) => res.sendFile(path.join(__dirname, '../../view/product.html')));

// Admin Routes
router.get('/admin-dashboard', verifyToken, isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../view/admin-dashboard.html'));
});

module.exports = router;