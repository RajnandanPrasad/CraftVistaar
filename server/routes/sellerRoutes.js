const express = require("express");
const router = express.Router();

const { authMiddleware, roleCheck } = require("../middleware/authMiddleware");
const sellerMiddleware = roleCheck(["seller"]);

const { getSellerDashboardStats, getSellerProfile } = require("../controllers/sellerController");

router.get('/dashboard', authMiddleware, sellerMiddleware, getSellerDashboardStats);
router.get('/profile', authMiddleware, sellerMiddleware, getSellerProfile);

module.exports = router;
