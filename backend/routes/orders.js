// routes/orders.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const auth = require("../middleware/auth");

// Create an order
router.post("/", auth, async (req, res) => {
  try {
    const { items, total, delivery, address, mobileNumber } = req.body;
    const userId = req.user.id;

    // Create a new order
    const newOrder = new Order({
      user: userId,
      items,
      total,
      delivery,
      address,
      mobileNumber,
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get orders for the logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get orders for the seller
router.get("/seller", auth, async (req, res) => {
  try {
    // Find orders where any item in the items array has the sellerId matching the authenticated user's ID
    const orders = await Order.find({
      'items.sellerId': req.user.id
    });

    // Send the orders as a response
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
