import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HANDMADE_CATEGORIES, HANDMADE_CATEGORY_DISPLAY } from "../utils/handmadeFilter";
import { NEW_CATEGORIES } from "../../constants/categories";

const categoryImages = {
  "Jewelry & Accessories": "https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?auto=format&fit=crop&w=800&q=80",
  "Clothing & Textiles": "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80",
  "Home & Decor": "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=800&q=80",
  "Art & Collectibles": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
  "Handmade Gifts": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
  "Kitchen & Dining": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3133?auto=format&fit=crop&w=800&q=80",
  "Bags & Footwear": "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=800&q=80",
  "Beauty & Personal Care": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
  "Toys & Baby": "https://images.unsplash.com/photo-1589890782431-253a653aedd8?auto=format&fit=crop&w=800&q=80",
  "Craft Supplies": "https://images.unsplash.com/photo-1544966127-b5e1f65ba53b?auto=format&fit=crop&w=800&q=80",
  "Spiritual & Festive": "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=800&q=80",
  "Custom & Personalized": "https://images.unsplash.com/photo-1578833147352-666f86169952?auto=format&fit=crop&w=800&q=80",
  "Food & Beverages": "https://images.unsplash.com/photo-1528716321680-8150c6a27886?auto=format&fit=crop&w=800&q=80",
  "For You": "https://images.unsplash.com/photo-1469362102473-8622cfb973cd?auto=format&fit=crop&w=800&q=80"
};

const getCategoryImage = (category) => categoryImages[category] || "https://images.unsplash.com/photo-1469362102473-8622cfb973cd?auto=format&fit=crop&w=800&q=80";

const CategorySection = () => {
  const { t } = useTranslation();
  const categories = HANDMADE_CATEGORY_DISPLAY.map((name) => ({
    name,
    img: getCategoryImage(name),
  }));


  return (
    <section className="py-10 bg-gradient-to-b from-blue-50 to-white px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          🧶 {t("shopByCategory")}
        </h2>
        <p className="text-gray-600 mb-6 text-lg">
          {t("exploreVarietyCrafts")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              to={`/category/${encodeURIComponent(cat.name)}`}
              key={cat.name}
              className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition-transform hover:scale-105"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="h-48 w-full object-cover"
              />
              <h3 className="py-4 text-lg font-semibold text-blue-700">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
