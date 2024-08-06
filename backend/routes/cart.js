// routes/cart.js
const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

// Get cart for the logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product', 'name price');
        if (!cart) {
            return res.status(404).json({ msg: 'Cart not found' });
        }
        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add item to cart
router.post('/', auth, async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
        }

        const productIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (productIndex !== -1) {
            cart.items[productIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        res.json(cart);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update item quantity in cart
router.put('/:itemId', auth, async (req, res) => {
    const { quantity } = req.body;

    try {
        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({ msg: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item._id.toString() === req.params.itemId);

        if (itemIndex === -1) {
            return res.status(404).json({ msg: 'Item not found in cart' });
        }

        cart.items[itemIndex].quantity = quantity;

        await cart.save();
        res.json(cart);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Remove item from cart
router.delete('/:itemId', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({ msg: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);

        await cart.save();
        res.json(cart);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;