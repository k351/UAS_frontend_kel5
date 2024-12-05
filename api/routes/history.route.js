const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction.schema');
const TransactionItem = require('../models/transactionitem.schema');
const { verifyToken } = require('../middleware/auth');

// GET - Fetch Transaction History
router.get('/', verifyToken, async (req, res) => {
    try {
        // Fetch all transactions for the logged-in user
        const transactions = await Transaction.find({ userId: req.user._id })
            .populate({
                path: 'items',
                populate: {
                    path: 'productId',
                    select: 'name price image address', 
                },
            })
            .sort({ transactionDate: -1 }); 

        console.log(transactions)
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transaction history:', error);
        res.status(500).json({ message: 'Failed to fetch transaction history.' });
    }
});

// POST - Submit Rating
router.post('/rate', verifyToken, async (req, res) => {
    try {
        const { transactionItemId, rating, review } = req.body;

        if (!transactionItemId || !rating) {
            return res.status(400).json({ message: 'Transaction Item ID and rating are required.' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
        }

        // Find and update the transaction item
        const updatedTransactionItem = await TransactionItem.findOneAndUpdate(
            { 
                _id: transactionItemId,
                // Optional: Add additional verification if needed
                // userId: req.user._id 
            }, 
            { 
                rating: rating, 
                review: review || '' 
            },
            { new: true }
        ).populate('productId');

        if (!updatedTransactionItem) {
            return res.status(404).json({ message: 'Transaction item not found.' });
        }

        res.status(200).json({
            message: 'Rating submitted successfully!',
            transactionItem: updatedTransactionItem
        });

    } catch (error) {
        console.error('Error submitting rating:', error);
        res.status(500).json({ message: 'Failed to submit rating.' });
    }
});

module.exports = router;
