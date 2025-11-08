const express = require('express');
const Product = require('../models/Product');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Middleware to check if user is seller and verified
const sellerOnly = (req, res, next) => {
    if (req.user.role !== 'seller') {
        return res.status(403).json({ msg: 'Access denied. Sellers only.' });
    }
    if (!req.user.isVerified) {
        return res.status(403).json({ msg: 'Seller not verified. Please wait for admin approval.' });
    }
    next();
};

// Middleware to check if user is seller or admin
const sellerOrAdmin = (req, res, next) => {
    if (req.user.role !== 'seller' && req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied.' });
    }
    if (req.user.role === 'seller' && !req.user.isVerified) {
        return res.status(403).json({ msg: 'Seller not verified.' });
    }
    next();
};

// Get all products (approved for customers, all for seller/admin)
router.get('/', authMiddleware, async (req, res) => {
    try {
        let products;
        if (req.user.role === 'customer') {
            products = await Product.find({ approved: true }).populate('sellerId', 'name');
        } else {
            products = await Product.find().populate('sellerId', 'name');
        }
        res.json(products);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Get single product
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('sellerId', 'name');
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Create product (seller only, verified)
router.post('/', authMiddleware, sellerOnly, async (req, res) => {
    try {
        const { title, description, price, images, category } = req.body;
        const product = new Product({
            title,
            description,
            price,
            images,
            category,
            sellerId: req.user._id,
            approved: false
        });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Update product (seller only, own product, verified)
router.put('/:id', authMiddleware, sellerOnly, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        if (product.sellerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ msg: 'Access denied. Not your product.' });
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
        res.status(500).json({ msg: 'Server error' });
    }
});

// Delete product (seller only, own product or admin)
router.delete('/:id', authMiddleware, sellerOrAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        if (req.user.role === 'seller' && product.sellerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ msg: 'Access denied. Not your product.' });
        }
        await product.remove();
        res.json({ msg: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Get distinct categories from approved products
router.get('/categories', async (req, res) => {
    try {
        const categories = await Product.distinct('category', { approved: true });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Approve product (admin only)
router.put('/:id/approve', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied. Admin only.' });
        }
        const product = await Product.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
