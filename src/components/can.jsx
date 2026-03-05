// src/components/Can.jsx
import { useAuth } from "../context/AuthContext";

export const Can = ({
  permiso,          
  permisos,        
  mode = "any",   
  children,
  fallback = null,
}) => {
  const { permisos: userPerms = [], loading } = useAuth();

  if (loading) return null;

  const required = permisos || (permiso ? [permiso] : []);

  if (!required.length) return fallback;

  const has =
    mode === "all"
      ? required.every((p) => userPerms.includes(p))
      : required.some((p) => userPerms.includes(p));

  return has ? children : fallback;
};

export default Can;
