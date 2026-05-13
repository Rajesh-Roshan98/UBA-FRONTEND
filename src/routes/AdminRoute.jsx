import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  // Grab loading state from your context so we don't redirect prematurely
  const { loading } = useAuth(); 
  const token = localStorage.getItem('token');

  // 1. Show a spinner while AuthContext is figuring out if the user is logged in
  // if (loading) {
  //   return (
  //     <div className="w-full h-full overflow-hidden flex items-center justify-center bg-gray-50">
  //       <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
  //     </div>
  //   );
  // }

  // 2. If there is no token at all, kick them to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 3. Decode the token to verify they actually have the "admin" role
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    // If they are a normal user, kick them to the regular homepage
    if (payload.role !== 'admin') {
      // 🔥 FIX: Added ?code=403 to trigger the specific "Access Denied" UI
      return <Navigate to="/unauthorized?code=403" replace />;
    }
  } catch (error) {
    console.error("Token decoding failed:", error);
    // If the token is mangled or fake, clear it and kick them to login
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }

  // 4. If they pass all checks, render the admin page!
  // Supports both wrapping (<AdminRoute><Component/></AdminRoute>) and Outlets
  return children ? children : <Outlet />;
};

export default AdminRoute;
