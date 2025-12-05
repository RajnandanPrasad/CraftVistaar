const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

// ==============================
// ✅ ADMIN DASHBOARD STATS
// ==============================
const getAdminDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    res.json({ totalUsers, totalProducts, totalOrders });
  } catch (err) {
    console.error("Error fetching admin stats:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ==============================
// ✅ ADMIN PROFILE
// ==============================
const getAdminProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    res.json(user);
  } catch (err) {
    console.error("Error fetching admin profile:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ==============================
// ✅ ✅ SELLER ANALYTICS (NEW)
// ==============================
const getSellerAnalytics = async (req, res) => {
  try {
    const sellers = await User.find({ role: "seller" });

    let totalOrders = 0;
    let totalRevenue = 0;
    let totalProfit = 0;

    const sellerStats = [];

    for (let seller of sellers) {
      // ✅ seller ke sare orders nikaalo
      const orders = await Order.find({ seller: seller._id });

      const sellerOrders = orders.length;

      const sellerRevenue = orders.reduce(
        (acc, o) => acc + (o.totalAmount || 0),
        0
      );

      // ✅ PROFIT LOGIC (10% COMMISSION MODEL)
      const sellerProfit = sellerRevenue * 0.1;

      totalOrders += sellerOrders;
      totalRevenue += sellerRevenue;
      totalProfit += sellerProfit;

      sellerStats.push({
        _id: seller._id,
        name: seller.name,
        orders: sellerOrders,
        revenue: Math.round(sellerRevenue),
        profit: Math.round(sellerProfit),
      });
    }

    res.json({
      totalSellers: sellers.length,
      totalOrders,
      totalRevenue: Math.round(totalRevenue),
      totalProfit: Math.round(totalProfit),
      sellers: sellerStats,
    });
  } catch (err) {
    console.error("Seller analytics error:", err);
    res.status(500).json({
      msg: "Seller analytics failed",
      error: err.message,
    });
  }
};

// ==============================
// ✅ EXPORT ALL CONTROLLERS
// ==============================
module.exports = {
  getAdminDashboardStats,
  getAdminProfile,
  getSellerAnalytics, // ✅ VERY IMPORTANT
};
