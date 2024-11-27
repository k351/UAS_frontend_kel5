const express = require('express');
const router = express.Router();
const CartItem = require('../models/cartItem.schema'); 
const User = require('../models/user.schema');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, async (req, res) => {
    try {
        const cartItems = await CartItem.find({ userId: req.user._id});
        res.status(200).json(cartItems);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.get('/populate', verifyToken, async (req, res) => {
    try {
        const cartItems = await CartItem.find({ userId: req.user._id }).populate('productId', 'name price image');
        res.status(200).json(cartItems);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ message: 'Failed to fetch cart items.' });
    }
});

router.post('/add', verifyToken, async (req, res) => {
    const { productId, cartQuantity } = req.body;

    try {
        let cartItem = new CartItem({
            userId: req.user._id,
            productId,
            cartQuantity
        });
        await cartItem.save();
        const user = await User.findById(req.user._id);
        user.cart.push(cartItem._id);
        await user.save();
        res.status(200).json({ message: 'Item added to cart successfully.', cartItem });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Failed to add item to cart.' });
    }
});

router.put('/update/:cartItemId', verifyToken, async (req, res) => {
    const { cartItemId } = req.params;
    const { cartQuantity } = req.body;
    try {
        const cartItem = await CartItem.findById(cartItemId);
        if (!cartItem || cartItem.userId.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Cart item not found.' });
        }
        cartItem.cartQuantity = cartQuantity;
        await cartItem.save();
        res.status(200).json({ message: 'Cart item updated successfully.', cartItem });
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ message: 'Failed to update cart item.' });
    }
});

router.delete('/delete/:cartItemId', verifyToken, async (req, res) => {
    const { cartItemId } = req.params;
    try {
        const cartItem = await CartItem.findById(cartItemId);
        if (!cartItem || cartItem.userId.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Cart item not found.' });
        }
        await CartItem.deleteOne({ _id: cartItemId });
        await User.findByIdAndUpdate(req.user._id, { $pull: { cart: cartItem._id } });
        res.status(200).json({ message: 'Cart item removed successfully.' });
    } catch (error) {
        console.error('Error removing cart item:', error);
        res.status(500).json({ message: 'Failed to remove cart item.' });
    }
});

module.exports = router;
