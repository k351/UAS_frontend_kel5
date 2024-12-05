const express = require('express');
const router = express.Router();
const Product = require('../models/product.schema');
const mongoose = require('mongoose');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', verifyToken, async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching product', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.post('/add', verifyToken, isAdmin, async (req, res) => {
    const { name, price, category, description, image, quantity } = req.body;

    try {
        let product = new Product({
            name,
            price,
            category,
            description,
            image,
            quantity,
        });

        await product.save();

        res.status(201).json({
            success: true,
            message: "Product created successfully!",
            product,
        });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create product.",
            error: error.message,
        });
    }
});

router.delete('/delete/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.send('Product deleted successfully');
    } catch (error) {
        res.status(500).send('Error deleting user');
    }
});

router.put('/update/:productId', verifyToken, isAdmin, async (req, res) => {
    const { productId } = req.params;
    const { name, price, category, description, image, quantity } = req.body;
    try {
        const productItem = await Product.findById(productId);
        if (!productItem) {
            return res.status(404).json({ message: 'Product item not found!' });
        }
        productItem.name = name;
        productItem.price = price;
        productItem.category = category;
        productItem.description = description;
        productItem.image = image;
        productItem.quantity = quantity;
        await productItem.save();
        res.status(200).json({ message: 'Product item updated successfully.', productItem });
    } catch (error) {
        res.status(500).send('Error updating product');
    }
});

router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({ message: 'Failed to fetch product' });
    }
});


module.exports = router;