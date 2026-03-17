import axios from "axios";
let isRedirecting = false; // Flag to prevent multiple redirects

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});
// 🔥 THE FIX: Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // 1. Grab the token from localStorage
    const token = localStorage.getItem("token");

    // 2. If the token exists, add it to the Headers
    if (token) {
      if (!config.headers) config.headers = {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request errors here
    return Promise.reject(error);
  },
);

// Optional: Add a response interceptor to handle 401s globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("Network error or backend down");
      return Promise.reject(error);
    }
    const status = error.response?.status;
    const token = localStorage.getItem("token");
    const requestUrl = error.config?.url;

    const isAuthRoute =
      requestUrl?.includes("/login") || requestUrl?.includes("/signup");

    if (status === 401 && token && !isAuthRoute && !isRedirecting) {
      isRedirecting = true;

      console.warn("Session expired. Logging out...");

      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
