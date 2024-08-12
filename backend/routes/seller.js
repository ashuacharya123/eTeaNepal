// routes/sellers.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('./email');
const multer = require('multer');
const fs = require('fs');
const path = require('path');



// Set up multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public'));  // Adjust the path as needed
    },
    filename: function (req, file, cb) {
        let str = file.originalname.replace(/\s+/g, '');// Remove space between file name
        cb(null, `${Date.now()}-${str}`);
    }
});

const upload = multer({ storage: storage });

// Accept multiple fields if needed
const uploadFields = upload.fields([{ name: 'panCardDocument', maxCount: 1 } ]);




// Register a new seller
router.post('/register', uploadFields, async (req, res) => {
    const { name, email, password, businessName, businessAddress, panCard, mobileNumber, } = req.body;


    try {
         // Check if all required fields are present
         if (!name || !email || !password || !businessName || !businessAddress || !panCard || !mobileNumber) {
            return res.status(400).json({ msg: 'All fields are required' });
        }

        // Check if the PAN card document file is uploaded
        if (!req.files || !req.files.panCardDocument || !req.files.panCardDocument[0]) {
            return res.status(400).json({ msg: 'PAN card document is required' });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Seller already exists' });
        }

        // Handle file uploads
        // Save the new PAN card document
        const panCardDocument = req.files.panCardDocument[0].filename;

        const newUser = new User({ 
            name, 
            email, 
            password, 
            role: 'seller', 
            panCard, 
            panCardDocument, 
            businessName, 
            businessAddress, 
            mobileNumber 
        });

        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        newUser.otp = await bcrypt.hash(otp, salt);

        const date = new Date(Date.now() + 600000); // 10 minutes from now
        newUser.otpExpiry = date.getTime();

        await newUser.save();

        // Notify admin
        const admin = await User.findOne({ role: 'admin' });
        const notification = new Notification({
            user: admin._id,
            message: `A new seller has registered: ${name}, ${email}.`
        });
        await notification.save();

        sendEmail(email, "OTP verification", `Your OTP is ${otp}`);

        res.status(200).json({ msg: 'OTP sent to email' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Seller dashboard
router.get('/dashboard', auth, async (req, res) => {
    try {
        const sellerId = req.user.id;

        // Get the total number of products listed by the seller
        const totalProducts = await Product.countDocuments({ seller: sellerId });

        // Get the total sales for the seller
        const orders = await Order.find({
            'products.product': { $in: await Product.find({ seller: sellerId }).select('_id') }
        });

        const totalSales = orders.reduce((total, order) => total + order.totalAmount, 0);

        res.status(200).json({
            totalProducts,
            totalSales
        });
    } catch (error) {
        console.error(error.message);
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
