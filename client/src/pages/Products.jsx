import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import productsData from "../data/products";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Always use the updated static data and update localStorage
    setProducts(productsData);
    localStorage.setItem("craftkart_products", JSON.stringify(productsData));
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          🛍️ Available Products
        </h2>
        <p className="text-gray-600">Discover beautiful handmade crafts</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-600 text-lg">No products available at the moment.</p>
        </div>
      )}
    </div>
  );
}
