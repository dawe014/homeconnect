import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "./Spinner";

interface ProtectedRouteProps {
  allowedRoles: Array<"user" | "agent" | "admin">;
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner />;
  }

  // Check if user is authenticated and if their role is in the allowed list
  const isAuthorized =
    isAuthenticated && user && allowedRoles.includes(user.role);

  return isAuthorized ? <Outlet /> : <Navigate to="/login" replace />;
}
