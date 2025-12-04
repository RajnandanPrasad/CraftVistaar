import React, { useEffect, useState } from "react";
import API from "../../api/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SellerAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await API.get("/admin/seller-analytics");
      setData(res.data);
    } catch (err) {
      console.error("Analytics Fetch Error:", err);
      alert("Seller analytics fetch failed!");
    }
  };

  if (!data) {
    return <p className="p-10">Loading Analytics...</p>;
  }

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 p-10 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-8">Seller Analytics Dashboard</h1>

        {/* ✅ TOP STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card title="Total Sellers" value={data.totalSellers} />
          <Card title="Total Orders" value={data.totalOrders} />
          <Card title="Total Revenue" value={`₹${data.totalRevenue}`} />
          <Card title="Total Profit" value={`₹${data.totalProfit}`} />
        </div>

        {/* ✅ GRAPH SECTION */}
        <div className="bg-white p-6 rounded shadow mb-10">
          <h2 className="text-xl font-semibold mb-4">
            Seller Wise Revenue Graph
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.sellers}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ✅ TABLE SECTION */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Seller Profit Table</h2>

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Seller</th>
                <th className="p-2 border">Orders</th>
                <th className="p-2 border">Revenue</th>
                <th className="p-2 border">Profit</th>
              </tr>
            </thead>
            <tbody>
              {data.sellers.map((seller) => (
                <tr key={seller._id} className="text-center">
                  <td className="p-2 border">{seller.name}</td>
                  <td className="p-2 border">{seller.orders}</td>
                  <td className="p-2 border">₹{seller.revenue}</td>
                  <td className="p-2 border font-semibold">
                    ₹{seller.profit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-6 rounded shadow text-center">
      <h3 className="text-gray-600 text-sm">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
