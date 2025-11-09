// server/routes/productRoutes.js
const express = require('express');
const Product = require('../models/Product');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Public route: customers see only approved products
// GET /api/products/public
router.get('/public', async (req, res) => {
  try {
    const products = await Product.find({ approved: true }).populate('sellerId', 'name email');
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching public products:', error);
    return res.status(500).json({ message: 'Error fetching public products' });
  }
});

// Middleware to check if user is seller and verified
const sellerOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ msg: 'Unauthorized' });
  if (req.user.role !== 'seller') return res.status(403).json({ msg: 'Access denied. Sellers only.' });
  if (!req.user.isVerified) return res.status(403).json({ msg: 'Seller not verified.' });
  next();
};

// Middleware to check if user is seller or admin (sellers must be verified)
const sellerOrAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ msg: 'Unauthorized' });
  if (req.user.role !== 'seller' && req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied.' });
  if (req.user.role === 'seller' && !req.user.isVerified) return res.status(403).json({ msg: 'Seller not verified.' });
  next();
};

// Get all products (protected)
// If customer: only approved; else admin/seller gets all
router.get('/', authMiddleware, async (req, res) => {
  try {
    let products;
    if (req.user.role === 'customer') {
      products = await Product.find({ approved: true }).populate('sellerId', 'name email');
    } else {
      products = await Product.find().populate('sellerId', 'name email');
    }
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get single product (protected)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('sellerId', 'name email');
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create product (seller only)
router.post('/', authMiddleware, sellerOnly, async (req, res) => {
  try {
    const { title, description, price, images = [], category } = req.body;
    const product = new Product({
      title,
      description,
      price,
      images,
      category,
      sellerId: req.user._id,
      approved: false // admin approval required
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update product (seller only, own product)
router.put('/:id', authMiddleware, sellerOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    if (product.sellerId.toString() !== req.user._id.toString()) return res.status(403).json({ msg: 'Access denied. Not your product.' });

    const { title, description, price, images, category } = req.body;
    product.title = title;
    product.description = description;
    product.price = price;
    product.images = images;
    product.category = category;

    await product.save();
    res.json(product);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete product (seller or admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });

    // seller can delete only their own product
    if (req.user.role === 'seller') {
      if (product.sellerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ msg: 'Not authorized to delete this product' });
      }
      await Product.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Product deleted' });
    }

    // admin can delete any product (ensure admin check on admin route side if you prefer)
    if (req.user.role === 'admin') {
      await Product.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Product deleted' });
    }

    return res.status(403).json({ msg: 'Access denied' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Distinct categories
router.get('/categories/distinct', async (req, res) => {
  try {
    const categories = await Product.distinct('category', { approved: true });
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
