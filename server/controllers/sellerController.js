const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const getSellerDashboardStats = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const totalProducts = await Product.countDocuments({ sellerId });

    // Get product IDs for the seller
    const productIds = await Product.find({ sellerId }).select('_id').lean();
    const productIdArray = productIds.map(p => p._id);

    // Aggregate orders to get count and total sales efficiently
    const orderStats = await Order.aggregate([
      { $match: { "items.product": { $in: productIdArray } } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSales: { $sum: "$totalAmount" }
        }
      }
    ]);

    const totalOrders = orderStats.length > 0 ? orderStats[0].totalOrders : 0;
    const totalSales = orderStats.length > 0 ? orderStats[0].totalSales : 0;

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
    const productIds = await Product.find({ sellerId }).select('_id').lean();
    const productIdArray = productIds.map(p => p._id);

    // Use aggregation to limit data and avoid loading all orders at once
    const orders = await Order.aggregate([
      { $match: { "items.product": { $in: productIdArray } } },
      {
        $lookup: {
          from: 'users',
          localField: 'customer',
          foreignField: '_id',
          as: 'customer'
        }
      },
      { $unwind: '$customer' },
      {
        $project: {
          'customer.passwordHash': 0,
          'customer._id': 0,
          'customer.createdAt': 0,
          'customer.updatedAt': 0
        }
      },
      { $sort: { createdAt: -1 } },
      { $limit: 100 } // Limit to prevent excessive data
    ]);

    res.json(orders);
  } catch (err) {
    console.error('Error fetching seller orders:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { getSellerDashboardStats, getSellerProfile, getSellerProducts, getSellerOrders };
