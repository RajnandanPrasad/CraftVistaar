import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getPublicProducts } from "../api/products";
import axios from "axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { categoryName } = useParams();
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams(location.search);
        const searchQuery = params.get("query");

        if (searchQuery) {
          const { data } = await axios.get(
  `${import.meta.env.VITE_API_BASE}/api/products/search?q=${encodeURIComponent(searchQuery)}`
);
          setProducts(data.products || []);
        } else {
          const allProducts = await getPublicProducts();
          let filtered = allProducts;
          if (categoryName) {
            filtered = allProducts.filter(
              (p) =>
                p.category?.toLowerCase() ===
                decodeURIComponent(categoryName).toLowerCase()
            );
          }
          setProducts(filtered);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName, location.search]);

  if (loading)
    return <p className="text-center py-10 text-lg">Loading products...</p>;

  const params = new URLSearchParams(location.search);
  const searchQuery = params.get("query");

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          🛍️{" "}
          {searchQuery
            ? `Search Results for "${searchQuery}"`
            : categoryName
            ? `${decodeURIComponent(categoryName)} Products`
            : "Available Products"}
        </h2>
        <p className="text-gray-600">
          {searchQuery
            ? "Showing all products matching your search"
            : "Discover beautiful handmade crafts"}
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-600 text-lg">
            {searchQuery
              ? "No products found matching your search."
              : "No products available at the moment."}
          </p>
        </div>
      )}
    </div>
  );
}
