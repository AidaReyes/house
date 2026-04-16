import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiEnvelope, BiLockAlt, BiShow, BiHide } from "react-icons/bi";
import "./auth.css";
import { useLogin } from "../hooks/useLogin";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error } = useLogin();
  const bgRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ usuario: "", password: "" });
  const [focused, setFocused] = useState("");

  /* partículas */
 


  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await login(form.usuario, form.password);
    if (user) navigate("/dashboard");
  };

  return (
    <div className="lp-root">
      <div className="lp-full-glow" />
      {/* ── LADO IZQUIERDO — branding ── */}
      <div className="lp-left" ref={bgRef}>
        <div className="lp-left-glow" />
        <div className="lp-left-circle lp-left-circle--top" />
        <div className="lp-left-circle lp-left-circle--bot" />

        <div className="lp-left-content">

          <div className="lp-logo">
            <div className="lp-logo-icon">🏠</div>
            <span className="lp-logo-name">Cozy House</span>
          </div>

          <div className="lp-pill">
            <span className="lp-pill-dot" />
            Zacualtipan de Ángeles, Hidalgo
          </div>

          <h1 className="lp-headline">
            Tu panel,<br />
            tu <em>control</em><br />
            total.
          </h1>

          <p className="lp-tagline">
            Gestiona cuartos, arrendadores y estudiantes desde
            un panel moderno, seguro y pensado para ti.
          </p>

          <div className="lp-stats">
            {[["40+", "Cuartos"], ["200+", "Estudiantes"], ["4.8★", "Calificación"]].map(
              ([num, lbl]) => (
                <div key={lbl} className="lp-stat">
                  <span className="lp-stat-num">{num}</span>
                  <span className="lp-stat-lbl">{lbl}</span>
                </div>
              )
            )}
          </div>

          <div className="lp-badge">
            <div className="lp-badge-icon">✅</div>
            <div>
              <div className="lp-badge-title">Cuartos verificados</div>
              <div className="lp-badge-sub">Revisados por Cozy House</div>
            </div>
          </div>

        </div>
      </div>

      {/* ── LADO DERECHO — formulario ── */}
      <div className="lp-right">
        <div className="lp-right-blob" />

        <div className="lp-form-wrap">

          {/* logo solo en móvil */}
          <div className="lp-mobile-logo">
            <div className="lp-logo-icon">🏠</div>
            <span className="lp-logo-name" style={{ color: "#1c1510" }}>Cozy House</span>
          </div>

          <div className="lp-form-head">
            <h2 className="lp-form-title">Bienvenido</h2>
            <p className="lp-form-sub">Inicia sesión para continuar</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>

            <div className="lp-field">
              <label className="lp-label">Correo electrónico</label>
              <div className={`lp-input-wrap ${focused === "usuario" ? "lp-input-wrap--focus" : ""}`}>
                <BiEnvelope className="lp-icon" />
                <input
                  type="email"
                  name="usuario"
                  placeholder="tu@correo.com"
                  value={form.usuario}
                  onChange={handleChange}
                  onFocus={() => setFocused("usuario")}
                  onBlur={() => setFocused("")}
                  className="lp-input"
                  required
                />
              </div>
            </div>

            <div className="lp-field">
              <label className="lp-label">Contraseña</label>
              <div className={`lp-input-wrap ${focused === "password" ? "lp-input-wrap--focus" : ""}`}>
                <BiLockAlt className="lp-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  className="lp-input"
                  required
                />
                <button
                  type="button"
                  className="lp-eye"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={showPassword ? "Ocultar" : "Mostrar"}
                >
                  {showPassword ? <BiHide /> : <BiShow />}
                </button>
              </div>
            </div>

            {error && (
              <div className="lp-error">
                <span>⚠</span> {error}
              </div>
            )}

            <button type="submit" className="lp-btn" disabled={loading}>
              {loading ? (
                <span className="lp-spinner" />
              ) : (
                "Iniciar sesión →"
              )}
            </button>

          </form>

          <p className="lp-switch">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="lp-switch-link">
              Crear cuenta gratis
            </Link>
          </p>

          <div className="lp-footer-note">
            <div className="lp-footer-icon">🏠</div>
            <span>Cozy House · Zacualtipan, Hidalgo · 2025</span>
          </div>

        </div>
      </div>

    </div>
  );
}
