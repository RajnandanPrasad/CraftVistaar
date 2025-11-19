import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function SellerSidebar() {
  const location = useLocation();

  const links = [
    { to: "/seller/dashboard", label: "Dashboard" },
    { to: "/seller/profile", label: "Profile" },
    { to: "/seller/products", label: "Products" },
    { to: "/seller/orders", label: "Orders" },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h3 className="text-xl font-bold mb-6">Seller Panel</h3>
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
