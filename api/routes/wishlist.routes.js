const express = require('express');
const router = express.Router();
const Wishlist = require('../models/wishlist.schema');
const TransactionItem = require('../models/transactionitem.schema');
const { verifyToken, optionalVerify } = require('../middleware/auth.js');

// Helper function to calculate average rating
const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const total = ratings.reduce((sum, rating) => sum + rating, 0);
    return (total / ratings.length).toFixed(1);
};
const Wishlist = require('../models/wishlist.schema'); 

// Middleware to check if the user is authenticated (assuming JWT)
const { verifyToken, optionalVerify } = require('../middleware/auth.js');

// Get wishlist items for the logged-in user
router.get('/', optionalVerify, async (req, res) => {
    
    try {
        // Fetch wishlist for the logged-in user

        if (!req.user) {
            return res.json([]);
        }

        const wishlist = await Wishlist.findOne({ userId: req.user._id }).populate('products');

        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        // Extract sort criteria from query parameters
        const sortBy = req.query.sortBy;
        let sortedProducts = [...wishlist.products];

        // Fetch ratings for all products in the wishlist
        const productIds = sortedProducts.map((product) => product._id);
        const transactionItems = await TransactionItem.find({ productId: { $in: productIds } });

        // Map product IDs to their ratings
        const productRatings = {};
        transactionItems.forEach((item) => {
            if (!productRatings[item.productId]) productRatings[item.productId] = [];
            productRatings[item.productId].push(item.rating);
        });

        // Add average ratings to each product
        sortedProducts = sortedProducts.map((product) => {
            const ratings = productRatings[product._id] || [];
            const averageRating = calculateAverageRating(ratings);
            return {
                ...product._doc, 
                rating: averageRating, 
            };
        });

        // Sort products based on the selected criteria
        if (sortBy) {
            switch (sortBy) {
                case 'price':
                    sortedProducts.sort((a, b) => a.price - b.price); // Ascending by price
                    break;
                case 'rating':
                    sortedProducts.sort((a, b) => b.rating - a.rating); // Descending by rating
                    break;
                case 'name-asc':
                    sortedProducts.sort((a, b) => a.name.localeCompare(b.name)); // A-Z
                    break;
                case 'name-desc':
                    sortedProducts.sort((a, b) => b.name.localeCompare(a.name)); // Z-A
                    break;
                default:
                    break;
            }
        }

        res.json(sortedProducts); // Send the sorted products
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
