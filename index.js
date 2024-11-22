const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5500;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static file serving
app.use(express.static(path.join(__dirname, 'view')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/controllers', express.static(path.join(__dirname, 'controllers')));
app.use('/images', express.static(path.join(__dirname, 'images')));

mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'view/index.html')));
app.get('/shop', (req, res) => res.sendFile(path.join(__dirname, 'view/shop.html')));
app.get('/wishlist', (req, res) => res.sendFile(path.join(__dirname, 'view/wishlist.html')));
app.get('/checkout', (req, res) => res.sendFile(path.join(__dirname, 'view/checkout.html')));
app.get('/cart', (req, res) => res.sendFile(path.join(__dirname, 'view/cart.html')));
app.get('/product', (req, res) => res.sendFile(path.join(__dirname, 'view/product.html')));

// API Routes (to be expanded)
// const productRoutes = require('./routes/productRoutes');
// const userRoutes = require('./routes/userRoutes');

// app.use('/api/products', productRoutes);
// app.use('/api/users', userRoutes);

// Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something broke!');
// });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});