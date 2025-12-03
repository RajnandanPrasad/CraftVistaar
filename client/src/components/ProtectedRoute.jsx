import React from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { getCurrentUser, isAuthenticated } from "../api/auth";

export default function ProtectedRoute({ children, requiredRole }) {
  const { t } = useTranslation();
  const user = getCurrentUser();
  const authenticated = isAuthenticated();

  if (!authenticated || !user) {
    toast.error(t("pleaseLoginToContinue"));
    return <Navigate to="/auth" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    toast.error(t("accessDenied"));
    return <Navigate to="/" />;
  }

  return children;
}
