import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiUser, BiEnvelope, BiLock, BiShow, BiHide } from "react-icons/bi";
import "./auth.css";
import { useRegister } from "../hooks/useRegister";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading, error } = useRegister();
  const bgRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [focused, setFocused]           = useState("");

  const [form, setForm] = useState({
    nombre:    "",
    usuario:   "",
    password:  "",
    confirm:   "",
    type_User: false,
  });

  /* partículas */


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
      form.password,
      form.type_User
    );

    if (!user) {
      console.log("No se recibió respuesta del registro");
      return;
    }

    navigate("/login");
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
            Únete a<br />
            nuestra <em>comunidad</em><br />
            hoy.
          </h1>

          <p className="lp-tagline">
            Crea tu cuenta y accede a cuartos verificados,
            seguros y cerca de tu plantel educativo o trabajo.
          </p>

          <div className="lp-stats">
            {[["40+","Cuartos"],["200+","Estudiantes"],["4.8★","Calificación"]].map(
              ([num, lbl]) => (
                <div key={lbl} className="lp-stat">
                  <span className="lp-stat-num">{num}</span>
                  <span className="lp-stat-lbl">{lbl}</span>
                </div>
              )
            )}
          </div>

          {/* cards de tipo de cuenta */}
          <div className="lp-type-cards">
            <div className={`lp-type-card ${!form.type_User ? "lp-type-card--active" : ""}`}>
              <div className="lp-type-card-icon">🎓</div>
              <div className="lp-type-card-name">Estudiante</div>
              <div className="lp-type-card-desc">Busca y renta cuartos</div>
            </div>
            <div className={`lp-type-card ${form.type_User ? "lp-type-card--active" : ""}`}>
              <div className="lp-type-card-icon">🏠</div>
              <div className="lp-type-card-name">Arrendador</div>
              <div className="lp-type-card-desc">Publica tus cuartos</div>
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
            <h2 className="lp-form-title">Crear cuenta</h2>
            <p className="lp-form-sub">Regístrate para encontrar tu cuarto ideal</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>

            {/* nombre */}
            <div className="lp-field">
              <label className="lp-label">Nombre completo</label>
              <div className={`lp-input-wrap ${focused === "nombre" ? "lp-input-wrap--focus" : ""}`}>
                <BiUser className="lp-icon" />
                <input
                  type="text"
                  name="nombre"
                  placeholder="Tu nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  onFocus={() => setFocused("nombre")}
                  onBlur={() => setFocused("")}
                  className="lp-input"
                  required
                />
              </div>
            </div>

            {/* correo */}
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

            {/* password */}
            <div className="lp-field lp-field--half">
              <div>
                <label className="lp-label">Contraseña</label>
                <div className={`lp-input-wrap ${focused === "password" ? "lp-input-wrap--focus" : ""}`}>
                  <BiLock className="lp-icon" />
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

              <div>
                <label className="lp-label">Confirmar</label>
                <div className={`lp-input-wrap ${focused === "confirm" ? "lp-input-wrap--focus" : ""}`}>
                  <BiLock className="lp-icon" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirm"
                    placeholder="••••••••"
                    value={form.confirm}
                    onChange={handleChange}
                    onFocus={() => setFocused("confirm")}
                    onBlur={() => setFocused("")}
                    className="lp-input"
                    required
                  />
                  <button
                    type="button"
                    className="lp-eye"
                    onClick={() => setShowConfirm((p) => !p)}
                    aria-label={showConfirm ? "Ocultar" : "Mostrar"}
                  >
                    {showConfirm ? <BiHide /> : <BiShow />}
                  </button>
                </div>
              </div>
            </div>

            {/* tipo de cuenta */}
            <div className="lp-checkbox-row">
              <label className="lp-checkbox-label">
                <div className="lp-checkbox-wrap">
                  <input
                    type="checkbox"
                    name="type_User"
                    id="arrendador"
                    checked={form.type_User}
                    onChange={handleChange}
                    className="lp-checkbox-input"
                  />
                  <div className="lp-checkbox-box">
                    {form.type_User && <span className="lp-checkbox-check">✓</span>}
                  </div>
                </div>
                <div>
                  <div className="lp-checkbox-title">Registrarme como arrendador</div>
                  <div className="lp-checkbox-sub">Podrás publicar cuartos en la plataforma</div>
                </div>
              </label>
            </div>

            {error && (
              <div className="lp-error">
                <span>⚠</span> {error}
              </div>
            )}

            <button type="submit" className="lp-btn" disabled={loading}>
              {loading ? <span className="lp-spinner" /> : "Crear cuenta →"}
            </button>

          </form>

          <p className="lp-switch">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="lp-switch-link">
              Iniciar sesión
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
