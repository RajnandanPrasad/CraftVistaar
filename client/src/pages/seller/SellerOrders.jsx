import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../../api/auth";
import API from "../../api/api";
import toast from "react-hot-toast";
import SellerLayout from "../../components/layouts/SellerLayout";

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
      <SellerLayout title="My Orders">
        <div className="text-center py-10 animate-pulse text-gray-500 text-lg">
          Loading orders…
        </div>
      </SellerLayout>
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
    <SellerLayout title="My Orders">
      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-lg">
            No orders yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-4 text-left">Order</th>
                  <th className="px-4 py-4 text-left">Customer</th>
                  <th className="px-4 py-4 text-left">Items</th>
                  <th className="px-4 py-4 text-left">Total</th>
                  <th className="px-4 py-4 text-left">Status</th>
                  <th className="px-4 py-4 text-left">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">#{order._id.slice(-8)}</div>
                      <div className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{order.customer?.name || "N/A"}</div>
                      <div className="text-xs text-slate-500">{order.customer?.email || "N/A"}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1 text-slate-600">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-xs">
                            {item.product?.title || "Product"} × {item.quantity}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap font-semibold text-slate-900">₹{order.totalAmount}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusColor[order.status]}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                      >
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </SellerLayout>
  );
}
