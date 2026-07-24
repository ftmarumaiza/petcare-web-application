import axios from "axios";

const normalizeApiBaseUrl = (value) => {
  const rawBaseUrl = (value || "http://localhost:5000/api").trim().replace(/\/+$/, "");
  return rawBaseUrl.endsWith("/api") ? rawBaseUrl : `${rawBaseUrl}/api`;
};

const api = axios.create({
  baseURL: normalizeApiBaseUrl(import.meta.env.VITE_API_URL),
});

// attach token to every request if we have one
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// if the token is invalid/expired, just log the user out
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // don't force redirect here, let the component handle it
    }
    return Promise.reject(err);
  }
);

export default api;
