import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../api/products";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { categoryName } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await getProducts();
        if (categoryName) {
          const filtered = allProducts.filter(product => product.category === decodeURIComponent(categoryName));
          setProducts(filtered);
        } else {
          setProducts(allProducts);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryName]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          🛍️ {categoryName ? `${decodeURIComponent(categoryName)} Products` : "Available Products"}
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
