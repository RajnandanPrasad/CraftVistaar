const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },

    // ROLE
    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      default: "customer",
    },

    isVerified: { type: Boolean, default: false },

    // IMAGE
    avatarUrl: { type: String },

    // ⭐ Seller verification fields
    mobile: { type: String },
    workAddress: { type: String },

    accountNumber: { type: String },
    ifsc: { type: String },
    bankName: { type: String },

    // ⭐ Seller documents
    aadhaar: { type: String },
    workImages: [{ type: String }],

    // ⭐⭐ NEW: Saved shipping address for customers (future checkout autofill)
    shippingAddress: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String, default: "India" }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
