const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },

    role: { 
        type: String,
        enum: ["customer", "seller", "admin"],
        default: "customer"
    },

    isVerified: { type: Boolean, default: false },

    avatarUrl: { type: String },

    // ⭐ Seller verification fields
    mobile: { type: String },
    workAddress: { type: String },

    accountNumber: { type: String },
    ifsc: { type: String },
    bankName: { type: String },

    // ⭐ Seller documents
    aadhaar: { type: String },           // file name/path
    workImages: [{ type: String }],      // array of file names

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
