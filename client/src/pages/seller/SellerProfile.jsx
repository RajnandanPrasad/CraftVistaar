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
  const [documents, setDocuments] = useState({
    aadhaar: null,
    pan: null,
    gst: null,
    shopLicense: null,
    extraDocs: [],
  });

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

  // ✅ Handle Document File Selection
  const handleDocumentChange = (e, field) => {
    const files = e.target.files;
    if (field === 'extraDocs') {
      setDocuments(prev => ({ ...prev, extraDocs: Array.from(files) }));
    } else {
      setDocuments(prev => ({ ...prev, [field]: files[0] }));
    }
  };

  // ✅ Upload Documents
  const handleDocumentUpload = async () => {
    try {
      const formData = new FormData();

      if (documents.aadhaar) formData.append('aadhaar', documents.aadhaar);
      if (documents.pan) formData.append('pan', documents.pan);
      if (documents.gst) formData.append('gst', documents.gst);
      if (documents.shopLicense) formData.append('shopLicense', documents.shopLicense);
      documents.extraDocs.forEach(file => formData.append('extraDocs', file));

      toast.loading("Uploading documents...");

      const res = await API.put("/seller/upload-documents", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.dismiss();
      toast.success("Documents uploaded successfully!");
      setProfile(prev => ({ ...prev, documents: res.data.documents }));
      setDocuments({ aadhaar: null, pan: null, gst: null, shopLicense: null, extraDocs: [] });
    } catch (error) {
      toast.dismiss();
      toast.error("Document upload failed!");
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

              {/* Document Upload Section */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Upload Documents</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Aadhaar Card</label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.pdf"
                      onChange={(e) => handleDocumentChange(e, 'aadhaar')}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">PAN Card</label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.pdf"
                      onChange={(e) => handleDocumentChange(e, 'pan')}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">GST Certificate</label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.pdf"
                      onChange={(e) => handleDocumentChange(e, 'gst')}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Shop License</label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.pdf"
                      onChange={(e) => handleDocumentChange(e, 'shopLicense')}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Extra Documents (max 5)</label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.pdf"
                      multiple
                      onChange={(e) => handleDocumentChange(e, 'extraDocs')}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={handleDocumentUpload}
                    className="w-full bg-green-600 text-white py-2 rounded-lg"
                  >
                    Upload Documents
                  </motion.button>
                </div>
              </div>
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
