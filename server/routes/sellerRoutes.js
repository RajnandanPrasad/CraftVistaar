const express = require("express");
const router = express.Router();

const { authMiddleware, roleCheck } = require("../middleware/authMiddleware");
const sellerMiddleware = roleCheck(["seller"]);
const uploadDocuments = require("../middleware/uploadDocuments");

const {
  getSellerDashboardStats,
  getSellerProfile,
  getSellerProducts,
  getSellerOrders,
  updateSellerProfile,
  uploadDocuments: uploadDocumentsController,
} = require("../controllers/sellerController");

router.get("/dashboard", authMiddleware, sellerMiddleware, getSellerDashboardStats);
router.get("/profile", authMiddleware, sellerMiddleware, getSellerProfile);
router.get("/products", authMiddleware, sellerMiddleware, getSellerProducts);
router.get("/orders", authMiddleware, sellerMiddleware, getSellerOrders);

// ✅ UPDATE PROFILE ROUTE
router.put("/profile", authMiddleware, sellerMiddleware, updateSellerProfile);

// ✅ UPLOAD DOCUMENTS ROUTE
router.put("/upload-documents", authMiddleware, sellerMiddleware, uploadDocuments, uploadDocumentsController);

module.exports = router;
