import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../../api/auth";
import API from "../../api/api";
import SellerSidebar from "../../components/seller/SellerSidebar";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

export default function SellerProfile() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  const user = getCurrentUser();

  // ✅ Load Profile (Refresh-Safe)
  useEffect(() => {
    if (user && user.role === "seller") {
      API.get("/seller/profile")
        .then((res) => {
          setProfile(res.data);
          setFormData({
            name: res.data.name,
            email: res.data.email,
          });
          setAvatarUrl(res.data.avatarUrl || "");
          setLoading(false);
        })
        .catch(() => {
          toast.error("Failed to load profile");
          setLoading(false);
        });
    }
  }, [user]);

  // ✅ Cloudinary Upload (Final Working)
  const uploadToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: data }
    );

    const result = await res.json();

    if (result.secure_url) return result.secure_url;
    if (result.public_id) {
      return `https://res.cloudinary.com/${cloudName}/image/upload/${result.public_id}.jpg`;
    }

    throw new Error("Image URL not found");
  };

  // ✅ Image Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      toast.loading("Uploading...");
      const imageUrl = await uploadToCloudinary(file);

      setAvatarUrl(imageUrl);
      setProfile((prev) => ({ ...prev, avatarUrl: imageUrl }));

      toast.dismiss();
      toast.success("Image uploaded!");
    } catch (err) {
      toast.dismiss();
      toast.error("Upload failed!");
    }
  };

  // ✅ Update Profile
  const handleUpdateProfile = async () => {
    try {
      const updatedData = { ...formData };
      if (avatarUrl) updatedData.avatarUrl = avatarUrl;

      await API.put("/seller/profile", updatedData);

      toast.success("Profile updated!");
      setProfile((prev) => ({ ...prev, ...updatedData }));
      setShowModal(false);
    } catch {
      toast.error("Update failed!");
    }
  };

  if (!user || user.role !== "seller") {
    return <div className="p-10 text-center">Access Denied</div>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <SellerSidebar />
      <Toaster position="top-right" />

      <div className="flex-1 p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
            <h2 className="text-3xl font-bold text-white">Seller Profile</h2>
          </div>

          {/* ✅ Profile Pic (FINAL FIXED STYLE) */}
          <div className="flex flex-col items-center mt-6">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-500 flex items-center justify-center bg-white">
              <img
                src={
                  avatarUrl ||
                  profile.avatarUrl ||
                  "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                }
                className="w-full h-full object-cover block"
                alt="Profile"
              />
            </div>

            <label className="mt-3 cursor-pointer bg-indigo-600 text-white px-4 py-1 rounded-lg">
              Upload Photo
              <input type="file" hidden onChange={handleImageUpload} />
            </label>
          </div>

          {/* Data */}
          {loading ? (
            <div className="p-6 space-y-4 animate-pulse">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
            </div>
          ) : (
            <div className="p-6 space-y-5">
              <Row title="Name" value={profile.name} />
              <Row title="Email" value={profile.email} />
              <Row title="Role" value={profile.role} />
              <Row
                title="Status"
                value={profile.isVerified ? "Verified" : "Not Verified"}
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowModal(true)}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg"
              >
                Edit Profile
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>

      {/* ✅ Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white p-6 rounded-xl w-96"
          >
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

            <input
              type="text"
              placeholder="Name"
              className="border p-2 w-full mb-3 rounded"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              className="border p-2 w-full mb-3 rounded"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleUpdateProfile}
                className="bg-indigo-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

const Row = ({ title, value }) => (
  <div className="flex justify-between border-b pb-2">
    <span className="text-gray-500">{title}</span>
    <span className="font-semibold">{value}</span>
  </div>
);
