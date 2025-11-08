const express = require('express');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Middleware to check if user is admin
const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied. Admin only.' });
    }
    next();
};

// Verify seller
router.put('/verify-seller/:sellerId', authMiddleware, adminOnly, async (req, res) => {
    try {
        const { sellerId } = req.params;
        const seller = await User.findById(sellerId);
        if (!seller || seller.role !== 'seller') {
            return res.status(404).json({ msg: 'Seller not found' });
        }
        seller.isVerified = true;
        await seller.save();
        res.json({ msg: 'Seller verified successfully', seller });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Get all sellers
router.get('/sellers', authMiddleware, adminOnly, async (req, res) => {
    try {
        const sellers = await User.find({ role: 'seller' }).select('-passwordHash');
        res.json(sellers);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
