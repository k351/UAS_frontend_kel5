// const Product = require('../models/product.schema.js');

// // Product Routes
// app.post('/api/products', verifyToken, isAdmin, async (req, res) => {
//     try {
//         const { name, price, category, description, image } = req.body;

//         // Create new product with default values for stars and sold
//         const product = new Product({
//             name,
//             price,
//             category,
//             description,
//             image,
//             stars: null, // Will be calculated from user reviews
//             sold: 0 // Will increment with sales
//         });

//         await product.save();

//         res.status(201).json({
//             message: 'Product added successfully',
//             product: product
//         });
//     } catch (error) {
//         console.error('Product creation error:', error);
//         res.status(500).json({ message: 'Error creating product' });
//     }
// });

// // Get all products
// app.get('/api/products', async (req, res) => {
//     try {
//         const products = await Product.find().sort('-createdAt');
//         res.json(products);
//     } catch (error) {
//         console.error('Error fetching products:', error);
//         res.status(500).json({ message: 'Error fetching products' });
//     }
// });

// // Get single product
// app.get('/api/products/:id', async (req, res) => {
//     try {
//         const product = await Product.findById(req.params.id);
//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }
//         res.json(product);
//     } catch (error) {
//         console.error('Error fetching product:', error);
//         res.status(500).json({ message: 'Error fetching product' });
//     }
// });

// // Update product (admin can only update basic product info)
// app.put('/api/products/:id', verifyToken, isAdmin, async (req, res) => {
//     try {
//         const { name, price, category, description, image } = req.body;
        
//         const product = await Product.findByIdAndUpdate(
//             req.params.id,
//             {
//                 name,
//                 price,
//                 category,
//                 description,
//                 image
//             },
//             { new: true }
//         );
        
//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }
        
//         res.json({
//             message: 'Product updated successfully',
//             product: product
//         });
//     } catch (error) {
//         console.error('Error updating product:', error);
//         res.status(500).json({ message: 'Error updating product' });
//     }
// });

// // Delete product
// app.delete('/api/products/:id', verifyToken, isAdmin, async (req, res) => {
//     try {
//         const product = await Product.findByIdAndDelete(req.params.id);
//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }
//         res.json({ message: 'Product deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting product:', error);
//         res.status(500).json({ message: 'Error deleting product' });
//     }
// });
