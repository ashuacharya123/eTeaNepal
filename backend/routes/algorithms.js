const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');


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
            boyerMooreSearch(product.description.toLowerCase(), query.toLowerCase()) !== -1 || 
            boyerMooreSearch(product.name.toLowerCase(), query.toLowerCase()) !== -1
        );
        res.json(matchedProducts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;