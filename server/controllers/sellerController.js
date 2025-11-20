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

module.exports = { getSellerDashboardStats, getSellerProfile };
