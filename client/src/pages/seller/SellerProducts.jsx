import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../../api/auth";
import API from "../../api/api";
import toast from "react-hot-toast";
import SellerLayout from "../../components/layouts/SellerLayout";
import { getProductImageUrl } from "../../utils/imageHelpers";

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
      <SellerLayout title="My Products">
        <div className="text-center py-10">Loading products...</div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout title="My Products">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

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
            <p className="text-xs mt-1">
              {product.approved ? (
                <span className="text-green-600 font-semibold">✅ Approved</span>
              ) : (
                <span className="text-yellow-600 font-semibold">⏳ Pending Approval</span>
              )}
            </p>
            <p className="text-xs text-slate-500">{product.category}</p>
            <div className="mt-4">
              <button
                onClick={() => handleDelete(product._id)}
                className="w-full bg-red-500 text-white px-3 py-2 rounded-xl text-sm hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="text-center py-10 col-span-full">
            <p className="text-gray-600">No products yet. Add your first product!</p>
          </div>
        )}
      </div>
    </SellerLayout>
  );
}
