import api from './api.js';

// Fetch seller's orders
export const fetchSellerOrders = async () => {
  try {
    const response = await api.get('/seller/orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    throw error;
  }
};
