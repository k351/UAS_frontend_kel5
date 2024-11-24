const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true},
    stars: { type: Number,  min: 0, max: 5, },
    sold: { type: Number },
},
    { timestamps: true, },
);

module.exports = mongoose.model('Product', ProductSchema);