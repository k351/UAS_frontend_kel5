const express = require('express');
const path = require('path');
const app = express();
const port = 5500;

app.use(express.static('view'))

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'view/index.html')));
app.get('/shop', (req, res) => res.sendFile(path.join(__dirname, 'view/shop.html')));
app.get('/wishlist', (req, res) => res.sendFile(path.join(__dirname, 'view/wishlist.html')));
app.get('/checkout', (req, res) => res.sendFile(path.join(__dirname, 'view/checkout.html')));
app.get('/cart', (req, res) => res.sendFile(path.join(__dirname, 'view/cart.html')));


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});