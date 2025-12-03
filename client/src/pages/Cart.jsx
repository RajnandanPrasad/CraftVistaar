import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getCurrentUser } from "../api/auth";
import { createRazorpayOrder } from "../api/payment";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function Cart() {
  const { t } = useTranslation();
  const { cartItems, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = getCurrentUser();

  const totalPrice = getTotalPrice();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };


  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error(t("pleaseLoginToPlaceOrder"));
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      toast.error(t("cartIsEmpty"));
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Create Razorpay order on backend
      const res = await createRazorpayOrder(totalPrice);
      const orderId = res.orderId;

      if (!orderId) {
        toast.error(t("failedToCreatePaymentOrder"));
        setLoading(false);
        return;
      }

      // 2️⃣ Load Razorpay checkout script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error(t("failedToLoadRazorpay"));
        setLoading(false);
        return;
      }

      // 3️⃣ Open Razorpay popup
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: totalPrice * 100,
        currency: "INR",
        name: "CraftKart",
        description: "Order Payment",
        order_id: orderId,

        handler: function (response) {
          // On successful payment
          toast.success(t("paymentSuccessful"));

          const order = {
            id: Date.now().toString(),
            userId: user.id,
            items: cartItems,
            total: totalPrice,
            date: new Date().toISOString(),
            status: "paid",
            paymentId: response.razorpay_payment_id,
          };

          const existingOrders = JSON.parse(localStorage.getItem("craftkart_orders") || "[]");
          existingOrders.push(order);
          localStorage.setItem("craftkart_orders", JSON.stringify(existingOrders));

          clearCart();
          navigate("/products");
        },

        theme: {
          color: "#4f46e5",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.log(err);
      toast.error(t("paymentFailed"));
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{t("yourCart")}</h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 text-lg">{t("cartEmpty")}</p>
          <Link to="/products" className="text-blue-600 underline mt-4 block">
            {t("browseProducts")}
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white shadow-md rounded-lg p-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => {
                      e.target.src = "/assets/logo.webp";
                    }}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                    <p className="text-gray-600">₹{item.price} {t("each")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-lg font-bold text-green-600 min-w-[80px] text-right">
                    ₹{item.price * item.quantity}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                  >
                    {t("remove")}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-bold text-gray-800">{t("total")}: ₹{totalPrice}</h3>
            <div className="space-x-4">
              <button
                onClick={clearCart}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                {t("clearCart")}
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className={`bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? t("placingOrder") : t("placeOrder")}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
