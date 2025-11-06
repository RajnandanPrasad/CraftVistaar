import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getCurrentUser } from "../api/auth";
import toast from "react-hot-toast";

export default function BuyPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = () => {
      const storedProducts = JSON.parse(localStorage.getItem("craftkart_products") || "[]");
      const foundProduct = storedProducts.find((p) => p.id === parseInt(id));
      setProduct(foundProduct);
      setLoading(false);
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <div className="text-gray-600">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600">Product not found!</h2>
        <Link to="/products" className="text-blue-600 underline mt-4 block">
          Go back to Products
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.title} added to cart!`);
  };

  const user = getCurrentUser();
  const seller = user && user.id === product.sellerId ? user : null;

  return (
    <div className="min-h-[80vh] bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-96 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = "/assets/logo.webp";
              }}
            />
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.title}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
                {product.category}
              </span>
            </div>

            {seller && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800">Seller Information</h3>
                <p className="text-blue-600">{seller.name}</p>
                <p className="text-sm text-blue-500">{seller.email}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Add to Cart
              </button>
              <Link
                to="/products"
                className="border border-gray-400 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-100 transition"
              >
                Back to Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
