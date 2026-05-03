import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../../api/auth";
import API from "../../api/api";
import toast from "react-hot-toast";
import SellerLayout from "../../components/layouts/SellerLayout";
import SellerStatsCards from "../../components/seller/SellerStatsCards";
import { HANDMADE_CATEGORIES } from "../../utils/handmadeFilter";
import { getProductImageUrl } from "../../utils/imageHelpers";
const categories = [...HANDMADE_CATEGORIES];

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
     stock: ""
  });

  const user = getCurrentUser();

  // Load seller's products
  const loadProducts = async () => {
    try {
      const res = await API.get("/seller/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
     if (!window.errorShown) {
  toast.error("Failed to load products");
  window.errorShown = true;
}
    }
  };

 useEffect(() => {
  if (!user || user.role !== "seller") return;

  const fetchData = async () => {
    try {
      const statsRes = await API.get("/seller/dashboard");
      setStats(statsRes.data);

      const productRes = await API.get("/seller/products");
      setProducts(productRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchData();
}, [user]);
  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.price || !formData.category || formData.stock === "") {
      toast.error("Please fill all fields");
      return;
    }
    if (parseInt(formData.stock) < 0) {
  toast.error("Stock cannot be negative");
  return;
}

    try {
      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, {
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock)
        });
        toast.success("Product updated successfully!");
        resetForm();
      } else {
        await API.post("/products", {
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock)
        });
        toast.success("Product added successfully!");
        // Reset form data but keep form open for adding another product
        setFormData({
          title: "",
          description: "",
          price: "",
          category: "",
          images: [""],
          stock: ""
        });
        setEditingProduct(null);
      }
      loadProducts();
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
      stock: product.stock?.toString() || ""
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
      stock: ""
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  if (!user || user.role !== "seller") {
    return <div className="p-6 text-center">Access denied.</div>;
  }

  return (
    <SellerLayout title="Seller Dashboard">
      <div className="space-y-6">
        <SellerStatsCards stats={stats} />



        <div className="space-y-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            {showForm ? "Cancel" : "Add New Product"}
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} className="mt-4 bg-slate-50 p-4 rounded-3xl shadow-sm border border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-xl bg-white"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-xl bg-white"
                />
                <input
                  type="number"
                  placeholder="Stock Quantity"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-xl bg-white"
                  min="0"
                />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-xl bg-white"
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
                  onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                  className="w-full p-3 border border-slate-300 rounded-xl bg-white"
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-xl bg-white col-span-2"
                  rows="4"
                />
              </div>
              <div className="flex flex-col gap-3 mt-4 md:flex-row md:items-center">
                <button
                  type="submit"
                  className="w-full md:w-auto bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition"
                >
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full md:w-auto bg-slate-500 text-white px-4 py-3 rounded-xl hover:bg-slate-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white p-4 rounded-3xl shadow hover:shadow-md transition">
                <img
                  src={getProductImageUrl(product.images?.[0])}
                  alt={product.title}
                  className="w-full h-40 object-cover rounded-2xl mb-4"
                />
                <h3 className="text-lg font-semibold text-slate-900">{product.title}</h3>
                <p className="text-slate-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                <p className="text-green-600 font-bold">₹{product.price}</p>
                <p className="text-sm text-slate-700">Stock: {product.stock}</p>
                <p className="text-xs mt-2">
                  {product.approved ? (
                    <span className="text-green-600 font-semibold">✅ Approved</span>
                  ) : (
                    <span className="text-yellow-600 font-semibold">⏳ Pending Approval</span>
                  )}
                </p>
                <p className="text-xs text-slate-500 mt-1">{product.category}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 min-w-[120px] bg-blue-500 text-white px-3 py-2 rounded-xl text-sm hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 min-w-[120px] bg-red-500 text-white px-3 py-2 rounded-xl text-sm hover:bg-red-600 transition"
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
    </SellerLayout>
  );
}
