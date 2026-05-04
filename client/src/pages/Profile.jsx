import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const user = getCurrentUser(); // fallback (keep this)
  const [userData, setUserData] = useState(null); // ✅ NEW
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

    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/me"); // ✅ FETCH LATEST USER
        setUserData(res.data);
      } catch (err) {
        console.error("User fetch error", err);
      }
    };

    fetchOrders();
    fetchUser();
  }, []);

  if (!user) {
    return <div className="text-center mt-10 text-red-500">Please Login First</div>;
  }

  // ✅ use fresh user if available
  const currentUser = userData || user;

  const totalOrdersCount = totalOrders || 0;
  const memberSince = currentUser.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString()
    : "-";

  const coins = currentUser.coins || 0;
  const rupees = Math.floor(coins / 10); // 💰 conversion

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white shadow-2xl">
          <h2 className="text-2xl font-bold md:text-3xl">My Profile</h2>
          <p className="mt-2 text-sm md:text-base text-indigo-100/90">
            Welcome back, {currentUser.name}. Manage your account and track your orders.
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-xl">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-6 rounded-[24px] bg-slate-50 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white shadow-lg">
                  {currentUser.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 md:text-2xl">
                    {currentUser.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 md:text-base">
                    {currentUser.email}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    Role: {currentUser.role}
                  </p>
                </div>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                
                {/* TOTAL ORDERS */}
                <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
                  <p className="text-3xl font-bold text-blue-600">
                    {totalOrdersCount}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">Total Orders</p>
                </div>

                {/* ACCOUNT STATUS */}
                <div className="rounded-3xl bg-green-50 p-4 text-center shadow-sm">
                  <p className="text-xl font-semibold text-green-600">Active</p>
                  <p className="mt-2 text-sm text-slate-500">Account Status</p>
                </div>

                {/* MEMBER SINCE */}
                <div className="rounded-3xl bg-purple-50 p-4 text-center shadow-sm">
                  <p className="text-xl font-semibold text-purple-600">
                    {memberSince}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">Member Since</p>
                </div>

                {/* 🪙 COINS CARD */}
                <div className="rounded-3xl bg-yellow-50 p-4 text-center shadow-sm">
                  <p className="text-2xl font-bold text-yellow-600">
                    🪙 {coins}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">Craft Coins</p>
                  <p className="text-xs text-gray-500 mt-1">
                    ≈ ₹{rupees}
                  </p>
                </div>

              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() => navigate("/orders")}
                className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                View My Orders
              </button>

              <button
                onClick={() => navigate("/")}
                className="w-full rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;