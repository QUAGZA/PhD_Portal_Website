// src/hooks/useRequireAuth.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDecodedToken } from "../utils/authToken";

export default function useRequireAuth(requiredRoles = []) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    const decoded = getDecodedToken();

    if (!decoded || !decoded.roles || !Array.isArray(decoded.roles)) {
      localStorage.removeItem("token");
      navigate("/", { replace: true });
      return;
    }

    const hasRequiredRole = requiredRoles.some((role) =>
      decoded.roles.includes(role)
    );

    if (!hasRequiredRole) {
      navigate("/", { replace: true });
    }
  }, [navigate, requiredRoles]);
}
