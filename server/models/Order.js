const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],

    totalAmount: { type: Number, required: true },

    status: {
        type: String,
        enum: ["pending", "accepted", "packed", "shipped", "delivered", "cancelled"],
        default: 'pending'
    },

    shippingAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },

    paymentMethod: { type: String, default: 'razorpay' },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
