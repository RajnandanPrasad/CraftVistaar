import React from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import logo from "../assets/logo.webp"; // make sure the image exists

function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 bg-white shadow-md sticky top-0 z-50">
      
      {/* Left - Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img src={logo} alt="CraftKart Logo" className="h-20 w-20 rounded-full object-cover" />
        
      </Link>

      {/* Middle - Search */}
      <div className="flex-1 mx-6 max-w-lg">
        <SearchBar />
      </div>

      {/* Right - Links */}
      <div className="flex items-center gap-6 text-gray-700 font-medium">
        <Link to="/products" className="hover:text-blue-500">Products</Link>
        <Link to="/login" className="hover:text-blue-500">Login</Link>
        <Link to="/singup" className="hover:text-blue-500">Signup</Link>
      </div>
    </nav>
  );
}

export default Navbar;
