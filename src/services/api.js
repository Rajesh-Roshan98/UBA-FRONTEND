import axios from "axios";
import { redirect } from "./navigationService";

let isRedirecting = false; // Flag to prevent multiple redirects

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  timeout: 8000, // Industry-standard 8-second fail-fast timeout
});

// Add a request interceptor
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
    const currentPath = window.location.pathname;
    const isErrorPage = currentPath.startsWith('/server-error');
    const isUnauthorizedPage = currentPath.startsWith('/unauthorized');

    // ========================================================================
    // 1. DYNAMIC ERROR PARSER: NO RESPONSE (Network Crash / Timeout)
    // Handles: 503 (Refused) and 504 (Timeout)
    // ========================================================================
    if (!error.response && !isRedirecting) {
      isRedirecting = true;

      console.error("Network error or backend down");

      // Dynamically determine if it's a Timeout (504) or Server Down (503)
      let errorCode = 503; 
      if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout') || error.name === 'AbortError') {
        errorCode = 504;
      }

      // 🔥 THE FIX PART 1: Protect the return path ONLY if we aren't already on an error page
      if (!isErrorPage && !isUnauthorizedPage) {
        sessionStorage.setItem("lastValidPath", currentPath);
      }

      // 🔥 THE FIX PART 2: ALWAYS update the URL parameter so ServerError.jsx can read it, 
      // even if we are already sitting on the /server-error page!
      if (!isUnauthorizedPage) {
        redirect(`/server-error?code=${errorCode}`);
      }

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

    // Handle 401 Unauthorized (expired token)
    if (status === 401 && token && !isAuthRoute && !isRedirecting) {
      isRedirecting = true;

      console.warn("Session expired. Logging out...");

      localStorage.removeItem("token");

      // Store the current path before redirect (skip error pages)
      if (!isErrorPage && !isUnauthorizedPage) {
        sessionStorage.setItem("lastValidPath", currentPath);
      }
      redirect("/login");

      setTimeout(() => {
        isRedirecting = false;
      }, 2000);
    }

    // Handle 403 Forbidden (Access Denied)
    if (status === 403 && !isRedirecting) {
      isRedirecting = true;

      console.warn("Access denied. Redirecting to unauthorized page...");

      // Store the current path before redirect (skip error pages)
      if (!isErrorPage && !isUnauthorizedPage) {
        sessionStorage.setItem("lastValidPath", currentPath);
      }
      
      // Redirect to dynamic unauthorized page with 403 code
      redirect("/unauthorized?code=403");

      setTimeout(() => {
        isRedirecting = false;
      }, 2000);
    }

    // ========================================================================
    // 2. DYNAMIC ERROR PARSER: SERVER RESPONDED WITH ERROR
    // status >= 500 automatically catches 500, 502, 503, 504, etc.
    // ========================================================================
    if ((status >= 500) && !isRedirecting) {
      isRedirecting = true;

      console.error(`Server error dynamically caught: ${status}`);

      // 🔥 THE FIX PART 1: Protect the return path ONLY if we aren't already on an error page
      if (!isErrorPage && !isUnauthorizedPage) {
        sessionStorage.setItem("lastValidPath", currentPath);
      }

      // 🔥 THE FIX PART 2: ALWAYS update the URL parameter so ServerError.jsx can read the exact status
      if (!isUnauthorizedPage) {
        redirect(`/server-error?code=${status}`);
      }

      setTimeout(() => {
        isRedirecting = false;
      }, 2000);
    }

    return Promise.reject(error);
  },
);

export default api;