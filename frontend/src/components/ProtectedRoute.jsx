import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, admin = false }) {
  const { user } = useAuth();

  if (!user) {
    // Usuário não logado
    return <Navigate to="/login" />;
  }

  if (admin && user.role !== "admin") {
    // Tentou acessar rota admin sem ser admin
    return <Navigate to="/" />;
  }

  return children;
}
