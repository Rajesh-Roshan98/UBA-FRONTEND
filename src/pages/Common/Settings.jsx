import React, { useState, useEffect } from "react";
import {
  Key,
  HelpCircle,
  LogOut,
  User,
  Mail,
  Lock,
  Monitor,
  Trash2,
  Copy,
  Check,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { maskEmail, maskPhone } from "../../utils/maskData";
import { motion, AnimatePresence } from "framer-motion";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("account");
  const navigate = useNavigate();
  const { logout, refreshUser, userId } = useAuth();

  const [pageLoading, setPageLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [copiedId, setCopiedId] = useState(false);
  const [savingField, setSavingField] = useState(null);
  const [lastUpdated, setLastUpdated] = useState({});
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false); // 🔥 NEW: Toggle for password visibility

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await api.post("/api/v1/auth/logout").catch(() => {});
      await logout();
      toast.success("Logged out successfully");
    } catch (err) {
      toast.error("Failed to logout");
    } finally {
      navigate("/login", { replace: true });
      setIsLoggingOut(false);
    }
  };

  const [settings, setSettings] = useState({
    email: "",
    fname: "",
    phone: "",
    avatarUrl: "",
    isEmailVerified: false,
  });

  const [editModes, setEditModes] = useState({
    fname: false,
    email: false,
    phone: false,
  });
  const [tempData, setTempData] = useState({ fname: "", email: "", phone: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [sessions, setSessions] = useState(null);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const [deletingAccount, setDeletingAccount] = useState(false);

  const toggleEdit = (key) => {
    if (!editModes[key])
      setTempData((prev) => ({ ...prev, [key]: settings[key] || "" }));
    setEditModes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTempChange = (key, value) =>
    setTempData((prev) => ({ ...prev, [key]: value }));

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(userId);
      setCopiedId(true);
      toast.success("Account ID copied to clipboard");
      setTimeout(() => setCopiedId(false), 2000);
    } catch {
      toast.error("Copy failed");
    }
  };

  const handleSaveField = async (key) => {
    if (savingField) return;

    if (tempData[key] === settings[key]) {
      toast("No changes made", { icon: "ℹ️" });
      setEditModes((prev) => ({ ...prev, [key]: false }));
      return;
    }

    const isEmailChanged = key === "email" && tempData.email !== settings.email;

    if (key === "fname") {
      const trimmedName = tempData.fname.trim();
      if (trimmedName === "") {
        toast.error("Full name cannot be empty");
        return;
      }
      if (trimmedName.length < 2) {
        toast.error("Full name must be at least 2 characters long");
        return;
      }
      if (trimmedName.length > 50) {
        toast.error("Full name cannot exceed 50 characters");
        return;
      }
    }

    if (key === "email") {
      const trimmedEmail = tempData.email.trim();
      if (trimmedEmail === "") {
        toast.error("Email cannot be empty");
        return;
      }
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(trimmedEmail)) {
        toast.error("Please enter a valid email format");
        return;
      }
    }

    if (key === "phone") {
      const trimmedPhone = tempData.phone.trim();
      if (trimmedPhone === "") {
        toast.error("Phone number cannot be empty");
        return;
      }
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(trimmedPhone)) {
        toast.error("Phone number must be exactly 10 digits");
        return;
      }
    }

    try {
      setSavingField(key);
      await handleChange(key, tempData[key]);
      setEditModes((prev) => ({ ...prev, [key]: false }));
      setLastUpdated((prev) => ({
        ...prev,
        [key]: new Date().toLocaleString(),
      }));

      if (isEmailChanged) {
        setSettings((prev) => ({ ...prev, isEmailVerified: false }));
      }
    } catch (err) {
    } finally {
      setSavingField(null);
    }
  };

  const getInitials = (name) => {
    const parts = name?.trim().split(/\s+/) || [];
    if (!parts.length || !parts[0]) return "U";
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setPageLoading(true);
        const { data } = await api.get(`/api/v1/auth/settings`);
        setSettings((prev) => ({ ...prev, ...data }));
      } catch (err) {
        console.error("Error fetching settings:", err);
        toast.error("Failed to load settings");
      } finally {
        setPageLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = async (key, value) => {
    const previous = { ...settings };
    const updated = { ...settings, [key]: value };

    setSettings(updated);

    try {
      await api.put(`/api/v1/auth/settings/account`, {
        [key]: value,
      });
      toast.success(`Saved ✔`);

      if (key === "email" && refreshUser) {
        await refreshUser();
      }
    } catch (err) {
      console.error("Failed to save changes:", err);
      toast.error("Failed to save changes");
      setSettings(previous);
      throw err;
    }
  };

  const handleVerifyEmail = async () => {
    if (!settings.email) {
      toast.error("No email found");
      return;
    }

    if (sendingOtp) return;
    setSendingOtp(true);

    try {
      await api.post(`/api/v1/auth/sendotp`, { email: settings.email });

      if (refreshUser) {
        await refreshUser();
      }

      toast.success("Verification code sent to your email");

      navigate("/verify-email", {
        state: { email: settings.email, otpSent: true },
      });
    } catch (err) {
      console.error("Failed to initiate verification", err);
      toast.error("Failed to send verification code");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      toast.error("Password is required to delete your account");
      return;
    }

    setDeletingAccount(true);
    try {
      await api.delete(`/api/v1/auth/settings/account`, {
        data: { password: deletePassword },
      });
      toast.success("Account deleted successfully");
      await logout();
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 800);
    } catch (err) {
      console.error("Failed to delete account", err);
      toast.error(
        err.response?.data?.message ||
          "Failed to delete account. Please try again.",
      );
      setDeletingAccount(false);
    }
  };

  const handleViewDevices = async () => {
    if (sessions) {
      setSessions(null);
      return;
    }

    setLoadingSessions(true);
    try {
      const { data } = await api.get(`/api/v1/auth/settings/sessions`);
      setSessions(data.sessions || []);
    } catch (err) {
      console.error("Failed to load sessions:", err);
      toast.error("Failed to load active sessions");
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleLogoutSession = async (sessionId) => {
    setActionLoading(true);
    try {
      await api.delete(`/api/v1/auth/settings/sessions/${sessionId}`);
      toast.success("Device logged out successfully");

      const sessionToDelete = sessions?.find((s) => s.id === sessionId);
      if (sessionToDelete?.current) {
        await logout();
        navigate("/login", { replace: true });
        return;
      }

      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch (err) {
      console.error("Failed to logout session:", err);
      toast.error("Failed to log out device");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogoutAllOtherSessions = async () => {
    setActionLoading(true);
    try {
      await api.delete(`/api/v1/auth/settings/sessions`);
      toast.success("All other devices logged out successfully");
      setSessions((prev) => prev.filter((s) => s.current));
    } catch (err) {
      console.error("Failed to logout other sessions:", err);
      toast.error("Failed to log out other devices");
    } finally {
      setActionLoading(false);
    }
  };

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "security", label: "Security", icon: Key },
    { id: "support", label: "Help & Support", icon: HelpCircle },
  ];

  const supportLinks = [
    {
      id: "help",
      icon: HelpCircle,
      title: "Help Center",
      desc: "Browse tutorials and guides",
      bg: "bg-purple-100",
      text: "text-purple-600",
      action: () => navigate("/help"),
    },
    {
      id: "contact",
      icon: Mail,
      title: "Contact Support",
      desc: "Get help from our team",
      bg: "bg-blue-100",
      text: "text-blue-600",
      action: () => (window.location.href = "mailto:support@yourdomain.com"),
    },
  ];

  const tabContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <motion.div
            key="account"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4 sm:space-y-2"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Profile Information
            </h3>

            <div className="flex items-center space-x-4 mb-4 sm:mb-2">
              {settings.avatarUrl ? (
                // ✅ FIX: Removed local API_BASE URL and used pure Cloudinary URL with fallback
                <img
                  src={settings.avatarUrl}
                  onError={(e) => {
                    e.target.onerror = null;
                    setSettings(prev => ({ ...prev, avatarUrl: "" }));
                  }}
                  className="h-16 w-16 rounded-full object-cover border"
                  alt="Avatar"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
                  {getInitials(settings.fname)}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-3">
              {/* Row 1 Side-by-Side: Full Name and Account ID */}
              <div>
                <div className="flex justify-between items-end mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  {lastUpdated.fname && !editModes.fname && (
                    <span className="text-[10px] text-green-600">
                      Updated: {lastUpdated.fname}
                    </span>
                  )}
                </div>
                {editModes.fname ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempData.fname}
                      onChange={(e) =>
                        handleTempChange("fname", e.target.value)
                      }
                      className="w-full px-4 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveField("fname")}
                      disabled={savingField === "fname"}
                      className="flex items-center justify-center min-w-[70px] px-4 py-3 sm:py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shrink-0 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {savingField === "fname" ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </button>
                    <button
                      onClick={() => toggleEdit("fname")}
                      disabled={savingField === "fname"}
                      className="px-4 py-3 sm:py-2 bg-gray-100 text-gray-700 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-200 transition shrink-0 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center w-full px-4 py-3 sm:py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-white transition-colors">
                      <div className="flex items-center gap-3 w-full overflow-hidden">
                        <span className="text-sm sm:text-base text-gray-900 truncate">
                          {settings.fname || "Not set"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleEdit("fname")}
                      className="mt-1.5 sm:mt-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition inline-block p-1 sm:p-0 cursor-pointer"
                    >
                      Change Name
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account ID
                </label>
                {/* 🔥 UPDATED: Added cursor-not-allowed and (Not editable) text */}
                <div className="flex items-center justify-between w-full px-4 py-3 sm:py-2 bg-gray-100 border border-gray-200 rounded-lg group transition-all cursor-not-allowed opacity-95">
                  <div className="flex items-center overflow-hidden">
                    <span className="text-sm sm:text-base font-mono font-semibold text-gray-700 truncate tracking-wider">
                      {userId || "N/A"}
                    </span>
                    <span className="ml-2 text-xs font-medium text-gray-400 whitespace-nowrap hidden sm:inline">
                      (Not editable)
                    </span>
                  </div>
                  <button
                    onClick={handleCopyId}
                    className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 hover:text-blue-600 font-bold uppercase tracking-wider flex-shrink-0 ml-2 transition-colors p-1 cursor-pointer"
                    title="Copy Account ID"
                  >
                    {copiedId ? (
                      <Check size={14} className="text-green-500" />
                    ) : (
                      <Copy size={14} />
                    )}
                    <span className="hidden sm:inline">
                      {copiedId ? "Copied" : "Copy"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Row 2 Side-by-Side: Email and Phone */}
              <div>
                <div className="flex justify-between items-end mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  {lastUpdated.email && !editModes.email && (
                    <span className="text-[10px] text-green-600">
                      Updated: {lastUpdated.email}
                    </span>
                  )}
                </div>
                {editModes.email ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      value={tempData.email}
                      onChange={(e) =>
                        handleTempChange("email", e.target.value)
                      }
                      className="w-full px-4 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveField("email")}
                      disabled={savingField === "email"}
                      className="flex items-center justify-center min-w-[70px] px-4 py-3 sm:py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shrink-0 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {savingField === "email" ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </button>
                    <button
                      onClick={() => toggleEdit("email")}
                      disabled={savingField === "email"}
                      className="px-4 py-3 sm:py-2 bg-gray-100 text-gray-700 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-200 transition shrink-0 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center w-full px-4 py-3 sm:py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-white transition-colors">
                      <div className="flex items-center gap-3 w-full overflow-hidden">
                        <span className="text-sm sm:text-base text-gray-900 truncate">
                          {maskEmail(settings.email) || "Not set"}
                        </span>
                        {settings.email &&
                          (settings.isEmailVerified ? (
                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold flex-shrink-0 uppercase tracking-wider">
                              Verified
                            </span>
                          ) : (
                            <button
                              onClick={handleVerifyEmail}
                              disabled={sendingOtp}
                              className="text-[10px] bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-2 py-1 sm:py-0.5 rounded-full font-bold transition flex-shrink-0 uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                              {sendingOtp ? "Sending..." : "Verify Now"}
                            </button>
                          ))}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleEdit("email")}
                      className="mt-1.5 sm:mt-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition inline-block p-1 sm:p-0 cursor-pointer"
                    >
                      Change Email
                    </button>
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-end mb-1 mt-2 md:mt-0">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  {lastUpdated.phone && !editModes.phone && (
                    <span className="text-[10px] text-green-600">
                      Updated: {lastUpdated.phone}
                    </span>
                  )}
                </div>
                {editModes.phone ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="tel"
                      value={tempData.phone}
                      onChange={(e) =>
                        handleTempChange("phone", e.target.value)
                      }
                      className="w-full px-4 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveField("phone")}
                      disabled={savingField === "phone"}
                      className="flex items-center justify-center min-w-[70px] px-4 py-3 sm:py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shrink-0 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {savingField === "phone" ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </button>
                    <button
                      onClick={() => toggleEdit("phone")}
                      disabled={savingField === "phone"}
                      className="px-4 py-3 sm:py-2 bg-gray-100 text-gray-700 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-200 transition shrink-0 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center w-full px-4 py-3 sm:py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-white transition-colors">
                      <div className="flex items-center gap-3 w-full overflow-hidden">
                        <span className="text-sm sm:text-base text-gray-900 truncate">
                          {maskPhone(settings.phone) || "Not set"}
                        </span>
                        {settings.phone && (
                          <button className="text-[10px] bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-2 py-1 sm:py-0.5 rounded-full font-bold transition flex-shrink-0 uppercase tracking-wider">
                            Verify Now
                          </button>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleEdit("phone")}
                      className="mt-1.5 sm:mt-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition inline-block p-1 sm:p-0 cursor-pointer"
                    >
                      {settings.phone
                        ? "Change Phone Number"
                        : "Add Phone Number"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 sm:pt-3 mt-4 sm:mt-3">
              <h3 className="text-lg font-semibold text-red-600 mb-2">
                Danger Zone
              </h3>
              <div className="bg-red-50/80 border border-red-200 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-3">
                <div>
                  <p className="font-semibold text-red-900">Delete Account</p>
                  <p className="text-sm text-red-700 mt-1">
                    Once you delete your account, there is no going back. Please
                    be certain.
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full md:w-auto px-5 py-3 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-md transition-all flex-shrink-0 font-medium text-sm text-center cursor-pointer"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </motion.div>
        );

      case "security":
        return (
          <motion.div
            key="security"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Security Settings
            </h3>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 border border-gray-200 rounded-lg bg-white transition-colors">
                <div className="flex items-start sm:items-center">
                  <div className="bg-yellow-100 p-2.5 sm:p-2 rounded-lg mr-4 flex-shrink-0">
                    <Lock className="text-yellow-600" size={20} />
                  </div>
                  <div className="text-left">
                    <button
                      onClick={() => navigate("/reset-password")}
                      className="font-medium text-base sm:text-sm text-gray-900 hover:text-blue-600 transition-colors focus:outline-none text-left cursor-pointer"
                    >
                      Change Password
                    </button>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Secure your account by updating your password.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                  <div className="flex items-start sm:items-center mb-4 sm:mb-0">
                    <div className="bg-green-100 p-2.5 sm:p-2 rounded-lg mr-4 flex-shrink-0">
                      <Monitor className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-base sm:text-sm text-gray-900">
                        Active Sessions
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Manage devices currently logged into your account.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleViewDevices}
                    disabled={loadingSessions}
                    className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium whitespace-nowrap text-center cursor-pointer"
                  >
                    {loadingSessions
                      ? "Loading..."
                      : sessions
                        ? "Hide Devices"
                        : "View Devices"}
                  </button>
                </div>

                <AnimatePresence>
                  {sessions && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-3 p-4 sm:p-5 border border-gray-200 rounded-lg bg-gray-50 space-y-4 shadow-inner overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-3 gap-2">
                        <h4 className="text-sm font-semibold text-gray-900">
                          Your Logged-in Devices
                        </h4>
                        {sessions.length > 1 && (
                          <button
                            onClick={handleLogoutAllOtherSessions}
                            disabled={actionLoading}
                            className="text-sm sm:text-xs font-semibold text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 self-start sm:self-auto p-1 sm:p-0 -ml-1 sm:ml-0"
                          >
                            Log out all other devices
                          </button>
                        )}
                      </div>

                      {sessions.length > 0 ? (
                        <div className="space-y-3">
                          {[...sessions]
                            .sort(
                              (a, b) =>
                                (b.current ? 1 : 0) - (a.current ? 1 : 0),
                            )
                            .map((session, idx) => (
                              <div
                                key={session.id || idx}
                                className="flex flex-col sm:flex-row justify-between sm:items-center bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm gap-3"
                              >
                                <div>
                                  <p className="font-medium text-gray-800 text-sm">
                                    {session.device
                                      ? session.device.split(" | ")[0]
                                      : "Unknown Device"}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1 sm:mt-0.5 leading-relaxed">
                                    Location: {session.location || "Unknown"}{" "}
                                    <br className="sm:hidden" />
                                    <span className="hidden sm:inline">
                                      {" "}
                                      •{" "}
                                    </span>
                                    Last Active:{" "}
                                    {session.lastActive
                                      ? new Intl.DateTimeFormat("en-US", {
                                          dateStyle: "medium",
                                          timeStyle: "short",
                                        }).format(new Date(session.lastActive))
                                      : "Recently"}
                                  </p>
                                </div>

                                <div className="flex items-center gap-3 self-start sm:self-auto w-full sm:w-auto justify-between sm:justify-end mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                                  {session.current ? (
                                    <span className="text-[10px] bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                                      Current
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        handleLogoutSession(session.id)
                                      }
                                      disabled={actionLoading}
                                      className="flex items-center gap-1.5 px-3 py-2 sm:py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200 rounded-md transition-all disabled:opacity-50 w-full sm:w-auto justify-center"
                                    >
                                      <Trash2 size={14} /> Log out
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          No active sessions recorded in the database.
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        );

      case "support":
        return (
          <motion.div
            key="support"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Help & Support
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
              {supportLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={link.action}
                  className="flex items-center justify-between p-4 sm:p-5 border border-gray-200 rounded-lg hover:bg-gray-50 transition w-full"
                >
                  <div className="flex items-center">
                    <div
                      className={`${link.bg} p-2.5 sm:p-2 rounded-lg mr-4 flex-shrink-0`}
                    >
                      <link.icon className={link.text} size={24} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900 text-base sm:text-sm">
                        {link.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {link.desc}
                      </p>
                    </div>
                  </div>
                  <div className="text-gray-400 shrink-0 ml-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  if (pageLoading) {
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse text-sm">
            Loading settings...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm"
          >
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-indigo-900 font-medium animate-pulse tracking-wide">
              logging out...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full h-full bg-gray-100 p-4 sm:p-6 md:p-8 font-sans">
        <div className="max-w-7xl mx-auto w-full">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Settings
            </h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1">
              Manage your account details and preferences.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <nav className="flex flex-col p-2 space-y-1 relative">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center w-full px-4 py-3 sm:py-2.5 text-sm font-medium rounded-lg transition-all ${
                        activeTab === tab.id
                          ? "text-blue-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTabIndicator"
                          className="absolute inset-0 bg-blue-50 rounded-lg shadow-sm"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                      <span className="relative flex items-center z-10">
                        <tab.icon
                          size={18}
                          className={`mr-3 ${activeTab === tab.id ? "text-blue-600" : "text-gray-400"}`}
                        />
                        {tab.label}
                      </span>
                    </button>
                  ))}
                </nav>
                <div className="p-3 sm:p-4 border-t border-gray-100 mt-1 sm:mt-2">
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className={`flex items-center justify-center sm:justify-start text-sm font-medium w-full px-2 py-3 sm:py-2 rounded-lg transition cursor-pointer ${
                      isLoggingOut
                        ? "text-gray-400 cursor-not-allowed opacity-50"
                        : "text-red-600 hover:text-red-700 hover:bg-red-50 bg-red-50 sm:bg-transparent"
                    }`}
                  >
                    <LogOut size={18} className="mr-2 sm:mr-3" /> Sign Out
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full min-w-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6 md:p-8 overflow-hidden">
                <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            >
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => !deletingAccount && setShowDeleteConfirm(false)}
              ></div>
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="relative bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Delete Account?
                </h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  This action cannot be undone. This will permanently delete
                  your account and remove all associated data.
                </p>

                {/* 🔥 UPDATED: Password Input with Eye Toggle */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password to Delete
                  </label>
                  <div className="relative">
                    <input
                      type={showDeletePassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-10"
                      disabled={deletingAccount}
                    />
                    <button
                      type="button"
                      onClick={() => setShowDeletePassword(!showDeletePassword)}
                      disabled={deletingAccount}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      {showDeletePassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type <span className="font-bold text-red-600">DELETE</span>{" "}
                    to confirm
                  </label>
                  <input
                    type="text"
                    placeholder="Type DELETE"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    disabled={deletingAccount}
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeletePassword("");
                      setDeleteConfirmText("");
                      setShowDeletePassword(false); // 🔥 Reset visibility on cancel
                    }}
                    disabled={deletingAccount}
                    className="w-full sm:w-auto px-5 py-3 sm:py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1 text-center cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={
                      deletingAccount ||
                      !deletePassword.trim() ||
                      deleteConfirmText !== "DELETE"
                    }
                    className="w-full sm:w-auto px-5 py-3 sm:py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 order-1 sm:order-2 cursor-pointer"
                  >
                    {deletingAccount ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Yes, Delete"
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default SettingsPage;
