import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // <--- Make sure this matches your backend
});

// Attach token if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("craftkart_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
