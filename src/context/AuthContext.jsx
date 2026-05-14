import { createContext, useContext, useEffect, useState, useMemo } from "react";
import api from "../services/api";
import { redirect } from "../services/navigationService"; // 🔥 FIX 3: Import SPA redirect

// 🔥 IMPROVEMENT: Separated imports for proper scalable architecture
import BootScreen from "../components/ui/BootScreen";
import { useServerWake } from "../hooks/useServerWake";

// Import socket functions (adjust the path if your file is named differently or in a different folder)
import {
  socket,
  connectUserSocket,
  disconnectUserSocket,
} from "../services/socket";
import { AnimatePresence } from "framer-motion";

const AuthContext = createContext(null);

// Normalize user object from backend
const normalizeUser = (user) => ({
  ...user,
  role: user.role || "user",
  isEmailVerified: user.isEmailVerified ?? user.emailVerified ?? false,
});

// 🔥 IMPROVEMENT: Centralized auth cleanup helper
const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("authUser");
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // 🔥 THE FLASH FIX: Lock this state on the very first render.
  // By initializing it in useState, it guarantees it runs instantly and never fluctuates, 
  // keeping the BootScreen rock-solid and completely hiding the Error Page.
  const [recoveringFromError] = useState(() => 
    typeof window !== "undefined" && window.location.href.includes("/server-error")
  );

  // 🔥 CLEANUP: We destructure the wake logic from our custom hook
  const { isWakingUp, setIsWakingUp, ensureBackendAwake } = useServerWake();

  // Helper used for login/refresh where the app is already mounted
  const getUserFromServer = async () => {
    try {
      const res = await api.get("/api/v1/auth/getUserDetail");

      if (res.data.success && res.data.user) {
        const normalized = normalizeUser(res.data.user);
        localStorage.setItem("role", normalized.role);
        return normalized;
      }
    } catch (err) {
      console.error("getUserFromServer error:", err);
      // 🔥 FIX 2: Safe optional chaining to prevent undefined crashes
      if (!err.response || err.response?.status >= 500) {
        throw err;
      }
    }

    return null;
  };

  /* ================= SOCKET EXPIRY LISTENER ================= */
  useEffect(() => {
    const handleSocketUnauthorized = () => {
      console.warn("⚠️ Socket unauthorized → logging out user");

      clearAuthData(); // 🔥 Refactored to use helper
      setUser(null);

      disconnectUserSocket();
      redirect("/login"); // 🔥 FIX 3: Use clean SPA redirect instead of window.location
    };

    window.addEventListener("socket_unauthorized", handleSocketUnauthorized);

    return () => {
      window.removeEventListener(
        "socket_unauthorized",
        handleSocketUnauthorized,
      );
    };
  }, []);

  /* ================= LOAD USER ON APP START ================= */
  useEffect(() => {
    let isMounted = true;
    const globalAbortController = new AbortController();

    const bootSequence = async () => {
      let wakeScreenActive = false;

      // 🔥 ISSUE 2 FIX: Helper to sync state cleanly
      const stopWakeScreen = () => {
        setIsWakingUp(false);
        wakeScreenActive = false;
      };

      try {
        // 🔥 THE STUCK URL FIX: Native Browser History replacement
        // React Router is unmounted during the BootScreen, so custom redirect() fails.
        // This instantly rewrites the URL natively, so when the Router eventually mounts, it sees "/" instead of "/server-error".
        if (typeof window !== "undefined" && window.location.href.includes("/server-error")) {
          window.history.replaceState(null, "", "/");
        }

        // 🔥 ISSUE 4 FIX: Handled offline natively to prevent unnecessary boot errors
        if (!navigator.onLine) {
          setLoading(false);
          setIsInitialized(true);
          return;
        }

        // PHASE 1: THE SILENT POLLING LOOP
        const serverAwake = await ensureBackendAwake(
          globalAbortController.signal,
          () => {
            wakeScreenActive = true;
            setLoading(false);
          },
        );

        if (!serverAwake) {
          stopWakeScreen(); // 🔥 UNBLOCKS APP.JSX TO PROCESS THE REDIRECT
          redirect("/server-error?code=SERVER_UNREACHABLE"); // 🔥 FIX 3: SPA redirect
          return;
        }

        // PHASE 2: SERVER IS AWAKE -> FETCH USER
        if (isMounted) {
          stopWakeScreen();
        }

        const token = localStorage.getItem("token");

        if (!token) {
          if (isMounted) {
            setUser(null);
          }
          return;
        }

        const res = await api.get("/api/v1/auth/getUserDetail", {
          signal: globalAbortController.signal,
        });

        const data = res.data;

        if (isMounted) {
          if (data.success && data.user) {
            const normalizedUser = normalizeUser(data.user);
            localStorage.setItem("role", normalizedUser.role);
            setUser(normalizedUser);

            if (!socket.connected) {
              connectUserSocket(
                token,
                normalizedUser.userId ||
                  normalizedUser.adminId ||
                  normalizedUser._id,
              );
            }
          } else {
            setUser(null);
            clearAuthData(); // 🔥 Refactored to use helper
          }
        }
      } catch (err) {
        if (!isMounted || globalAbortController.signal.aborted) return;
        console.error("[Boot Sequence] Initialization failed:", err);

        disconnectUserSocket(); // 🔥 Disconnect ghost socket on auth failure
        setUser(null);
        
        // ====================================================================
        // 🔥 ROOT CAUSE FIX: Do NOT wipe the token on 503 / Render Sleep errors!
        // We only delete the token if the backend explicitly says it's invalid (401).
        // ====================================================================
        if (err.response && err.response.status === 401) {
          clearAuthData(); 
        }
      } finally {
        if (
          isMounted &&
          !globalAbortController.signal.aborted &&
          !wakeScreenActive
        ) {
          setLoading(false);
          setIsInitialized(true);
        }
      }
    };

    bootSequence();

    return () => {
      isMounted = false;
      globalAbortController.abort();
    };
  }, []); // 🔥 FIX 1: Empty dependency array avoids unnecessary custom hook reruns

  /* ================= LOGIN ================= */
  const login = async (token) => {
    if (!token) return;
    localStorage.setItem("token", token);
    setLoading(true);

    let isFatalError = false;
    let wakeScreenActive = false;

    // 🔥 ISSUE 2 FIX: Helper to sync state cleanly
    const stopWakeScreen = () => {
      setIsWakingUp(false);
      wakeScreenActive = false;
    };

    try {
      const serverAwake = await ensureBackendAwake(undefined, () => {
        wakeScreenActive = true;
        setLoading(false);
      });

      if (!serverAwake) {
        stopWakeScreen(); // 🔥 UNBLOCKS APP.JSX TO PROCESS THE REDIRECT
        redirect("/server-error?code=SERVER_UNREACHABLE"); // 🔥 FIX 3: SPA redirect
        return;
      }

      if (wakeScreenActive) {
        stopWakeScreen();
      }

      const fetchedUser = await getUserFromServer();

      if (fetchedUser) {
        setUser(fetchedUser);
        stopWakeScreen();

        if (!socket.connected) {
          connectUserSocket(
            token,
            fetchedUser.userId || fetchedUser.adminId || fetchedUser._id,
          );
        }
      } else {
        setUser(null);
        clearAuthData(); // 🔥 Refactored to use helper
      }
    } catch (err) {
      console.error("Auth login error:", err);

      if (
        !err.response ||
        err.code === "ECONNABORTED" ||
        err.code === "ERR_NETWORK"
      ) {
        console.warn("Server is sleeping during login");
        setIsWakingUp(true);
        wakeScreenActive = true;
        setLoading(false);
        return;
      }

      if (err.response?.status === 401) {
        disconnectUserSocket(); // 🔥 Disconnect ghost socket on auth failure
        clearAuthData(); // 🔥 Refactored to use helper
        setUser(null);
      } else {
        console.warn("Temporary login error.");
        // 🔥 FIX 2: Safe optional chaining to prevent undefined crashes
        if (err.response?.status >= 500) {
          isFatalError = true;
          throw err;
        }
      }
    } finally {
      if (!isFatalError && !wakeScreenActive) {
        setLoading(false);
        setIsInitialized(true);
      }
    }
  };

  /* ================= LOGOUT ================= */
  const logout = async () => {
    try {
      setIsLoggingOut(true);
      // 🔥 FIX 6: Silent logout ignores global errors to prevent server-error redirect loop
      await api.post("/api/v1/auth/logout", null, {
        skipGlobalErrorHandler: true,
      });
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      clearAuthData(); // 🔥 Refactored to use helper

      disconnectUserSocket();

      setUser(null);
      setIsLoggingOut(false);
    }
  };

  /* ================= REFRESH USER ================= */
  // 🔥 THE FIX: Added skipWakeScreen parameter
  const refreshUser = async (skipWakeScreen = false) => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    let wakeScreenActive = false;

    // 🔥 ISSUE 2 FIX: Helper to sync state cleanly
    const stopWakeScreen = () => {
      setIsWakingUp(false);
      wakeScreenActive = false;
    };

    try {
      // 🔥 THE FIX: Only run the 2-minute polling animation block if NOT doing a silent background retry
      if (!skipWakeScreen) {
        const serverAwake = await ensureBackendAwake(undefined, () => {
          wakeScreenActive = true;
        });

        if (!serverAwake) {
          stopWakeScreen(); // 🔥 UNBLOCKS APP.JSX TO PROCESS THE REDIRECT
          redirect("/server-error?code=SERVER_UNREACHABLE"); // 🔥 FIX 3: SPA redirect
          return null;
        }

        if (wakeScreenActive) {
          stopWakeScreen();
        }
      }

      const updatedUser = await getUserFromServer();

      if (updatedUser) {
        setUser(updatedUser);
        if (!skipWakeScreen) stopWakeScreen();

        setIsInitialized(true);
        setLoading(false);

        if (!socket.connected) {
          connectUserSocket(
            token,
            updatedUser.userId || updatedUser.adminId || updatedUser._id,
          );
        }

        return updatedUser;
      }
    } catch (err) {
      console.error("Auth refreshUser error:", err);

      if (
        !err.response ||
        err.code === "ECONNABORTED" ||
        err.code === "ERR_NETWORK"
      ) {
        console.warn("Server sleeping during refresh");
        // 🔥 THE FIX: Do not hijack the screen if we are quietly checking from the Error Page
        if (!skipWakeScreen) {
          setIsWakingUp(true);
          wakeScreenActive = true;
        }
        return null;
      }

      if (err.response?.status === 401) {
        disconnectUserSocket(); // 🔥 Disconnect ghost socket on auth failure
        clearAuthData(); // 🔥 Refactored to use helper
        setUser(null);
      }
    } finally {
      // 🔥 Safely restore loading state if the sequence completes without wake screen
      if (!wakeScreenActive) {
        setLoading(false);
      }
    }

    return null;
  };

  /* ================= CONTEXT VALUE ================= */

  const value = useMemo(
    () => ({
      user,
      userId: user?.userId || user?.adminId || null,
      isAuthenticated: !!user,
      role: user?.role || "user",
      isAdmin: user?.role === "admin",
      isEmailVerified: user?.isEmailVerified ?? false,
      loading,
      isInitialized,
      login,
      logout,
      refreshUser,
      setUser,
      isLoggingOut,
      isWakingUp,
    }),
    [user, loading, isLoggingOut, isInitialized, isWakingUp],
  );

  // 🔥 THE ULTIMATE FLASH FIX:
  // Uses the locked recoveringFromError state to physically prevent the Error Page 
  // from flashing before the backend check completes.
  const showBootScreen = isWakingUp || (!isInitialized && recoveringFromError);

  return (
    <AuthContext.Provider value={value}>
      <AnimatePresence mode="wait">
        {showBootScreen && <BootScreen key="wake-screen" />}
        {!showBootScreen && children}
      </AnimatePresence>
    </AuthContext.Provider>
  );
};

/* ================= CUSTOM HOOK ================= */
export const useAuth = () => useContext(AuthContext);
export default AuthContext;