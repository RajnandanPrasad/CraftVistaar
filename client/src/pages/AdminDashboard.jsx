import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../api/auth";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("users");

  const user = getCurrentUser();

  useEffect(() => {
    if (user && user.role === "admin") {
      loadData();
    }
  }, [user]);

  const loadData = () => {
    const storedUsers = JSON.parse(localStorage.getItem("craftkart_users") || "[]");
    const storedProducts = JSON.parse(localStorage.getItem("craftkart_products") || "[]");
    const storedOrders = JSON.parse(localStorage.getItem("craftkart_orders") || "[]");

    setUsers(storedUsers);
    setProducts(storedProducts);
    setOrders(storedOrders);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const updatedUsers = users.filter(u => u.id !== userId);
      localStorage.setItem("craftkart_users", JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      toast.success("User deleted successfully!");
    }
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const updatedProducts = products.filter(p => p.id !== productId);
      localStorage.setItem("craftkart_products", JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
      toast.success("Product deleted successfully!");
    }
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      const updatedOrders = orders.filter(o => o.id !== orderId);
      localStorage.setItem("craftkart_orders", JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
      toast.success("Order deleted successfully!");
    }
  };

  if (!user || user.role !== "admin") {
    return <div className="p-6 text-center">Access denied. Admin account required.</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded ${activeTab === "users" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 rounded ${activeTab === "products" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded ${activeTab === "orders" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Orders ({orders.length})
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === "users" && (
        <div>
          <h3 className="text-xl font-semibold mb-4">All Users</h3>
          <div className="space-y-4">
            {users.map((u) => (
              <div key={u.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                <div>
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-gray-600">{u.email}</p>
                  <p className="text-sm text-blue-600">Role: {u.role}</p>
                </div>
                <button
                  onClick={() => handleDeleteUser(u.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === "products" && (
        <div>
          <h3 className="text-xl font-semibold mb-4">All Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.id} className="bg-white p-4 rounded-lg shadow">
                <img
                  src={p.images[0]}
                  alt={p.title}
                  className="w-full h-32 object-cover rounded mb-2"
                  onError={(e) => {
                    e.target.src = "/assets/logo.webp";
                  }}
                />
                <h4 className="font-semibold">{p.title}</h4>
                <p className="text-gray-600 text-sm">{p.description}</p>
                <p className="text-green-600 font-bold">₹{p.price}</p>
                <p className="text-xs text-gray-500">Seller ID: {p.sellerId}</p>
                <button
                  onClick={() => handleDeleteProduct(p.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 mt-2"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div>
          <h3 className="text-xl font-semibold mb-4">All Orders</h3>
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">Order #{o.id}</p>
                    <p className="text-gray-600">User ID: {o.userId}</p>
                    <p className="text-sm text-gray-500">
                      Date: {new Date(o.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">₹{o.total}</p>
                    <p className="text-sm text-blue-600">Status: {o.status}</p>
                  </div>
                </div>
                <div className="mb-2">
                  <p className="text-sm font-medium">Items:</p>
                  {o.items.map((item, index) => (
                    <p key={index} className="text-sm text-gray-600">
                      {item.title} x {item.quantity} = ₹{item.price * item.quantity}
                    </p>
                  ))}
                </div>
                <button
                  onClick={() => handleDeleteOrder(o.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Delete Order
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {(users.length === 0 && activeTab === "users") ||
       (products.length === 0 && activeTab === "products") ||
       (orders.length === 0 && activeTab === "orders") && (
        <div className="text-center py-10">
          <p className="text-gray-600">No {activeTab} found.</p>
        </div>
      )}
    </div>
  );
}
