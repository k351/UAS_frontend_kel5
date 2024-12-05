const express = require('express');
const router = express.Router();
const Coupon = require('../models/coupon.schema'); 
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const coupon = await Coupon.find();
        res.status(200).json(coupon);
    } catch (error) {
        console.error('Error fetching coupon', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.get('/:couponCode', verifyToken, async (req, res) => {
    try {
        const { couponCode } = req.params;
        const coupon = await Coupon.findOne({couponCode: couponCode});
        res.status(200).json(coupon);
    } catch (error) {
        console.error('Error fetching coupon', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.put('/update/:couponId', verifyToken, isAdmin, async(req, res) => {
    const { couponId } = req.params;
    const { couponCode, discountValue, discountType, startAt, expiresAt } = req.body;
    try {
        const coupons = await Coupon.findById(couponId);
        if(!coupons){
            return res.status(404).json({ message: 'Coupon not found!'});
        }
        
        coupons.couponCode = couponCode;
        coupons.discountValue = discountValue;
        coupons.discountType = discountType;
        coupons.startAt = startAt;
        coupons.expiresAt = expiresAt;
        await coupons.save()
        res.status(200).json({ message: 'Coupons have been updated successfully.', coupons})
    } catch (error) {
        res.status(500).send('Error updating product');
    }
});

router.post('/add', async (req, res) => {
    try {
        const { couponCode, discountValue, discountType, startAt, expiresAt } = req.body;

        const coupon = new Coupon({
            couponCode,
            discountValue,
            discountType,
            startAt,
            expiresAt,
        });

        await coupon.save();
        res.status(201).json({ message: 'Coupon created successfully', coupon });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create coupon', error });
    }
});

router.delete('/delete/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await Coupon.findByIdAndDelete(id);
        res.status(200).json({ message: 'Coupon deleted successfully.' });
    } catch (error) {
        console.error('Error deleting coupon:', error);
        res.status(500).json({ message: 'Failed to delete coupon.' });
    }
});


module.exports = router;
