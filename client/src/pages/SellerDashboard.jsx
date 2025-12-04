import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../api/auth";
import API from "../api/api";
import toast from "react-hot-toast";

const categories = [
  "Clothing",
  "Electronics",
  "Grocery",
  "Fitness",
  "Toys",
  "Home Decor",
  "Footwear",
  "Beauty",
  "Kitchen",
  "Pickles",
  "Accessories",
];

/* ------------------------------------------------------------------
   ⭐ SELLER ORDERS COMPONENT (Added without touching your product code)
------------------------------------------------------------------- */
function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load seller-specific orders
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await API.get("/orders/seller/orders");
        setOrders(res.data || []);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load incoming orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Update order status
  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/orders/seller/update-status/${id}`, { status });
      toast.success(`Order ${status}`);

      // Update state instantly
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status } : o))
      );
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <p>Loading orders...</p>;

  if (orders.length === 0)
    return <p className="text-gray-500">No incoming orders yet.</p>;

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order._id} className="border p-5 rounded-xl bg-gray-50 shadow">
          <p className="font-bold text-lg">Order ID: {order._id}</p>
          <p className="text-gray-600">Customer: {order.customer?.name}</p>
          <p className="text-gray-600">Status: {order.status}</p>

          <div className="mt-4 space-y-3">
            {order.items.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 p-3 bg-white rounded-lg border"
              >
                <img
                  src={item.product?.images?.[0] || "/assets/logo.webp"}
                  className="w-16 h-16 rounded object-cover border"
                  alt="product"
                />

                <div className="flex-1">
                  <p className="font-semibold">{item.product?.title}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>

                <p className="font-bold">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          {/* STATUS UPDATE BUTTONS */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => updateStatus(order._id, "accepted")}
              className="px-3 py-1 rounded bg-blue-600 text-white"
            >
              Accept
            </button>
            <button
              onClick={() => updateStatus(order._id, "packed")}
              className="px-3 py-1 rounded bg-yellow-600 text-white"
            >
              Packed
            </button>
            <button
              onClick={() => updateStatus(order._id, "shipped")}
              className="px-3 py-1 rounded bg-purple-600 text-white"
            >
              Shipped
            </button>
            <button
              onClick={() => updateStatus(order._id, "delivered")}
              className="px-3 py-1 rounded bg-green-600 text-white"
            >
              Delivered
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------
   ⭐ MAIN SELLER DASHBOARD (Your original code preserved)
------------------------------------------------------------------- */
export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    images: [""],
  });

  const user = getCurrentUser();

  // Load seller's products
  const loadProducts = async () => {
    try {
      const res = await API.get("/products");
      const sellerProducts = res.data.filter((p) => p.sellerId._id === user.id);
      setProducts(sellerProducts);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    if (user && user.role === "seller") {
      loadProducts();
    }
  }, [user]);

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.price || !formData.category) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, {
          ...formData,
          price: parseFloat(formData.price),
        });
        toast.success("Product updated successfully!");
      } else {
        await API.post("/products", {
          ...formData,
          price: parseFloat(formData.price),
        });
        toast.success("Product added successfully!");
      }
      loadProducts();
      resetForm();
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error("Failed to save product. Make sure your seller is verified.");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      images: product.images,
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.delete(`/products/${productId}`);
      toast.success("Product deleted successfully!");
      loadProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", price: "", category: "", images: [""] });
    setEditingProduct(null);
    setShowForm(false);
  };

  if (!user || user.role !== "seller") {
    return <div className="p-6 text-center">Access denied. Seller account required.</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Seller Dashboard</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "Add Product"}
        </button>
      </div>

      {/* PRODUCT FORM (unchanged) */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Product Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full p-2 border rounded"
                min="0"
                step="0.01"
                required
              />
            </div>

            <select
              className="w-full p-2 border rounded"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-2 border rounded h-24"
              required
            />

            <input
              type="text"
              placeholder="Image URL"
              value={formData.images[0]}
              onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
              className="w-full p-2 border rounded"
            />

            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                {editingProduct ? "Update Product" : "Add Product"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PRODUCT LIST (unchanged) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white p-4 rounded-lg shadow-md">
            <img
              src={product.images[0] || "/assets/logo.webp"}
              alt={product.title}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h3 className="text-lg font-semibold">{product.title}</h3>
            <p className="text-gray-600 text-sm mb-2">{product.description}</p>
            <p className="text-green-600 font-bold">₹{product.price}</p>

            <p className="text-xs mt-1">
              {product.approved ? (
                <span className="text-green-600 font-semibold">✅ Approved</span>
              ) : (
                <span className="text-yellow-600 font-semibold">⏳ Pending Approval</span>
              )}
            </p>

            <p className="text-xs text-gray-500">{product.category}</p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEdit(product)}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* NO PRODUCTS MESSAGE */}
      {products.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-600">No products yet. Add your first product!</p>
        </div>
      )}

      {/* ⭐ INCOMING ORDERS SECTION ADDED HERE ⭐ */}
      <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Incoming Orders</h2>
        <SellerOrders />
      </div>
    </div>
  );
}
