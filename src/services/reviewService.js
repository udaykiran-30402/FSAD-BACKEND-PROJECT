import API from "../utils/api";

export const getReviews = (productId) =>
  API.get(`/reviews/product/${productId}`);

export const addReview = (data) =>
  API.post("/reviews", data);
