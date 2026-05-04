// server/routes/productRoutes.js
const express = require("express");
const Product = require("../models/Product");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

const { NEW_CATEGORIES, CRAFT_SUPPLIES_FALLBACK } = require('../constants/categories');

// ✅ Flexible category validation (new categories + fallback)
const isValidCategory = (category) => {
  if (!category || typeof category !== 'string') return false;
  const normalized = category.trim();
  return NEW_CATEGORIES.includes(normalized) || normalized === CRAFT_SUPPLIES_FALLBACK;
};


const isBase64Image = (value) =>
  typeof value === "string" && value.trim().startsWith("data:");

const isValidImageEntry = (value) =>
  typeof value === "string" && value.trim().length > 0;

// ✅ NEW: Public search route (used by SearchBar + Products.jsx)
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query || query.trim() === "") {
      return res.json({ products: [] });
    }

    // Find approved products matching title, category, or description
    const products = await Product.find({
      approved: true,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    }).populate("sellerId", "name email");

    res.json({ products });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ message: "Error searching products" });
  }
});

// ✅ Public route: customers see only approved products
router.get("/public", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const sortField = req.query.sort || 'createdAt';
    const products = await Product.find({ approved: true })
      .limit(limit)
      .sort({ [sortField]: -1 })
      .populate("sellerId", "name email");
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching public products:", error);
    return res.status(500).json({ message: "Error fetching public products" });
  }
});

// ✅ Public: Get single approved product by ID
router.get("/public/:id", async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      approved: true,
    }).populate("sellerId", "name email");

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or not approved" });
    }

    res.json(product);
  } catch (err) {
    console.error("Error fetching public product:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Middleware checks
const sellerOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ msg: "Unauthorized" });
  if (req.user.role !== "seller")
    return res.status(403).json({ msg: "Access denied. Sellers only." });
  if (!req.user.isVerified)
    return res.status(403).json({ msg: "Seller not verified." });
  next();
};

const sellerOrAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ msg: "Unauthorized" });
  if (req.user.role !== "seller" && req.user.role !== "admin")
    return res.status(403).json({ msg: "Access denied." });
  if (req.user.role === "seller" && !req.user.isVerified)
    return res.status(403).json({ msg: "Seller not verified." });
  next();
};

// ✅ Get all products (protected)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const sortField = req.query.sort || 'createdAt';
    let products;
    if (req.user.role === "customer") {
      products = await Product.find({ approved: true })
        .limit(limit)
        .sort({ [sortField]: -1 })
        .populate("sellerId", "name email");
    } else {
      products = await Product.find()
        .limit(limit)
        .sort({ [sortField]: -1 })
        .populate("sellerId", "name email");
    }
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Create product (seller only)
router.post("/", authMiddleware, sellerOnly, async (req, res) => {
  try {
    let { title, description, price, images = [], category, stock, model3D = "" } = req.body;

    // Safe Number conversion
    price = Number(price);
    if (isNaN(price) || price < 0) {
      return res.status(400).json({ msg: "Valid price (number >= 0) is required" });
    }
    stock = Number(stock);
    if (isNaN(stock)) {
      return res.status(400).json({ msg: "Valid stock (number) is required" });
    }

    // Handle single image string → array
    if (typeof images === 'string' && images.trim()) {
      images = [images.trim()];
    }

    if (!isValidCategory(category)) {
      return res.status(400).json({ msg: `Invalid category. Must be one of: ${NEW_CATEGORIES.join(', ')} or fallback.` });
    }


    if (stock === undefined || stock < 0) {
      return res.status(400).json({ msg: "Valid stock is required" });
    }

    if (!Array.isArray(images) || images.length === 0 || images.some((img) => !isValidImageEntry(img))) {
      return res.status(400).json({
        msg: "At least one valid product image URL or path is required (no base64).",
      });
    }

    const product = new Product({
      title,
      description,
      price,
      images,
      category,
      stock,
      model3D: typeof model3D === "string" ? model3D.trim() : "",
      sellerId: req.user._id,
      approved: true,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("Error creating product:", err);
    // Mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ msg: messages.join(', ') });
    }
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Update product (seller only)
router.put("/:id", authMiddleware, sellerOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ msg: "Product not found" });
    if (product.sellerId.toString() !== req.user._id.toString())
      return res
        .status(403)
        .json({ msg: "Access denied. Not your product." });

    if (!isValidCategory(req.body.category)) {
      return res.status(400).json({ msg: `Invalid category. Must be one of: ${NEW_CATEGORIES.join(', ')} or fallback.` });
    }


    const { title, description, price, images = [], category, stock, model3D = "" } = req.body;

    if (!Array.isArray(images) || images.some((img) => !isValidImageEntry(img))) {
      return res.status(400).json({
        msg: "Product images must be URLs or file paths, not base64 data.",
      });
    }

    product.title = title;
    product.description = description;
    product.price = price;
    product.images = images;
    product.category = category;
    product.stock = stock;
    product.model3D = typeof model3D === "string" ? model3D.trim() : product.model3D;

    await product.save();
    res.json(product);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Delete product (seller or admin)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ msg: "Product not found" });

    if (req.user.role === "seller") {
      if (product.sellerId.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ msg: "Not authorized to delete this product" });
      }
      await Product.findByIdAndDelete(req.params.id);
      return res.json({ message: "Product deleted" });
    }

    if (req.user.role === "admin") {
      await Product.findByIdAndDelete(req.params.id);
      return res.json({ message: "Product deleted" });
    }

    return res.status(403).json({ msg: "Access denied" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ SINGLE UPLOAD ROUTE as per requirements
const productUpload = require('../middleware/productUpload');

router.post('/upload', authMiddleware, sellerOnly, (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ msg: 'File too large. Max 10MB.' });
    }
    return res.status(400).json({ msg: err.message });
  } else if (err) {
    return res.status(400).json({ msg: err.message });
  }
  next();
}, productUpload, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    let filePath;
    const ext = path.extname(req.file.originalname).toLowerCase();
    
    if (ext === '.glb' || ext === '.gltf') {
      filePath = `/models/${req.file.filename}`;
    } else {
      filePath = `/uploads/${req.file.filename}`;
    }

    res.json({ 
      success: true, 
      path: filePath,
      url: `${req.protocol}://${req.get('host')}${filePath}`
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ msg: 'Upload failed' });
  }
});

// ✅ Distinct categories
router.get("/categories/distinct", async (req, res) => {
  try {
    const categories = await Product.distinct("category", { approved: true });
    res.json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
