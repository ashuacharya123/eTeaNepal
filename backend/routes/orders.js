// routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// Place an order
router.post('/', auth, async (req, res) => {
    const { products, totalAmount } = req.body;

    try {
        const newOrder = new Order({
            buyer: req.user.id,
            products,
            totalAmount
        });

        const order = await newOrder.save();
        res.json(order);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get all orders for a user
router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user.id }).populate('products.product');
        res.json(orders);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('products.product');
        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }
        res.json(order);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update order status
router.put('/:id', auth, async (req, res) => {
    const { status } = req.body;

    try {
        let order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        // Ensure user is an admin or the seller
        if (req.user.role !== 'admin' && req.user.id !== order.seller.toString()) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        order = await Order.findByIdAndUpdate(req.params.id, { $set: { status } }, { new: true });

        res.json(order);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
