import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProductCard from "../components/ProductCard";
import { fetchProducts, searchProducts } from "../api/products";

export default function Products() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { categoryName } = useParams();
  const location = useLocation();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams(location.search);
        const searchQuery = params.get("query");

        let data;
        if (searchQuery) {
          data = await searchProducts(searchQuery);
        } else {
          data = await fetchProducts();
        }

        let filtered = data;
        if (categoryName) {
          filtered = data.filter(
            (p) =>
              p.category?.toLowerCase() ===
              decodeURIComponent(categoryName).toLowerCase()
          );
        }
        setProducts(filtered);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categoryName, location.search]);

  if (loading)
    return <p className="text-center py-10 text-lg">{t("loadingProducts")}</p>;

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
              ? t("noProductsFound")
              : t("noProductsAvailable")}
          </p>
        </div>
      )}
    </div>
  );
}
