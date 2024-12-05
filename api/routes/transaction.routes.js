const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction.schema');
const TransactionItem = require('../models/transactionitem.schema');
const CartItem = require('../models/cartItem.schema');
const User = require('../models/user.schema');
const Product = require('../models/product.schema'); 
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, async (req, res) => {
    try {
        const { address, items, paymentMethod, totalAmount } = req.body;
        const userId = req.user._id;

        // Fetch the user with their address
        const user = await User.findById(userId).select('address');
        if (!user || !user.address) {
            return res.status(404).json({ error: 'User or address not found.' });
        }

        // Use the user's full address
        const fullAddress = Object.values(user.address.toObject())
            .filter((value) => typeof value === 'string') // Ensure only string values are included
            .join(', ');

        // Validate required fields
        if (!userId || !address || !items || items.length === 0 || !paymentMethod) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        // Validate payment method
        const validPaymentMethods = ['paypal', 'mastercard', 'ovo', 'gopay', 'bank'];
        if (!validPaymentMethods.includes(paymentMethod.toLowerCase())) {
            return res.status(400).json({ error: 'Invalid payment method.' });
        }

        // Fetch CartItems based on the items passed in the request body
        const cartItems = await CartItem.find({ 
            _id: { $in: items.map(item => item.id) }, 
            userId: userId 
        });

        // Create TransactionItem documents
        const transactionItems = await Promise.all(
            cartItems.map(async (cartItem) => {
                const product = await Product.findById(cartItem.productId); 
                if (!product) {
                    throw new Error('Product not found: ' + cartItem.productId);
                }

                if (cartItem.cartQuantity <= 0 || cartItem.cartQuantity > product.stock) {
                    throw new Error('Invalid quantity or insufficient stock for product: ' + product._id);
                }

                const transactionItem = new TransactionItem({
                    productId: cartItem.productId,
                    quantity: cartItem.cartQuantity,
                    price: product.price, 
                });

                // Save the transaction item
                await transactionItem.save();

                // Update the product stock
                product.quantity -= cartItem.cartQuantity; 
                product.sold += cartItem.cartQuantity; 
                await product.save();

                return transactionItem;
            })
        );

        // Create Transaction document
        const transaction = new Transaction({
            userId: userId,
            address: fullAddress,
            items: transactionItems.map((item) => item._id),
            totalAmount: totalAmount,
            paymentMethod: paymentMethod,
        });

        // Save the Transaction
        const savedTransaction = await transaction.save();

        // Prepare item details (productId and cartQuantity)
        const transactionDetails = transactionItems.map(item => ({
            productId: item.productId,
            cartQuantity: item.quantity,
        }));

        // Send response with transaction and item details
        res.status(201).json({
            message: 'Checkout successful!',
            transaction: savedTransaction,
            items: transactionDetails,  // Include product ID and cart quantity
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process checkout. Please try again later.' });
    }
});

module.exports = router;
