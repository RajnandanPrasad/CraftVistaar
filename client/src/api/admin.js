import API from "./api";

// Users
export const getSellers = async () => {
  const res = await API.get("/admin/sellers");
  return res.data;
};

export const verifySeller = async (sellerId) => {
  const res = await API.put(`/admin/verify-seller/${sellerId}`);
  return res.data;
};

export const deleteUser = async (userId) => {
  const res = await API.delete(`/admin/users/${userId}`);
  return res.data;
};

// Products
export const getAdminProducts = async () => {
  const res = await API.get("/admin/products");
  return res.data;
};

export const approveProduct = async (productId) => {
  const res = await API.put(`/admin/products/${productId}/approve`);
  return res.data;
};

export const rejectProduct = async (productId) => {
  const res = await API.delete(`/admin/products/${productId}/reject`);
  return res.data;
};

// Orders
export const getAllOrders = async () => {
  const res = await API.get("/admin/orders");
  return res.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const res = await API.put(`/admin/orders/${orderId}`, { status });
  return res.data;
};
