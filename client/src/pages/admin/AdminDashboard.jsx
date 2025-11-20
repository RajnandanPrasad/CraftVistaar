import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../../api/auth";
import API from "../../api/api";
import toast from "react-hot-toast";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminStatsCards from "../../components/admin/AdminStatsCards";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0, totalOrders: 0 });
  const [products, setProducts] = useState([]);
  const user = getCurrentUser();

  const loadStats = async () => {
    try {
      const res = await API.get("/admin/dashboard");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await API.get("/admin/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      loadStats();
      loadProducts();
    }
  }, [user]);

  const approveProduct = async (productId) => {
    try {
      await API.put(`/admin/products/${productId}/approve`);
      toast.success("Product approved");
      loadProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve product");
    }
  };

  const rejectProduct = async (productId) => {
    if (!window.confirm("Reject this product?")) return;
    try {
      await API.delete(`/admin/products/${productId}/reject`);
      toast.success("Product rejected");
      loadProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject product");
    }
  };

  if (!user || user.role !== "admin") {
    return <div className="p-6 text-center">Access denied. Admin account required.</div>;
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
        <AdminStatsCards stats={stats} />

        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4">Product Approvals</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Title</th>
                  <th className="px-4 py-2 border">Seller</th>
                  <th className="px-4 py-2 border">Price</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{p.title}</td>
                    <td className="px-4 py-2 border">{p.sellerId?.name || "—"}</td>
                    <td className="px-4 py-2 border">₹{p.price}</td>
                    <td className="px-4 py-2 border">
                      {p.approved ? "Approved" : "Pending"}
                    </td>
                    <td className="px-4 py-2 border flex gap-2">
                      {!p.approved && (
                        <>
                          <button
                            onClick={() => approveProduct(p._id)}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectProduct(p._id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-4 py-2 text-center text-gray-500">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
