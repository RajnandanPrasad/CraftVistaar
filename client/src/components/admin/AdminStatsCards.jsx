import React from "react";

export default function AdminStatsCards({ stats }) {
  const cards = [
    { title: "Total Users", value: stats.totalUsers, icon: "👥" },
    { title: "Total Products", value: stats.totalProducts, icon: "📦" },
    { title: "Total Orders", value: stats.totalOrders, icon: "📋" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-4xl mb-2">{card.icon}</div>
          <h3 className="text-lg font-semibold text-gray-700">{card.title}</h3>
          <p className="text-2xl font-bold text-gray-900">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
