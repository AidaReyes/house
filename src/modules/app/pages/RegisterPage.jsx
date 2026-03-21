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
    type_User: false // 👈 por defecto no marcado = false
  });

  useEffect(() => {
    const container = topRef.current;
    if (!container) return;

    const createParticles = () => {
      container.querySelectorAll(".particle").forEach(p => p.remove());

      for (let i = 0; i < 60; i++) {
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
    window.addEventListener("resize", createParticles);

    return () => window.removeEventListener("resize", createParticles);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setForm({
        ...form,
        type_User: checked // ✅ true si está marcado, false si no
      });
    } else {
      setForm({ ...form, [name]: value });
    }
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

    // ✅ evitar error si user es null
    if (!user) {
      console.log("No se recibió respuesta del registro");
      return;
    }

    // Redirección según tipo
    if (form.type_User === false) {
      navigate("/"); // arrendador
    } else {
      navigate("/"); // usuario normal
    }
  };

  return (
    <div className="login-page">

      <div className="top-section" ref={topRef}></div>

      <div className="form-container">

        <div className="logo-container">
          <img src="/logo_Dark.png" alt="Logo" className="logo" />
        </div>

        <form className="auth-card" onSubmit={handleSubmit}>
          <h2>Crear Cuenta</h2>

          {/* Nombre */}
          <div className="input-group">
            <BiUser />
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          {/* Correo */}
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

          {/* Password */}
          <div className="input-group">
            <BiLock />
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
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <BiHide /> : <BiShow />}
            </button>
          </div>

          {/* Confirmar */}
          <div className="input-group">
            <BiLock />
            <input
              type={showConfirm ? "text" : "password"}
              name="confirm"
              placeholder="Confirmar contraseña"
              value={form.confirm}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <BiHide /> : <BiShow />}
            </button>
          </div>

          {/* Checkbox */}
          <div className="input-group" style={{ gap: "10px" }}>
            <input
              type="checkbox"
              id="arrendador"
              checked={form.type_User} // ✅ controlado
              onChange={handleChange}
            />
            <label htmlFor="arrendador">
              Registrarme como arrendador
            </label>
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

      <div className="bottom-section"></div>

    </div>
  );
}