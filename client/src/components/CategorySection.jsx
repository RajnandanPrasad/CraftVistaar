import React from "react";
import { Link } from "react-router-dom";

const CategorySection = () => {
  const categories = [
    { name: "Pottery", img: "https://i.imgur.com/I2y6iWq.jpg" },
    { name: "Jewelry", img: "https://i.imgur.com/mVcwZz5.jpg" },
    { name: "Textiles", img: "https://i.imgur.com/bX4EHEv.jpg" },
    { name: "Home Decor", img: "https://i.imgur.com/xU4h5sR.jpg" },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          🧶 Shop by Category
        </h2>
        <p className="text-gray-600 mb-10 text-lg">
          Explore a variety of traditional and modern handmade crafts.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <Link
              to={`/products?category=${cat.name.toLowerCase()}`}
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
