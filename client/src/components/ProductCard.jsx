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

  const hasAR = typeof product.model3D === "string" && product.model3D.trim().length > 0;
  const imageAspectClass = isFeatured ? "aspect-[4/4]" : "aspect-[4/3]";

  return (
    <article className="group/card bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
      <div className={`relative w-full overflow-hidden ${imageAspectClass}`}>
        <img
          src={imageUrl}
          alt={product?.title || 'Product'}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-all duration-700 group-hover/card:scale-110 group-hover/card:brightness-105"
          onError={(e) => {
            e.target.src = logo;
            e.target.classList.add('animate-pulse');
          }}
        />

        <div className="absolute inset-x-4 top-4 flex flex-wrap items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {badge && (
              <span className="rounded-full bg-amber-500/90 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-lg border border-amber-300/50">
                {badge}
              </span>
            )}
            {hasAR && (
              <span className="rounded-full bg-teal-500/90 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-lg border border-teal-300/50 animate-pulse">
                AR View
              </span>
            )}
          </div>
          {discountPercent && (
            <span className="rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-lg">
              {discountPercent}% OFF
            </span>
          )}
        </div>
      </div>

      <div className="p-5 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {product?.category && (
            <span className="rounded-full bg-gradient-to-r from-indigo-100 to-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-800 border border-indigo-200 shadow-sm">
              {product.category}
            </span>
          )}
          {product?.stock === 0 ? (
            <span className="rounded-full bg-rose-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-rose-700 border border-rose-200 shadow-sm">
              Sold Out
            </span>
          ) : product.stock < 5 ? (
            <span className="rounded-full bg-amber-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800 border border-amber-200 shadow-sm animate-pulse">
              Only {product.stock} left!
            </span>
          ) : null}
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight group-hover/card:text-blue-900 transition-colors">
            {product?.title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
            {product?.description?.trim() || shortDesc}
          </p>
        </div>

        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-2xl font-black text-green-600 drop-shadow-sm">
                ₹{product?.price?.toLocaleString()}
              </span>
              {discountPercent && (
                <span className="text-xs text-gray-500 line-through">
                  ₹{product.originalPrice?.toLocaleString()}
                </span>
              )}
            </div>
            {product?.stock > 0 ? (
              <button
                onClick={handleAddToCart}
                className="group/add bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 border border-emerald-400/30"
              >
                <span>Add to Cart</span>
              </button>
            ) : (
              <span className="px-6 py-2.5 bg-gray-100 text-gray-500 rounded-xl font-semibold text-sm shadow-sm">
                Out of Stock
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              const productId = product?._id || product?.id;
              if (productId) navigate(`/product/${productId}`);
            }}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-100 transition-all duration-200 border border-blue-400/30"
          >
            {hasAR ? '👁️ View in AR' : 'View Details'}
          </button>

          {hasAR && (
            <p className="text-xs text-teal-600 font-medium bg-teal-50/50 px-3 py-1.5 rounded-full border border-teal-200 text-center backdrop-blur-sm">
              ✨ Tap for AR preview in your space
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
