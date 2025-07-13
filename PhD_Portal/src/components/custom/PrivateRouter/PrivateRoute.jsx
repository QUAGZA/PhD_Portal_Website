import { Navigate, Outlet } from "react-router-dom";
import { getDecodedToken } from "../../../utils/authToken";

export default function PrivateRoute({ requiredRoles }) {
  const tokenData = getDecodedToken();

  if (!tokenData) {
    return <Navigate to="/" />;
  }

  const userRoles = tokenData.roles || []; 
  const isAuthorized = userRoles.includes(requiredRoles); 

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
