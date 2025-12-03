import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useTranslation } from "react-i18next";
import AdminSidebar from "../../components/admin/AdminSidebar";

import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  AlertCircle,
  Search,
  Loader2,
  FileText,
  User,
  Users,
} from "lucide-react";

export default function AdminUsers() {
  const { t } = useTranslation();

  const [users, setUsers] = useState([]);
  const [filteredType, setFilteredType] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifyLoadingId, setVerifyLoadingId] = useState(null);
  const [error, setError] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  // ✅ FETCH USERS
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await API.get("/admin/users");
        setUsers(res.data?.users || res.data || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ✅ APPROVE / REJECT
  const handleVerifySeller = async (userId, status) => {
    if (status === "rejected" && !rejectionReason.trim()) {
      alert("Please enter rejection reason.");
      return;
    }

    try {
      setVerifyLoadingId(userId);

      await API.patch(`/admin/users/${userId}/verify`, {
        status,
        reason: status === "rejected" ? rejectionReason : undefined,
        notify: true,
      });

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId
            ? { ...u, sellerVerificationStatus: status }
            : u
        )
      );

      if (selectedUser?._id === userId) {
        setSelectedUser((prev) => ({
          ...prev,
          sellerVerificationStatus: status,
        }));
      }

      if (status === "approved") setRejectionReason("");
    } catch (err) {
      console.error(err);
      alert("Verification failed");
    } finally {
      setVerifyLoadingId(null);
    }
  };

  // ✅ FILTER + SEARCH
  const filteredUsers = users.filter((user) => {
    const byType =
      filteredType === "all"
        ? true
        : filteredType === "customer"
        ? user.role === "customer"
        : filteredType === "seller"
        ? user.role === "seller"
        : filteredType === "pending"
        ? user.role === "seller" &&
          (user.sellerVerificationStatus === "pending" ||
            !user.sellerVerificationStatus)
        : true;

    const bySearch =
      search.trim() === ""
        ? true
        : (user.name || "").toLowerCase().includes(search.toLowerCase()) ||
          (user.email || "").toLowerCase().includes(search.toLowerCase());

    return byType && bySearch;
  });

  // ✅ STATUS BADGE
  const getStatusBadge = (user) => {
    if (user.role !== "seller") {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700">
          Customer
        </span>
      );
    }

    const status = user.sellerVerificationStatus || "pending";

    if (status === "approved") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700">
          <ShieldCheck size={14} /> Verified
        </span>
      );
    }

    if (status === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
          <XCircle size={14} /> Rejected
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
        <AlertCircle size={14} /> Pending
      </span>
    );
  };

  // ✅ ✅ ✅ FINAL UI WITH SIDEBAR
  return (
    <div className="flex h-screen bg-slate-950 text-white">
      {/* ✅ LEFT SIDEBAR */}
      <AdminSidebar />

      {/* ✅ RIGHT CONTENT */}
      <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
        {/* HEADER */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t("manageUsers") || "Manage Users"}
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              {t("manageUsersSubtitle") ||
                "View customers & sellers, verify documents, and control access."}
            </p>
          </div>

          <div className="flex gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700 shadow-inner">
              <Users size={18} />
              <span className="text-xs">
                Total: <span className="font-semibold">{users.length}</span>
              </span>
            </div>
          </div>
        </div>

        {/* ✅ FILTER + SEARCH */}
        <div className="mb-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All" },
              { key: "customer", label: "Customers" },
              { key: "seller", label: "Sellers" },
              { key: "pending", label: "Pending" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilteredType(f.key)}
                className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                  filteredType === f.key
                    ? "bg-blue-600 border-blue-500 shadow-lg scale-[1.02]"
                    : "bg-slate-800/70 border-slate-700 hover:bg-slate-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5" size={16} />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full bg-slate-900/70 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ✅ ERROR */}
        {error && (
          <div className="mb-4 flex items-center gap-2 bg-red-900/40 border border-red-700 text-red-100 px-3 py-2 rounded-lg text-sm">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* ✅ USERS TABLE */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="animate-spin mr-2" size={22} />
              <span className="text-sm text-slate-300">Loading users...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 text-sm">
              <User size={26} className="mb-2 opacity-70" />
              <p>No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-900/90 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={index}
                      className="border-b border-slate-800 hover:bg-slate-800/50"
                    >
                      <td className="px-4 py-3">{user.name}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">{user.role}</td>
                      <td className="px-4 py-3">{getStatusBadge(user)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setRejectionReason("");
                          }}
                          className="px-3 py-1 bg-slate-800 rounded"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ✅ FULL DETAILS MODAL */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">
                  {selectedUser.name} - Details
                </h2>
                <button onClick={() => setSelectedUser(null)}>✕</button>
              </div>

              <p><b>Email:</b> {selectedUser.email}</p>
              <p><b>Role:</b> {selectedUser.role}</p>
              <p className="mt-2">{getStatusBadge(selectedUser)}</p>

              {/* ✅ DOCUMENTS */}
              <div className="mt-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText size={16} /> Documents
                </h3>

                {selectedUser.documents?.length > 0 ? (
                  selectedUser.documents.map((doc, i) => (
                    <a
                      key={i}
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-blue-400 underline text-sm mt-1"
                    >
                      {doc.type || `Document ${i + 1}`}
                    </a>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No documents uploaded</p>
                )}
              </div>

              {/* ✅ REJECTION REASON */}
              <textarea
                className="w-full mt-4 p-2 rounded bg-slate-800"
                placeholder="Enter rejection reason if rejecting"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />

              {/* ✅ ACTIONS */}
              <div className="mt-4 flex gap-2">
                <button
                  disabled={verifyLoadingId === selectedUser._id}
                  onClick={() =>
                    handleVerifySeller(selectedUser._id, "approved")
                  }
                  className="bg-green-600 px-4 py-1 rounded"
                >
                  Approve
                </button>

                <button
                  disabled={verifyLoadingId === selectedUser._id}
                  onClick={() =>
                    handleVerifySeller(selectedUser._id, "rejected")
                  }
                  className="bg-red-600 px-4 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
