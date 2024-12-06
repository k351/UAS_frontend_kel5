const express = require('express');
const router = express.Router();
const TransactionItem = require('../models/transactionitem.schema');

router.get('/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        // Find transaction items with reviews
        const reviewItems = await TransactionItem.find({
            productId: productId,
            review: { $ne: '' }
        }).populate({
            path: 'transaction',
            populate: {
                path: 'userId',
                select: 'name'
            }
        });

        // Transform reviews
        const reviews = reviewItems.map(item => ({
            rating: item.rating,
            review: item.review,
            userId: {
                name: item.transaction.userId.name,
                _id: item.transaction.userId._id
            },
            transactionDate: item.transaction.transactionDate 
        }));

        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Failed to fetch reviews' });
    }
});


module.exports = router;