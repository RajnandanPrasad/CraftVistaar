import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../../api/auth";
import API from "../../api/api";
import toast from "react-hot-toast";
import SellerSidebar from "../../components/seller/SellerSidebar";
import SellerStatsCards from "../../components/seller/SellerStatsCards";

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
  "Accessories",
];

export default function SellerDashboard() {
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalSales: 0 });
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
      API.get("/seller/dashboard").then(res => setStats(res.data)).catch(err => console.error(err));
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
    setFormData({
      title: "",
      description: "",
      price: "",
      category: "",
      images: [""],
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  if (!user || user.role !== "seller") {
    return <div className="p-6 text-center">Access denied.</div>;
  }

  return (
    <div className="flex">
      <SellerSidebar />
      <div className="flex-1 p-6">
        <h2 className="text-3xl font-bold mb-6">Seller Dashboard</h2>
        <SellerStatsCards stats={stats} />

        <div className="mt-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showForm ? "Cancel" : "Add New Product"}
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} className="mt-4 bg-gray-100 p-4 rounded">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Image URL"
                  value={formData.images[0]}
                  onChange={(e) =>
                    setFormData({ ...formData, images: [e.target.value] })
                  }
                  className="w-full p-2 border rounded"
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border rounded col-span-2"
                  rows="3"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
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
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-600">No products yet. Add your first product!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
