import API from "./api";

// Submit a review
export const submitReview = async (reviewData) => {
  const res = await API.post("/reviews", reviewData);
  return res.data;
};

// Get all reviews for a product
export const getProductReviews = async (productId) => {
  const res = await API.get(`/reviews/product/${productId}`);
  return res.data;
};
