import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  Monitor,
  Clock,
  Mail,
  AlertOctagon,
  Loader2,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "");

export default function CheckActivity() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  const [activityData, setActivityData] = useState({
    email: "",
    device: "",
    location: "",
    time: "",
    reason: "",
  });

  useEffect(() => {
    const alertId = searchParams.get("alertId");

    const fetchActivityDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE}/api/v1/public-alert/details?id=${alertId}`,
        );

        const data = response.data;

        setActivityData({
          email: data.email || "N/A",
          device: data.device || "Unknown Device",
          location: data.location || "Unknown Location",
          time: data.time
            ? new Date(data.time).toLocaleString()
            : new Date().toLocaleString(),
          reason: data.reason || "Suspicious Login",
        });
      } catch (error) {
        console.error("Error fetching UBA alert details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (alertId) {
      fetchActivityDetails();
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      /* 🔥 UPDATED: Centered mobile-friendly loader while keeping the fixed overlay */
      <div className="fixed inset-0 z-[100] bg-gray-50 flex items-center justify-center text-gray-900 p-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
          <Loader2 className="animate-spin text-blue-600 shrink-0" size={28} />
          <p className="font-medium text-sm sm:text-base text-gray-700">Fetching activity details...</p>
        </div>
      </div>
    );
  }

  return (
    /* 🔥 UPDATED: Fixed overlay with internal scrolling to handle mobile viewports seamlessly without forcing PC scrollbars */
    <div className="fixed inset-0 z-[100] bg-gray-50 overflow-y-auto font-sans text-gray-900">
      <div className="min-h-[100dvh] w-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden transition-all duration-300 mx-auto max-w-[95%] sm:max-w-md lg:max-w-lg">
          <div className="p-5 sm:p-6 md:p-8">
            <div className="animate-fade-in">
              {/* Details Card */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 sm:p-5 space-y-4 sm:space-y-5 mb-2">
                <h3 className="text-xs sm:text-sm font-bold text-red-600 uppercase tracking-wider mb-2 border-b border-gray-200 pb-3">
                  Alert Details
                </h3>

                <div className="flex items-start gap-3 sm:gap-3.5 pb-3 sm:pb-4 border-b border-gray-200">
                  <AlertOctagon className="text-red-500 mt-0.5 shrink-0" size={20} />
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-semibold">
                      Alert Reason
                    </p>
                    <p className="text-sm sm:text-base font-bold text-red-700 leading-tight mt-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 inline-block break-words">
                      {activityData.reason}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-3.5">
                  <Mail className="text-gray-400 mt-0.5 shrink-0" size={18} />
                  <div className="min-w-0 w-full">
                    <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-semibold">
                      Email Address
                    </p>
                    <p className="text-sm sm:text-base font-medium text-gray-900 leading-relaxed mt-0.5 break-all sm:break-normal">
                      {activityData.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-3.5">
                  <Monitor className="text-gray-400 mt-0.5 shrink-0" size={18} />
                  <div className="min-w-0 w-full">
                    <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-semibold">
                      Device Info
                    </p>
                    <p className="text-sm sm:text-base font-medium text-gray-900 leading-relaxed mt-0.5 break-words">
                      {activityData.device}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-3.5">
                  <MapPin className="text-gray-400 mt-0.5 shrink-0" size={18} />
                  <div className="min-w-0 w-full">
                    <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-semibold">
                      Location
                    </p>
                    <p className="text-sm sm:text-base font-medium text-gray-900 leading-relaxed mt-0.5 break-words">
                      {activityData.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-3.5">
                  <Clock className="text-gray-400 mt-0.5 shrink-0" size={18} />
                  <div className="min-w-0 w-full">
                    <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-semibold">
                      Time
                    </p>
                    <p className="text-sm sm:text-base font-medium text-gray-900 leading-relaxed mt-0.5">
                      {activityData.time}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}