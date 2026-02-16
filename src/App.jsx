import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import LogsTable from "./components/LogsTable";
import Charts from "./components/Charts";
import ProtectedRoute from "./components/ProtectedRoute";
import Settings from "./components/Settings";
import Profile from "./components/Profile";
import AdminLayout from "./layouts/AdminLayout";

import {
  Login,
  Signup,
  ResetPassword,
  VerifyEmail,
  ForgetPassword,
} from "./pages/Auth";

import {
  HomePage,
  AboutUs,
  ContactUs,
  Insider,
  LearnMore,
  NotFound,
  RTMonitoring,
  SCAnalytics,
  Unauthorized,
  ViewDemo,
} from "./pages/Common";


import {
  AccessControl,
  AdminDashboard,
  AdminPanel,
  Alerts,
  AnomalyReview,
  ModelResults,
  Reports,
  SystemLogs,
  UserManagement,
} from "./pages/Admin";

// 🔐 Public Route (redirects logged-in users)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" /> : children;
};

function App() {
  return (
    <div className="w-screen h-screen flex flex-col">
      {/* ✅ Toast must be mounted FIRST */}
      <Toaster
        position="top-right"
        containerStyle={{
          top: "4rem", // or the height of your navbar, e.g., 56px = 3.5rem ~ 4rem
          right: "1rem", // distance from right edge
          zIndex: 50,
        }}
      />

      {/* Navbar */}
      <div className="pt-14">
        <Navbar />
        <Outlet />
      </div>

      {/* Main Content */}
      <div className="grow w-full h-full overflow-auto">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/insider" element={<Insider />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/view-demo" element={<ViewDemo />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/rt-monitoring" element={<RTMonitoring />} />
          <Route path="/sc-analytics" element={<SCAnalytics />} />
          <Route path="/not-found" element={<NotFound />} />

          {/* Auth Pages */}
          <Route path="/login" element={ <PublicRoute> {" "} <Login />{" "} </PublicRoute> } />
          <Route path="/signup" element={ <PublicRoute> {" "} <Signup />{" "} </PublicRoute> } />

          {/* Protected Pages */}
          <Route path="/dashboard" element={ <ProtectedRoute> {" "} <Dashboard />{" "} </ProtectedRoute> } />
          <Route path="/logs" element={ <ProtectedRoute> {" "} <LogsTable />{" "} </ProtectedRoute> } />
          <Route path="/charts" element={ <ProtectedRoute> {" "} <Charts />{" "} </ProtectedRoute> } />

          <Route path="/admin-dashboard" element={ <ProtectedRoute> <AdminDashboard /> </ProtectedRoute> } />
          <Route path="/admin-panel" element={ <ProtectedRoute> <AdminPanel /> </ProtectedRoute> } />
          <Route path="/access-control" element={ <ProtectedRoute> <AccessControl /> </ProtectedRoute> } />
          <Route path="/alerts" element={ <ProtectedRoute> <Alerts /> </ProtectedRoute> } />
          <Route path="/anomaly-review" element={ <ProtectedRoute> <AnomalyReview /> </ProtectedRoute> } />
          <Route path="/model-results" element={ <ProtectedRoute> <ModelResults /> </ProtectedRoute> } />
          <Route path="/reports" element={ <ProtectedRoute> <Reports /> </ProtectedRoute> } />
          <Route path="/system-logs" element={ <ProtectedRoute> <SystemLogs /> </ProtectedRoute> } />
          <Route path="/user-management" element={ <ProtectedRoute> <UserManagement /> </ProtectedRoute> } />
          <Route path="/admin-dashboard" element={ <ProtectedRoute> <AdminDashboard /> </ProtectedRoute> } />

          {/* Email Verification */}
          <Route path="/verify-email" element={<VerifyEmail />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
