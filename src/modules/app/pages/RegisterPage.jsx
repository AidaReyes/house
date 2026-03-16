import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiUser, BiEnvelope, BiLock, BiShow, BiHide } from "react-icons/bi";
import "./auth.css";
import { useRegister } from "../hooks/useRegister";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading, error } = useRegister();
  const topRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    usuario: "",
    password: "",
    confirm: "",
  });

  // 🔥 Partículas solo en la parte superior
  useEffect(() => {
    const container = topRef.current;
    if (!container) return;

    const createParticles = () => {
      container.querySelectorAll(".particle").forEach(p => p.remove());

      const particleCount = 60;

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";

        const size = Math.random() * 6 + 4;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.opacity = Math.random() * 0.6 + 0.2;
        particle.style.animationDuration = `${Math.random() * 10 + 6}s`;

        container.appendChild(particle);
      }
    };

    createParticles();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const user = await register(
      form.nombre,
      form.usuario,
      form.password
    );

    if (user) {
      navigate("/");
    }
  };

  return (
    <div className="login-page">

      {/* MITAD SUPERIOR */}
      <div className="top-section" ref={topRef}></div>

      {/* CONTENEDOR CENTRAL */}
      <div className="form-container">
        <div className="auth-wrapper">

          {/* LOGO ARRIBA */}
          <div className="logo-container">
            <img src="/logo_Dark.png" alt="Logo" className="logo" />
          </div>

          {/* FORMULARIO */}
          <form className="auth-card" onSubmit={handleSubmit}>
            <h2>Crear Cuenta</h2>

            <div className="input-group">
              <BiUser />
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <BiEnvelope />
              <input
                type="email"
                name="usuario"
                placeholder="Correo"
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <BiLock />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Contraseña"
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <BiHide /> : <BiShow />}
              </button>
            </div>

            <div className="input-group">
              <BiLock />
              <input
                type={showConfirm ? "text" : "password"}
                name="confirm"
                placeholder="Confirmar contraseña"
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <BiHide /> : <BiShow />}
              </button>
            </div>

            {error && <p className="error">{error}</p>}

            <button className="btn" disabled={loading}>
              {loading ? "Cargando..." : "Registrarse"}
            </button>

            <p className="switch">
              ¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link>
            </p>
          </form>

        </div>
      </div>

      {/* MITAD INFERIOR */}
      <div className="bottom-section"></div>

    </div>
  );
}