import API from "../utils/api";

export const createOrder = (data) =>
  API.post("/orders", data);

export const getOrders = () =>
  API.get("/orders");

export const getUserOrders = (userId) =>
  API.get(`/orders/user/${userId}`);
