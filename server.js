const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./api/routes/auth.routes');
const productRoutes = require('./api/routes/product.routes');
const cartRoutes = require('./api/routes/cart.routes');
const wishlistRoutes = require('./api/routes/wishlist.routes');
const couponRoutes = require('./api/routes/coupon.routes');
const userRoutes = require('./api/routes/user.routes');
const settingsRoutes = require('./api/routes/settings.routes');
// const transactionRoutes = require('./api/routes/transaction.routes');
const wishlist = require('./api/models/wishlist.schema');

const app = express();
const port = 5500;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'view')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/controllers', express.static(path.join(__dirname, 'controllers')));
app.use('/images', express.static(path.join(__dirname, 'images')));

mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);
// app.use('/api/transaction', transactionRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});