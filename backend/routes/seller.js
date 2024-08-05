// routes/sellers.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new seller
router.post('/register', async (req, res) => {
    const { name, email, password, panCard } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Seller already exists' });
        }
        const newUser = new User({ name, email, password, role: 'seller',panCard });

        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);

        await newUser.save();

        // Notify admin
        const admin = await User.findOne({ role: 'admin' });
        const notification = new Notification({
            user: admin._id,
            message: `A new seller has registered: ${name}, ${email}.`
        });
        await notification.save();

       const payload = { user: { id: newUser.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add a new product (only for sellers)
router.post('/product', auth, async (req, res) => {
    const { name, description, price, stock, image } = req.body;

    try {
        const newProduct = new Product({
            name,
            description,
            price,
            stock,
            image,
            seller: req.user.id,
            verified: false // initially not verified
        });
        await newProduct.save();

        // Notify admin
        const admin = await User.findOne({ role: 'admin' });
        const notification = new Notification({
            user: admin._id,
            message: `A new product has been listed: ${name}. Please verify.`
        });
        await notification.save();

        res.json(newProduct);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
