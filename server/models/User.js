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

    // ⭐ Seller verification fields
    mobile: { type: String },
    workAddress: { type: String },
    accountNumber: { type: String },
    ifsc: { type: String },
    bankName: { type: String },

    // ⭐ Seller verification status
    sellerVerificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: function() {
        return this.role === "seller" ? "pending" : undefined;
      }
    },

    // ⭐ Seller documents
    documents: [{
      type: { type: String, required: true }, // e.g., "Aadhaar", "Work Image"
      url: { type: String, required: true } // file path
    }],

    // ⭐ Verification audit
    verificationReason: { type: String }, // for rejection
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // admin id
    verifiedByName: { type: String },
    verifiedByEmail: { type: String },
    verifiedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
