import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HANDMADE_CATEGORIES } from "../utils/handmadeFilter";

const categoryImages = {
  Pottery: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
  Jewelry: "https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?auto=format&fit=crop&w=800&q=80",
  Textiles: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80",
  "Home Decor": "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=800&q=80",
  "Wood Crafts": "https://images.unsplash.com/photo-1519739830221-0d7c8f7c4eeb?auto=format&fit=crop&w=800&q=80",
  "Handmade Gifts": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
  "Art & Paintings": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
  "Handwoven Items": "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80",
};

const CategorySection = () => {
  const { t } = useTranslation();
  const categories = HANDMADE_CATEGORIES.map((name) => ({
    name,
    img: categoryImages[name],
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
