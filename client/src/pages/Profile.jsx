import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders/my");
        setTotalOrders(res.data.length || 0);
      } catch (err) {
        console.error("Order fetch error", err);
      }
    };

    fetchOrders();
  }, []);

  if (!user) {
    return <div className="text-center mt-10 text-red-500">Please Login First</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 py-10 px-4">

      {/* Top Banner */}
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-bold">My Profile</h2>
        <p className="text-sm opacity-90">Welcome, {user.name}</p>
      </div>

      {/* Profile Card */}
      <div className="max-w-4xl mx-auto bg-white mt-[-40px] rounded-xl shadow-xl p-6">

        <div className="flex flex-col sm:flex-row items-center gap-6">

          {/* Avatar */}
          <div className="w-28 h-28 bg-blue-600 text-white rounded-full flex items-center justify-center text-4xl font-bold shadow-lg">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          {/* User Info */}
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-2xl font-semibold">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500 capitalize">Role: {user.role}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-xl font-bold text-blue-600">{totalOrders}</p>
            <p className="text-sm text-gray-600">Total Orders</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-xl font-bold text-green-600">Active</p>
            <p className="text-sm text-gray-600">Account Status</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <p className="text-xl font-bold text-purple-600">
              {new Date(user.createdAt || Date.now()).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">Member Since</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={() => navigate("/orders")}
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            View My Orders
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-100"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
