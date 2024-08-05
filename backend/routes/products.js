// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');


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
        if (product.seller.toString() !== req.user.id) {
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
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Product.deleteOne({_id:req.params.id});

        res.json({ msg: 'Product removed' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get products with weighted average price
router.get('/weightedaverageprice', async (req, res) => {
    try {
        const products = await Product.find().populate('seller', 'rating');
        const weightedProducts = products.map(product => {
            const weightedPrice = product.price * product.seller.rating;
            return {
                ...product._doc,
                weightedPrice
            };
        });
        res.json(weightedProducts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Implementing Boyer-Moore Algorithm for search
function boyerMooreSearch(text, pattern) {
    const m = pattern.length;
    const n = text.length;
    const badChar = Array(256).fill(-1);

    for (let i = 0; i < m; i++) {
        badChar[pattern.charCodeAt(i)] = i;
    }

    let s = 0;
    while (s <= (n - m)) {
        let j = m - 1;
        while (j >= 0 && pattern[j] === text[s + j]) {
            j--;
        }
        if (j < 0) {
            return s;
        } else {
            s += Math.max(1, j - badChar[text.charCodeAt(s + j)]);
        }
    }
    return -1;
}

router.get('/search', async (req, res) => {
    const { query } = req.query;
    try {
        const products = await Product.find();
        const matchedProducts = products.filter(product => 
            boyerMooreSearch(product.description, query) !== -1 || 
            boyerMooreSearch(product.name, query) !== -1
        );
        res.json(matchedProducts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
