const express = require("express");
const Review = require("../models/Review");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();


// ===============================
// ⭐ ADD REVIEW (VERIFIED ONLY)
// ===============================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    // ✅ Check if user purchased & delivered
    const order = await Order.findOne({
      customer: req.user._id,
      "items.product": productId,
      status: "delivered"
    });

    if (!order) {
      return res.status(403).json({
        msg: "You can only review products you have purchased"
      });
    }

    // ❌ Prevent duplicate review
    const alreadyReviewed = await Review.findOne({
      customerId: req.user._id,
      productId
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        msg: "You already reviewed this product"
      });
    }

    // ✅ Get sellerId from product
    const product = await Product.findById(productId);

    const review = new Review({
      rating,
      comment,
      customerId: req.user._id,
      productId,
      sellerId: product.sellerId,
      orderId: order._id
    });

    await review.save();

    // ===============================
    // ⭐ UPDATE PRODUCT RATING
    // ===============================
    const reviews = await Review.find({ productId });

    const avg =
      reviews.reduce((acc, item) => acc + item.rating, 0) /
      reviews.length;

    product.rating = avg;
    product.numReviews = reviews.length;

    await product.save();

    res.status(201).json({ msg: "Review added successfully" });

  } catch (err) {
    console.error("Review error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


// ===============================
// ⭐ GET PRODUCT REVIEWS
// ===============================
router.get("/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({
      productId: req.params.productId
    }).populate("customerId", "name");

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;