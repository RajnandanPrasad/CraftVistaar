import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function SellerSidebar({ onLinkClick }) {
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
    <div className="w-64 bg-gray-900 text-white p-4 min-h-full">
      <div className="mb-6 border-b border-white/10 pb-4">
        <h3 className="text-xl font-bold">{t("sellerPanel")}</h3>
        <p className="text-sm text-slate-300 mt-1">Control panel for your shop.</p>
      </div>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              onClick={onLinkClick}
              className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                location.pathname === link.to
                  ? "bg-blue-600 text-white"
                  : "text-slate-200 hover:bg-slate-800 hover:text-white"
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
