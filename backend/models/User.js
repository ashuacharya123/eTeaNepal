// models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['buyer', 'seller', 'admin'], required: true },
    panCard: { type: String },
    verified: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', UserSchema);
