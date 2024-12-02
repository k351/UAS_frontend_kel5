const mongoose = require('mongoose');

const TransactionItemSchema = new mongoose.Schema({
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
    items: [TransactionItemSchema], 
    totalAmount: {
        type: Number,
        required: true,
    },
    transactionDate: {
        type: Date,
        default: Date.now,
    },
  });
  

module.exports = mongoose.model('Transaction', TransactionSchema);
