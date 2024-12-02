const express = require('express');
const router = express.Router();
const User = require('../models/user.schema');
const { verifyToken } = require('../middleware/auth');


router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.get('/address', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id, 'address');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(user.address);
    } catch (error) {
        console.error('Error fetching address:', error);
        res.status(500).json({ message: 'Failed to fetch address.' });
    }
});


router.put('/address/update', verifyToken, async (req, res) => {
    const { street, city, country } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        user.address.street = street;
        user.address.city = city;
        user.address.country = country;

        await user.save();
        res.status(200).json({ message: 'Address updated successfully.', address: user.address });
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({ message: 'Failed to update address.' });
    }
});

module.exports = router;
