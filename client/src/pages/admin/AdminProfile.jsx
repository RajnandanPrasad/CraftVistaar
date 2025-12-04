import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../../api/auth";
import API from "../../api/api";
import AdminSidebar from "../../components/admin/AdminSidebar";

export default function AdminProfile() {
  const [profile, setProfile] = useState({});
  const user = getCurrentUser();

  useEffect(() => {
    if (user && user.role === "admin") {
      API.get("/admin/profile")
        .then((res) => setProfile(res.data))
        .catch((err) => console.error(err));
    }
  }, [user]);

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-red-200">
        <div className="backdrop-blur-xl bg-white/70 p-10 rounded-2xl shadow-2xl text-center">
          <h2 className="text-3xl font-bold text-red-600">🚫 Access Denied</h2>
          <p className="text-gray-700 mt-2 text-lg">
            Admin account required
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <AdminSidebar />

      <div className="flex-1 flex items-center justify-center p-10">
        <div className="relative w-full max-w-xl rounded-3xl bg-white/70 backdrop-blur-xl shadow-2xl border border-white/30 p-10 transition-all duration-500 hover:scale-[1.02]">

          {/* Floating Glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-400 opacity-30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-400 opacity-30 rounded-full blur-3xl"></div>

          {/* Header */}
          <div className="flex items-center gap-6 border-b border-gray-200 pb-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-pink-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {profile?.name?.charAt(0) || "A"}
            </div>

            <div>
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-pink-600 text-transparent bg-clip-text">
                {profile.name || "Admin"}
              </h2>
              <p className="text-sm text-gray-600 tracking-wide">
                System Administrator
              </p>
            </div>
          </div>

          {/* Info Cards */}
          <div className="space-y-5">

            <div className="flex justify-between items-center bg-white/80 p-5 rounded-xl shadow hover:shadow-md transition">
              <span className="text-gray-600 font-semibold">👤 Name</span>
              <span className="text-gray-900 font-bold">{profile.name}</span>
            </div>

            <div className="flex justify-between items-center bg-white/80 p-5 rounded-xl shadow hover:shadow-md transition">
              <span className="text-gray-600 font-semibold">📧 Email</span>
              <span className="text-gray-900 font-bold">{profile.email}</span>
            </div>

            <div className="flex justify-between items-center bg-white/80 p-5 rounded-xl shadow hover:shadow-md transition">
              <span className="text-gray-600 font-semibold">🛡 Role</span>
              <span className="px-5 py-1.5 text-sm rounded-full font-bold bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow">
                {profile.role}
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
