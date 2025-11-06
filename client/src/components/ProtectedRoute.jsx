import React from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem("craftkart_token");
  const user = JSON.parse(localStorage.getItem("craftkart_currentUser") || "null");

  if (!token || !user) {
    toast.error("Please login to continue");
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    toast.error("Access denied");
    return <Navigate to="/" />;
  }

  return children;
}
