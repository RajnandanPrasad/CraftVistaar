import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import logo from "../assets/logo.webp";
import { ShoppingCart, LogOut, ChevronDown } from "lucide-react";
import { useCart } from "../context/CartContext";
import { logout, getCurrentUser } from "../api/auth";
import { getCategories } from "../api/products";
import toast from "react-hot-toast";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  // ✅ include clearCart to reset cart on logout
  const { getTotalItems, clearCart } = useCart();
  const cartCount = getTotalItems();

  const user = getCurrentUser();
  const navigate = useNavigate();
  const categoryRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getCategories();
        if (cats.length > 0) {
          setCategories(cats);
        } else {
          setCategories([
            "Jewelry",
            "Home Decor",
            "Clothing & Accessories",
            "Art & Prints",
            "Gifts & Stationery",
            "Trending",
            "New Arrivals",
            "Eco-Friendly",
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([
          "Jewelry",
          "Home Decor",
          "Clothing & Accessories",
          "Art & Prints",
          "Gifts & Stationery",
          "Trending",
          "New Arrivals",
          "Eco-Friendly",
        ]);
      }
    };
    fetchCategories();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Fix: Clear cart on logout
  const handleLogout = () => {
    logout(); // remove user token/session
    clearCart(); // clear cart items from context/localStorage
    toast.success("Logged out successfully");
    navigate("/");
    setDropdownOpen(false);
  };

  const getRoleBasedLinks = () => {
    if (!user) return [];

    const links = [
      { to: "/", label: "Home" },
      { to: "/products", label: "Products" },
    ];

    if (user.role === "seller") links.push({ to: "/seller", label: "Seller Dashboard" });
    if (user.role === "admin") links.push({ to: "/admin", label: "Admin Dashboard" });

    return links;
  };

  const getDropdownLinks = () => {
    const links = [{ to: "/profile", label: "Profile" }];
    if (user.role === "customer") links.push({ to: "/orders", label: "My Orders" });
    if (user.role === "seller") links.push({ to: "/seller", label: "Add Product" });
    if (user.role === "admin") links.push({ to: "/admin", label: "Dashboard" });
    return links;
  };

  const getInitials = (name) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 bg-white shadow-md sticky top-0 z-50">
      {/* Left - Logo and Desktop Category */}
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="CraftKart Logo"
            className="h-14 w-14 rounded-full object-cover shadow-lg hover:scale-110 transition-all duration-200"
          />
        </Link>

        {/* Desktop Category Dropdown */}
        <div className="relative hidden md:block" ref={categoryRef}>
          <button
            onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
            className={`text-2xl font-bold flex items-center gap-1 transition-colors duration-200 ${
              categoryDropdownOpen ? "text-blue-600" : "text-gray-800 hover:text-blue-500"
            }`}
          >
            Category
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-300 ${
                categoryDropdownOpen ? "rotate-180 text-blue-600" : ""
              }`}
            />
          </button>

          {categoryDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-60 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden transition-all duration-300 animate-fadeIn">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      navigate(`/category/${encodeURIComponent(category)}`);
                      setCategoryDropdownOpen(false);
                    }}
                    className="block w-full text-left px-5 py-2.5 text-gray-700 text-sm hover:bg-blue-50 hover:text-blue-600 transition-all duration-150"
                  >
                    {category}
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">No categories available</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Middle - Search */}
      <div className="flex-1 mx-6 max-w-lg hidden md:block">
        <SearchBar />
      </div>

      {/* Right - Links */}
      <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
        {getRoleBasedLinks().map((link) => (
          <Link key={link.to} to={link.to} className="hover:text-blue-500">
            {link.label}
          </Link>
        ))}

        {!user ? (
          <Link to="/auth" className="hover:text-blue-500">
            Login/Signup
          </Link>
        ) : (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-full"
            >
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {getInitials(user.name)}
                </div>
              )}
              <ChevronDown className="w-4 h-4" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                {getDropdownLinks().map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* Cart */}
        <Link to="/cart" className="relative flex items-center hover:text-blue-600">
          <ShoppingCart className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* Hamburger - Mobile */}
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

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center py-4 space-y-3 md:hidden">
          <div className="relative w-full flex justify-center">
            <button
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              className="text-xl font-bold text-gray-800 hover:text-blue-500 flex items-center gap-1"
            >
              Category
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${categoryDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {categoryDropdownOpen && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-60 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      navigate(`/category/${encodeURIComponent(category)}`);
                      setCategoryDropdownOpen(false);
                      setMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-150"
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          {getRoleBasedLinks().map((link) => (
            <Link key={link.to} to={link.to} className="hover:text-blue-500" onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}

          {!user ? (
            <Link to="/auth" className="hover:text-blue-500" onClick={() => setMenuOpen(false)}>
              Login/Signup
            </Link>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {getInitials(user.name)}
                  </div>
                )}
                <span className="text-sm text-gray-600">
                  {user.name} ({user.role})
                </span>
              </div>
              {getDropdownLinks().map((link) => (
                <Link key={link.to} to={link.to} className="hover:text-blue-500" onClick={() => setMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
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

          {/* Cart */}
          <Link to="/cart" onClick={() => setMenuOpen(false)} className="flex items-center gap-1 text-gray-700 hover:text-blue-600">
            <ShoppingCart className="w-5 h-5" /> <span>Cart ({cartCount})</span>
          </Link>

          <div className="w-11/12 border-t border-gray-200 my-2"></div>
          <div className="w-11/12"><SearchBar /></div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
