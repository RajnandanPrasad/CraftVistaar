import React, { useState, useEffect, useMemo } from "react";
import { getCurrentUser } from "../api/auth";
import API from "../api/api";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [user] = useState(() => getCurrentUser());

  useEffect(() => {
    const token = localStorage.getItem("craftkart_token");
    if (!token) return;
    if (user && user.role === "admin") {
      loadAll();
    }
  }, [user]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, query, filter]);

  const loadAll = async () => {
    setLoading(true);
    try {
      await Promise.all([loadUsers(), loadProducts(), loadOrders()]);
    } catch (err) {
      console.error("loadAll error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await API.get("/admin/sellers");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to load users:", err.response?.data || err.message);
      toast.error("Failed to load users");
      setUsers([]);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await API.get("/admin/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to load products:", err.response?.data || err.message);
      toast.error("Failed to load products");
      setProducts([]);
    }
  };

  const loadOrders = async () => {
    try {
      const res = await API.get("/admin/orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to load orders:", err.response?.data || err.message);
      toast.error("Failed to load orders");
      setOrders([]);
    }
  };

  const verifySeller = async (sellerId) => {
    if (!window.confirm("Verify this seller?")) return;
    try {
      await API.put(`/admin/verify-seller/${sellerId}`);
      toast.success("Seller verified");
      await loadUsers();
    } catch (err) {
      console.error("verifySeller error:", err.response?.data || err.message);
      toast.error("Failed to verify seller");
    }
  };

  const approveProduct = async (productId) => {
    if (!window.confirm("Approve this product?")) return;
    try {
      await API.put(`/admin/products/${productId}/approve`);
      toast.success("Product approved");
      await loadProducts();
    } catch (err) {
      console.error("approveProduct error:", err.response?.data || err.message);
      toast.error("Failed to approve product");
    }
  };

  const rejectProduct = async (productId) => {
    if (!window.confirm("Reject and remove this product?")) return;
    try {
      await API.delete(`/admin/products/${productId}/reject`);
      toast.success("Product rejected and removed");
      await loadProducts();
    } catch (err) {
      console.error("rejectProduct error:", err.response?.data || err.message);
      toast.error("Failed to reject product");
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      await API.delete(`/admin/users/${userId}`);
      toast.success("User deleted");
      await loadUsers();
    } catch (err) {
      console.error("deleteUser error:", err.response?.data || err.message);
      toast.error("Failed to delete user");
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await API.put(`/admin/orders/${orderId}`, { status });
      toast.success("Order status updated");
      await loadOrders();
    } catch (err) {
      console.error("updateOrderStatus error:", err.response?.data || err.message);
      toast.error("Failed to update order status");
    }
  };

  const listForActiveTab = useMemo(() => {
    if (activeTab === "users") return users;
    if (activeTab === "products") return products;
    if (activeTab === "orders") return orders;
    return [];
  }, [activeTab, users, products, orders]);

  const filteredList = useMemo(() => {
    const q = query.trim().toLowerCase();
    const f = filter.trim().toLowerCase();
    return listForActiveTab.filter((item) => {
      if (activeTab === "users") {
        const matchesQ =
          !q ||
          item.name?.toLowerCase().includes(q) ||
          item.email?.toLowerCase().includes(q) ||
          (item.role || "").toLowerCase().includes(q) ||
          (item._id || "").toString().includes(q);

        const matchesF =
          !f ||
          (item.role || "").toLowerCase() === f ||
          (item.isVerified ? "verified" : "unverified") === f;

        return matchesQ && matchesF;
      }

      if (activeTab === "products") {
        const matchesQ =
          !q ||
          item.title?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          (item.category || "").toLowerCase().includes(q) ||
          (item._id || "").toString().includes(q);

        const matchesF =
          !f ||
          (item.category || "").toLowerCase() === f ||
          (item.approved ? "approved" : "pending") === f;

        return matchesQ && matchesF;
      }

      if (activeTab === "orders") {
        const matchesQ =
          !q ||
          (item._id || "").toString().includes(q) ||
          (item.userId?.name || "").toLowerCase().includes(q) ||
          (item.status || "").toLowerCase().includes(q);

        const matchesF = !f || (item.status || "").toLowerCase() === f;
        return matchesQ && matchesF;
      }

      return true;
    });
  }, [listForActiveTab, activeTab, query, filter]);

  const paginatedList = filteredList.slice((page - 1) * pageSize, page * pageSize);

  if (!user || user.role !== "admin") {
    return <div className="p-6 text-center">Access denied. Admin account required.</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
        <button
          onClick={loadAll}
          className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
          title="Reload"
        >
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded ${
            activeTab === "users" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 rounded ${
            activeTab === "products" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded ${
            activeTab === "orders" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Orders ({orders.length})
        </button>
      </div>

      {/* USERS TABLE — UPDATED WITH SELLER FIELDS */}
      {activeTab === "users" && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Role</th>
                <th className="px-4 py-2 border">Mobile</th>
                <th className="px-4 py-2 border">Work Address</th>
                <th className="px-4 py-2 border">Aadhaar</th>
                <th className="px-4 py-2 border">Work Images</th>
                <th className="px-4 py-2 border">Verified</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedList.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{u._id}</td>
                  <td className="px-4 py-2 border">{u.name}</td>
                  <td className="px-4 py-2 border">{u.email}</td>
                  <td className="px-4 py-2 border">{u.role}</td>

                  <td className="px-4 py-2 border">{u.mobile || "—"}</td>
                  <td className="px-4 py-2 border">{u.workAddress || "—"}</td>

                  {/* Aadhaar */}
                  <td className="px-4 py-2 border">
                    {u.aadhaar ? (
                      <a
                        href={`${import.meta.env.VITE_API_BASE}/uploads/${u.aadhaar}`}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        View
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>

                  {/* Work Images */}
                  <td className="px-4 py-2 border">
                    <div className="flex gap-2">
                      {u.workImages?.length > 0
                        ? u.workImages.map((img, i) => (
                            <img
                              key={i}
                              src={`${import.meta.env.VITE_API_BASE}/uploads/${img}`}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ))
                        : "—"}
                    </div>
                  </td>

                  <td className="px-4 py-2 border">{u.isVerified ? "Yes" : "No"}</td>

                  <td className="px-4 py-2 border flex gap-2">
                    {!u.isVerified && u.role === "seller" && (
                      <button
                        onClick={() => verifySeller(u._id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Verify
                      </button>
                    )}
                    <button
                      onClick={() => deleteUser(u._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {paginatedList.length === 0 && (
                <tr>
                  <td colSpan="10" className="px-4 py-2 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* PRODUCTS + ORDERS TABLES REMAIN EXACTLY SAME */}
      
      {activeTab === "products" && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Category</th>
                <th className="px-4 py-2 border">Seller</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedList.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{p._id}</td>
                  <td className="px-4 py-2 border">{p.title}</td>
                  <td className="px-4 py-2 border">{p.category}</td>
                  <td className="px-4 py-2 border">{p.sellerId?.name || "—"}</td>
                  <td className="px-4 py-2 border">{p.approved ? "Approved" : "Pending"}</td>
                  <td className="px-4 py-2 border flex gap-2">
                    {!p.approved && (
                      <button
                        onClick={() => approveProduct(p._id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => rejectProduct(p._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">User</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedList.map((o) => (
                <tr key={o._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{o._id}</td>
                  <td className="px-4 py-2 border">{o.userId?.name || "—"}</td>
                  <td className="px-4 py-2 border">{o.status}</td>
                  <td className="px-4 py-2 border flex gap-2">
                    {["pending", "shipped", "delivered"].map((s) => (
                      <button
                        key={s}
                        onClick={() => updateOrderStatus(o._id, s)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
