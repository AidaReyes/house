import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiEnvelope, BiLockAlt, BiShow, BiHide } from "react-icons/bi";
import "./auth.css";
import { useLogin } from "../hooks/useLogin";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error } = useLogin();

  const topRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    usuario: "",
    password: "",
  });

  useEffect(() => {
    const container = topRef.current;
    if (!container) return;

    const createParticles = () => {
      container.querySelectorAll(".particle").forEach((p) => p.remove());

      for (let i = 0; i < 45; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";

        const size = Math.random() * 6 + 4;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;

        particle.style.opacity = Math.random() * 0.5 + 0.15;
        particle.style.animationDuration = `${Math.random() * 8 + 6}s`;

        container.appendChild(particle);
      }
    };

    createParticles();
    window.addEventListener("resize", createParticles);

    return () => window.removeEventListener("resize", createParticles);
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await login(form.usuario, form.password);
    if (user) navigate("/dashboard");
  };

  return (
    <div className="login-page">
      <div className="top-section" ref={topRef}></div>
      <div className="bottom-section"></div>

      <div className="form-container">
        <div className="brand-block">
          <img src="/logo_Dark.png" alt="Logo" className="logo" />
          <p className="brand-subtitle">Accede a tu panel y gestiona tu sistema</p>
        </div>

        <form className="auth-card" onSubmit={handleSubmit}>
          <h2>Bienvenido</h2>
          <p className="auth-subtitle">Inicia sesión para continuar</p>

          <div className="input-group">
            <BiEnvelope />
            <input
              type="email"
              name="usuario"
              placeholder="Correo"
              value={form.usuario}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <BiLockAlt />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <BiHide /> : <BiShow />}
            </button>
          </div>

          {error && <p className="error">{error}</p>}

          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Cargando..." : "Entrar"}
          </button>

          <p className="switch">
            ¿No tienes cuenta? <Link to="/register">Crear cuenta</Link>
          </p>
        </form>
      </div>
    </div>
  );
}