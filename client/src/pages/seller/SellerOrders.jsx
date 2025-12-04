import React, { useState, useEffect } from "react";
import { fetchSellerOrders } from "../../api/sellers";
import SellerSidebar from "../../components/seller/SellerSidebar";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchSellerOrders();
        setOrders(data);
      } catch (err) {
        setError("Failed to load orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <SellerSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
            <p className="text-gray-600 font-medium">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <SellerSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg shadow">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <SellerSidebar />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          📦 My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-10 text-center">
            <p className="text-xl font-semibold text-gray-800 mb-2">
              No Orders Yet
            </p>
            <p className="text-gray-500">
              As soon as customers purchase your products, orders will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition"
              >
                {/* HEADER */}
                <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Order #{order._id.slice(-8)}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "shipped"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "packed"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {order.status.toUpperCase()}
                    </span>

                    <span
                      className={`text-sm font-semibold ${
                        order.paymentStatus === "paid"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      Payment: {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* BODY */}
                <div className="p-6 grid md:grid-cols-2 gap-6">
                  {/* CUSTOMER */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      👤 Customer Details
                    </h3>
                    <p className="text-sm text-gray-600">
                      Name: {order.customer?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Email: {order.customer?.email}
                    </p>
                  </div>

                  {/* ADDRESS */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      🚚 Shipping Address
                    </h3>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress?.street},{" "}
                      {order.shippingAddress?.city}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress?.state} -{" "}
                      {order.shippingAddress?.zipCode}
                    </p>
                  </div>
                </div>

                {/* PRODUCTS */}
                <div className="px-6 pb-6">
                  <h3 className="font-semibold text-gray-800 mb-4">
                    🛒 Order Items
                  </h3>

                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-4 rounded-xl border"
                      >
                        <p className="font-semibold text-gray-800">
                          {item.product?.title}
                        </p>

                        <p className="text-sm text-gray-600 mt-1">
                          Qty: {item.quantity} × ₹{item.price}
                        </p>

                        <p className="font-bold text-indigo-600 mt-1">
                          Total: ₹{item.quantity * item.price}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FOOTER */}
                <div className="px-6 py-4 bg-gray-100 flex justify-between items-center">
                  <span className="text-sm text-gray-600">Grand Total</span>
                  <span className="text-xl font-bold text-gray-900">
                    ₹{order.totalAmount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerOrders;
