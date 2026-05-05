const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },

  price: { 
    type: Number, 
    required: true,
    min: 0
  },

  category: { type: String, required: true },

  images: [{ type: String }],

  model3D: {
    type: String,
    default: ""
  },

  sellerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  approved: { type: Boolean, default: false },

  // ✅ STOCK MANAGEMENT STARTS HERE
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },

  // ✅ Derived field (optional but useful)
  inStock: {
    type: Boolean,
    default: true
  },
  rating: {
  type: Number,
  default: 0
},
numReviews: {
  type: Number,
  default: 0
},

}, { timestamps: true });

/* ✅ Auto update inStock */
productSchema.pre('save', function (next) {
  this.inStock = this.stock > 0;
  next();
});

module.exports = mongoose.model('Product', productSchema);