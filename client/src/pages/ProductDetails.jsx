import React, { useState, useEffect } from "react";
import { getProductImageUrl } from "../utils/imageHelpers";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getPublicProductById } from "../api/products";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import logo from "../assets/logo.webp";
import ARViewer from "../components/ARViewer";

export default function ProductDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const API_BASE = import.meta.env.VITE_API_BASE;

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
const [rating, setRating] = useState(0);
const [comment, setComment] = useState("");
const [canReview, setCanReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAR, setShowAR] = useState(false);

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
  useEffect(() => {
  const fetchReviews = async () => {
   const API_BASE = import.meta.env.VITE_API_BASE;

const res = await fetch(`${API_BASE}/api/reviews/${id}`);
    const data = await res.json();
    setReviews(data);
  };

  fetchReviews();
}, [id]);
useEffect(() => {
  const checkPurchase = async () => {
    const token = localStorage.getItem("craftkart_token");

    if (!token) return;

  const API_BASE = import.meta.env.VITE_API_BASE;

const res = await fetch(`${API_BASE}/api/orders/my-orders`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

    const orders = await res.json();

    console.log("ORDERS:", orders);

    const hasBought = orders.some(order =>
      order.status?.toLowerCase() === "delivered" &&
      order.items.some(item => {
        const productId =
          typeof item.product === "object"
            ? item.product._id
            : item.product;

        return String(productId) === String(id);
      })
    );

    setCanReview(hasBought);
  };
   checkPurchase(); 

 
}, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    if (product.stock === 0) {
      toast.error("This product is out of stock");
      return;
    }

    addToCart(product);
  };

  const getARModelUrl = (modelPath) => {
    if (!modelPath || typeof modelPath !== "string") return "";

    const normalized = modelPath.trim();
    if (normalized === "") return "";

    if (normalized.startsWith("http")) return normalized;
    if (normalized.startsWith("/models")) return normalized;
    if (normalized.startsWith("models/")) return `/${normalized}`;
    if (normalized.startsWith("/")) return `/models${normalized}`;

    return `/models/${normalized}`;
  };

  const modelUrl = getARModelUrl(product?.model3D);

  // 🔹 LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t("loading")}</div>
      </div>
    );
  }

  // 🔹 ERROR STATE
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

  // 🔹 NO PRODUCT
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t("productNotFound")}
          </h2>

          <button
            onClick={() => navigate("/products")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            {t("backToProducts")}
          </button>
        </div>
      </div>
    );
  }

  // 🔹 SKELETON LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-slate-200 rounded-lg mb-12"></div>
            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <div className="h-80 bg-slate-200 rounded-2xl"></div>
                <div className="space-y-4">
                  <div className="h-6 bg-slate-200 rounded-xl w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded-xl w-full"></div>
                  <div className="h-4 bg-slate-200 rounded-xl w-5/6"></div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-slate-200 rounded-xl"></div>
                  <div className="h-32 bg-slate-200 rounded-xl"></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-14 bg-slate-200 rounded-xl"></div>
                    <div className="h-14 bg-slate-200 rounded-xl"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 🔹 MAIN UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 mb-8 px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl hover:bg-white transition-all duration-300 hover:-translate-y-0.5 text-gray-800 font-semibold"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </button>

        <div className="bg-white/70 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/50">
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 xl:gap-12 items-start">

            {/* Images Gallery */}
            <div className="xl:col-span-2 order-2 xl:order-1">
              <div className="sticky top-8 space-y-4">
                <div className="group/image relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-slate-100 aspect-[4/5] shadow-2xl">
                  <img
                    src={getProductImageUrl(product?.images?.[0] || "")}
                    alt={product?.title}
                    className="w-full h-full object-cover group-hover/image:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src = logo;
                      e.target.style.filter = 'brightness(0.8)';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                {product?.images?.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {product.images.slice(1, 5).map((img, idx) => (
                      <img
                        key={idx}
                        src={getProductImageUrl(img)}
                        alt={`Thumbnail ${idx + 2}`}
                        className="w-20 h-20 flex-shrink-0 object-cover rounded-xl border-2 border-white/50 hover:border-blue-400 hover:scale-105 shadow-md cursor-pointer transition-all duration-200 hover:shadow-lg"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="xl:col-span-3 order-1 xl:order-2">
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-slate-900 bg-clip-text text-transparent leading-tight mb-4">
                    {product?.title}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      In Stock: {product?.stock || 0}
                    </span>
                    {product?.category && (
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold">
                        {product.category}
                      </span>
                    )}
                  </div>
                </div>

                <div className="prose prose-slate max-w-none">
                  <p className="text-xl text-gray-700 leading-relaxed">
                    {product?.description}
                  </p>
                </div>

                <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl shadow-inner">
                  <div className="flex items-baseline gap-4 mb-6">
                    <span className="text-5xl font-black text-emerald-600 drop-shadow-2xl">
                      ₹{product?.price?.toLocaleString('en-IN') || '0'}
                    </span>
                  </div>

                  {/* Enhanced Stock Status */}
                  {product?.stock === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-24 h-24 mx-auto mb-4 bg-rose-100 rounded-2xl flex items-center justify-center">
                        <svg className="w-12 h-12 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 0l-6.849 6.849m0 0L6.364 5.637M12.728 12.486l-6.849 6.849" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-rose-600 mb-2">Out of Stock</h3>
                      <p className="text-rose-600">This item is currently unavailable</p>
                    </div>
                  ) : product.stock < 5 ? (
                    <div className="flex items-center gap-3 p-4 bg-amber-100 border-l-4 border-amber-400 rounded-r-2xl animate-pulse">
                      <div className="w-12 h-12 bg-amber-200 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-amber-800">{product.stock}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-amber-900">Low Stock Alert!</h4>
                        <p className="text-amber-800">Only <strong>{product.stock}</strong> items remaining</p>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Action Buttons - Full-width on mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={product?.stock === 0}
                    className={`w-full py-5 px-8 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 transform flex items-center justify-center gap-3 ${
                      product?.stock === 0
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
                        : 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white hover:from-emerald-600 hover:via-emerald-700 hover:to-teal-700 hover:shadow-3xl hover:scale-[1.02] active:scale-[0.98]'
                    }`}
                  >
                    {product?.stock === 0 ? (
                      <>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        Out of Stock
                      </>
                    ) : (
                      <>
                        🛒 Add to Cart
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setShowAR(true)}
                    disabled={!modelUrl}
                    className={`w-full py-5 px-8 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 transform flex items-center justify-center gap-3 md:col-span-2 ${
                      !modelUrl
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none md:col-span-2'
                        : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 hover:shadow-3xl hover:scale-[1.02] active:scale-[0.98]'
                    }`}
                  >
                    {modelUrl ? (
                      <>
                        ✨ View in AR
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 15.5a.75.75 0 01-.75-.75v-7.5a.75.75 0 011.5 0v7.5a.75.75 0 01-.75.75zm4.5 0a.75.75 0 01-.75-.75v-7.5a.75.75 0 011.5 0v7.5a.75.75 0 01-.75.75z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 10.5c0-.75.378-1.437 1.014-1.849A2.98 2.98 0 017.5 9a2.98 2.98 0 012.986 2.651.75.75 0 11-1.499.124A1.489 1.49 0 007.5 10a1.49 1.49 0 00-1.498.974.75.75 0 11-1.499-.124A2.98 2.98 0 014.5 10.5z" />
                        </svg>
                      </>
                    ) : (
                      <>
                        AR Not Available
                      </>
                    )}
                  </button>
                </div>

                {!modelUrl && (
                  <div className="text-center py-8 bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">AR Preview Not Available</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      This product doesn't have a 3D model yet. Check back later for immersive AR viewing!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced AR Modal */}
        {showAR && modelUrl && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[9999] p-4 animate-in fade-in zoom-in duration-300">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-6xl max-h-[90vh] w-full overflow-hidden border border-white/50 animate-in slide-in-from-bottom-4 duration-300">
              <div className="p-8 pb-4 flex items-center justify-between border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 15.5a.75.75 0 01-.75-.75v-7.5a.75.75 0 011.5 0v7.5a.75.75 0 01-.75.75zm4.5 0a.75.75 0 01-.75-.75v-7.5a.75.75 0 011.5 0v7.5a.75.75 0 01-.75.75z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">View in Your Space ✨</h2>
                    <p className="text-gray-600">Place this {product?.title} in AR</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAR(false)}
                  className="p-2 hover:bg-gray-100 rounded-2xl transition-colors duration-200 group"
                >
                  <svg className="w-6 h-6 text-gray-600 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-1 max-h-[70vh] overflow-auto">
                <ARViewer modelUrl={modelUrl} />
              </div>
            </div>
          </div>
        )}

{/* ⭐ REVIEWS SECTION */}
<div className="mt-12 bg-white p-6 rounded-2xl shadow-lg">
  <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
{!localStorage.getItem("craftkart_token") && (
  <p className="text-gray-500 mb-4">
    Please login to write a review
  </p>
)}

{localStorage.getItem("craftkart_token") && !canReview && (
  <p className="text-gray-500 mb-4">
    You can review this product after it is delivered
  </p>
)}

  {/* Write Review */}
 {canReview && localStorage.getItem("craftkart_token") && (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Write a Review</h3>

      <select
        onChange={(e) => setRating(Number(e.target.value))}
        className="border p-2 rounded mb-2"
      >
        <option value="">Select Rating</option>
        <option value="1">1 ⭐</option>
        <option value="2">2 ⭐</option>
        <option value="3">3 ⭐</option>
        <option value="4">4 ⭐</option>
        <option value="5">5 ⭐</option>
      </select>

      <textarea
        placeholder="Write your review..."
        className="w-full border p-2 rounded mb-2"
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        onClick={async () => {
          if (!rating || !comment) {
  alert("Please add rating and comment");
  return;
}
          const token = localStorage.getItem("craftkart_token");

          const API_BASE = import.meta.env.VITE_API_BASE;

const res = await fetch(`${API_BASE}/api/reviews`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              productId: id,
              rating,
              comment
            })
          });

          const data = await res.json();

          if (res.ok) {
            alert("Review added!");
            setComment("");
setRating(0);

// refresh reviews without reload
const res2 = await fetch(`${API_BASE}/api/reviews/${id}`)
const updated = await res2.json();
setReviews(updated);

// hide form after submit
setCanReview(false);
          } else {
            alert(data.msg);
          }
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit Review
      </button>
    </div>
  )}

  {/* Reviews List */}
  {reviews.length === 0 ? (
    <p>No reviews yet</p>
  ) : (
    reviews.map((r) => (
      <div key={r._id} className="border-b py-3">
        <p className="font-semibold">{r.customerId.name}</p>
       <p className="text-yellow-500 font-semibold">
  {"⭐".repeat(r.rating)}
</p>
        <p className="text-gray-600">{r.comment}</p>
      </div>
    ))
  )}
</div>
      </div>
    </div>
  );
}