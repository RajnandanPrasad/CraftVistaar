const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const getAdminDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    res.json({ totalUsers, totalProducts, totalOrders });
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getAdminProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    res.json(user);
  } catch (err) {
    console.error('Error fetching admin profile:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { getAdminDashboardStats, getAdminProfile };
