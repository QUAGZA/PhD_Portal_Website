import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { checkAuthStatus } from "../redux/slices/authSlice";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children, role = null }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await dispatch(checkAuthStatus()).unwrap();
      } catch (error) {
        console.error("Failed to check authentication status:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (isChecking || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-[#B7202E]" />
          <h2 className="mt-4 text-xl font-medium">Verifying your session...</h2>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page but save the location they were trying to access
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  if (role && user?.role !== role) {
    // User doesn't have the required role, redirect based on their actual role
    const redirectPath = (() => {
      switch (user?.role) {
        case "Student":
          return "/student/dashboard";
        case "Guide":
          return "/guide/dashboard";
        case "Admin":
          return "/faculty-coordinator/dashboard";
        default:
          return "/";
      }
    })();

    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
