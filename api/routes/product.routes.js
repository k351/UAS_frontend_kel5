const express = require('express');
const router = express.Router();
const multer = require('multer');
const Product = require('../models/product.schema');
const Wishlist = require('../models/wishlist.schema');
const { verifyToken, isAdmin } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../images/products')); // Lokasi penyimpanan file
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = file.originalname;
        cb(null, uniqueSuffix);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Only PNG files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching product', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.get('/compare', verifyToken, async (req, res) => {
    try {
        // Cari wishlist berdasarkan userId
        const wishlist = await Wishlist.findOne({ userId: req.user.id }).populate('products');
        if (!wishlist) {
            return res.status(404).json({ message: 'No wishlist found for this user' });
        }

        // Ambil daftar produk dari wishlist
        const compareProducts = wishlist.products;

        // Jika wishlist kosong atau hanya ada produk utama, kirimkan pesan kosong
        if (compareProducts.length === 0) {
            return res.status(200).json({ message: 'No products in wishlist to compare' });
        }

        res.status(200).json(compareProducts);  // Mengirimkan produk untuk perbandingan
    } catch (error) {
        console.error('Error fetching compare list:', error);
        res.status(500).json({ message: 'Failed to fetch compare list' });
    }
});

router.post('/add', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
    const { name, price, category, description, quantity } = req.body;

    try {

        if (!req.file) {
            return res.status(400).json({ message: 'File upload is required.' });
        }

        let product = new Product({
            name,
            price,
            category,
            description,
            image: `images/products/${req.file.filename}`,
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
    const id = req.params.id;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        
        const imagePath = path.join(__dirname, '../../', product.image); 
        
        if (product.image) {
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting image file:', err);
                }
            });
        }
        await Product.findByIdAndDelete(id);
        res.status(200).send('Product deleted successfully');
        
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting product');
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

router.get('/checkname/:name', async (req, res) => {
    const { name } = req.params;
    try {
        const product = await Product.findOne({ name: name });
        if (!product) {
            return res.json({ exists: false, message: 'Product does not exist' });
        }
        res.json({ exists: true, product });
    } catch (error) {
        console.error('Error fetching product by name:', error);
        res.status(500).json({ message: 'Failed to fetch product' });
    }
});


module.exports = router;