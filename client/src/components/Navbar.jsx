import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import logo from "../assets/logo.webp";
import { ShoppingCart, LogOut, User } from "lucide-react";
import { useCart } from "../context/CartContext";
import { logout, getCurrentUser } from "../api/auth";
import toast from "react-hot-toast";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const cartCount = getTotalItems();
  const user = getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const getRoleBasedLinks = () => {
    if (!user) return [];

    const links = [
      { to: "/", label: "Home" },
      { to: "/products", label: "Products" },
    ];

    if (user.role === "seller") {
      links.push({ to: "/seller", label: "Seller Dashboard" });
    }

    if (user.role === "admin") {
      links.push({ to: "/admin", label: "Admin Dashboard" });
    }

    return links;
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 bg-white shadow-md sticky top-0 z-50">
      {/* Left - Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img
          src={logo}
          alt="CraftKart Logo"
          className="h-10 w-10 rounded-full object-cover"
        />
        <h1 className="text-2xl font-bold text-gray-800">CraftKart</h1>
      </Link>

      {/* Middle - Search (Hidden on small screens) */}
      <div className="flex-1 mx-6 max-w-lg hidden md:block">
        <SearchBar />
      </div>

      {/* Right - Links (Hidden on small screens) */}
      <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
        {getRoleBasedLinks().map((link) => (
          <Link key={link.to} to={link.to} className="hover:text-blue-500">
            {link.label}
          </Link>
        ))}

        {!user ? (
          <>
            <Link to="/login" className="hover:text-blue-500">Login</Link>
            <Link to="/signup" className="hover:text-blue-500">Signup</Link>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              <User className="inline w-4 h-4 mr-1" />
              {user.name} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}

        {/* 🛒 Cart Icon */}
        <Link to="/cart" className="relative flex items-center hover:text-blue-600">
          <ShoppingCart className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* Hamburger Icon (Visible only on mobile) */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden flex items-center justify-center text-gray-700"
      >
        {menuOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center py-4 space-y-3 md:hidden">
          {getRoleBasedLinks().map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="hover:text-blue-500"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {!user ? (
            <>
              <Link to="/login" className="hover:text-blue-500" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="hover:text-blue-500" onClick={() => setMenuOpen(false)}>Signup</Link>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm text-gray-600">
                <User className="inline w-4 h-4 mr-1" />
                {user.name} ({user.role})
              </span>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-1 text-red-600 hover:text-red-700"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}

          {/* 🛒 Cart (mobile) */}
          <Link
            to="/cart"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Cart ({cartCount})</span>
          </Link>

          <div className="w-11/12 border-t border-gray-200 my-2"></div>

          {/* SearchBar inside mobile menu */}
          <div className="w-11/12">
            <SearchBar />
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
