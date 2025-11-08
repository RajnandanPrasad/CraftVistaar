import React from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import productsData from "../data/products";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const product = productsData.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
        <Link
          to="/products"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
            onError={(e) => {
              e.target.src = "/assets/logo.webp"; // Fallback image
            }}
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.title}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <div className="flex items-center mb-4">
            <span className="text-2xl font-bold text-green-600 mr-4">₹{product.price}</span>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
              {product.category}
            </span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              Add to Cart
            </button>
            <Link
              to="/products"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
