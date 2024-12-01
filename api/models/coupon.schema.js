const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    couponCode: {
        type: String,
        required: true,
        unique: true
    },
    discountValue: {
        type: Number,
        required: true
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'], 
        required: true
    },
    startAt: {
        type: Date,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model('Coupon', couponSchema);
