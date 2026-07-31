import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // Check your exact auth logic/key name here
  const isAuthenticated = Boolean(localStorage.getItem("token") || localStorage.getItem("user"));

  if (!isAuthenticated) {
    // Must return Navigate, NOT null
    return <Navigate to="/login" replace />;
  }

  // Must render Outlet for nested routes, or children
  return children ? children : <Outlet />;
}