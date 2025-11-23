import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";
import { useRegister } from "../hooks/useRegister";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading, error } = useRegister();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    usuario: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const user = await register(form.nombre, form.usuario, form.password);

    if (user) {
      alert("Usuario creado correctamente");
      navigate("/");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-card">
        <h2 className="auth-title">Crear Cuenta</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              placeholder="Juan Pérez"
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Usuario</label>
            <input
              type="text"
              name="usuario"
              placeholder="usuario"
              onChange={handleChange}
            />
          </div>

          {/* 🔥 Contraseña */}
          <div className="input-group password-group">
            <label>Contraseña</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
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

          {/* 🔥 Confirmar contraseña */}
          <div className="input-group password-group">
            <label>Confirmar Contraseña</label>
            <div className="password-wrapper">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirm"
                placeholder="••••••••"
                onChange={handleChange}
              />
              <span
                className="password-toggle"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button className="auth-btn" disabled={loading}>
            {loading ? "Cargando..." : "Registrarse"}
          </button>
        </form>

        <p className="auth-switch">
          ¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}