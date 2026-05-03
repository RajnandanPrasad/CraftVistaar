import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import logo from "../assets/logo.webp";
import { getProductImageUrl } from "../utils/imageHelpers";

export default function ProductCard({ product, badge, variant, featured }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const isFeatured = variant === "featured" || featured;

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast.error("This product is out of stock");
      return;
    }

    addToCart(product);
  };

  const imageUrl =
    product.images && product.images.length > 0
      ? getProductImageUrl(product.images[0])
      : logo;

  const discountPercent = product.discount
    ? product.discount
    : product.originalPrice
    ? Math.max(10, Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100))
    : null;

  const rating =
    product.rating && typeof product.rating === "object"
      ? product.rating.rate || null
      : typeof product.rating === "number"
      ? product.rating
      : null;

  const desc = product.description?.trim();
  const shortDesc = desc
    ? desc.length > 80
      ? `${desc.slice(0, 80)}...`
      : desc
    : "Premium handmade product";

  const imageAspectClass = isFeatured ? "aspect-[4/4]" : "aspect-[4/3]";

  return (
    <article className="group bg-white rounded-xl shadow-sm overflow-hidden transition hover:shadow-lg">
      <div className={`relative w-full overflow-hidden ${imageAspectClass}`}>
        <img
          src={imageUrl}
          alt={product.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = logo;
          }}
        />

        <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-3">
          {badge && (
            <span className="rounded-full bg-amber-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm">
              {badge}
            </span>
          )}
          {discountPercent ? (
            <span className="rounded-full bg-slate-950 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm">
              {discountPercent}% off
            </span>
          ) : null}
        </div>
      </div>

      <div className="p-3 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {product.category && (
            <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
              {product.category}
            </span>
          )}
          {product.stock === 0 && (
            <span className="rounded-full bg-rose-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-700">
              Sold out
            </span>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-900">
            {product.title}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {product.description || shortDesc}
          </p>
        </div>

        <div className="px-3 pb-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-green-600 font-bold">₹{product.price}</span>
            {product.stock > 0 ? (
              <button
                onClick={handleAddToCart}
                className="rounded-lg bg-black px-3 py-1 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Add
              </button>
            ) : (
              <span className="text-gray-400 text-sm">Out of stock</span>
            )}
          </div>

          <button
            onClick={() => navigate(`/product/${product._id || product.id}`)}
            className="w-full text-sm text-blue-600 hover:underline"
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}
