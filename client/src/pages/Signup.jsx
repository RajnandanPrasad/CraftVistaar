import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import toast, { Toaster } from "react-hot-toast";

export default function Signup() {
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

  const [aadhaar, setAadhaar] = useState(null);
  const [workImages, setWorkImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    if (aadhaar) data.append("aadhaar", aadhaar);
    workImages.forEach((img) => data.append("workImages", img));

    setLoading(true);
    try {
      await register(data, true);
      toast.success("Signup successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error.message || "Signup failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <Toaster position="top-center" />

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md transition-all hover:shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* NAME */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Full Name
            </label>
            <input
              name="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* ROLE SELECT */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Select Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          {/* ⭐ SELLER EXTRA FIELDS */}
          {formData.role === "seller" && (
            <div className="space-y-5 p-4 border rounded-lg bg-blue-50">

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Mobile Number
                </label>
                <input
                  name="mobile"
                  placeholder="Enter mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Work Address
                </label>
                <input
                  name="workAddress"
                  placeholder="Enter your work address"
                  value={formData.workAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Upload Aadhaar Card
                </label>
                <input
                  type="file"
                  onChange={(e) => setAadhaar(e.target.files[0])}
                  accept="image/*,application/pdf"
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Upload Work Images (1–3)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setWorkImages([...e.target.files])}
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Account Number
                </label>
                <input
                  name="accountNumber"
                  placeholder="Enter account number"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  IFSC Code
                </label>
                <input
                  name="ifsc"
                  placeholder="Enter IFSC code"
                  value={formData.ifsc}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Bank Name
                </label>
                <input
                  name="bankName"
                  placeholder="Enter bank name"
                  value={formData.bankName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold text-white ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>

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
