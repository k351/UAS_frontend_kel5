const mongoose = require('mongoose');

const TransactionItemSchema = new mongoose.Schema({
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null,
    },
    review: {
        type: String,
        default: '',
    },
});

module.exports = mongoose.model('TransactionItem', TransactionItemSchema);
