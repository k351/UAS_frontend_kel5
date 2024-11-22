const mongoose = require('mongoose');

// Define the Product Schema
const ProductSchema = mongoose.Schema({
    index: { type: Number, required: true,},
    image: { type: String, required: true,},
    category: { type: String, required: true,},
    name: { type: String, required: true,},
    stars: { type: Number, required: true, min: 0, max: 5,},
    price: { type: String, required: true,},
    sold: { type: Number, required: true,},},
    { timestamps: true, }
);

// Create the Product model
const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
