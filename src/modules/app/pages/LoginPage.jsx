import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";
import { useLogin } from "../hooks/useLogin";

import { BiEnvelope, BiLockAlt, BiShow, BiHide } from "react-icons/bi";

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
    if (user) navigate("/dashboard");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card glass">
        <h2 className="auth-title">Bienvenido</h2>
        <p className="auth-subtitle">Inicia sesión para continuar</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Correo electrónico</label>
            <div className="input-icon-box">
              <BiEnvelope className="input-icon" />
              <input type="email" name="usuario" onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <div className="input-icon-box">
              <BiLockAlt className="input-icon" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={handleChange}
              />

              <button
                type="button"
                className="toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <BiHide size={20} /> : <BiShow size={20} />}
              </button>
            </div>
          </div>

          {error && <p className="error-text">{error}</p>}

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
