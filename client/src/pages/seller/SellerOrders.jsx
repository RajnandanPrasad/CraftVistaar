import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../../api/auth";
import API from "../../api/api";
import toast from "react-hot-toast";
import SellerSidebar from "../../components/seller/SellerSidebar";

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = getCurrentUser();

  const loadOrders = async () => {
    try {
      const res = await API.get("/orders/seller/orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "seller") loadOrders();
  }, [user]);

  const updateStatus = async (orderId, status) => {
    try {
      await API.patch(`/orders/seller/update-status/${orderId}`, { status });
      toast.success(`Order updated to ${status}`);

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );
    } catch (err) {
      toast.error("Failed to update order status");
      console.error(err);
    }
  };

  if (!user || user.role !== "seller")
    return <div className="p-6 text-center">Access denied.</div>;

  if (loading) {
    return (
      <div className="flex">
        <SellerSidebar />
        <div className="flex-1 p-6 flex justify-center items-center">
          <div className="animate-pulse text-gray-500 text-lg">
            Loading orders…
          </div>
        </div>
      </div>
    );
  }

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
    accepted: "bg-purple-100 text-purple-700 border-purple-300",
    packed: "bg-orange-100 text-orange-700 border-orange-300",
    shipped: "bg-blue-100 text-blue-700 border-blue-300",
    delivered: "bg-green-100 text-green-700 border-green-300",
    cancelled: "bg-red-100 text-red-700 border-red-300",
  };

  return (
    <div className="flex">
      <SellerSidebar />

      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        <h2 className="text-4xl font-bold mb-8 text-gray-800 tracking-tight">
          📦 My Orders
        </h2>

        {orders.length === 0 && (
          <div className="text-center py-20 text-gray-500 text-lg">
            No orders yet.
          </div>
        )}

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-1">
                    Order #{order._id.slice(-8)}
                  </h3>
                  <p className="text-gray-600">
                    👤 {order.customer?.name || "N/A"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    ✉️ {order.customer?.email || "N/A"}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    📅 {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-800">
                    ₹{order.totalAmount}
                  </p>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border inline-block mt-2 ${statusColor[order.status]}`}
                  >
                    {order.status.toUpperCase()}
                  </span>

                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(order._id, e.target.value)
                    }
                    className="mt-3 px-3 py-2 border rounded-lg bg-gray-50 text-sm hover:bg-gray-100 transition"
                  >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="packed">Packed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* ITEMS LIST */}
              <div className="border-t pt-5">
                <h4 className="text-lg font-semibold mb-3 text-gray-800">
                  🛍 Items
                </h4>

                <div className="space-y-3">
                  {order.items.map((item, idx) => {
                    const product = item.product || {};

                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-gray-100 p-3 rounded-xl border hover:bg-gray-200 transition"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={product.images?.[0] || "/assets/logo.webp"}
                            alt=""
                            className="w-16 h-16 rounded-lg border object-cover shadow-sm"
                          />

                          <div>
                            <p className="font-semibold text-gray-800 text-lg">
                              {product.title || "Product"}
                            </p>
                            <p className="text-gray-500 text-sm">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>

                        <p className="text-lg font-bold text-gray-800">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SHIPPING ADDRESS */}
              <div className="border-t pt-5 mt-5">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  📍 Shipping Address
                </h4>

                <div className="text-gray-600 leading-relaxed">
                  {order.shippingAddress?.fullName} <br />
                  {order.shippingAddress?.street} <br />
                  {order.shippingAddress?.city},{" "}
                  {order.shippingAddress?.state} <br />
                  {order.shippingAddress?.zipCode} <br />
                  {order.shippingAddress?.country} <br />
                  <span className="text-gray-700 font-semibold">
                    Phone: {order.shippingAddress?.phone}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
