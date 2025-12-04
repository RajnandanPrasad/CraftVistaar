import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import API from "../api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/orders/saved-address");
        if (res.data) setAddress((prev) => ({ ...prev, ...res.data }));
      } catch {}
    })();
  }, []);

  const handleChange = (e) =>
    setAddress({ ...address, [e.target.name]: e.target.value });

  // Load Razorpay script
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

  // ========================================================
  // PAYMENT LOGIC (FINAL FIXED)
  // ========================================================
  const handlePayment = async () => {
    if (!address.fullName || !address.phone || !address.street || !address.city || !address.state || !address.zipCode) {
      toast.error("Please fill all address fields");
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) return toast.error("Razorpay SDK failed to load!");

    try {
      // 1️⃣ Create Razorpay order
      const rp = await API.post("/orders/create-payment", {
        amount: getTotalPrice(),
      });

      const { orderId, amount } = rp.data;
      if (!orderId) {
        toast.error("Failed to create Razorpay order");
        return;
      }

      // 2️⃣ Format cart items
      const formattedItems = cartItems.map((item) => ({
        product: item._id || item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      // 3️⃣ Razorpay popup config
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,  // ✅ FIXED KEY
        amount,
        currency: "INR",
        order_id: orderId,

        handler: async function (response) {
          // 4️⃣ Verify payment
          const verify = await API.post("/orders/verify", {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });

          if (!verify.data || verify.data.msg !== "Payment verified") {
            toast.error("Payment verification failed");
            return;
          }

          // 5️⃣ Save order in DB
          await API.post("/orders", {
            items: formattedItems,
            shippingAddress: address,
            paymentMethod: "razorpay",
          });

          clearCart();
          toast.success("Order placed successfully!");
          navigate("/order/confirm");
        },

        prefill: {
          name: address.fullName,
          contact: address.phone,
        },
      };

      new window.Razorpay(options).open();
    } catch (error) {
      console.log(error);
      toast.error("Payment failed");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-3xl font-bold mb-6">Shipping Address</h2>

      {["fullName", "phone", "street", "city", "state", "zipCode"].map((f) => (
        <input
          key={f}
          type="text"
          name={f}
          placeholder={f}
          value={address[f]}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />
      ))}

      <button
        onClick={handlePayment}
        className="bg-blue-600 text-white w-full py-3 rounded-lg mt-4 text-lg font-semibold"
      >
        Pay ₹{getTotalPrice()}
      </button>
    </div>
  );
}
