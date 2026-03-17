import React, { useState, useEffect } from "react";
import {
  Key,
  HelpCircle,
  LogOut,
  User,
  Mail,
  Lock,
  Check,
  X,
  Monitor,
  Trash2 
} from "lucide-react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast"; 
import { maskEmail, maskPhone } from "../utils/maskData";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("account");
  const navigate = useNavigate();
  const { logout, refreshUser } = useAuth();

  // 🔥 NEW: Full page loading state
  const [pageLoading, setPageLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await api.post("/api/v1/logout").catch(() => {}); 
      await logout();
      toast.success("Logged out successfully");
    } catch (err) {
      toast.error("Failed to logout");
    } finally {
      navigate("/login", { replace: true });
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
  // 🔥 NEW: Delete account loading state
  const [deletingAccount, setDeletingAccount] = useState(false);

  const toggleEdit = (key) => {
    if (!editModes[key])
      setTempData((prev) => ({ ...prev, [key]: settings[key] || "" }));
    setEditModes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTempChange = (key, value) =>
    setTempData((prev) => ({ ...prev, [key]: value }));

  const handleSaveField = async (key) => {
    const isEmailChanged = key === "email" && tempData.email !== settings.email;

    try {
      await handleChange(key, tempData[key]);
      setEditModes((prev) => ({ ...prev, [key]: false }));

      if (isEmailChanged) {
        setSettings((prev) => ({ ...prev, isEmailVerified: false }));
      }
    } catch (err) {
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
        const { data } = await api.get(`/api/v1/settings`);
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
      await api.put(`/api/v1/settings/account`, {
        [key]: value,
      });
      toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} updated`);
      
      if (key === "email" && refreshUser) {
        await refreshUser();
      }
    } catch (err) {
      console.error("Failed to save changes:", err);
      toast.error("Failed to save changes");
      setSettings(previous); 
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
      await api.post(`/api/v1/sendotp`, { email: settings.email });

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
    setDeletingAccount(true);
    try {
      await api.delete(`/api/v1/settings/account`);
      toast.success("Account deleted successfully");
      await logout(); 
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 800);
    } catch (err) {
      console.error("Failed to delete account", err);
      toast.error("Failed to delete account. Please try again.");
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
      const { data } = await api.get(`/api/v1/settings/sessions`);
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
      await api.delete(`/api/v1/settings/sessions/${sessionId}`);
      toast.success("Device logged out successfully");
      
      const sessionToDelete = sessions?.find(s => s.id === sessionId);
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
      await api.delete(`/api/v1/settings/sessions`);
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

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">
              Profile Information
            </h3>

            <div className="flex items-center space-x-4 mb-2">
              {settings.avatarUrl ? (
                <img
                  src={`${api.defaults.baseURL?.replace(/\/+$/, "") || ""}${settings.avatarUrl}`}
                  className="h-16 w-16 rounded-full object-cover border"
                  alt="Avatar"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
                  {getInitials(settings.fname)}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="flex items-center justify-between w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed opacity-90">
                  <span className="text-gray-700 truncate">
                    {settings.fname || "Not set"}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex-shrink-0">
                    Not Editable
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                {editModes.email ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      value={tempData.email}
                      onChange={(e) =>
                        handleTempChange("email", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveField("email")}
                      className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                    >
                      <Check size={20} />
                    </button>
                    <button
                      onClick={() => toggleEdit("email")}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-white transition-colors">
                      <div className="flex items-center gap-3 w-full overflow-hidden">
                        <span className="text-gray-900 truncate">
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
                              className="text-[10px] bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-2 py-0.5 rounded-full font-bold transition flex-shrink-0 uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {sendingOtp ? "Sending..." : "Verify Now"}
                            </button>
                          ))}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleEdit("email")}
                      className="mt-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition inline-block"
                    >
                      Change Email
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                {editModes.phone ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="tel"
                      value={tempData.phone}
                      onChange={(e) =>
                        handleTempChange("phone", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveField("phone")}
                      className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                    >
                      <Check size={20} />
                    </button>
                    <button
                      onClick={() => toggleEdit("phone")}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-white transition-colors">
                      <div className="flex items-center gap-3 w-full overflow-hidden">
                        <span className="text-gray-900 truncate">
                          {maskPhone(settings.phone) || "Not set"}
                        </span>
                        {settings.phone && (
                          <button className="text-[10px] bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-2 py-0.5 rounded-full font-bold transition flex-shrink-0 uppercase tracking-wider">
                            Verify Now
                          </button>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleEdit("phone")}
                      className="mt-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition inline-block"
                    >
                      {settings.phone
                        ? "Change Phone Number"
                        : "Add Phone Number"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-3 mt-3">
              <h3 className="text-lg font-semibold text-red-600 mb-2">
                Danger Zone
              </h3>
              <div className="bg-red-50/80 border border-red-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-red-900">Delete Account</p>
                  <p className="text-sm text-red-700 mt-1">
                    Once you delete your account, there is no going back. Please
                    be certain.
                  </p>
                </div>
                {/* 🔥 REPLACED inline confirmation with a simple delete button */}
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-md transition-all flex-shrink-0 font-medium text-sm"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        );


      case "security":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Security Settings
            </h3>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg bg-white transition-colors">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-lg mr-4 flex-shrink-0">
                    <Lock className="text-yellow-600" size={20} />
                  </div>
                  <div className="text-left">
                    <button
                      onClick={() => navigate("/reset-password")}
                      className="font-medium text-gray-900 hover:text-blue-600 transition-colors focus:outline-none"
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                  <div className="flex items-center mb-4 sm:mb-0">
                    <div className="bg-green-100 p-2 rounded-lg mr-4 flex-shrink-0">
                      <Monitor className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Active Sessions</p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Manage devices currently logged into your account.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={handleViewDevices}
                    disabled={loadingSessions}
                    className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium whitespace-nowrap"
                  >
                    {loadingSessions ? "Loading..." : sessions ? "Hide Devices" : "View Devices"}
                  </button>
                </div>
                
                {sessions && (
                  <div className="mt-3 p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4 shadow-inner transition-all">
                    
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <h4 className="text-sm font-semibold text-gray-900">Your Logged-in Devices</h4>
                      {sessions.length > 1 && (
                        <button 
                          onClick={handleLogoutAllOtherSessions}
                          disabled={actionLoading}
                          className="text-xs font-semibold text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                        >
                          Log out all other devices
                        </button>
                      )}
                    </div>

                    {sessions.length > 0 ? (
                      sessions.map((session, idx) => (
                        <div key={session.id || idx} className="flex flex-col sm:flex-row justify-between sm:items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm gap-3">
                          <div>
                            <p className="font-medium text-gray-800 text-sm">
                              {session.device ? session.device.split(' | ')[0] : "Unknown Device"}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Location: {session.location || "Unknown"} • Last Active: {session.lastActive ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(session.lastActive)) : "Recently"}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-3 self-end sm:self-auto">
                            {session.current ? (
                              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                                Current
                              </span>
                            ) : (
                              <button
                                onClick={() => handleLogoutSession(session.id)}
                                disabled={actionLoading}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200 rounded-md transition-all disabled:opacity-50"
                              >
                                <Trash2 size={14} /> Log out
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">No active sessions recorded in the database.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "support":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Help & Support
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {supportLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={link.action}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition w-full"
                >
                  <div className="flex items-center">
                    <div className={`${link.bg} p-2 rounded-lg mr-4`}>
                      <link.icon className={link.text} size={24} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{link.title}</p>
                      <p className="text-sm text-gray-500">{link.desc}</p>
                    </div>
                  </div>
                  <div className="text-gray-400">
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
          </div>
        );
      default:
        return null;
    }
  };

  // 🔥 NEW: Full Page Loader UI
  if (pageLoading) {
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          {/* Animated Text */}
          <p className="text-gray-500 font-medium animate-pulse text-sm">
            Loading settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[calc(100vh-3.5rem)] h-auto overflow-y-auto overflow-x-hidden bg-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">
            Manage your account details and preferences.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <nav className="flex flex-col p-2 space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-600 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <tab.icon
                      size={18}
                      className={`mr-3 ${activeTab === tab.id ? "text-blue-600" : "text-gray-400"}`}
                    />
                    {tab.label}
                  </button>
                ))}
              </nav>
              <div className="p-4 border-t border-gray-100 mt-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center text-red-600 hover:text-red-700 text-sm font-medium w-full px-2 py-2 rounded-lg hover:bg-red-50 transition"
                >
                  <LogOut size={18} className="mr-3" /> Sign Out
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 NEW: Delete Confirmation Modal with backdrop blur */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !deletingAccount && setShowDeleteConfirm(false)}
          ></div>
          {/* Modal */}
          <div className="relative bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Are you sure?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              This action cannot be undone. This will permanently delete your
              account and remove all associated data.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deletingAccount}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {deletingAccount ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;