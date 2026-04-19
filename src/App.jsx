import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import { setNavigator } from "./services/navigationService"; // 🔥 NEW

// 🛑 CORE COMPONENTS (Imported normally so they load immediately, preventing UI flashes)
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import UserRoute from "./components/UserRoute";

// 🚀 LAZY LOADED COMPONENTS
// We use .then(module => ({ default: module.ComponentName })) because you are using named exports from your index files.

const Charts = lazy(() => import("./components/Charts").then((m) => ({ default: m.default || m })));
const Settings = lazy(() => import("./components/Settings").then((m) => ({ default: m.default || m })));
const Profile = lazy(() => import("./components/Profile").then((m) => ({ default: m.default || m })));
const CheckActivity = lazy(() => import("./components/CheckActivity").then((m) => ({ default: m.default || m })));

// Auth Pages
const Login = lazy(() => import("./pages/Auth").then((m) => ({ default: m.Login })));
const Signup = lazy(() => import("./pages/Auth").then((m) => ({ default: m.Signup })));
const ResetPassword = lazy(() => import("./pages/Auth").then((m) => ({ default: m.ResetPassword })));
const VerifyEmail = lazy(() => import("./pages/Auth").then((m) => ({ default: m.VerifyEmail })));
const ForgetPassword = lazy(() => import("./pages/Auth").then((m) => ({ default: m.ForgetPassword })));

// Common Pages
const HomePage = lazy(() => import("./pages/Common").then((m) => ({ default: m.HomePage })));
const AboutUs = lazy(() => import("./pages/Common").then((m) => ({ default: m.AboutUs })));
const ContactUs = lazy(() => import("./pages/Common").then((m) => ({ default: m.ContactUs })));
const Insider = lazy(() => import("./pages/Common").then((m) => ({ default: m.Insider })));
const LearnMore = lazy(() => import("./pages/Common").then((m) => ({ default: m.LearnMore })));
const ServerError = lazy(() => import("./pages/Common").then((m) => ({ default: m.ServerError })));
const RTMonitoring = lazy(() => import("./pages/Common").then((m) => ({ default: m.RTMonitoring })));
const SCAnalytics = lazy(() => import("./pages/Common").then((m) => ({ default: m.SCAnalytics })));
const Unauthorized = lazy(() => import("./pages/Common").then((m) => ({ default: m.Unauthorized })));

// Admin Pages
const AccessControl = lazy(() => import("./pages/Admin").then((m) => ({ default: m.AccessControl })));
const AdminDashboard = lazy(() => import("./pages/Admin").then((m) => ({ default: m.AdminDashboard })));
const Alerts = lazy(() => import("./pages/Admin").then((m) => ({ default: m.Alerts })));
const AnomalyReview = lazy(() => import("./pages/Admin").then((m) => ({ default: m.AnomalyReview })));
const Reports = lazy(() => import("./pages/Admin").then((m) => ({ default: m.Reports })));
const SystemLogs = lazy(() => import("./pages/Admin").then((m) => ({ default: m.SystemLogs })));
const UserManagement = lazy(() => import("./pages/Admin").then((m) => ({ default: m.UserManagement })));
const AdminHomepage = lazy(() => import("./pages/Admin").then((m) => ({ default: m.AdminHomepage })));

// User Pages
const Activity = lazy(() => import("./pages/User").then((m) => ({ default: m.Activity })));
const MyAlerts = lazy(() => import("./pages/User").then((m) => ({ default: m.MyAlerts })));
const MyReports = lazy(() => import("./pages/User").then((m) => ({ default: m.MyReports })));
const UserDashboard = lazy(() => import("./pages/User").then((m) => ({ default: m.UserDashboard })));

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

const PageLoader = () => (
  <div className="flex items-center justify-center w-full h-full text-gray-500 font-semibold tracking-wide">
    Loading page...
  </div>
);

function App() {
  const navigate = useNavigate(); // 🔥 Get navigate once

  // 🔥 Set the global navigator for use outside React components
  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

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
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<HomeGuard> <HomePage /> </HomeGuard>} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/insider" element={<Insider />} />
            <Route path="/learn-more" element={<LearnMore />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/rt-monitoring" element={<RTMonitoring />} />
            <Route path="/sc-analytics" element={<SCAnalytics />} />
            <Route path="/server-error" element={<ServerError />} />
            <Route path="/check-activity" element={<CheckActivity />} />


            {/* Auth Pages */}
            <Route path="/login" element={ <PublicRoute> {" "} <Login />{" "} </PublicRoute> } />
            <Route path="/signup" element={ <PublicRoute> {" "} <Signup />{" "} </PublicRoute> } />
            
            {/* Admin ONLY Protected Pages */}
            <Route element={<AdminRoute />}>
              <Route path="/charts" element={ <ProtectedRoute allowedRoles={["admin"]}> <Charts /> </ProtectedRoute> } />
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
        </Suspense>
      </div>
    </div>
  );
}

export default App;