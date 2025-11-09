// server/routes/orderRoutes.js
const express = require('express');
const Order = require('../models/Order');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Place an order (Customer)
// POST /api/orders
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ msg: 'Only customers can place orders' });
    }

    const { items, shippingAddress, paymentMethod } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ msg: 'No items in order' });

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const newOrder = new Order({
      customer: req.user._id,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod
    });

    await newOrder.save();
    res.status(201).json({ msg: 'Order placed successfully', order: newOrder });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get orders of logged-in customer
// GET /api/orders/my-orders
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'customer') return res.status(403).json({ msg: 'Only customers can view their orders' });

    const orders = await Order.find({ customer: req.user._id }).populate('items.product', 'title price').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Error fetching my orders:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Admin: Get all orders (compact format A)
// GET /api/orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Only admin can view all orders' });

    const orders = await Order.find().populate('customer', 'name email').sort({ createdAt: -1 });

    const compact = orders.map(o => ({
      _id: o._id,
      customerName: o.customer?.name || '—',
      totalAmount: o.totalAmount,
      status: o.status,
      createdAt: o.createdAt
    }));

    res.json(compact);
  } catch (err) {
    console.error('Error fetching all orders:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Admin: Update order status
// PUT /api/orders/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Only admin can update order status' });

    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ msg: 'Order not found' });

    res.json({ msg: 'Order status updated', order });
  } catch (err) {
    console.error('Error updating order status (admin):', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
