import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";
import { useLogin } from "../hooks/useLogin";
import { BiEnvelope, BiLockAlt, BiShow, BiHide } from "react-icons/bi";

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
      container.querySelectorAll(".particle").forEach(p => p.remove());
      const particleCount = 90;

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
    const user = await login(form.usuario, form.password);
    if (user) navigate("/dashboard");
  };

  return (
    <div className="login-page">

      <div className="top-section" ref={topRef}></div>

      <div className="form-container">
        <div className="auth-wrapper">

          <div className="logo-container">
            <img src="/logo_Dark.png" alt="Logo" className="logo" />
          </div>

          <form className="auth-card" onSubmit={handleSubmit}>
            <h2>Iniciar Sesión</h2>

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
              <BiLockAlt />
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

            {error && <p className="error">{error}</p>}

            <button className="btn" disabled={loading}>
              {loading ? "Cargando..." : "Entrar"}
            </button>

            <p className="switch">
              ¿No tienes cuenta? <Link to="/register">Crear</Link>
            </p>
          </form>

        </div>
      </div>

      <div className="bottom-section"></div>

    </div>
  );
}