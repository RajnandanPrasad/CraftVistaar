import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import API from "../api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });
  const [loading, setLoading] = useState(true);

  // UI state
  const [paymentMode, setPaymentMode] = useState("razorpay"); // 'razorpay' or 'cod'
  const [saveAddress, setSaveAddress] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [userRes, addrRes] = await Promise.allSettled([
          API.get("/auth/me"),
          API.get("/orders/saved-address"),
        ]);

        let fetchedUser = null;
        if (userRes.status === "fulfilled" && userRes.value?.data) {
          fetchedUser = userRes.value.data;
          setUser(fetchedUser);
        }

        if (addrRes.status === "fulfilled" && addrRes.value?.data) {
          setAddress((prev) => ({ ...prev, ...addrRes.value.data }));
        }

        setAddress((prev) => ({
          ...prev,
          fullName: prev.fullName || fetchedUser?.name || "",
          phone: prev.phone || fetchedUser?.mobile || prev.phone || "",
        }));
      } catch (err) {
        console.error("prefill error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (e) =>
    setAddress({ ...address, [e.target.name]: e.target.value });

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const validateAddress = () => {
    const nameToUse = address.fullName || user?.name;
    const phoneToUse = address.phone || user?.mobile;
    if (!nameToUse || !phoneToUse || !address.street || !address.city || !address.state || !address.zipCode) {
      toast.error("Please fill all address fields (or ensure profile has name & phone).");
      return false;
    }
    return true;
  };

  // Create order on server (used by both COD and after razorpay verification)
  const createOrderOnServer = async ({ paymentMethod, formattedItems }) => {
    // API call to save order
    await API.post("/orders", {
      items: formattedItems,
      shippingAddress: address,
      paymentMethod,
    });
  };

  // Handler for COD flow
  const handleCOD = async () => {
    if (!validateAddress()) return;
    setProcessing(true);
    try {
      const formattedItems = cartItems.map((item) => ({
        product: item._id || item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      // Save address if user wants
      if (saveAddress) {
        try {
          await API.post("/users/save-address", address);
        } catch (e) {
          // fail silently if endpoint not available
          console.warn("save-address failed", e);
        }
      }

      // create the order with COD
      await createOrderOnServer({ paymentMethod: "cod", formattedItems });

      clearCart();
      toast.success("Order placed (Cash on Delivery).");
      navigate("/order/confirm");
    } catch (err) {
      console.error(err);
      toast.error("Failed to place COD order.");
    } finally {
      setProcessing(false);
    }
  };

  // Handler for Razorpay flow
  const handleRazorpay = async () => {
    if (!validateAddress()) return;
    setProcessing(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Razorpay SDK failed to load!");
        setProcessing(false);
        return;
      }

      // create razorpay order on server
      const rp = await API.post("/orders/create-payment", { amount: getTotalPrice() });
      const { orderId, amount } = rp.data;
      if (!orderId) {
        toast.error("Failed to create Razorpay order");
        setProcessing(false);
        return;
      }

   const formattedItems = cartItems.map((item) => ({
  product: item._id || item.id,
  quantity: item.quantity,
  price: item.price,
  sellerId: item.sellerId,       // ⭐ VERY IMPORTANT
}));

      const nameToUse = address.fullName || user?.name;
      const phoneToUse = address.phone || user?.mobile;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency: "INR",
        order_id: orderId,
        handler: async function (response) {
          try {
            const verify = await API.post("/orders/verify", {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            if (!verify.data || verify.data.msg !== "Payment verified") {
              toast.error("Payment verification failed");
              setProcessing(false);
              return;
            }

            // Save address if user wants
            if (saveAddress) {
              try {
                await API.post("/users/save-address", address);
              } catch (e) {
                console.warn("save-address failed", e);
              }
            }

            // Save order after successful payment
            await createOrderOnServer({ paymentMethod: "razorpay", formattedItems });

            clearCart();
            toast.success("Order placed successfully!");
            navigate("/order/confirm");
          } catch (err) {
            console.error(err);
            toast.error("Failed to finalize payment/order.");
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          name: nameToUse,
          contact: phoneToUse,
        },
        theme: {
          color: "#2563EB",
        },
      };

      new window.Razorpay(options).open();
    } catch (error) {
      console.log(error);
      toast.error("Payment failed");
      setProcessing(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (paymentMode === "cod") {
      await handleCOD();
    } else {
      await handleRazorpay();
    }
  };

  // UI helpers
  const shippingPrice = 0;
  const subtotal = getTotalPrice();
  const total = subtotal + shippingPrice;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded mt-10">
        <h2 className="text-2xl font-semibold mb-4">Shipping Address</h2>
        <p>Loading your profile & saved address…</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10">
      <div className="grid md:grid-cols-3 gap-6">
        {/* LEFT: Shipping card */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Shipping Details</h3>
              <span className="text-sm text-gray-500">Editable — updates only this order</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Full name</label>
                <input
                  name="fullName"
                  value={address.fullName}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded p-2"
                  placeholder="Name for delivery"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <input
                  name="phone"
                  value={address.phone}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded p-2"
                  placeholder="Mobile number"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700">Street / House No.</label>
                <input
                  name="street"
                  value={address.street}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded p-2"
                  placeholder="Street, area, landmarks..."
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">City</label>
                <input
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">State</label>
                <input
                  name="state"
                  value={address.state}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">PIN / ZIP</label>
                <input
                  name="zipCode"
                  value={address.zipCode}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Country</label>
                <input
                  name="country"
                  value={address.country}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded p-2"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={saveAddress}
                  onChange={(e) => setSaveAddress(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Save this address for future</span>
              </label>

              <button
                onClick={() => {
                  // quick auto-fill from profile if available
                  if (user?.name || user?.mobile) {
                    setAddress((prev) => ({
                      ...prev,
                      fullName: prev.fullName || user.name || "",
                      phone: prev.phone || user.mobile || prev.phone || "",
                    }));
                    toast.success("Prefilled from profile");
                  } else {
                    toast("No profile data available");
                  }
                }}
                className="px-3 py-2 bg-gray-100 rounded text-sm"
              >
                Use profile
              </button>
            </div>
          </div>

          {/* Order items / notes */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Order Items</h3>
            <div className="space-y-3">
              {cartItems.length === 0 ? (
                <p className="text-gray-500">Your cart is empty.</p>
              ) : (
                cartItems.map((it) => (
                  <div key={it._id || it.id} className="flex items-center gap-3">
                    <img src={it.image || it.images?.[0]} alt={it.name} className="w-14 h-14 object-cover rounded" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{it.name}</p>
                          <p className="text-sm text-gray-500">Qty: {it.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{(it.price * it.quantity).toFixed(2)}</p>
                          <p className="text-xs text-gray-400">₹{it.price} each</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: summary & payment */}
        <div className="space-y-4">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Payment & Summary</h3>

            {/* Payment method cards */}
            <div className="space-y-3">
              <label className={`block p-3 rounded-lg border ${paymentMode === "razorpay" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}>
                <input
                  type="radio"
                  name="payment"
                  value="razorpay"
                  checked={paymentMode === "razorpay"}
                  onChange={() => setPaymentMode("razorpay")}
                  className="mr-2"
                />
                <strong>Pay online (Razorpay)</strong>
                <div className="text-sm text-gray-600 mt-1">Secure UPI / card / netbanking payment.</div>
              </label>

              <label className={`block p-3 rounded-lg border ${paymentMode === "cod" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMode === "cod"}
                  onChange={() => setPaymentMode("cod")}
                  className="mr-2"
                />
                <strong>Cash on Delivery (COD)</strong>
                <div className="text-sm text-gray-600 mt-1">Pay with cash when the parcel arrives.</div>
              </label>
            </div>

            <div className="mt-5 border-t pt-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>Shipping</span>
                <span>{shippingPrice === 0 ? "Free" : `₹${shippingPrice.toFixed(2)}`}</span>
              </div>

              <div className="flex justify-between mt-3 pt-3 border-t">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-semibold text-lg">₹{total.toFixed(2)}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={processing || cartItems.length === 0}
                className={`mt-4 w-full py-3 rounded-lg text-white font-semibold ${
                  processing ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {processing ? "Processing..." : paymentMode === "cod" ? `Place Order • COD` : `Pay ₹${total.toFixed(2)} • Pay Online`}
              </button>

              <p className="text-xs text-gray-500 mt-2">
                {paymentMode === "cod"
                  ? "You will pay in cash when your order is delivered."
                  : "You will be redirected to the secure Razorpay gateway."}
              </p>
            </div>
          </div>

          {/* Help / support card */}
          <div className="bg-white shadow rounded-lg p-4 flex items-start gap-3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-blue-600">
              <path d="M12 2v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 6l-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22v-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <div className="font-medium">Need help?</div>
              <div className="text-sm text-gray-600">Contact support at support@example.com or call +91-XXXXXXXXXX</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
