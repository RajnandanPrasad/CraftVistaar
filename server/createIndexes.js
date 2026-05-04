const mongoose = require('mongoose');
const connectDB = require('./config/db');

const createIndexes = async () => {
  try {
    await connectDB();
    const Product = require('./models/Product');
    
    await Product.collection.createIndex({ category: 1 });
    await Product.collection.createIndex({ createdAt: -1 });
    await Product.collection.createIndex({ approved: 1 });
    await Product.collection.createIndex({ sellerId: 1 });
    
    console.log('✅ Indexes created: category, createdAt, approved, sellerId');
    process.exit(0);
  } catch (err) {
    console.error('Index creation failed:', err);
    process.exit(1);
  }
};

createIndexes();
