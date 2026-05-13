import React, { useState, useEffect, useRef } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Save,
  Camera,
  X,
} from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { maskEmail, maskPhone } from "../../utils/maskData";

const formatName = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const ProfilePage = () => {
  const { refreshUser } = useAuth();
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // 🔥 NEW: State for full page loading animation
  const [pageLoading, setPageLoading] = useState(true);
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    joinDate: "",
    avatar: "",
  });

  const [editForm, setEditForm] = useState({ ...profileData });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Start loading
        setPageLoading(true);
        // ✅ FIX 1: Removed manual token fetching. Interceptor handles this.
        const res = await api.get("/api/v1/auth/profile");

        if (res.data.success) {
          const profile = res.data.profile;

          // ✅ Explicit Mapping to preserve specific strings like "unknown"
          const mappedData = {
            firstName: profile.firstName || "",
            middleName: profile.middleName || "",
            lastName: profile.lastName || "",
            email: profile.email || "",
            phone: profile.phone || "",
            location: profile.location || "",
            bio: profile.bio || "",
            joinDate: profile.joinDate || "",
            avatar: profile.avatar || "",
            createdAt: profile.createdAt || "",
          };

          setProfileData(mappedData);
          setEditForm(mappedData);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        // 🔥 Stop loading only after data is mounted
        setPageLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditBioClick = () => {
    setEditForm({ ...profileData });
    setIsEditingBio(true);
  };

  const handleCancelBioClick = () => {
    setIsEditingBio(false);
  };

  const handleSaveBioClick = async () => {
    try {
      // ✅ FIX 1: Removed manual token fetching. Interceptor handles this.
      const res = await api.put("/api/v1/auth/profile", editForm);

      if (res.data.success) {
        setProfileData(res.data.profile);
        setIsEditingBio(false);
        toast.success("Bio updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update bio");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    // ✅ FIX 3: Disable click during upload to prevent double-clicks
    if (isUploadingAvatar) return;
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, GIF).");
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      toast.error("Image must be less than 1MB.");
      return;
    }

    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      // ✅ FIX: Cleaned up post request - Axios automatically handles multipart headers when given FormData
      const res = await api.post("/api/v1/auth/profile/avatar", formData);

      if (res.data.avatarUrl) {
        setProfileData((prev) => ({ ...prev, avatar: res.data.avatarUrl }));
        toast.success("Avatar updated successfully!");
        await refreshUser();
      }
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload avatar.");
    } finally {
      setIsUploadingAvatar(false);
      e.target.value = null;
    }
  };

  const displayFullName =
    [profileData.firstName, profileData.middleName, profileData.lastName]
      .filter(Boolean)
      .map(formatName)
      .join(" ") || profileData.name;

  const getInitials = () => {
    const firstInitial = profileData.firstName?.charAt(0) || "";
    const lastInitial = profileData.lastName?.charAt(0) || "";
    return (firstInitial + lastInitial).toUpperCase();
  };

  const formatJoinDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  // 🔥 Full Page Loader UI Overlay
  if (pageLoading) {
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse text-sm sm:text-base text-center">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gray-50 p-4 sm:p-6 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Profile
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage your personal information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 sticky top-4 sm:top-6">
              <div className="flex flex-col items-center mb-5 sm:mb-6">
                <div className="relative mb-3 sm:mb-4">
                  {/* Fluid avatar sizing */}
                  <div
                    className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center overflow-hidden shadow-md border-4 border-white transition-opacity ${isUploadingAvatar ? "opacity-50" : "opacity-100"} ${!profileData.avatar && "bg-gradient-to-r from-blue-500 to-purple-600"}`}
                  >
                    {profileData.avatar ? (
                      <img
                        src={profileData.avatar}
                        // ✅ FIX: Improved image fallback to revert gracefully to initials
                        onError={(e) => {
                          e.target.onerror = null;
                          setProfileData(prev => ({ ...prev, avatar: "" }));
                        }}
                        alt="Profile Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl sm:text-5xl font-bold text-white tracking-wide">
                        {getInitials()}
                      </span>
                    )}
                  </div>

                  {/* Camera button positioning for touch targets */}
                  <button
                    onClick={handleAvatarClick}
                    disabled={isUploadingAvatar}
                    className="absolute bottom-0 right-0 sm:bottom-1 sm:right-1 bg-gray-800 hover:bg-gray-700 text-white p-2 sm:p-2.5 rounded-full shadow-lg border-2 border-white transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed active:scale-95"
                    title="Change Avatar"
                  >
                    <Camera size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/gif"
                    className="hidden"
                  />

                  {isUploadingAvatar && (
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-md shadow text-[10px] sm:text-xs font-medium text-blue-600 whitespace-nowrap">
                      Uploading...
                    </div>
                  )}
                </div>

                <p className="text-[10px] sm:text-xs text-gray-400 mb-3 sm:mb-3 -mt-1 text-center">
                  Max file size: 1MB
                </p>

                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center px-2">
                  {displayFullName || "Loading..."}
                </h2>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 sm:space-y-4 mb-2">
                <div className="flex items-start sm:items-center text-gray-700">
                  <Mail
                    size={18}
                    className="text-gray-400 mr-3 mt-0.5 sm:mt-0 shrink-0"
                  />
                  <span className="text-sm break-all sm:break-normal">
                    {maskEmail(profileData.email) || "No email"}
                  </span>
                </div>

                <div className="flex items-start sm:items-center text-gray-700">
                  <Phone
                    size={18}
                    className="text-gray-400 mr-3 mt-0.5 sm:mt-0 shrink-0"
                  />
                  <span className="text-sm">
                    {maskPhone(profileData.phone) || "No phone number"}
                  </span>
                </div>

                <div className="flex items-start sm:items-center text-gray-700">
                  <MapPin
                    size={18}
                    className="text-gray-400 mr-3 mt-0.5 sm:mt-0 shrink-0"
                  />
                  <span className="text-sm leading-snug">
                    {/* Explicitly check for white space/empty to show placeholder */}
                    {profileData.location && profileData.location.trim() !== ""
                      ? profileData.location
                      : "Location not set"}
                  </span>
                </div>

                <div className="flex items-start sm:items-center text-gray-700">
                  <Calendar
                    size={18}
                    className="text-gray-400 mr-3 mt-0.5 sm:mt-0 shrink-0"
                  />
                  <span className="text-sm leading-snug">
                    Joined{" "}
                    {formatJoinDate(profileData.joinDate) ||
                      formatJoinDate(profileData.createdAt) ||
                      "Recently"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-5 sm:space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-5">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  About Me
                </h3>
                {!isEditingBio && (
                  <button
                    onClick={handleEditBioClick}
                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition p-1 sm:p-0 active:scale-95"
                  >
                    <Edit2 size={16} className="mr-1.5" /> Edit
                  </button>
                )}
              </div>

              {isEditingBio ? (
                <div>
                  <textarea
                    name="bio"
                    value={editForm.bio || ""}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 sm:p-4 mb-4 focus:ring-2 focus:ring-blue-500 outline-none resize-none text-base sm:text-sm"
                    placeholder="Tell us about yourself..."
                  />
                  <div className="flex flex-col sm:flex-row justify-end gap-3 sm:space-x-3">
                    <button
                      onClick={handleCancelBioClick}
                      className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-gray-100 text-gray-700 rounded-xl sm:rounded-lg hover:bg-gray-200 transition flex items-center justify-center font-medium active:scale-[0.98]"
                    >
                      <X size={18} className="mr-1.5 sm:w-4 sm:h-4" /> Cancel
                    </button>
                    <button
                      onClick={handleSaveBioClick}
                      className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-blue-600 text-white rounded-xl sm:rounded-lg hover:bg-blue-700 transition flex items-center justify-center font-medium active:scale-[0.98]"
                    >
                      <Save size={18} className="mr-1.5 sm:w-4 sm:h-4" /> Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {profileData.bio ||
                    "No bio added yet. Click edit to add some information about yourself."}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
