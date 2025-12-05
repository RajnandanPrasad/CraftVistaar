const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Submit a review (only for delivered orders, one per customer per product)
const submitReview = async (req, res) => {
  try {
    const { rating, comment, productId, orderId } = req.body;
    const customerId = req.user._id;

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ msg: 'Rating must be between 1 and 5' });
    }

    // Check if order exists and is delivered
    const order = await Order.findOne({
      _id: orderId,
      customer: customerId,
      status: 'delivered'
    });

    if (!order) {
      return res.status(400).json({ msg: 'Order not found or not delivered' });
    }

    // Check if product is in the order
    const orderItem = order.items.find(item => item.product.toString() === productId);
    if (!orderItem) {
      return res.status(400).json({ msg: 'Product not found in this order' });
    }

    // Get product and seller info
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      customerId,
      productId
    });

    if (existingReview) {
      return res.status(400).json({ msg: 'You have already reviewed this product' });
    }

    // Create review
    const review = new Review({
      rating,
      comment,
      customerId,
      productId,
      sellerId: product.sellerId,
      orderId
    });

    await review.save();

    // Update product ratings
    await updateProductRatings(productId);

    // Update seller ratings
    await updateSellerRatings(product.sellerId);

    res.status(201).json({ msg: 'Review submitted successfully', review });
  } catch (err) {
    console.error('Submit review error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all reviews for a product
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId })
      .populate('customerId', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error('Get product reviews error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Helper function to update product ratings
const updateProductRatings = async (productId) => {
  const reviews = await Review.find({ productId });
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
    : 0;

  await Product.findByIdAndUpdate(productId, {
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    totalReviews
  });
};

// Helper function to update seller ratings
const updateSellerRatings = async (sellerId) => {
  const reviews = await Review.find({ sellerId });
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
    : 0;

  await User.findByIdAndUpdate(sellerId, {
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    totalReviews
  });
};

module.exports = {
  submitReview,
  getProductReviews
};
