const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');
const { CATEGORY_MAPPING, NEW_CATEGORIES, CRAFT_SUPPLIES_FALLBACK } = require('../../shared/constants/categories');

connectDB();

const migrateCategories = async (dryRun = true) => {
  try {
    console.log('🚀 Starting category migration...');
    console.log(dryRun ? '👀 DRY-RUN MODE (no changes)' : '💾 LIVE MODE (updating DB)');

    // Count total products
    const totalProducts = await Product.countDocuments();
    console.log(`📊 Total products: ${totalProducts}`);

    // Find products needing migration
    const oldCategories = Object.keys(CATEGORY_MAPPING);
    const productsToUpdate = await Product.find({
      category: { $in: oldCategories }
    });

    console.log(`🔄 Products to migrate: ${productsToUpdate.length}`);

    if (productsToUpdate.length === 0) {
      console.log('✅ No products need migration!');
      return;
    }

    let updates = 0;
    const stats = {};

    for (let product of productsToUpdate) {
      const oldCat = product.category;
      const newCat = CATEGORY_MAPPING[oldCat] || CRAFT_SUPPLIES_FALLBACK;
      
      stats[oldCat] = (stats[oldCat] || 0) + 1;

      if (dryRun) {
        console.log(`📝 WOULD UPDATE: ${product._id} | ${oldCat} → ${newCat}`);
      } else {
        product.category = newCat;
        await product.save();
        updates++;
        console.log(`✅ UPDATED: ${product._id.slice(-6)} | ${oldCat} → ${newCat}`);
      }
    }

    // Final stats
    console.log('\n📈 MIGRATION STATS:');
    for (let [old, count] of Object.entries(stats)) {
      console.log(`  ${old} → ${CATEGORY_MAPPING[old] || CRAFT_SUPPLIES_FALLBACK}: ${count}`);
    }

    console.log(`\n🎉 Migration complete! Updated ${dryRun ? '0 (dry-run)' : updates} products.`);
    
    // Verify all categories are now valid
    const invalidCats = await Product.distinct('category', {
      category: { $nin: NEW_CATEGORIES }
    });
    if (invalidCats.length > 0) {
      console.log('⚠️  Remaining invalid categories:', invalidCats);
    } else {
      console.log('✅ All categories are now standardized!');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
};

// Usage: node migrateCategories.js [live]
const dryRun = process.argv[2] !== 'live';
migrateCategories(dryRun);
