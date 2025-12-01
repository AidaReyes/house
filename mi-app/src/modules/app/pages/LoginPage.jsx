import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";
import { useLogin } from "../hooks/useLogin";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error } = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    usuario: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = await login(form.usuario, form.password);

    if (user) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-card">
        <h2 className="auth-title">Iniciar Sesión</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              name="usuario"
              onChange={handleChange}
            />
          </div>

          <div className="input-group password-group">
            <label>Contraseña</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={handleChange}
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button className="auth-btn" disabled={loading}>
            {loading ? "Cargando..." : "Entrar"}
          </button>
        </form>

        <p className="auth-switch">
          ¿No tienes cuenta? <Link to="/register">Crear cuenta</Link>
        </p>
      </div>
    </div>
  );
}