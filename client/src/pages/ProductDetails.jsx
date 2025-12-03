import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getPublicProductById } from "../api/products";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export default function ProductDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getPublicProductById(id);
        if (data) {
          setProduct(data);
        } else {
          setError(t("productNotFound"));
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(t("failedToLoadProduct"));
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast.success(t("addedToCart"));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t("loading")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">{error}</h2>
          <button
            onClick={() => navigate("/products")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate("/products")}
          className="mb-6 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          {t("backToProducts")}
        </button>
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-96 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = "/assets/logo.webp";
                }}
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.title}</h1>
              <p className="text-gray-600 mb-6">{product.description}</p>
              <div className="mb-6">
                <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                >
                  {t("addToCart")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
