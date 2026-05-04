import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import toast from "react-hot-toast";
import { uploadImage, uploadModel } from "../utils/uploadHelpers.js";

import { HANDMADE_CATEGORIES } from "../utils/handmadeFilter";

const allowedCategories = [...HANDMADE_CATEGORIES];

export default function SellerAddProduct() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    model3D: "",
    images: []
  });
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const token = localStorage.getItem("craftkart_token");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileUpload = async (file, isModel = false) => {
    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      setUploading(true);
      const path = isModel ? await uploadModel(file, token) : await uploadImage(file, token);
      toast.success(`Uploaded ${isModel ? 'model' : 'image'}`);
      
      if (isModel) {
        setFormData(prev => ({ ...prev, model3D: path }));
      } else {
        setFormData(prev => ({ ...prev, images: [...prev.images, path] }));
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => handleFileUpload(file, false));
  };

  const handleModelUpload = (e) => {
    const file = e.target.files[0];
    if (file) handleFileUpload(file, true);
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Simple: first file as image, if .glb as model
      const file = e.dataTransfer.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      const isModel = ext === 'glb' || ext === 'gltf';
      handleFileUpload(file, isModel);
    }
  }, []);

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.price || !formData.category || 
        formData.stock === '' || !formData.images.length) {
      toast.error("Please fill all required fields (title, description, price, category, stock, at least one image)");
      return;
    }
    
    const priceNum = Number(formData.price);
    const stockNum = Number(formData.stock);
    if (isNaN(priceNum) || priceNum < 0 || isNaN(stockNum)) {
      toast.error("Price and stock must be valid non-negative numbers");
      return;
    }

    // Build validated payload
    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: priceNum,
      stock: stockNum,
      category: formData.category,
      images: formData.images,
      model3D: formData.model3D || ""
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE}/api/products`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product created successfully!");
      setFormData({ title: "", description: "", price: "", category: "", stock: "", model3D: "", images: [] });
    } catch (err) {
      console.error("Product creation error:", err.response?.data || err);
      toast.error(err.response?.data?.msg || err.message || "Failed to create product");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Add New Product</h1>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Info */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Title *</label>
            <input 
              name="title" 
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter product title"
              value={formData.title} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea 
              name="description" 
              rows="4"
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              placeholder="Describe your handmade product..."
              value={formData.description} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
              <input 
                name="price" 
                type="number" 
                min="0"
                step="0.01"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="99.99"
                value={formData.price} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
              <input 
                name="stock" 
                type="number" 
                min="0"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter stock quantity"
                value={formData.stock} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select 
              name="category" 
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.category} 
              onChange={handleChange} 
              required
            >
              <option value="">Select category</option>
              {allowedCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Media Upload */}
        <div className="space-y-6">
          {/* Images Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Product Images</label>
            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-200' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file" 
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="space-y-2">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-lg font-medium text-gray-900">Drag & drop images here, or click to browse</p>
                  <p className="text-sm text-gray-500">PNG, JPG, WebP up to 10MB</p>
                </div>
              </label>
            </div>
            
            {formData.images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img src={img.startsWith('http') ? img : `${import.meta.env.VITE_API_BASE}${img}`} 
                         alt={`Preview ${index}`} 
                         className="w-full h-20 object-cover rounded-lg" 
                    />
                    <button 
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3D Model Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">3D Model (Optional)</label>
            <input
              type="file" 
              accept=".glb,.gltf"
              onChange={handleModelUpload}
              disabled={uploading}
              className="w-full p-4 border border-gray-300 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
{formData.model3D && (
              <p className="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                Model ready: {formData.model3D.split('/').pop()}
              </p>
            )}
          </div>

          {/* Direct 3D Model URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">3D Model URL (.glb) - OR upload above</label>
            <input
              type="url"
              name="model3D"
              placeholder="https://example.com/model.glb"
              value={formData.model3D || ""}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">Paste .glb URL directly or upload file above</p>
          </div>

          <button 
            type="submit" 
            disabled={uploading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {uploading ? 'Uploading...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
