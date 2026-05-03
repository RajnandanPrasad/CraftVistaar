import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SearchBar from "./SearchBar";
import CategoryBar from "./CategoryBar";
import logo from "../assets/logo.webp";
import {
  ShoppingCart,
  ChevronDown,
  MapPin,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { logout } from "../api/auth";
import { useUser } from "../context/useUser";
import toast from "react-hot-toast";

function Navbar() {
  const { t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { getTotalItems, clearCart } = useCart();
  const cartCount = getTotalItems();

  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUser(null);
    clearCart();
    toast.success(t("loggedOutSuccessfully"));
    navigate("/");
    setDropdownOpen(false);
  };

  // ✅ YAHI NAYA PART HAI – ROLE BASED PROFILE LINKS
  const getDropdownLinks = () => {
    if (!user) return [];

    let links = [];

    // CUSTOMER
    if (user.role === "customer") {
      links.push({ to: "/profile", label: t("profile") });
      links.push({ to: "/orders", label: t("myOrders") });
    }

    // SELLER
    if (user.role === "seller") {
      links.push({ to: "/seller/profile", label: t("profile") });
      links.push({ to: "/seller", label: t("addProduct") });
    }

    // ADMIN
    if (user.role === "admin") {
      links.push({ to: "/admin/profile", label: t("profile") });
      links.push({ to: "/admin", label: t("dashboard") });
    }

    return links;
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-3">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-3">
                <img
                  src={logo}
                  alt="Craft Vister Logo"
                  className="h-14 w-14 rounded-full object-cover shadow-lg"
                />
                <div className="hidden sm:block">
                  <p className="text-sm text-slate-500">Craft Vister</p>
                  <p className="text-xs text-slate-400">Marketplace for handmade goods</p>
                </div>
              </Link>
            </div>

            <div className="flex-1 min-w-0 md:mx-4">
              <SearchBar />
            </div>

            <div className="flex flex-wrap items-center gap-2 justify-end text-slate-700">
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>Deliver to your city</span>
              </div>

              <Link
                to="/cart"
                className="relative inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-slate-900">
                    {cartCount}
                  </span>
                )}
              </Link>

              {!user ? (
                <Link
                  to="/auth"
                  className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  {t("loginSignup")}
                </Link>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:shadow-md"
                  >
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt="Avatar" className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold text-white">
                        {getInitials(user.name)}
                      </div>
                    )}
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                      <div className="border-b border-slate-200 px-4 py-3 text-sm">
                        <p className="font-semibold text-slate-900">{user.name}</p>
                        <p className="text-slate-500">{user.role}</p>
                      </div>
                      {getDropdownLinks().map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          className="block px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
                          onClick={() => setDropdownOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-sm text-rose-600 transition hover:bg-slate-50"
                      >
                        {t("logout")}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <CategoryBar />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
