import React, { useEffect, useState } from "react";
import API from "../../api/api"; // <- apne project ke hisaab se correct path rakho
import { useTranslation } from "react-i18next";
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
  const [filteredType, setFilteredType] = useState("all"); // all | customer | seller | pending
  const [selectedUser, setSelectedUser] = useState(null); // seller details modal
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifyLoadingId, setVerifyLoadingId] = useState(null);
  const [error, setError] = useState("");

  // 🔴 New: rejection reason (for reject action)
  const [rejectionReason, setRejectionReason] = useState("");

  // ✅ Users fetch
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

  // ✅ Verification handler (Approve / Reject from modal)
  const handleVerifySeller = async (userId, status) => {
    // Rejection reason required for "rejected"
    if (status === "rejected" && !rejectionReason.trim()) {
      alert("Please enter a rejection reason before rejecting the seller.");
      return;
    }

    try {
      setVerifyLoadingId(userId);

      await API.patch(`/admin/users/${userId}/verify`, {
        status,
        reason: status === "rejected" ? rejectionReason.trim() : undefined,
        notify: true, // 🔔 backend: send email/SMS & log audit
      });

      // Frontend state update
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId
            ? {
                ...u,
                sellerVerificationStatus: status,
              }
            : u
        )
      );

      // If modal open and same user -> update there too
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser((prev) => ({
          ...prev,
          sellerVerificationStatus: status,
        }));
      }

      // Approve ke baad rejection reason clear
      if (status === "approved") {
        setRejectionReason("");
      }
    } catch (err) {
      console.error(err);
      alert("Verification failed. Please try again.");
    } finally {
      setVerifyLoadingId(null);
    }
  };

  // ✅ Filter + Search logic
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
      search.trim().length === 0
        ? true
        : (user.name || "").toLowerCase().includes(search.toLowerCase()) ||
          (user.email || "").toLowerCase().includes(search.toLowerCase());

    return byType && bySearch;
  });

  const getStatusBadge = (user) => {
    if (user.role !== "seller")
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700">
          {t("customer") || "Customer"}
        </span>
      );

    const status = user.sellerVerificationStatus || "pending";

    if (status === "approved") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700">
          <ShieldCheck size={14} />
          {t("verifiedSeller") || "Verified Seller"}
        </span>
      );
    }

    if (status === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
          <XCircle size={14} />
          {t("rejected") || "Rejected"}
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
        <AlertCircle size={14} />
        {t("pendingVerification") || "Pending Verification"}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-6">
      {/* Header */}
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

      {/* Filters + Search */}
      <div className="mb-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: t("allUsers") || "All" },
            { key: "customer", label: t("customers") || "Customers" },
            { key: "seller", label: t("sellers") || "Sellers" },
            { key: "pending", label: t("pending") || "Pending" },
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

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5" size={16} />
          <input
            type="text"
            placeholder={
              t("searchByNameOrEmail") || "Search by name or email..."
            }
            className="w-full bg-slate-900/70 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 flex items-center gap-2 bg-red-900/40 border border-red-700 text-red-100 px-3 py-2 rounded-lg text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Users Table / List */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="animate-spin mr-2" size={22} />
            <span className="text-sm text-slate-300">
              {t("loadingUsers") || "Loading users..."}
            </span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 text-sm">
            <User size={26} className="mb-2 opacity-70" />
            <p>{t("noUsersFound") || "No users found for this filter/search."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/90 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">
                    {t("name") || "Name"}
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">
                    {t("email") || "Email"}
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">
                    {t("role") || "Role"}
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">
                    {t("status") || "Status"}
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">
                    {t("actions") || "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user._id || index}
                    className={`border-b border-slate-800/70 hover:bg-slate-800/50 transition ${
                      index % 2 === 0 ? "bg-slate-900/40" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold">
                          {user.name || "N/A"}
                        </span>
                        {(user.mobile || user.phone) && (
                          <span className="text-xs text-slate-400">
                            {user.mobile || user.phone}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-200">
                      {user.email || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs rounded-full bg-slate-800 border border-slate-700">
                        {user.role?.toUpperCase() || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(user)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {/* View Details - Approve/Reject sirf modal me */}
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setRejectionReason(""); // reset on open
                          }}
                          className="px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 transition"
                        >
                          {t("viewDetails") || "View Details"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ✅ User Details & Documents Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950/80">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <User size={18} />
                  <span>{selectedUser.name || "User Details"}</span>
                </h2>
                <p className="text-xs text-slate-400">{selectedUser.email}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setRejectionReason("");
                }}
                className="text-slate-400 hover:text-white text-xl leading-none px-2"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 overflow-y-auto max-h-[70vh]">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 text-xs">
                  <p className="text-slate-400">{t("name") || "Name"}</p>
                  <p className="font-semibold">{selectedUser.name || "N/A"}</p>
                </div>
                <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 text-xs">
                  <p className="text-slate-400">{t("email") || "Email"}</p>
                  <p className="font-semibold">{selectedUser.email || "N/A"}</p>
                </div>
                <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 text-xs">
                  <p className="text-slate-400">{t("role") || "Role"}</p>
                  <p className="font-semibold">
                    {selectedUser.role?.toUpperCase() || "N/A"}
                  </p>
                </div>
                {(selectedUser.mobile || selectedUser.phone) && (
                  <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 text-xs">
                    <p className="text-slate-400">{t("phone") || "Phone"}</p>
                    <p className="font-semibold">
                      {selectedUser.mobile || selectedUser.phone || "N/A"}
                    </p>
                  </div>
                )}
              </div>

              {/* Seller Extra Info */}
              {selectedUser.role === "seller" && (
                <>
                  {/* KYC / business details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedUser.workAddress && (
                      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 text-xs">
                        <p className="text-slate-400">Work Address</p>
                        <p className="font-semibold">
                          {selectedUser.workAddress}
                        </p>
                      </div>
                    )}
                    {selectedUser.accountNumber && (
                      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 text-xs">
                        <p className="text-slate-400">Account Number</p>
                        <p className="font-semibold">
                          {selectedUser.accountNumber}
                        </p>
                      </div>
                    )}
                    {selectedUser.ifsc && (
                      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 text-xs">
                        <p className="text-slate-400">IFSC</p>
                        <p className="font-semibold">
                          {selectedUser.ifsc}
                        </p>
                      </div>
                    )}
                    {selectedUser.bankName && (
                      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 text-xs">
                        <p className="text-slate-400">Bank Name</p>
                        <p className="font-semibold">
                          {selectedUser.bankName}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 text-xs">
                    <p className="text-slate-400">
                      {t("verificationStatus") || "Verification Status"}
                    </p>
                    <div className="mt-1">{getStatusBadge(selectedUser)}</div>
                  </div>

                  {/* Audit trail (if backend send these fields) */}
                  {(selectedUser.verifiedByName ||
                    selectedUser.verifiedBy ||
                    selectedUser.verifiedByEmail ||
                    selectedUser.verifiedAt) && (
                    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 text-xs">
                      <p className="text-slate-400 mb-1">
                        {t("verificationAudit") || "Verification Audit"}
                      </p>
                      {selectedUser.verifiedByName && (
                        <p>
                          {t("verifiedBy") || "Verified by"}:{" "}
                          <span className="font-semibold">
                            {selectedUser.verifiedByName}
                          </span>
                        </p>
                      )}
                      {!selectedUser.verifiedByName &&
                        (selectedUser.verifiedBy ||
                          selectedUser.verifiedByEmail) && (
                          <p>
                            {t("verifiedBy") || "Verified by"}:{" "}
                            <span className="font-semibold">
                              {selectedUser.verifiedBy ||
                                selectedUser.verifiedByEmail}
                            </span>
                          </p>
                        )}
                      {selectedUser.verifiedAt && (
                        <p className="text-[11px] text-slate-400 mt-1">
                          {t("verifiedAt") || "Verified at"}:{" "}
                          {new Date(selectedUser.verifiedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Documents */}
                  <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 text-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText size={16} />
                      <p className="font-semibold">
                        {t("uploadedDocuments") || "Uploaded Documents"}
                      </p>
                    </div>

                    {selectedUser.documents &&
                    selectedUser.documents.length > 0 ? (
                      <div className="space-y-2">
                        {selectedUser.documents.map((doc, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2"
                          >
                            <div>
                              <p className="font-medium text-xs">
                                {doc.type || `Document ${idx + 1}`}
                              </p>
                              {doc.number && (
                                <p className="text-[11px] text-slate-400">
                                  {doc.number}
                                </p>
                              )}
                            </div>
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] underline hover:text-blue-400"
                            >
                              {t("view") || "View"}
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400">
                        {t("noDocuments") ||
                          "No documents uploaded by this seller."}
                      </p>
                    )}
                  </div>

                  {/* Rejection Reason Input */}
                  <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 text-xs">
                    <p className="text-slate-400 mb-1">
                      {t("rejectionReason") ||
                        "Rejection Reason (required if rejecting)"}
                    </p>
                    <textarea
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-lg px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-red-500 min-h-[60px]"
                      placeholder={
                        t("rejectionReasonPlaceholder") ||
                        "Example: Documents are not clear, please upload a better scanned copy."
                      }
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      This reason will help the seller understand what to fix.
                    </p>
                  </div>

                  {/* Approve / Reject from modal */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-1">
                    <p className="text-[11px] text-slate-400">
                      On approval, backend can send SMS/Email and store which
                      admin verified this seller.
                    </p>

                    <div className="flex gap-2">
                      {(() => {
                        const status =
                          selectedUser.sellerVerificationStatus || "pending";
                        const isApproved = status === "approved";
                        const isRejected = status === "rejected";

                        return (
                          <>
                            <button
                              disabled={
                                verifyLoadingId === selectedUser._id ||
                                isApproved
                              }
                              onClick={() =>
                                handleVerifySeller(selectedUser._id, "approved")
                              }
                              className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg transition ${
                                isApproved
                                  ? "bg-emerald-700/60 cursor-not-allowed opacity-70"
                                  : "bg-emerald-600 hover:bg-emerald-500"
                              } ${
                                verifyLoadingId === selectedUser._id
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              {verifyLoadingId === selectedUser._id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <CheckCircle2 size={14} />
                              )}
                              {isApproved
                                ? t("alreadyApproved") || "Already Approved"
                                : t("approve") || "Approve"}
                            </button>

                            <button
                              disabled={
                                verifyLoadingId === selectedUser._id ||
                                isRejected
                              }
                              onClick={() =>
                                handleVerifySeller(selectedUser._id, "rejected")
                              }
                              className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg transition ${
                                isRejected
                                  ? "bg-red-700/60 cursor-not-allowed opacity-70"
                                  : "bg-red-600 hover:bg-red-500"
                              } ${
                                verifyLoadingId === selectedUser._id
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              {verifyLoadingId === selectedUser._id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <XCircle size={14} />
                              )}
                              {isRejected
                                ? t("alreadyRejected") || "Already Rejected"
                                : t("reject") || "Reject"}
                            </button>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
