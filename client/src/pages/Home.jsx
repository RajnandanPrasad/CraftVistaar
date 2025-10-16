import React from "react";
import { Link } from "react-router-dom";
import Products from "./Products";
import heroImg from "../assets/hero-handmade.jpg"; // replace if you have a banner image

const Home = () => {
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

      {/* 🛍️ Product Section */}
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Available Products</h1>
        <Products />
      </div>
    </div>
  );
};

export default Home;
