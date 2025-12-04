// server/routes/orderRoutes.js
const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Razorpay = require("razorpay");
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// ⭐ Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});


// ======================================================================
// ⭐ RAZORPAY: CREATE PAYMENT ORDER
// ======================================================================
router.post("/create-payment", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;

    const razorOrder = await razorpay.orders.create({
      amount: amount * 100, // convert ₹ to paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.json({
      orderId: razorOrder.id,
      amount: razorOrder.amount,
    });
  } catch (err) {
    console.log("Razorpay Create Error:", err);
    res.status(500).json({ msg: "Failed to create Razorpay order" });
  }
});


// ======================================================================
// ⭐ RAZORPAY: VERIFY PAYMENT
// ======================================================================
router.post("/verify", authMiddleware, async (req, res) => {
  try {
    const { orderId, paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({ msg: "Payment failed" });
    }

    res.json({ msg: "Payment verified" });

  } catch (err) {
    console.log("Verify Error:", err);
    res.status(500).json({ msg: "Verification failed" });
  }
});


// ======================================================================
// 1️⃣ CUSTOMER: PLACE ORDER + Save Address
// ======================================================================
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ msg: 'Only customers can place orders' });
    }

    const { items, shippingAddress, paymentMethod } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ msg: 'No items in order' });

    // Fetch seller automatically from product model
    const itemsWithSeller = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        return {
          product: product._id,
          seller: product.sellerId,
          quantity: item.quantity,
          price: item.price
        };
      })
    );

    const totalAmount = itemsWithSeller.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    const newOrder = new Order({
      customer: req.user._id,
      items: itemsWithSeller,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "razorpay" ? "paid" : "pending"
    });

    await newOrder.save();

    // Save address for future checkout
    await User.findByIdAndUpdate(req.user._id, {
      shippingAddress
    });

    res.status(201).json({ msg: 'Order placed successfully', order: newOrder });
  } catch (err) {
    console.error('Order error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});


// ======================================================================
// 2️⃣ CUSTOMER: GET MY ORDERS
// ======================================================================
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'customer')
      return res.status(403).json({ msg: 'Only customers can view their orders' });

    const orders = await Order.find({ customer: req.user._id })
      .populate('items.product', 'title price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error('Error fetching my orders:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});


// ======================================================================
// 3️⃣ CUSTOMER: GET SAVED ADDRESS
// ======================================================================
router.get('/saved-address', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("shippingAddress");
    res.json(user.shippingAddress || {});
  } catch (err) {
    console.error("Error fetching saved address:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


// ======================================================================
// 4️⃣ ADMIN: GET ALL ORDERS
// ======================================================================
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin')
      return res.status(403).json({ msg: 'Only admin can view all orders' });

    const orders = await Order.find()
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });

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


// ======================================================================
// 5️⃣ ADMIN: UPDATE ANY ORDER STATUS
// ======================================================================
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin')
      return res.status(403).json({ msg: 'Only admin can update order status' });

    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ msg: 'Order not found' });

    res.json({ msg: 'Order status updated', order });
  } catch (err) {
    console.error('Error updating order status (admin):', err);
    res.status(500).json({ msg: 'Server error' });
  }
});


// ======================================================================
// 6️⃣ SELLER: VIEW THEIR ORDERS
// ======================================================================
router.get('/seller/orders', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'seller')
      return res.status(403).json({ msg: 'Only sellers can view their orders' });

    const orders = await Order.find({
      "items.seller": req.user._id
    })
      .populate("customer", "name email")
      .populate("items.product", "title price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error('Seller order fetch error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});


// ======================================================================
// 7️⃣ SELLER: UPDATE ORDER STATUS
// ======================================================================
router.patch('/seller/update-status/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'seller')
      return res.status(403).json({ msg: 'Only sellers can update status' });

    const { status } = req.body;

    const order = await Order.findOne({
      _id: req.params.id,
      "items.seller": req.user._id
    });

    if (!order)
      return res.status(404).json({ msg: 'Order not found for this seller' });

    order.status = status;
    await order.save();

    res.json({ msg: "Order status updated", order });
  } catch (err) {
    console.error("Seller status update error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
