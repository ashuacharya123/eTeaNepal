// routes/sellers.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');


// Helper function to send OTP
const sendOTP = (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAILID,
            pass: process.env.EMAILPASS
        }
    });

    const mailOptions = {
        from: process.env.EMAILID,
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP is ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};


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

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
            user.otp = otp;
            user.otpExpiry = Date.now() + 3600000; // 1 hour from now


        await newUser.save();

        // Notify admin
        const admin = await User.findOne({ role: 'admin' });
        const notification = new Notification({
            user: admin._id,
            message: `A new seller has registered: ${name}, ${email}.`
        });
        await notification.save();

        sendOTP(email, otp);

        res.status(200).json({ msg: 'OTP sent to email' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add a new product (only for sellers)
router.post('/product', auth, async (req, res) => {
    const { name, description, price, stock, image } = req.body;

       // Ensure user is a seller
       if (req.user.role !== 'seller') {
        return res.status(401).json({ msg: 'User not authorized' });
    }

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
