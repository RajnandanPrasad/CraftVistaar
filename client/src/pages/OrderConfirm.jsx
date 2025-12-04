import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { createRazorpayOrder } from "../api/payment";
import toast from "react-hot-toast";


export default function OrderConfirm() {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState(null);

  const total = getTotalPrice();

  useEffect(() => {
    const data = sessionStorage.getItem("checkout_address");
    if (!data) {
      toast.error("Please enter address");
      navigate("/checkout");
      return;
    }
    setAddress(JSON.parse(data));
  }, []);

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    try {
      const res = await createRazorpayOrder(total);

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load Razorpay");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: total * 100,
        currency: "INR",
        name: "CraftKart",
        description: "Order Payment",
        order_id: res.orderId,

        handler: function (response) {
          toast.success("Payment Successful!");

          // Save order temporarily to localStorage (same as your Cart.jsx logic)
          const order = {
            id: Date.now().toString(),
            items: cartItems,
            total,
            address,
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

        theme: { color: "#4f46e5" },
      };

      new window.Razorpay(options).open();
    } catch (error) {
      toast.error("Payment Failed");
    }
  };

  if (!address) return null;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Confirm Your Order</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold">Delivery Address</h3>
        <p className="text-gray-700 mt-2">{address.name}</p>
        <p className="text-gray-700">{address.mobile}</p>
        <p className="text-gray-700">
          {address.address}, {address.city}, {address.state} - {address.pincode}
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold">Order Summary</h3>
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between py-1">
            <span>{item.title} × {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="font-bold text-right mt-2 text-xl">Total: ₹{total}</div>
      </div>

      <button
        onClick={handlePayment}
        className="bg-green-600 text-white w-full py-3 rounded font-semibold hover:bg-green-700"
      >
        Pay ₹{total}
      </button>
    </div>
  );
}
