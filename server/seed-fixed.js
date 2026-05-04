const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');

connectDB();

const seed = async () => {
  try {
    await Product.deleteMany({});

    const product = new Product({
      title: 'AR Ready Handmade Pottery Vase',
      description: 'Test product with 3D AR model for preview.',
      price: 599,
      category: 'Home & Decor',
      images: ['https://images.unsplash.com/photo-1558618047-3c8c76bbb17e?ixlib=rb-4.0.3&fit=crop&w=1000&q=80'],
      model3D: '/models/sample-pottery.glb',
      stock: 10,
      sellerId: new mongoose.Types.ObjectId(),
      approved: true
    });

    await product.save();
    console.log('✅ AR Product Seeded!');
    console.log('ID:', product._id);
    console.log(`Test: http://localhost:5000/api/products/public/${product._id}`);
    mongoose.connection.close();
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seed();

