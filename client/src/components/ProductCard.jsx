import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";


export default function ProductCard({ product }) {
  const { addToCart } = useCart();

const handleAddToCart = () => {
  if (product.stock === 0) {
    toast.error("This product is out of stock");
    return;
  }

  addToCart(product);
 
};

  // FIX: Build correct image URL
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0].startsWith("http") // If full URL
        ? product.images[0]
        : product.images[0].startsWith("/") // If local asset
        ? product.images[0]
        : `http://localhost:5000/${product.images[0]}` // Backend uploads
      : logo; // Fallback

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition-all duration-300">
      <img
        src={imageUrl}
        alt={product.title}
        className="w-full h-48 object-cover rounded-lg mb-4"
        onError={(e) => {
          e.target.src = logo;
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
        {product.stock === 0 && (
  <p className="text-red-500 font-semibold mb-2">Out of Stock</p>
)}

{product.stock > 0 && product.stock < 5 && (
  <p className="text-orange-500 text-sm mb-2">
    Only {product.stock} left!
  </p>
)}

        <button
  onClick={handleAddToCart}
  disabled={product.stock === 0}
  className={`px-4 py-2 rounded-lg transition ${
    product.stock === 0
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-green-600 text-white hover:bg-green-700"
  }`}
>
  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
</button>
      </div>
    </div>
  );
}
