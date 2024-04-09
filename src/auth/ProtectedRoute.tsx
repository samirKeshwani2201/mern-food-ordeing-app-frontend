import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  console.log(isAuthenticated);
  if (isLoading) return null;
  if (isAuthenticated) {
    return <Outlet />;
  }
  return <Navigate to="/" replace />;

  // below line wont work as when we directly hit /manage-res.. than useAuth takes time to get isAuthenticated so till that time it navigates to home
  // return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
