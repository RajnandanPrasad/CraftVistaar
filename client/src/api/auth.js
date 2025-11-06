import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

// Mock auth functions for demo mode
const mockRegister = async (formData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const users = JSON.parse(localStorage.getItem("craftkart_users") || "[]");
  const existingUser = users.find(user => user.email === formData.email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const newUser = {
    id: Date.now().toString(),
    name: formData.name,
    email: formData.email,
    passwordHash: btoa(formData.password), // Simple encoding for demo
    role: formData.role || "customer",
  };

  users.push(newUser);
  localStorage.setItem("craftkart_users", JSON.stringify(users));

  const token = btoa(JSON.stringify({ id: newUser.id, role: newUser.role }));
  localStorage.setItem("craftkart_token", token);
  localStorage.setItem("craftkart_currentUser", JSON.stringify(newUser));

  return { token, user: newUser };
};

const mockLogin = async (formData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const users = JSON.parse(localStorage.getItem("craftkart_users") || "[]");
  const user = users.find(u => u.email === formData.email && u.passwordHash === btoa(formData.password));

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const token = btoa(JSON.stringify({ id: user.id, role: user.role }));
  localStorage.setItem("craftkart_token", token);
  localStorage.setItem("craftkart_currentUser", JSON.stringify(user));

  return { token, user };
};

// Register function with fallback
export const register = async (formData) => {
  try {
    const res = await API.post("/register", formData);
    localStorage.setItem("craftkart_token", res.data.token);
    localStorage.setItem("craftkart_currentUser", JSON.stringify(res.data.user));
    return res.data;
  } catch (error) {
    console.log("Backend unavailable, using mock auth");
    return await mockRegister(formData);
  }
};

// Login function with fallback
export const login = async (formData) => {
  try {
    const res = await API.post("/login", formData);
    localStorage.setItem("craftkart_token", res.data.token);
    localStorage.setItem("craftkart_currentUser", JSON.stringify(res.data.user));
    return res.data;
  } catch (error) {
    console.log("Backend unavailable, using mock auth");
    return await mockLogin(formData);
  }
};

// Utility functions
export const getCurrentUser = () => {
  const user = localStorage.getItem("craftkart_currentUser");
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem("craftkart_token");
  localStorage.removeItem("craftkart_currentUser");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("craftkart_token");
};

export const getUserRole = () => {
  const user = getCurrentUser();
  return user ? user.role : null;
};
