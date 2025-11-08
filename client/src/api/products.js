import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("craftkart_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get all products
export const getProducts = async () => {
  const res = await API.get("/products");
  return res.data;
};

// Get distinct categories
export const getCategories = async () => {
  const res = await API.get("/products/categories");
  return res.data;
};
