const express = require('express');
const router = express.Router();
const multer = require('multer');
const Category = require('../models/categories.schema');
const { verifyToken, isAdmin } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../images/categories')); // Lokasi penyimpanan file
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


router.get('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


router.get('/home', async (req, res) => {
    try {
        const categories = await Category.find({isOnHome : true});
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.get('/shop', async (req, res) => {
    try {
        const categories = await Category.find().select('name');
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


router.post('/add', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { name, isOnHome } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'File upload is required.' });
        }

        const category = new Category({
            name: name,
            image: `images/categories/${req.file.filename}`,
            isOnHome: isOnHome === 'true',
        });

        await category.save();
        res.status(201).json({ message: 'Category created successfully.', category });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.put('/update/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { isOnHome } = req.body;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        category.isOnHome = isOnHome;  
        await category.save();

        res.status(200).json({ message: 'Category status updated successfully.' });
    } catch (error) {
        console.error('Error updating category status:', error);
        res.status(500).json({ message: 'Failed to update category status.' });
    }
});


router.delete('/delete/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        res.status(200).json({ message: 'Category deleted successfully.' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Failed to delete category.' });
    }
});

module.exports = router;
