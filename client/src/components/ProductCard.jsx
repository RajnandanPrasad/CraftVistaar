import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.title} added to cart!`);
  };

  // FIX: Build correct image URL
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0].startsWith("http") // If full URL
        ? product.images[0]
        : `${import.meta.env.VITE_BACKEND_URL}/${product.images[0]}` // Local uploads
      : "/assets/logo.webp"; // Fallback

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition-all duration-300">
      <img
        src={imageUrl}
        alt={product.title}
        className="w-full h-48 object-cover rounded-lg mb-4"
        onError={(e) => {
          e.target.src = "/assets/logo.webp";
        }}
      />

      <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.title}</h3>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

      <div className="flex justify-between items-center mb-4">
        <span className="text-xl font-bold text-green-600">₹{product.price}</span>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {product.category}
        </span>
      </div>

      <div className="flex gap-2">
        <Link
          to={`/product/${product._id}`}
          className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition"
        >
          View Details
        </Link>

        <button
          onClick={handleAddToCart}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
