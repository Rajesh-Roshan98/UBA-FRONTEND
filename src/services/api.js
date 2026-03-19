import axios from "axios";
import { redirect } from "./navigationService";

let isRedirecting = false; // Flag to prevent multiple redirects

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
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
    // 🔥 Handle network errors (backend down, no internet)
    if (!error.response && !isRedirecting) {
      isRedirecting = true;

      console.error("Network error or backend down");

      // Store the current path before redirect (skip error pages)
      if (!window.location.pathname.startsWith('/server-error') && !window.location.pathname.startsWith('/unauthorized')) {
        sessionStorage.setItem("lastValidPath", window.location.pathname);
      }
      redirect("/server-error");

      // Reset flag after a delay to allow future redirects
      setTimeout(() => {
        isRedirecting = false;
      }, 2000);

      return Promise.reject(error);
    }

    const status = error.response?.status;
    const token = localStorage.getItem("token");
    const requestUrl = error.config?.url;

    const isAuthRoute =
      requestUrl?.includes("/login") || requestUrl?.includes("/signup");

    // 🔥 Handle 401 Unauthorized (expired token)
    if (status === 401 && token && !isAuthRoute && !isRedirecting) {
      isRedirecting = true;

      console.warn("Session expired. Logging out...");

      localStorage.removeItem("token");

      // Store the current path before redirect (skip error pages)
      if (!window.location.pathname.startsWith('/server-error') && !window.location.pathname.startsWith('/unauthorized')) {
        sessionStorage.setItem("lastValidPath", window.location.pathname);
      }
      redirect("/login");

      setTimeout(() => {
        isRedirecting = false;
      }, 2000);
    }

    // 🔥 Handle server errors (500, 503, etc.)
    if ((status >= 500 || status === 503) && !isRedirecting) {
      isRedirecting = true;

      console.error("Server error:", status);

      // Store the current path before redirect (skip error pages)
      if (!window.location.pathname.startsWith('/server-error') && !window.location.pathname.startsWith('/unauthorized')) {
        sessionStorage.setItem("lastValidPath", window.location.pathname);
      }
      redirect("/server-error");

      setTimeout(() => {
        isRedirecting = false;
      }, 2000);
    }

    return Promise.reject(error);
  },
);

export default api;