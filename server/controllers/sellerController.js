const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

// ✅ SELLER DASHBOARD STATS
const getSellerDashboardStats = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const totalProducts = await Product.countDocuments({ sellerId });

    const productIds = await Product.find({ sellerId }).select("_id").lean();
    const productIdArray = productIds.map((p) => p._id);

    const orderStats = await Order.aggregate([
      { $match: { "items.product": { $in: productIdArray } } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSales: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalOrders =
      orderStats.length > 0 ? orderStats[0].totalOrders : 0;
    const totalSales =
      orderStats.length > 0 ? orderStats[0].totalSales : 0;

    res.json({ totalProducts, totalOrders, totalSales });
  } catch (err) {
    console.error("Error fetching seller stats:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ GET SELLER PROFILE
const getSellerProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    res.json(user);
  } catch (err) {
    console.error("Error fetching seller profile:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ UPDATE SELLER PROFILE
const updateSellerProfile = async (req, res) => {
  try {
    const { name, email, avatarUrl } = req.body;

    const updatedSeller = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, avatarUrl },
      { new: true }
    );

    res.json(updatedSeller);
  } catch (error) {
    console.error("Error updating seller profile:", error);
    res.status(500).json({ msg: "Profile update failed" });
  }
};

// ✅ GET SELLER PRODUCTS
const getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const products = await Product.find({ sellerId }).sort({
      createdAt: -1,
    });
    res.json(products);
  } catch (err) {
    console.error("Error fetching seller products:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ GET SELLER ORDERS
const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const productIds = await Product.find({ sellerId })
      .select("_id")
      .lean();
    const productIdArray = productIds.map((p) => p._id);

    const orders = await Order.aggregate([
      { $match: { "items.product": { $in: productIdArray } } },
      {
        $lookup: {
          from: "users",
          localField: "customer",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },
      {
        $project: {
          "customer.passwordHash": 0,
          "customer._id": 0,
          "customer.createdAt": 0,
          "customer.updatedAt": 0,
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 100 },
    ]);

    res.json(orders);
  } catch (err) {
    console.error("Error fetching seller orders:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ UPLOAD SELLER DOCUMENTS
const uploadDocuments = async (req, res) => {
  try {
    const sellerId = req.user.id;
    console.log('Upload documents request received for seller:', sellerId);
    console.log('req.files:', req.files);

    // Extract Cloudinary URLs from req.files
    const documents = {
      aadhaarUrl: req.files?.aadhaar?.[0]?.path || undefined,
      panUrl: req.files?.pan?.[0]?.path || undefined,
      gstUrl: req.files?.gst?.[0]?.path || undefined,
      shopLicenseUrl: req.files?.shopLicense?.[0]?.path || undefined,
      extraDocs: req.files?.extraDocs?.map(file => file.path) || [],
    };

    console.log('Extracted documents:', documents);

    // Update the seller's documents in the database
    const updatedSeller = await User.findByIdAndUpdate(
      sellerId,
      { documents },
      { new: true }
    ).select('-passwordHash');

    if (!updatedSeller) {
      return res.status(404).json({ msg: 'Seller not found' });
    }

    res.json({
      msg: 'Documents uploaded successfully',
      documents: updatedSeller.documents,
    });
  } catch (error) {
    console.error('Error uploading documents:', error);
    res.status(500).json({ msg: 'Document upload failed' });
  }
};

module.exports = {
  getSellerDashboardStats,
  getSellerProfile,
  updateSellerProfile,
  getSellerProducts,
  getSellerOrders,
  uploadDocuments,
};
