const express = require('express');
const { submitReview, getProductReviews } = require('../controllers/reviewController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Submit a review (customers only)
router.post('/', authMiddleware, submitReview);

// Get all reviews for a product (public)
router.get('/product/:productId', getProductReviews);

module.exports = router;
