import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../../api/auth";
import API from "../../api/api";
import toast from "react-hot-toast";
import SellerSidebar from "../../components/seller/SellerSidebar";

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = getCurrentUser();

  const loadProducts = async () => {
    try {
      const res = await API.get("/seller/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
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

  useEffect(() => {
    if (user && user.role === "seller") {
      loadProducts();
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
          <div className="text-center py-10">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <SellerSidebar />
      <div className="flex-1 p-6">
        <h2 className="text-3xl font-bold mb-6">My Products</h2>

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
  );
}
