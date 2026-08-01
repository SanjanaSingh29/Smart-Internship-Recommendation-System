import axios from "axios";

const api = axios.create({
  baseURL: "https://smart-internship-recommendation-system-q0f1.onrender.com/api",
});

// Intercept requests to attach Authorization Token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;