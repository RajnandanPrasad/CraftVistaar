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

    // seller fields
    mobile: "",
    workAddress: "",
    accountNumber: "",
    ifsc: "",
    bankName: "",
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
          if (user.role === "seller") navigate("/seller");
          if (user.role === "admin") navigate("/admin");
        }, 1500);

      } else {
        if (formData.password.length < 6) {
          toast.error("Password must be at least 6 characters long");
          setLoading(false);
          return;
        }

        // Send only JSON data (no files) to register
        const { user } = await register(formData);

        toast.success("Signup successful!");
        if (user.role === "seller") {
          toast("Please upload your documents to complete verification.", { duration: 4000 });
        }

        setTimeout(() => {
          if (user.role === "customer") navigate("/products");
          if (user.role === "seller") navigate("/seller");
          if (user.role === "admin") navigate("/admin");
        }, 2000);
      }
    } catch (error) {
      toast.error(error.message || `${isLogin ? "Login" : "Signup"} failed.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <Toaster position="top-center" />

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

          {/* NAME (signup only) */}
          {!isLogin && (
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
          )}

          {/* EMAIL */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {/* ROLE (signup only) */}
          {!isLogin && (
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Select Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="customer">Customer</option>
                <option value="seller">Seller</option>
              </select>
            </div>
          )}

          {/* ⭐ SELLER ONLY FIELDS */}
          {!isLogin && formData.role === "seller" && (
            <div className="space-y-4 bg-blue-50 p-4 border rounded-lg">

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Mobile Number</label>
                <input
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Work Address</label>
                <input
                  name="workAddress"
                  value={formData.workAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>



              <div>
                <label className="block text-gray-700 font-semibold mb-1">Account Number</label>
                <input
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">IFSC Code</label>
                <input
                  name="ifsc"
                  value={formData.ifsc}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Bank Name</label>
                <input
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-2 rounded-lg transition-all ${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (isLogin ? "Logging in..." : "Signing up...") : (isLogin ? "Login" : "Signup")}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 hover:underline font-medium">
            {isLogin ? "Sign up here" : "Login here"}
          </button>
        </p>
      </div>
    </div>
  );
}
