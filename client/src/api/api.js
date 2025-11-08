import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // backend URL
});

// Attach token
API.interceptors.request.use(config => {
  const token = localStorage.getItem("craftkart_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
