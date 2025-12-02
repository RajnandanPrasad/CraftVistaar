const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const getSellerDashboardStats = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const totalProducts = await Product.countDocuments({ sellerId });
    const orders = await Order.find({ "items.product": { $in: await Product.find({ sellerId }).select('_id') } }).populate('items.product');
    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    res.json({ totalProducts, totalOrders, totalSales });
  } catch (err) {
    console.error('Error fetching seller stats:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getSellerProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    res.json(user);
  } catch (err) {
    console.error('Error fetching seller profile:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const products = await Product.find({ sellerId }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('Error fetching seller products:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const products = await Product.find({ sellerId }).select('_id');
    const productIds = products.map(p => p._id);
    const orders = await Order.find({ "items.product": { $in: productIds } }).populate('customer', 'name email').populate('items.product', 'title price').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Error fetching seller orders:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { getSellerDashboardStats, getSellerProfile, getSellerProducts, getSellerOrders };
