import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // use your deployed backend
});

// Optional: attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("craftkart_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Get all products
export const getProducts = async () => {
  const res = await API.get("/products");
  return res.data;
};

// Get public approved products
export const getPublicProducts = async () => {
  const res = await API.get("/products/public");
  return res.data;
};

// Get categories
export const getCategories = async () => {
  const res = await API.get("/products/categories/distinct");
  return res.data;
};


// Get public product by ID
export const getPublicProductById = async (id) => {
  const res = await API.get(`/products/public/${id}`);
  return res.data;
};
