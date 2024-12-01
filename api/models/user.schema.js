const mongoose = require('mongoose');

// Address Schema
const addressSchema = new mongoose.Schema({
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true }
});

// User Schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    password: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    address: { type: addressSchema, required: true },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^(?:\+62|62|0)8[1-9][0-9]{6,11}$/.test(v);
            },
            message: props => `${props.value} is not a valid Indonesian phone number!`
        }
    },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'cartItem'
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);