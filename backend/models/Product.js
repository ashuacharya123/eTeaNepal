// models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    initialPrice :{ type: Number},
    stock: { type: Number, required: true },
    image: { type: String },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    verified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
