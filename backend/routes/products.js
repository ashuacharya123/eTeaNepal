// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');


// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.json(product);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update a product
router.patch('/:id', auth, async (req, res) => {
    const { name, description, price, stock, image } = req.body;

    const productFields = { name, description, price, stock, image };

    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Ensure user owns the product
        if (product.seller.toString() !== req.user.id ) {
            const user = await User.findById(req.user.id).select('-password');
            if(user.role != "admin")// admin can also make change
            return res.status(401).json({ msg: 'User not authorized' });
        }

        product = await Product.findByIdAndUpdate(req.params.id, { $set: productFields }, { new: true });

        res.json(product);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete a product
router.delete('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Ensure user owns the product
        if (product.seller.toString() !== req.user.id) {
            const user = await User.findById(req.user.id).select('-password');
            if(user.role != "admin")// admin can also make change
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Product.deleteOne({_id:req.params.id});

        res.json({ msg: 'Product removed' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});




module.exports = router;
