import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import HomePage from "./pages/HomePage";
import Dashboard from "./components/Dashboard";
import LogsTable from "./components/LogsTable";
import Charts from "./components/Charts";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import VerifyEmail from "./components/VerifyEmail";
import ProtectedRoute from "./components/ProtectedRoute";

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

          {/* Auth Pages */}
          <Route path="/login" element={ <PublicRoute> <Login /> </PublicRoute> } />
          <Route path="/signup" element={ <PublicRoute> <Signup /> </PublicRoute> } />

          {/* Protected Pages */}
          <Route path="/dashboard" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute> } />
          <Route path="/logs" element={ <ProtectedRoute> <LogsTable /> </ProtectedRoute> } />
          <Route path="/charts" element={ <ProtectedRoute> <Charts /> </ProtectedRoute> } />
         

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
