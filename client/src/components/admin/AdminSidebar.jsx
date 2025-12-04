import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AdminSidebar() {
  const { t } = useTranslation();
  const location = useLocation();

  const links = [
    { to: "/admin/dashboard", label: t("dashboard") },
    { to: "/admin/profile", label: t("profile") },
    { to: "/admin/users", label: t("users") },
    { to: "/admin/products", label: t("products") },
    { to: "/admin/orders", label: t("orders") },

    // ✅ NEW SELLER ANALYTICS LINK
    { to: "/admin/seller-analytics", label: "Seller Analytics" },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h3 className="text-xl font-bold mb-6">{t("adminPanel")}</h3>
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
