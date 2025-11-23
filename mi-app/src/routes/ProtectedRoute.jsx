import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  // 👈 mientras loading está TRUE, no redirigimos
  if (loading) return <div>Cargando...</div>;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(user.rol)) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return children;
}

