import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import heroImg from "../assets/hero-handmade.jpg";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    // Load featured products (first 4) from localStorage
    const storedProducts = JSON.parse(localStorage.getItem("craftkart_products") || "[]");
    setFeaturedProducts(storedProducts.slice(0, 4));
  }, []);

  return (
    <div className="p-0">
      {/* 🖼️ Hero Section */}
      <section className="w-full min-h-[85vh] flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-pink-50 to-blue-50 px-6 md:px-12 lg:px-20 py-10">
        {/* Left Content */}
        <div className="flex flex-col gap-6 max-w-lg text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            Discover Beautiful <span className="text-blue-500">Handmade Crafts</span> for Your Home
          </h1>

          <p className="text-gray-600 text-lg">
            Explore a unique collection of handmade items crafted with love and creativity.
            Perfect for gifts, décor, and personal use.
          </p>

          <Link
            to="/products"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition duration-200 mx-auto md:mx-0"
          >
            Shop Now
          </Link>
        </div>

        {/* Right Image */}
        <div className="mt-10 md:mt-0">
          <img
            src={heroImg}
            alt="Handmade Crafts Banner"
            className="w-full max-w-md rounded-2xl shadow-lg object-cover"
          />
        </div>
      </section>

      {/* 🛍️ Featured Products Section */}
      <div className="p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Products</h2>
            <p className="text-gray-600">Handpicked selection of our best crafts</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/products"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              View All Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
