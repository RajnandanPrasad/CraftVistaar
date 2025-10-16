import React from "react";
import { Link } from "react-router-dom";

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  alert("Logged out successfully");
  window.location.href = "/login";
};

const products = [
  { id: 1, name: "Handmade Vase", price: 200, description: "A beautifully crafted vase made with love and care." },
  { id: 2, name: "Wooden Frame", price: 150, description: "Elegant wooden photo frame for your memories." },
  { id: 3, name: "Jute Bag", price: 100, description: "Eco-friendly jute bag for daily use." },
];

export default function Products() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          🛍️ Available Products
        </h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white shadow-md rounded-2xl p-5 hover:shadow-lg transition-all duration-300 text-center"
          >
            <h3 className="text-lg font-semibold text-gray-700">{p.name}</h3>
            <p className="text-gray-600 mt-2 mb-3">₹{p.price}</p>
            <p className="text-sm text-gray-500 mb-4">{p.description}</p>
            <Link
              to={`/buy/${p.id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
            >
              Buy
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
