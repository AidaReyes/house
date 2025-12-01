import { useAuth } from "../../../context/AuthContext";

export const useLogoutWithAlert = () => {
  const { logout } = useAuth();

  const logoutWithAlert = (message = "Tu sesión ha expirado") => {
    alert(message); // <-- Puedes cambiar esto por SweetAlert o tu modal
    logout();
    window.location.href = "/"; // redirecciona sin recargar toda la app
  };

  return { logoutWithAlert };
};
