// routes/admin.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth'); // Middleware to check admin role
const User = require("../models/User");
const Notification = require('../models/Notification');

// Verify a product
router.put('/verify/product/:id', [auth, adminAuth], async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        product.verified = ! product.verified;
        await product.save();

        // Notify the seller about product verification status
        const seller = await User.findById(product.seller);
        if (seller) {
            const notification = new Notification({
                user: seller._id,
                message: `Your product "${product.name}" has been ${product.verified ? 'verified' : 'unverified'} by the admin.`
            });
            await notification.save();
        }

        res.status(200).json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Verify a seller
router.put('/verify/seller/:id', [auth, adminAuth], async (req, res) => {
    try {
        let user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'No Seller found' });
        }

        user.verified = ! user.verified;
        await user.save();
        // Notify the seller about their verification status
        const notification = new Notification({
            user: user._id,
            message: `Your seller account has been ${user.verified ? 'verified' : 'unverified'} by the admin.`
        });
        await notification.save();

        res.status(200).json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// Change Role to admin
router.put('/change-role/:userId', [auth, adminAuth], async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = "admin";
        await user.save();

        res.status(200).json({ message: 'User role updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Delete a user
router.delete('/delete-user/:userId', [auth, adminAuth], async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.deleteOne({_id:req.params.userId});

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
