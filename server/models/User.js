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

    // ✅ IMAGE FIELD (PERMANENT)
    avatarUrl: { type: String },

    // ⭐ Seller verification fields (YOUR FIELDS)
    mobile: { type: String },
    workAddress: { type: String },

    accountNumber: { type: String },
    ifsc: { type: String },
    bankName: { type: String },

    // ⭐ Seller documents (YOUR FIELDS)
    aadhaar: { type: String }, // file name/path
    workImages: [{ type: String }], // array of file names
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
