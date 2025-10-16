import React, { useState } from "react";
import axios from "axios";

export default function Signup() {
  // State to store form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      localStorage.setItem("token", res.data.token);
      alert("Signup successful!");
    } catch (error) {
      alert(error.response?.data?.msg || "Signup failed");
    }
  };

  return (
    // Full page centered container
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      {/* Signup card */}
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Create Your Account
        </h2>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
              Full Name
            </label>
            <input
              name="name"
              id="name"
              type="text"
              placeholder="Enter your name"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition-all"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
              Email Address
            </label>
            <input
              name="email"
              id="email"
              type="email"
              placeholder="Enter your email"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition-all"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              name="password"
              id="password"
              type="password"
              placeholder="Enter your password"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition-all"
              required
            />
          </div>

          {/* Role Selector */}
          <div>
            <label htmlFor="role" className="block text-gray-700 font-semibold mb-2">
              Select Role
            </label>
            <select
              name="role"
              id="role"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition-all"
            >
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            Signup
          </button>
        </form>

        {/* Optional login redirect */}
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
