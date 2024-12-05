const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TransactionItem',
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    transactionDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
