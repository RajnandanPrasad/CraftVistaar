const express = require("express");
const router = express.Router();

const { authMiddleware, roleCheck } = require("../middleware/authMiddleware");
const sellerMiddleware = roleCheck(["seller"]);

const { getSellerDashboardStats, getSellerProfile, getSellerProducts, getSellerOrders } = require("../controllers/sellerController");

router.get('/dashboard', authMiddleware, sellerMiddleware, getSellerDashboardStats);
router.get('/profile', authMiddleware, sellerMiddleware, getSellerProfile);
router.get('/products', authMiddleware, sellerMiddleware, getSellerProducts);
router.get('/orders', authMiddleware, sellerMiddleware, getSellerOrders);

module.exports = router;
