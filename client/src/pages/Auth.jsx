import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api/auth";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { user } = await login({ email: formData.email, password: formData.password });
        toast.success("Login successful! Redirecting...");
        setTimeout(() => {
          if (user.role === "customer") navigate("/products");
          else if (user.role === "seller") navigate("/seller");
          else if (user.role === "admin") navigate("/admin");
        }, 1500);
      } else {
        if (formData.password.length < 6) {
          toast.error("Password must be at least 6 characters long");
          setLoading(false);
          return;
        }
        const { user } = await register(formData);
        toast.success("Signup successful!");
        if (user.role === "seller") {
          toast("Awaiting admin verification to add products.", { duration: 4000 });
        }
        setTimeout(() => {
          if (user.role === "customer") navigate("/products");
          else if (user.role === "seller") navigate("/seller");
          else if (user.role === "admin") navigate("/admin");
        }, 2000);
      }
    } catch (error) {
      toast.error(error.message || `${isLogin ? "Login" : "Signup"} failed. Try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md transition-transform hover:scale-[1.01]">
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 rounded-l-lg font-semibold ${isLogin ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 rounded-r-lg font-semibold ${!isLogin ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Signup
          </button>
        </div>

        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          {isLogin ? "Login to Your Account" : "Create Your Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                Full Name
              </label>
              <input
                name="name"
                id="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
              Email Address
            </label>
            <input
              name="email"
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              name="password"
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition-all"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="role" className="block text-gray-700 font-semibold mb-2">
                Select Role
              </label>
              <select
                name="role"
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition-all"
              >
                <option value="customer">Customer</option>
                <option value="seller">Seller</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-2 rounded-lg transition-all ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (isLogin ? "Logging in..." : "Signing up...") : (isLogin ? "Login" : "Signup")}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline font-medium"
          >
            {isLogin ? "Sign up here" : "Login here"}
          </button>
        </p>
      </div>
    </div>
  );
}
