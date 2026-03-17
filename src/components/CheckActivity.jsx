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
          `${API_BASE}/api/user/public-alert/details?id=${alertId}`,
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
      /* 🔥 UPDATED: Added fixed inset-0 z-50 to cover the navbar */
      <div className="fixed inset-0 z-50 bg-gray-50 flex items-center justify-center text-gray-900">
        <Loader2 className="animate-spin text-blue-600 mr-2" size={32} />
        <p className="font-medium">Fetching activity details...</p>
      </div>
    );
  }

  return (
    /* 🔥 UPDATED: Added fixed inset-0 z-50 and overflow-y-auto to cover the navbar and allow scrolling if needed */
    <div className="fixed inset-0 z-50 bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-900 overflow-y-auto">
      <div
        className={`w-full bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden transition-all duration-300 mx-auto max-w-md`}
      >
        <div className="p-6">
          <div className="animate-fade-in">
            {/* Details Card */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3 mb-6">
              <h3 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-3 border-b border-gray-200 pb-2">
                Alert Details
              </h3>

              <div className="flex items-start gap-2.5 pb-2 mb-2 border-b border-gray-200">
                <AlertOctagon className="text-red-500 mt-0.5" size={16} />
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider">
                    Alert Reason
                  </p>
                  <p className="text-sm font-bold text-black leading-tight mt-0.5 rounded-xl border border-red-300 bg-red-100 px-2 py-1 inline-block">
                    {activityData.reason}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="text-gray-500 mt-0.5" size={16} />
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider">
                    Email Address
                  </p>
                  <p className="text-sm font-medium text-gray-900 leading-tight mt-0.5">
                    {activityData.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Monitor className="text-gray-500 mt-0.5" size={16} />
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider">
                    Device Info
                  </p>
                  <p className="text-sm font-medium text-gray-900 leading-tight mt-0.5">
                    {activityData.device}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="text-gray-500 mt-0.5" size={16} />
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider">
                    Location
                  </p>
                  <p className="text-sm font-medium text-gray-900 leading-tight mt-0.5">
                    {activityData.location}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="text-gray-500 mt-0.5" size={16} />
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider">
                    Time
                  </p>
                  <p className="text-sm font-medium text-gray-900 leading-tight mt-0.5">
                    {activityData.time}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}