const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

const { authMiddleware, roleCheck } = require("../middleware/authMiddleware");
const adminMiddleware = roleCheck(["admin"]);

const { getAdminDashboardStats, getAdminProfile } = require("../controllers/adminController");

// --- New dashboard and profile routes ---
router.get('/dashboard', authMiddleware, adminMiddleware, getAdminDashboardStats);
router.get('/profile', authMiddleware, adminMiddleware, getAdminProfile);

// --- Get all sellers ---
router.get('/sellers', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const sellers = await User.find({ role: 'seller' }).select('-passwordHash');
    res.json(sellers);
  } catch (err) {
    console.error('Error fetching sellers:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// --- Verify seller ---
router.put('/verify-seller/:sellerId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const seller = await User.findById(req.params.sellerId);
    if (!seller || seller.role !== 'seller') return res.status(404).json({ msg: 'Seller not found' });

    seller.isVerified = true;
    await seller.save();
    res.json({ msg: 'Seller verified successfully', seller });
  } catch (err) {
    console.error('Error verifying seller:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// --- Get all products (admin) ---
router.get('/products', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // full product details + seller name & email (P3)
    const products = await Product.find().populate('sellerId', 'name email');
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// --- Approve product ---
router.put('/products/:id/approve', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json({ msg: 'Product approved', product });
  } catch (err) {
    console.error('Error approving product:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// --- Delete (reject) product permanently (admin) ---
router.delete('/products/:id/reject', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: 'Product not found' });
    res.json({ msg: 'Product rejected and deleted' });
  } catch (err) {
    console.error('Error deleting product (admin):', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// --- Get all users (admin) ---
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json({ users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// --- Verify seller (approve/reject) ---
router.patch('/users/:id/verify', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, reason, notify } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'seller') {
      return res.status(404).json({ msg: 'Seller not found' });
    }

    if (status === 'rejected' && !reason) {
      return res.status(400).json({ msg: 'Rejection reason is required' });
    }

    // Update verification status
    user.sellerVerificationStatus = status;
    if (status === 'rejected') {
      user.verificationReason = reason;
    }

    // Audit trail
    user.verifiedBy = req.user._id;
    user.verifiedByName = req.user.name;
    user.verifiedByEmail = req.user.email;
    user.verifiedAt = new Date();

    await user.save();

    // TODO: Implement notification (email/SMS) if notify === true
    if (notify) {
      // Stub: console.log(`Notification sent to ${user.email} for ${status}`);
    }

    res.json({ msg: 'Verification updated successfully', user });
  } catch (err) {
    console.error('Error verifying seller:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// --- Delete a user permanently (admin only) ---
router.delete('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// --- Get all orders (admin) ---
// NOTE: Per your choice (Option A) we return compact order objects for UI
router.get('/orders', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });

    // Shape into compact objects for admin UI (A)
    const compact = orders.map(o => ({
      _id: o._id,
      customerName: o.customer?.name || '—',
      totalAmount: o.totalAmount,
      status: o.status,
      createdAt: o.createdAt
    }));

    res.json(compact);
  } catch (err) {
    console.error('Error fetching orders (admin):', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// --- Update order status (admin) ---
router.put('/orders/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
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
