import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../../api/auth";
import API from "../../api/api";
import SellerLayout from "../../components/layouts/SellerLayout";
import { useUser } from "../../context/useUser";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

export default function SellerProfile() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [documents, setDocuments] = useState({
    aadhaar: null,
    pan: null,
    gst: null,
    shopLicense: null,
    extraDocs: [],
  });

  const user = getCurrentUser();
  const { setUser } = useUser();
  const MotionDiv = motion.div;
  const MotionButton = motion.button;

  useEffect(() => {
    if (user && user.role === "seller") {
      API.get("/seller/profile")
        .then((res) => {
          setProfile(res.data);
          setFormData({
            name: res.data.name || "",
            email: res.data.email || "",
          });
          setAvatarUrl(res.data.avatarUrl || "");
          setImagePreview(res.data.avatarUrl || "");
          setLoading(false);
        })
        .catch(() => {
          toast.error("Failed to load profile");
          setLoading(false);
        });
    }
  }, [user]);

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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setSelectedImageFile(file);
    setImagePreview(previewUrl);
  };

  const handleUpdateProfile = async () => {
    try {
      const updatedData = { ...formData };

      if (selectedImageFile) {
        const uploadedAvatarUrl = await uploadToCloudinary(selectedImageFile);
        updatedData.avatarUrl = uploadedAvatarUrl;
        setAvatarUrl(uploadedAvatarUrl);
        setImagePreview(uploadedAvatarUrl);
      } else if (avatarUrl) {
        updatedData.avatarUrl = avatarUrl;
      }

      const res = await API.put("/seller/profile", updatedData);
      const updatedUser = { ...user, ...res.data };

      toast.success("Profile updated!");
      setProfile((prev) => ({ ...prev, ...res.data }));
      setUser(updatedUser);
      localStorage.setItem("craftkart_currentUser", JSON.stringify(updatedUser));
    } catch {
      toast.error("Update failed!");
    }
  };

  const handleDocumentChange = (e, field) => {
    const files = e.target.files;
    if (field === "extraDocs") {
      setDocuments((prev) => ({ ...prev, extraDocs: Array.from(files) }));
    } else {
      setDocuments((prev) => ({ ...prev, [field]: files[0] }));
    }
  };

  const handleDocumentUpload = async () => {
    try {
      const formPayload = new FormData();

      if (documents.aadhaar) formPayload.append("aadhaar", documents.aadhaar);
      if (documents.pan) formPayload.append("pan", documents.pan);
      if (documents.gst) formPayload.append("gst", documents.gst);
      if (documents.shopLicense) formPayload.append("shopLicense", documents.shopLicense);
      documents.extraDocs.forEach((file) => formPayload.append("extraDocs", file));

      toast.loading("Uploading documents...");

      const res = await API.put("/seller/upload-documents", formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.dismiss();
      toast.success("Documents uploaded successfully!");
      setProfile((prev) => ({ ...prev, documents: res.data.documents }));
      setDocuments({ aadhaar: null, pan: null, gst: null, shopLicense: null, extraDocs: [] });
    } catch {
      toast.dismiss();
      toast.error("Document upload failed!");
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (!user || user.role !== "seller") {
    return <div className="p-10 text-center">Access Denied</div>;
  }

  const imageSrc = imagePreview || avatarUrl || profile.avatarUrl || "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  if (loading) {
    return (
      <SellerLayout title="Seller Profile">
        <div className="max-w-4xl mx-auto p-4">
          <div className="h-80 rounded-3xl bg-white shadow-lg border border-slate-200 p-6 animate-pulse" />
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout title="Seller Profile">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto p-4">
        <MotionDiv
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
        >
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-indigo-600 uppercase tracking-[0.24em]">Seller Profile</p>
                <h1 className="text-3xl font-semibold text-slate-900">Manage your account</h1>
                <p className="max-w-2xl text-sm text-slate-500 leading-6">
                  Update your seller profile details and upload a fresh profile image for a more professional storefront experience.
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <div className="font-semibold text-slate-900">Status</div>
                <div>{profile.isVerified ? "Verified seller" : "Verification pending"}</div>
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-[280px_1fr] items-start">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="relative mx-auto w-fit">
                  <img
                    src={imageSrc}
                    alt="Seller"
                    className="w-28 h-28 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <label className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg transition hover:bg-blue-700">
                    <span className="text-sm">✏️</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>

                <div className="mt-5 text-center">
                  <p className="text-lg font-semibold text-slate-900">{profile.name || "Seller Name"}</p>
                  <p className="mt-1 text-sm text-slate-500">{profile.email || "seller@example.com"}</p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Full Name</span>
                    <input
                      type="text"
                      className="input mt-2"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter full name"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Email</span>
                    <input
                      type="email"
                      className="input mt-2"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </label>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Your profile image will upload when you save changes.</p>
                  </div>
                  <MotionButton
                    whileHover={{ scale: 1.02 }}
                    onClick={handleUpdateProfile}
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                  >
                    Save Changes
                  </MotionButton>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Seller Documents</h2>
                  <p className="text-sm text-slate-500">Upload seller verification documents securely.</p>
                </div>
              </div>

              <div className="mt-5 grid gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Aadhaar Card</span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.pdf"
                    onChange={(e) => handleDocumentChange(e, "aadhaar")}
                    className="input mt-2"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">PAN Card</span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.pdf"
                    onChange={(e) => handleDocumentChange(e, "pan")}
                    className="input mt-2"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">GST Certificate</span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.pdf"
                    onChange={(e) => handleDocumentChange(e, "gst")}
                    className="input mt-2"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Shop License</span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.pdf"
                    onChange={(e) => handleDocumentChange(e, "shopLicense")}
                    className="input mt-2"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Extra Documents (max 5)</span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.pdf"
                    multiple
                    onChange={(e) => handleDocumentChange(e, "extraDocs")}
                    className="input mt-2"
                  />
                </label>

                <MotionButton
                  whileHover={{ scale: 1.02 }}
                  onClick={handleDocumentUpload}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Upload Documents
                </MotionButton>
              </div>
            </div>
          </div>
        </MotionDiv>
      </div>
    </SellerLayout>
  );
}

const Row = ({ title, value }) => (
  <div className="flex justify-between border-b pb-2">
    <span className="text-gray-500">{title}</span>
    <span className="font-semibold">{value}</span>
  </div>
);
