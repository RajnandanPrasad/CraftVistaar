const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();


// ---------- REGISTER ----------
router.post(
    "/register",
    [
        body("name").notEmpty().withMessage("Name is required"),
        body("email").isEmail().withMessage("Valid email is required"),
        body("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters"),
        body("role")
            .isIn(["customer", "seller", "admin"])
            .withMessage("Invalid role")
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ msg: errors.array()[0].msg });
            }

            const {
                name,
                email,
                password,
                role,

                // seller fields
                mobile,
                workAddress,
                accountNumber,
                ifsc,
                bankName,
            } = req.body;

            // Check existing
            const existing = await User.findOne({ email });
            if (existing)
                return res.status(400).json({ msg: "User already exists" });

            // Hash password
            const passwordHash = await bcrypt.hash(password, 10);

            // New user object
            const newUser = new User({
                name,
                email,
                passwordHash,
                role,
                isVerified: role === "seller" ? false : true,

                // seller fields
                mobile,
                workAddress,
                accountNumber,
                ifsc,
                bankName,

                // Seller documents (empty at signup, uploaded later)
                documents: [],
            });

            await newUser.save();

            // Create JWT
            const token = jwt.sign(
                { id: newUser._id, role: newUser.role },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            res.status(201).json({
                msg: "User registered successfully",
                token,
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    isVerified: newUser.isVerified,
                    avatarUrl: newUser.avatarUrl,

                    // seller fields returned
                    mobile,
                    workAddress,
                    accountNumber,
                    ifsc,
                    bankName,
                    documents: newUser.documents,
                }
            });
        } catch (err) {
            console.error("Registration error:", err.message);
            res.status(500).json({ msg: "Server error" });
        }
    }
);


// ---------- LOGIN ----------
router.post("/login", [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: errors.array()[0].msg });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            msg: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                avatarUrl: user.avatarUrl,
                mobile: user.mobile,
                workAddress: user.workAddress,
                accountNumber: user.accountNumber,
                ifsc: user.ifsc,
                bankName: user.bankName,
                documents: user.documents,
            }
        });

    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
});


// ---------- GET CURRENT USER ----------
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-passwordHash');
        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

// ---------- UPDATE AVATAR ----------
router.put("/avatar", authMiddleware, async (req, res) => {
    try {
        const { avatarUrl } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { avatarUrl },
            { new: true }
        ).select('-passwordHash');

        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;
