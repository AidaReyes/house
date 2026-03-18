import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiUser, BiEnvelope, BiLock, BiShow, BiHide } from "react-icons/bi";
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
    <div className="auth-wrapper">
      <div className="auth-card glass">
        <h2 className="auth-title">Crear Cuenta</h2>
        <p className="auth-subtitle">Regístrate para continuar</p>

        <form onSubmit={handleSubmit}>

          {/* Nombre */}
          <div className="input-group">
            <label>Nombre</label>
            <div className="input-icon-box">
              <BiUser className="input-icon" />
              <input
                type="text"
                name="nombre"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="input-group">
            <label>Correo electrónico</label>
            <div className="input-icon-box">
              <BiEnvelope className="input-icon" />
              <input
                type="email"
                name="usuario"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="input-group">
            <label>Contraseña</label>
            <div className="input-icon-box">
              <BiLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <BiHide size={22} /> : <BiShow size={22} />}
              </button>
            </div>
          </div>

          {/* Confirmar */}
          <div className="input-group">
            <label>Confirmar contraseña</label>
            <div className="input-icon-box">
              <BiLock className="input-icon" />
              <input
                type={showConfirm ? "text" : "password"}
                name="confirm"
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="toggle-btn"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <BiHide size={22} /> : <BiShow size={22} />}
              </button>
            </div>
          </div>

          {error && <p className="error-text">{error}</p>}

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
