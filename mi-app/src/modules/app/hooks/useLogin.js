import { useState } from "react";
import { authService } from "../service/auth.service";
import { useAuth } from "../../../context/AuthContext";

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { login: saveUser } = useAuth();

    const login = async (usuario, password) => {
        setLoading(true);
        setError(null);

        try {
            const user = await authService.login(usuario, password);

        
            // Guardar token
            localStorage.setItem("token", user.token);

            // Guardar usuario en el contexto
            saveUser(user);

            return user;
        } catch (err) {
            setError(err.response?.data?.message || "Error al iniciar sesión");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
};
