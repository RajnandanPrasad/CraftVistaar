import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE}/api`,
});


API.interceptors.request.use((config) => {
  const token = localStorage.getItem("craftkart_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Create Razorpay Order
export const createRazorpayOrder = async (amount) => {
  const res = await API.post("/payment/create-order", { amount });
  return res.data; // returns { orderId }
};
