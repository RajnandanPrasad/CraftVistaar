import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE}/api`,
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("craftkart_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Register (JSON only, no files)
export const register = async (userData) => {
  const res = await API.post("/auth/register", userData);

  localStorage.setItem("craftkart_token", res.data.token);
  localStorage.setItem("craftkart_currentUser", JSON.stringify(res.data.user));

  return res.data;
};

// Login
export const login = async (formData) => {
  const res = await API.post("/auth/login", formData);
  localStorage.setItem("craftkart_token", res.data.token);
  localStorage.setItem("craftkart_currentUser", JSON.stringify(res.data.user));
  return res.data;
};

// Fetch current user
export const fetchMe = async () => {
  const res = await API.get("/auth/me");
  localStorage.setItem("craftkart_currentUser", JSON.stringify(res.data));
  return res.data;
};

// Logout
export const logout = () => {
  localStorage.removeItem("craftkart_token");
  localStorage.removeItem("craftkart_currentUser");
};

// Utility functions
export const getCurrentUser = () => {
  const user = localStorage.getItem("craftkart_currentUser");
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("craftkart_token");
};

export const getUserRole = () => {
  const user = getCurrentUser();
  return user ? user.role : null;
};
