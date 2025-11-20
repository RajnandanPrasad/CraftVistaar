require('dotenv').config();
const express = require('express');
const cors = require("cors");  
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');



const app = express();
connectDB();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use("/api/auth", require('./routes/authRoutes'));
app.use("/api/admin", require('./routes/adminRoutes'));
app.use("/api/products", require('./routes/productRoutes'));
app.use("/api/orders", require('./routes/orderRoutes'));
<<<<<<< HEAD
app.use("/api/payment", paymentRoutes);
=======
app.use("/api/seller", require('./routes/sellerRoutes'));


>>>>>>> 7f5374da1b26129dddfb538115da3abcedae41f4

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
