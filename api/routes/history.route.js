const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction.schema');
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
                    select: 'name price image', 
                },
            })
            .sort({ transactionDate: -1 }); 

        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transaction history:', error);
        res.status(500).json({ message: 'Failed to fetch transaction history.' });
    }
});

module.exports = router;
