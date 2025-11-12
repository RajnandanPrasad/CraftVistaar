// server/routes/productRoutes.js
const express = require("express");
const Product = require("../models/Product");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Allowed categories (for validation)
const allowedCategories = [
  "Clothing",
  "Electronics",
  "Grocery",
  "Fitness",
  "Toys",
  "Home Decor",
  "Footwear",
  "Beauty",
  "Kitchen",
  "Accessories",
];

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
    const products = await Product.find({ approved: true }).populate(
      "sellerId",
      "name email"
    );
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
    let products;
    if (req.user.role === "customer") {
      products = await Product.find({ approved: true }).populate(
        "sellerId",
        "name email"
      );
    } else {
      products = await Product.find().populate("sellerId", "name email");
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
    const { title, description, price, images = [], category } = req.body;

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ msg: "Invalid category selected." });
    }

    const product = new Product({
      title,
      description,
      price,
      images,
      category,
      sellerId: req.user._id,
      approved: false,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("Error creating product:", err);
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

    if (!allowedCategories.includes(req.body.category)) {
      return res.status(400).json({ msg: "Invalid category selected." });
    }

    const { title, description, price, images, category } = req.body;
    product.title = title;
    product.description = description;
    product.price = price;
    product.images = images;
    product.category = category;

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
