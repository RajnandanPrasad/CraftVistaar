import React, { useEffect, useState } from "react";
import API from "../api/api";
import toast from "react-hot-toast";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/orders/my-orders");
        setOrders(res.data);
      } catch (err) {
        toast.error(err.response?.data?.msg || "Failed to load your orders");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ⭐ ADDED "accepted" HERE
  const statusSteps = ["pending", "accepted", "packed", "shipped", "delivered"];

  const getStatusIndex = (status) => statusSteps.indexOf(status.toLowerCase());

  const getStatusColor = (status) => {
    const s = status.toLowerCase();
    if (s === "accepted") return "bg-purple-100 text-purple-700"; // ⭐ NEW COLOR
    if (s === "delivered") return "bg-green-100 text-green-700";
    if (s === "shipped") return "bg-blue-100 text-blue-700";
    if (s === "packed") return "bg-yellow-100 text-yellow-700";
    if (s === "cancelled") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-20 text-center text-lg text-gray-600">
        Loading your orders…
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto mt-20 bg-white shadow-md rounded-xl p-10 text-center">
        <h2 className="text-3xl font-bold mb-3">No Orders Yet</h2>
        <p className="text-gray-600">
          Looks like you haven’t ordered anything yet. Explore our products!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 mt-8">
      <h1 className="text-4xl font-bold mb-8">My Orders</h1>

      <div className="space-y-8">
        {orders.map((order) => {
          const id = order._id;
          const status = order.status || "pending";
          const statusIndex = getStatusIndex(status);

          return (
            <div
              key={id}
              className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b flex flex-wrap md:flex-nowrap items-center justify-between gap-5 bg-gray-50">
                <div>
                  <p className="text-gray-500 text-sm">Order ID</p>
                  <p className="text-lg font-semibold">{id}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Placed On</p>
                  <p className="font-medium">{formatDate(order.createdAt)}</p>
                </div>

                <span
                  className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                    status
                  )}`}
                >
                  {status.toUpperCase()}
                </span>
              </div>

              {/* Timeline */}
              <div className="flex items-center justify-between px-8 py-6">
                {statusSteps.map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full text-white text-lg font-bold ${
                        idx <= statusIndex
                          ? "bg-blue-600 shadow-md"
                          : "bg-gray-300"
                      }`}
                    >
                      {idx === 0 && "🛒"}
                      {idx === 1 && "✅"} 
                      {idx === 2 && "📦"}
                      {idx === 3 && "🚚"}
                      {idx === 4 && "📬"}
                    </div>
                    <p
                      className={`mt-2 text-sm font-medium ${
                        idx <= statusIndex ? "text-blue-700" : "text-gray-500"
                      }`}
                    >
                      {step[0].toUpperCase() + step.slice(1)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Items */}
              <div className="px-6 pb-6 space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 p-4 border rounded-xl bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <img
                      src={item.product?.images?.[0] || "/assets/logo.webp"}
                      alt={item.product?.title}
                      className="w-20 h-20 object-cover rounded-lg border"
                      onError={(e) => (e.target.src = "/assets/logo.webp")}
                    />

                    <div className="flex-1">
                      <p className="font-semibold text-lg">
                        {item.product?.title}
                      </p>

                      <p className="text-gray-500 text-sm">
                        Sold by: {item.product?.sellerId?.name || "Unknown Seller"}
                      </p>

                      <p className="text-gray-600">Qty: {item.quantity}</p>
                    </div>

                    <div className="text-lg font-bold">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              {/* Expand */}
              <button
                onClick={() =>
                  setExpandedOrderId(expandedOrderId === id ? null : id)
                }
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 font-medium text-sm"
              >
                {expandedOrderId === id ? "Hide Details ▲" : "View Details ▼"}
              </button>

              {/* Expanded Section */}
              {expandedOrderId === id && (
                <div className="p-6 bg-gray-50 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <h3 className="text-gray-700 font-semibold mb-2">
                        Shipping Address
                      </h3>
                      <p>{order.shippingAddress.fullName}</p>
                      <p>{order.shippingAddress.street}</p>
                      <p>
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}
                      </p>
                      <p>{order.shippingAddress.zipCode}</p>
                      <p>{order.shippingAddress.country}</p>
                      <p className="mt-1 text-gray-600">
                        Phone: {order.shippingAddress.phone}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-gray-700 font-semibold mb-2">
                        Payment & Total
                      </h3>
                      <p>Payment Method: {order.paymentMethod.toUpperCase()}</p>
                      <p className="text-lg font-bold mt-2">
                        Total: ₹{order.totalAmount}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
