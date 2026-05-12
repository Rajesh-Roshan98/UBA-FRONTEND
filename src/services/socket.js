import { io } from "socket.io-client";

const API_BASE = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") || "http://localhost:3000";

// autoConnect: false ensures we only connect when the user is actually logged in
export const socket = io(API_BASE, { 
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket", "polling"], 
  timeout: 120000,                      // Give it 120 seconds to connect (matches Axios)
  reconnection: true,                   // Ensure auto-reconnect is forced ON
  reconnectionAttempts: Infinity,       // Never stop trying to reconnect
  reconnectionDelay: 1000,              // Wait 1 second before first retry
  reconnectionDelayMax: 5000,
  connectionStateRecovery: {},          // 🔥 FIX 5: Enable Socket.IO v4 state recovery
});

// 🔥 NEW: Call this from AuthContext.jsx when the user logs in
// Note: userId is still passed here so we don't break the AuthContext function call, but it is no longer logged.
export const connectUserSocket = (token, userId) => {
  if (!token || !userId) return;

  // 1. Attach the token for the secure backend handshake we built
  socket.auth = { token };

  // 🔥 FIX 6: Guard to prevent multi-call overlap
  if (socket.connected) return;

  // 2. Set up listeners BEFORE connecting to ensure we never miss the initial event
  socket.off("connect"); // Prevent duplicate listeners if called multiple times
  socket.on("connect", () => {
    // 🔥 FIX: Only show this log in development mode. It will be completely hidden in production!
    if (import.meta.env.MODE !== "production") {
      console.log(`✅ Real-time Socket Connected: ${socket.id}`);
    }
  });

  // 🔥 FIX 1 & 4: Handle connection errors safely and match exact backend error messages
  socket.off("connect_error");
  socket.on("connect_error", (err) => {
    console.error("❌ Socket connection error:", err.message);
    
    // Advanced: Catch exact auth failures from your backend
    if (
      err.message === "No token provided" || 
      err.message === "Invalid token payload" || 
      err.message.includes("jwt") ||
      err.message === "Unauthorized" // Kept as a fallback just in case
    ) {
      console.warn("⚠️ Socket unauthorized. Token may be expired.");
      // Tip: Dispatch global event so AuthContext can catch it and force logout or token refresh
      window.dispatchEvent(new Event("socket_unauthorized")); 
    }
  });

  // 🔥 FIX 3: Better Reconnect Listener Management (Manager instance)
  socket.io.off("reconnect");
  socket.io.on("reconnect", () => {
    console.log("🔄 Reconnected");
    // Note: Socket.io automatically re-sends the `socket.auth` payload upon reconnection!
  });

  // 🔥 FIX 4: Add Reconnect Attempt Log (Manager instance)
  socket.io.off("reconnect_attempt");
  socket.io.on("reconnect_attempt", (attempt) => {
    console.log(`🔄 Reconnect Attempt: ${attempt}`);
  });

  // 🔥 FIX 5: Global listener dispatches a DOM event so React Context/Components can easily listen
  socket.off("new_notification");
  socket.on("new_notification", (data) => {
    console.log("🔔 New notification:", data);
    // Dispatch custom event to window so your UI (like NotificationBell) can listen and update state
    window.dispatchEvent(new CustomEvent("global_new_notification", { detail: data }));
  });

  // 🔥 FIX 2: Disconnect should show reason
  socket.off("disconnect");
  socket.on("disconnect", (reason) => {
    console.log("🛑 Real-time Socket Disconnected:", reason);
  });

  // Safer connection logic executed AFTER all listeners are ready
  if (!socket.connected) {
    socket.connect();
  }
};

// 🔥 NEW: Call this from AuthContext.jsx when the user logs out
export const disconnectUserSocket = () => {
  if (socket.connected) {
    // 🔥 FIX 1: Explicitly remove custom listeners instead of using the dangerous removeAllListeners()
    socket.off("connect");
    socket.off("connect_error");
    socket.off("disconnect");
    socket.off("new_notification");
    
    socket.disconnect();
  }
};