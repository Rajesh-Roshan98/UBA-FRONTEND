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
import AdminRoute from "./components/AdminRoute";
import UserRoute from "./components/UserRoute";
import CheckActivity from "./components/CheckActivity";

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
  Alerts,
  AnomalyReview,
  Reports,
  SystemLogs,
  UserManagement,
  AdminHomepage,
} from "./pages/Admin";

import {
  Activity,
  MyAlerts,
  MyReports,
  UserDashboard,
} from "./pages/User";

// 🔐 Public Route (redirects logged-in users based on their role)
const PublicRoute = ({ children }) => {
  // 🔥 FIX 1: Added 'loading' here so the router waits for the backend to confirm the role
  const { isAuthenticated, user, loading } = useAuth(); 

  if (loading) return null; // Pauses the redirect until the role is loaded!

  if (isAuthenticated) {
    // Check if the user is an admin
    if (user?.role === "admin") {
      // 'replace' ensures they can't use the back button to return to the public/login routes
      return <Navigate to="/admin-homepage" replace />;
    }
    // Normal users go to the common homepage
    return <Navigate to="/" replace />;
  }

  // If not authenticated, render the public page (Login/Signup)
  return children;
};

// 🛡️ Home Guard (Prevents Admins from staying on the common homepage)
const HomeGuard = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return null;

  // If an Admin tries to access the common homepage, bounce them back to their dashboard
  if (isAuthenticated && user?.role === "admin") {
    return <Navigate to="/admin-homepage" replace />;
  }

  // Regular users and guests are allowed to stay
  return children;
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
          <Route path="/" element={<HomeGuard> <HomePage /> </HomeGuard>} />
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
          <Route path="/check-activity" element={<CheckActivity />} />


          {/* Auth Pages */}
          <Route path="/login" element={ <PublicRoute> {" "} <Login />{" "} </PublicRoute> } />
          <Route path="/signup" element={ <PublicRoute> {" "} <Signup />{" "} </PublicRoute> } />

          {/* Protected Pages (Accessible by any verified user) */}
          <Route path="/dashboard" element={ <ProtectedRoute> {" "} <Dashboard />{" "} </ProtectedRoute> } />
          <Route path="/logs" element={ <ProtectedRoute> {" "} <LogsTable />{" "} </ProtectedRoute> } />
          <Route path="/charts" element={ <ProtectedRoute> {" "} <Charts />{" "} </ProtectedRoute> } />

          {/* Admin ONLY Protected Pages */}
          <Route element={<AdminRoute />}>
            <Route path="/admin-dashboard" element={ <ProtectedRoute allowedRoles={["admin"]}> <AdminDashboard /> </ProtectedRoute> } />
            <Route path="/access-control" element={ <ProtectedRoute allowedRoles={["admin"]}> <AccessControl /> </ProtectedRoute> } />
            <Route path="/alerts" element={ <ProtectedRoute allowedRoles={["admin"]}> <Alerts /> </ProtectedRoute> } />
            <Route path="/anomaly-review" element={ <ProtectedRoute allowedRoles={["admin"]}> <AnomalyReview /> </ProtectedRoute> } />
            <Route path="/reports" element={ <ProtectedRoute allowedRoles={["admin"]}> <Reports /> </ProtectedRoute> } />
            <Route path="/system-logs" element={ <ProtectedRoute allowedRoles={["admin"]}> <SystemLogs /> </ProtectedRoute> } />
            <Route path="/user-management" element={ <ProtectedRoute allowedRoles={["admin"]}> <UserManagement /> </ProtectedRoute> } />
            <Route path="/admin-homepage" element={ <ProtectedRoute allowedRoles={["admin"]}> <AdminHomepage /> </ProtectedRoute> } />
          </Route>

          {/* User Pages */}
          <Route element={<UserRoute />}>
            <Route path="/activity" element={ <ProtectedRoute allowedRoles={["user"]}> <Activity /> </ProtectedRoute> } />
            <Route path="/my-alerts" element={ <ProtectedRoute allowedRoles={["user"]}> <MyAlerts /> </ProtectedRoute> } />
            <Route path="/my-reports" element={ <ProtectedRoute allowedRoles={["user"]}> <MyReports /> </ProtectedRoute> } />
            <Route path="/user-dashboard" element={ <ProtectedRoute allowedRoles={["user"]}> <UserDashboard /> </ProtectedRoute> } />
          </Route>

          {/* Email Verification */}
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
