import axios from "axios";
import { redirect } from "./navigationService";

// 🔥 BIG UPGRADE: Timestamp lock to prevent race conditions under load
let lastRedirectTime = 0;
const shouldRedirect = () => {
  const now = Date.now();
  if (now - lastRedirectTime < 1500) return false;
  lastRedirectTime = now;
  return true;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  timeout: 120000, // Industry-standard 120-second fail-fast timeout because of the render free tier
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // 🔥 Fix 1: Block API calls when offline (MOST IMPORTANT)
    if (!navigator.onLine) {
      const offlineError = new Error("Offline");
      offlineError.code = "OFFLINE";
      offlineError.isAxiosError = true; // ✅ Fix 1: Restore isAxiosError for library compatibility
      offlineError.config = config; // ✅ Fix 2: Attach config to prevent undefined errors later
      return Promise.reject(offlineError);
    }

    // 1. Grab the token from localStorage
    const token = localStorage.getItem("token");

    // 2. If the token exists, add it to the Headers
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request errors here
    return Promise.reject(error);
  }
);

// Optional: Add a response interceptor to handle 401s globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔥 THE FIX: Bypass global error handler if the flag is set (e.g., from ServerError retry)
    if (error.config?.skipGlobalErrorHandler) {
      return Promise.reject(error);
    }

    // Hoisted these checks so the OFFLINE handler can use them safely
    const currentPath = window.location.pathname;
    const isErrorPage = currentPath.startsWith('/server-error');
    const isUnauthorizedPage = currentPath.startsWith('/unauthorized');

    // 🔥 THE FIX: Allow updating the URL to NETWORK_ERROR even if already on the ServerError page!
    if (
      error.code === "OFFLINE" ||
      (error.code === "ERR_NETWORK" && !navigator.onLine)
    ) {
      if (shouldRedirect()) {
        // Only save the path if we are coming from a normal page
        if (!isErrorPage && !isUnauthorizedPage) {
          sessionStorage.setItem("lastValidPath", currentPath);
        }
        // Always update the URL so the UI dynamically changes to the WiFi Off state
        if (!isUnauthorizedPage) {
          redirect(`/server-error?code=NETWORK_ERROR`);
        }
      }
      return Promise.reject(error);
    }

    // ✅ Ignore cancelled/aborted requests (VERY IMPORTANT FIX)
    if (
      error.code === "ERR_CANCELED" ||
      error.message === "canceled" ||
      error.message === "Polling aborted"
    ) {
      return Promise.reject(error);
    }

    // ========================================================================
    // 1. DYNAMIC ERROR PARSER: NO RESPONSE (Network Crash / Timeout)
    // ========================================================================
    if (!error.response) {
      let errorCode;

      // ✅ DIFFERENTIATE PROPERLY (Double offline check removed, handled purely in request interceptor)
      if (
        error.code === "ECONNABORTED" ||
        error.message?.toLowerCase().includes("timeout") ||
        error.name === "AbortError"
      ) {
        errorCode = 504; // Timeout
      } else if (error.code === "ERR_NETWORK") {
        errorCode = "SERVER_UNREACHABLE"; // Backend down / DNS issue
      } else {
        return Promise.reject(error); // ignore unknown cases
      }

      // Check lock AFTER evaluating the conditions to prevent locking on ignored cases
      if (shouldRedirect()) {
        console.error("Network error (no response from server)");

        // 🔥 THE FIX PART 1: Protect the return path ONLY if we aren't already on an error page
        if (!isErrorPage && !isUnauthorizedPage) {
          sessionStorage.setItem("lastValidPath", currentPath);
        }

        // 🔥 THE FIX PART 2: ALWAYS update the URL parameter so ServerError.jsx can read it, 
        // even if we are already sitting on the /server-error page!
        if (!isUnauthorizedPage) {
          redirect(`/server-error?code=${errorCode}`);
        }
      }

      return Promise.reject(error);
    }

    const status = error.response?.status;
    const token = localStorage.getItem("token");
    const requestUrl = error.config?.url;

    // 🔥 IMPORTANT: Ignore health polling requests completely
    const isHealthCheck =
      requestUrl?.includes("/api/v1/auth/health");

    if (isHealthCheck) {
      return Promise.reject(error);
    }

    const isAuthRoute =
      requestUrl?.includes("/login") || requestUrl?.includes("/signup");

    // Handle 401 Unauthorized (expired token)
    if (status === 401 && token && !isAuthRoute) {
      if (shouldRedirect()) {
        console.warn("Session expired. Logging out...");

        localStorage.removeItem("token");

        // Store the current path before redirect (skip error pages)
        if (!isErrorPage && !isUnauthorizedPage) {
          sessionStorage.setItem("lastValidPath", currentPath);
        }
        redirect("/login");
      }
      
      return Promise.reject(error); // ✅ Fix 3: Added return to prevent continuing to 500 block
    }

    // Handle 403 Forbidden (Access Denied)
    if (status === 403) {
      if (shouldRedirect()) {
        console.warn("Access denied. Redirecting to unauthorized page...");

        // Store the current path before redirect (skip error pages)
        if (!isErrorPage && !isUnauthorizedPage) {
          sessionStorage.setItem("lastValidPath", currentPath);
        }
        
        // Redirect to dynamic unauthorized page with 403 code
        redirect("/unauthorized?code=403");
      }
      
      return Promise.reject(error); // ✅ Fix 3: Added return to prevent continuing to 500 block
    }

    // ========================================================================
    // 🔥 NEW: Handle 429 Too Many Requests (Rate Limiting)
    // ========================================================================
    if (status === 429) {
      const retryAfter = error.response?.data?.retryAfter || 60;

      // Optional: store globally (helps UI if needed)
      sessionStorage.setItem("rateLimitRetryAfter", retryAfter);

      // 1. Drop high-frequency background telemetry logs silently so the UI doesn't spam errors
      if (requestUrl?.includes('/api/v1/uba/log')) {
        return Promise.reject(error);
      }

      // 2. For standard user routes (Login, OTP, General API limits), pass the error
      // straight down to the component. This allows the local `catch` block in your
      // React components to extract `error.response.data.message` and display a Toast notification.
      return Promise.reject(error);
    }

    // ========================================================================
    // 2. DYNAMIC ERROR PARSER: SERVER RESPONDED WITH ERROR
    // status >= 500 automatically catches 500, 502, 503, 504, etc.
    // ========================================================================
    if (status >= 500) {
      if (shouldRedirect()) {
        console.error(`Server error dynamically caught: ${status}`);

        // 🔥 THE FIX PART 1: Protect the return path ONLY if we aren't already on an error page
        if (!isErrorPage && !isUnauthorizedPage) {
          sessionStorage.setItem("lastValidPath", currentPath);
        }

        // 🔥 THE FIX PART 2: ALWAYS update the URL parameter so ServerError.jsx can read the exact status
        if (!isUnauthorizedPage) {
          redirect(`/server-error?code=${status}`);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
