import { useAuth } from "../../../context/AuthContext";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export const useLogoutWithAlert = () => {
  const { logout } = useAuth();

  const logoutWithAlert = async (
    message = "Tu sesión ha expirado"
  ) => {
    await Swal.fire({
      title: "Sesión finalizada",
      text: message,
      icon: "warning",
      background: "#ffffff",
      color: "#000000",
      iconColor: "#000000",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#000000",
      customClass: {
        popup: "logout-alert-popup",
      },
    });

    logout();
    window.location.href = "/";
  };

  return { logoutWithAlert };
};
