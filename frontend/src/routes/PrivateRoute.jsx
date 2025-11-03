import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, roleRequired }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to="/" />;
  }

  return children;
}