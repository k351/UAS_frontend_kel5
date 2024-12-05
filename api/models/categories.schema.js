const mongoose = require('mongoose');

const categoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: { type: String, required: true },
    isOnHome: { 
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('Categories', categoriesSchema);
