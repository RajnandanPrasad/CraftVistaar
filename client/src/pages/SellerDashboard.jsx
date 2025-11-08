import React, { useState, useEffect, useCallback } from "react";
import { getCurrentUser } from "../api/auth";
import toast from "react-hot-toast";

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    images: ["/assets/product1.jpg"], // Default image
  });

  const user = getCurrentUser();

  const loadProducts = useCallback(() => {
    const storedProducts = JSON.parse(localStorage.getItem("craftkart_products") || "[]");
    const sellerProducts = storedProducts.filter(p => p.sellerId === user.id);
    setProducts(sellerProducts);
  }, [user]);

  useEffect(() => {
    if (user && user.role === "seller") {
      loadProducts();
    }
  }, [user, loadProducts]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.price || !formData.category) {
      toast.error("Please fill all fields");
      return;
    }

    const storedProducts = JSON.parse(localStorage.getItem("craftkart_products") || "[]");

    if (editingProduct) {
      // Update existing product
      const updatedProducts = storedProducts.map(p =>
        p.id === editingProduct.id
          ? { ...p, ...formData, price: parseFloat(formData.price) }
          : p
      );
      localStorage.setItem("craftkart_products", JSON.stringify(updatedProducts));
      toast.success("Product updated successfully!");
    } else {
      // Add new product
      const newProduct = {
        id: Date.now(),
        ...formData,
        price: parseFloat(formData.price),
        sellerId: user.id,
      };
      storedProducts.push(newProduct);
      localStorage.setItem("craftkart_products", JSON.stringify(storedProducts));
      toast.success("Product added successfully!");
    }

    loadProducts();
    resetForm();
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

  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const storedProducts = JSON.parse(localStorage.getItem("craftkart_products") || "[]");
      const filteredProducts = storedProducts.filter(p => p.id !== productId);
      localStorage.setItem("craftkart_products", JSON.stringify(filteredProducts));
      loadProducts();
      toast.success("Product deleted successfully!");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      category: "",
      images: ["/assets/product1.jpg"],
    });
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
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded h-24"
              required
            />
            <div className="flex gap-2">
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
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow-md">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-48 object-cover rounded mb-4"
              onError={(e) => {
                e.target.src = "/assets/logo.webp";
              }}
            />
            <h3 className="text-lg font-semibold">{product.title}</h3>
            <p className="text-gray-600 text-sm mb-2">{product.description}</p>
            <p className="text-green-600 font-bold">₹{product.price}</p>
            <p className="text-xs text-gray-500">{product.category}</p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEdit(product)}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
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
  );
}
