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


// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'backend/uploads/'); // Set the upload destination
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Register a new seller
router.post('/register', upload.single('panCardDocument'), async (req, res) => {
    const { name, email, password, businessName, businessAddress, panCard, mobileNumber } = req.body;
    const panCardDocument = req.file ? req.file.path : null;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Seller already exists' });
        }

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
