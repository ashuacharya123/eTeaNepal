const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      sellerTotal: { type: Number, required: true },
    },
  ],
  orderTotal: { type: Number, required: true },
  deliveryStatus: { type: String, enum: ['Pending', 'Shipped', 'Delivered'], default: 'Pending' },
  orderDate: { type: Date, default: Date.now },
  deliveryDate: { type: Date },
  paymentStatus: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
});

module.exports = mongoose.model('Order', orderSchema);
