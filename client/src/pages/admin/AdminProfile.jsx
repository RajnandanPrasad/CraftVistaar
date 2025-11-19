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
    return <div className="p-6 text-center">Access denied. Admin account required.</div>;
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Profile</h2>
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1 text-lg">{profile.name}</p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-lg">{profile.email}</p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <p className="mt-1 text-lg">{profile.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
