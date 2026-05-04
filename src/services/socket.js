import { io } from "socket.io-client";

const API_BASE = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") || "http://localhost:3000";

// autoConnect: false ensures we only connect when the user is actually logged in
export const socket = io(API_BASE, { 
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket"] 
});

// 🔥 NEW: Call this from AuthContext.jsx when the user logs in
export const connectUserSocket = (token, userId) => {
  if (!token || !userId) return;

  // 1. Attach the token for the secure backend handshake we built
  socket.auth = { token };

  // 🔥 FIX 6: Guard to prevent multi-call overlap
  if (socket.connected) return;

  // 2. Set up listeners BEFORE connecting to ensure we never miss the initial event
  socket.off("connect"); // Prevent duplicate listeners if called multiple times
  socket.on("connect", () => {
    // 🔥 FIX 3: Utilizing userId for explicit debugging context
    console.log(`✅ Real-time Socket Connected: ${socket.id} (User: ${userId})`);
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

  // Handle auto-reconnects gracefully (socket.io is the Manager instance)
  // Check to ensure we don't stack duplicate reconnect listeners
  if (!socket.io.listeners("reconnect").length) {
    socket.io.on("reconnect", () => {
      console.log("🔄 Reconnected");
      // Note: Socket.io automatically re-sends the `socket.auth` payload upon reconnection!
    });
  }

  // 🔥 FIX 5: Global listener dispatches a DOM event so React Context/Components can easily listen
  socket.off("new_notification");
  socket.on("new_notification", (data) => {
    console.log("🔔 New notification:", data);
    // Dispatch custom event to window so your UI (like NotificationBell) can listen and update state
    window.dispatchEvent(new CustomEvent("global_new_notification", { detail: data }));
  });

  socket.off("disconnect");
  socket.on("disconnect", () => {
    console.log("🛑 Real-time Socket Disconnected");
  });

  // Safer connection logic executed AFTER all listeners are ready
  if (!socket.connected) {
    socket.connect();
  }
};

// 🔥 NEW: Call this from AuthContext.jsx when the user logs out
export const disconnectUserSocket = () => {
  if (socket.connected) {
    // 🔥 IMPORTANT: Clean up memory and prevent duplicate events on re-login
    socket.removeAllListeners(); 
    socket.disconnect();
  }
};