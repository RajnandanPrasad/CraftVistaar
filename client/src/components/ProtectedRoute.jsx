import React from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getCurrentUser, isAuthenticated } from "../api/auth";

export default function ProtectedRoute({ children, requiredRole }) {
  const user = getCurrentUser();
  const authenticated = isAuthenticated();

  if (!authenticated || !user) {
    toast.error("Please login to continue");
    return <Navigate to="/auth" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    toast.error("Access denied");
    return <Navigate to="/" />;
  }

  return children;
}
