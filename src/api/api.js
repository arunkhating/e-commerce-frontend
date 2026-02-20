import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// ── Automatically attach JWT token to every request ──────────────────────────
// This is the key part — reads token from localStorage and adds it to headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Auth ──────────────────────────────────────────────────────────────────────
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser   = (data) => API.post("/auth/login", data);
export const getMe       = ()     => API.get("/users/me");

// ── Products (public, no token needed) ───────────────────────────────────────
export const getProducts    = ()   => API.get("/products");
export const getProductById = (id) => API.get(`/products/${id}`);

// ── Cart (protected, token auto-attached above) ───────────────────────────────
export const getCart       = ()                         => API.get("/cart");
export const addToCart     = (product_id, quantity = 1) => API.post(`/cart/add?product_id=${product_id}&quantity=${quantity}`);
export const removeFromCart = (product_id)              => API.delete(`/cart/remove/${product_id}`);
export const clearCart     = ()                         => API.delete("/cart/clear");

// ── Orders (protected) ────────────────────────────────────────────────────────
export const checkout  = ()       => API.post("/orders/checkout");
export const getOrders = ()       => API.get("/orders/my");

export default API;