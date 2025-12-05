import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../../api/auth";
import { fetchSellerAnalytics } from "../../api/sellers";
import toast from "react-hot-toast";
import SellerSidebar from "../../components/seller/SellerSidebar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdvancedAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    pendingPayout: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    monthlySales: [],
    topProduct: null,
  });

  const user = getCurrentUser();

  useEffect(() => {
    if (user && user.role === "seller") {
      fetchSellerAnalytics()
        .then(res => setAnalytics(res))
        .catch(err => {
          console.error(err);
          toast.error("Failed to load analytics data");
        });
    }
  }, [user]);

  if (!user || user.role !== "seller") {
    return <div className="p-6 text-center">Access denied.</div>;
  }

  return (
    <div className="flex">
      <SellerSidebar />
      <div className="flex-1 p-6">
        <h2 className="text-3xl font-bold mb-6">Advanced Analytics</h2>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-100 p-4 rounded-lg shadow">
            <h4 className="text-lg font-semibold text-green-800">Total Revenue</h4>
            <p className="text-2xl font-bold text-green-600">₹{(analytics.totalRevenue || 0).toLocaleString()}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg shadow">
            <h4 className="text-lg font-semibold text-yellow-800">Pending Payout</h4>
            <p className="text-2xl font-bold text-yellow-600">₹{(analytics.pendingPayout || 0).toLocaleString()}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg shadow">
            <h4 className="text-lg font-semibold text-blue-800">Delivered Orders</h4>
            <p className="text-2xl font-bold text-blue-600">{analytics.deliveredOrders || 0}</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg shadow">
            <h4 className="text-lg font-semibold text-red-800">Cancelled Orders</h4>
            <p className="text-2xl font-bold text-red-600">{analytics.cancelledOrders || 0}</p>
          </div>
        </div>

        {/* Monthly Sales Graph */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h4 className="text-xl font-semibold mb-4">Monthly Sales</h4>
          {analytics.monthlySales.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.monthlySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Sales']} />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center">No sales data available</p>
          )}
        </div>

        {/* Top Selling Product */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h4 className="text-xl font-semibold mb-4">Top Selling Product</h4>
          {analytics.topProduct ? (
            <div className="flex items-center space-x-4">
              <div>
                <h5 className="text-lg font-medium">{analytics.topProduct.name}</h5>
                <p className="text-gray-600">Units Sold: {analytics.topProduct.totalSold || 0}</p>
                <p className="text-green-600 font-semibold">Revenue: ₹{(analytics.topProduct.totalRevenue || 0).toLocaleString()}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No sales data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
