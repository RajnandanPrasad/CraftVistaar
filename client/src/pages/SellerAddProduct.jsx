import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import toast from "react-hot-toast";

const allowedCategories = [
  "Clothing",
  "Electronics",
  "Grocery",
  "Fitness",
  "Toys",
  "Home Decor",
  "Footwear",
  "Beauty",
  "Kitchen",
  "Accessories",
];

export default function SellerAddProduct() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    images: [] // array of URLs for now
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImagesChange = (e) => setFormData({ ...formData, images: e.target.value.split(",") });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("craftkart_token"); // JWT from login
      await axios.post(`${import.meta.env.VITE_API_BASE}/api/products`, formData, {
  headers: { Authorization: `Bearer ${token}` }
});
      toast.success(t("productUploadedWaitingApproval"));
      setFormData({ title: "", description: "", price: "", category: "", images: [] });
    } catch (err) {
      console.error(err);
      toast.error(t("failedToUploadProduct"));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 max-w-md mx-auto">
      <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
      <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
      <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required />
      <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
      <input name="images" placeholder="Image URLs comma separated" value={formData.images.join(",")} onChange={handleImagesChange} />
      <button type="submit" className="bg-blue-600 text-white py-2 rounded">Upload Product</button>
    </form>
  );
}
