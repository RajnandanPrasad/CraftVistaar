const API_BASE = (import.meta.env.VITE_API_BASE || "http://localhost:5000").replace(/\/$/, "");

export const getImageUrl = (image) => {
  if (!image || typeof image !== "string") return "/assets/logo.webp";

  const trimmed = image.trim();
  if (trimmed.startsWith("data:")) return trimmed;
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("//")) return trimmed;
  if (trimmed.startsWith("/")) return `${API_BASE}${trimmed}`;

  return `${API_BASE}/${trimmed.replace(/^\/+/, "")}`;
};

export const getProductImageUrl = getImageUrl;
