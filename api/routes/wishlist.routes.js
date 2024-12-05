const express = require('express');
const router = express.Router();
const Wishlist = require('../models/wishlist.schema'); 

// Middleware to check if the user is authenticated (assuming JWT)
const { verifyToken, optionalVerify } = require('../middleware/auth.js');

// Get wishlist items for the logged-in user
router.get('/', optionalVerify, async (req, res) => {
    
    try {

        if (!req.user) {
            return res.json([]);
        }

        const wishlist = await Wishlist.findOne({ userId: req.user._id }).populate('products');

        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        res.json(wishlist.products);  // Send back the list of products in the wishlist
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add an item to the user's wishlist
router.post('/', verifyToken, async (req, res) => {
    try {
        const { productId } = req.body;
        const wishlist = await Wishlist.findOne({ userId: req.user._id });

        if (!wishlist) {
            const newWishlist = new Wishlist({
                userId: req.user._id,
                products: [productId]
            });
            await newWishlist.save();
            return res.json({ message: 'Item added to wishlist', wishlist: newWishlist.products });
        }

        if (wishlist.products.includes(productId)) {
            return res.status(400).json({ message: 'Item already in wishlist' });
        }

        wishlist.products.push(productId);
        await wishlist.save();

        res.json({ message: 'Item added to wishlist', wishlist: wishlist.products });
    } catch (error) {
        console.error('Error adding item to wishlist:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove an item from the user's wishlist
router.delete('/', verifyToken, async (req, res) => {
    try {
        console.log('Request body:', req.body);  // Debugging line to check req.body
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: 'Product ID is missing' });
        }

        const wishlist = await Wishlist.findOne({ userId: req.user._id });

        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        const index = wishlist.products.indexOf(productId);
        if (index === -1) {
            return res.status(400).json({ message: 'Item not found in wishlist' });
        }

        wishlist.products.splice(index, 1);
        await wishlist.save();

        res.json({ message: 'Item removed from wishlist', wishlist: wishlist.products });
    } catch (error) {
        console.error('Error removing item from wishlist:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
