// models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'buyer', required: true },
    panCard: { type: String },
    verified: { type: Boolean, default: false },
    otp: {
        type: Number,
        required: false
    },
    otpExpiry: {
        type: Number,
        required: false
    },
    ratedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
