import React from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const products = [
  { id: 1, name: "Handmade Vase", price: 200, description: "A beautifully crafted vase made with love and care." },
  { id: 2, name: "Wooden Frame", price: 150, description: "Elegant wooden photo frame for your memories." },
  { id: 3, name: "Jute Bag", price: 100, description: "Eco-friendly jute bag for daily use." },
];

export default function BuyPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === parseInt(id));

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

  const handleBuy = () => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-[80vh] flex justify-center items-center bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{product.name}</h2>
        <p className="text-gray-600 mb-3">{product.description}</p>
        <p className="text-lg font-semibold text-green-700 mb-6">Price: ₹{product.price}</p>

        <div className="flex gap-4">
          <button
            onClick={handleBuy}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Buy Now
          </button>
          <Link
            to="/products"
            className="border border-gray-400 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}
