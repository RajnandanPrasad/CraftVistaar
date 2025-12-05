import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function SellerSidebar() {
  const { t } = useTranslation();
  const location = useLocation();

  const links = [
    { to: "/seller/dashboard", label: t("dashboard") },
    { to: "/seller/profile", label: t("profile") },
    { to: "/seller/products", label: t("products") },
    { to: "/seller/orders", label: t("orders") },
    { to: "/seller/learn", label: "📘 " + t("learn & Grow") },
    { to: "/seller/advanced-analytics", label: "📊 Advanced Analytics" },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h3 className="text-xl font-bold mb-6">{t("sellerPanel")}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className={`block py-2 px-4 rounded ${
                location.pathname === link.to
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
