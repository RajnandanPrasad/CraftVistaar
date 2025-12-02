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
      const res = await API.get("/seller/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "seller") {
      loadOrders();
    }
  }, [user]);

  if (!user || user.role !== "seller") {
    return <div className="p-6 text-center">Access denied.</div>;
  }

  if (loading) {
    return (
      <div className="flex">
        <SellerSidebar />
        <div className="flex-1 p-6">
          <div className="text-center py-10">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <SellerSidebar />
      <div className="flex-1 p-6">
        <h2 className="text-3xl font-bold mb-6">My Orders</h2>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Order #{order._id.slice(-8)}</h3>
                  <p className="text-gray-600">Customer: {order.customer?.name || 'N/A'}</p>
                  <p className="text-gray-600">Email: {order.customer?.email || 'N/A'}</p>
                  <p className="text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">₹{order.totalAmount}</p>
                  <p className={`text-sm font-semibold ${
                    order.status === 'pending' ? 'text-yellow-600' :
                    order.status === 'shipped' ? 'text-blue-600' :
                    order.status === 'delivered' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Items:</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.product?.title || 'Product'}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold mb-2">Shipping Address:</h4>
                <p className="text-sm text-gray-600">{order.shippingAddress}</p>
              </div>
            </div>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-600">No orders yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
