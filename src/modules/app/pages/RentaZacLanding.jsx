import { useState } from 'react'
import './RentaZacLanding.css'

const Cuarto1 = () => (
  <svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="rz-c1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#8B6F47" /><stop offset="1" stopColor="#3A2010" />
      </linearGradient>
    </defs>
    <rect width="300" height="220" fill="url(#rz-c1)" />
    <rect x="0" y="150" width="300" height="70" fill="rgba(0,0,0,.25)" />
    <rect x="80" y="30" width="90" height="80" rx="2" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.25)" strokeWidth="2" />
    <line x1="125" y1="30" x2="125" y2="110" stroke="rgba(255,255,255,.2)" strokeWidth="1.5" />
    <line x1="80" y1="70" x2="170" y2="70" stroke="rgba(255,255,255,.2)" strokeWidth="1.5" />
    <rect x="88" y="38" width="33" height="28" fill="rgba(135,180,220,.3)" />
    <rect x="128" y="38" width="33" height="28" fill="rgba(224,175,100,.2)" />
    <rect x="20" y="120" width="110" height="70" rx="4" fill="rgba(255,255,255,.12)" />
    <rect x="20" y="120" width="110" height="20" rx="4" fill="rgba(255,255,255,.18)" />
    <rect x="30" y="124" width="36" height="12" rx="3" fill="rgba(255,255,255,.3)" />
    <rect x="180" y="110" width="100" height="8" rx="2" fill="rgba(255,255,255,.18)" />
    <rect x="187" y="118" width="6" height="38" fill="rgba(255,255,255,.12)" />
    <rect x="267" y="118" width="6" height="38" fill="rgba(255,255,255,.12)" />
    <rect x="195" y="90" width="50" height="30" rx="2" fill="rgba(30,50,70,.6)" stroke="rgba(255,255,255,.2)" strokeWidth="1" />
    <rect x="198" y="93" width="44" height="24" rx="1" fill="rgba(80,140,200,.3)" />
    <rect x="192" y="120" width="56" height="5" rx="1" fill="rgba(255,255,255,.15)" />
    <ellipse cx="130" cy="178" rx="80" ry="10" fill="rgba(193,98,47,.2)" />
  </svg>
)

const Cuarto2 = () => (
  <svg viewBox="0 0 280 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="rz-c2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#556B7A" /><stop offset="1" stopColor="#1E3040" />
      </linearGradient>
    </defs>
    <rect width="280" height="200" fill="url(#rz-c2)" />
    <rect x="0" y="140" width="280" height="60" fill="rgba(0,0,0,.3)" />
    <rect x="20" y="40" width="60" height="90" rx="2" fill="rgba(255,255,255,.07)" stroke="rgba(255,255,255,.12)" strokeWidth="1" />
    <rect x="20" y="65" width="60" height="2" fill="rgba(255,255,255,.15)" />
    <rect x="20" y="90" width="60" height="2" fill="rgba(255,255,255,.15)" />
    <rect x="26" y="45" width="8" height="18" rx="1" fill="rgba(193,98,47,.5)" />
    <rect x="37" y="48" width="8" height="15" rx="1" fill="rgba(74,124,89,.5)" />
    <rect x="48" y="46" width="8" height="17" rx="1" fill="rgba(224,122,79,.4)" />
    <rect x="59" y="44" width="8" height="19" rx="1" fill="rgba(80,120,180,.4)" />
    <rect x="100" y="105" width="130" height="55" rx="5" fill="rgba(255,255,255,.1)" />
    <rect x="100" y="105" width="130" height="18" rx="5" fill="rgba(255,255,255,.08)" />
    <rect x="100" y="105" width="14" height="55" rx="3" fill="rgba(255,255,255,.1)" />
    <rect x="216" y="105" width="14" height="55" rx="3" fill="rgba(255,255,255,.1)" />
    <rect x="118" y="108" width="36" height="22" rx="3" fill="rgba(255,255,255,.14)" />
    <rect x="160" y="108" width="36" height="22" rx="3" fill="rgba(193,98,47,.25)" />
    <rect x="230" y="100" width="6" height="30" fill="rgba(74,124,89,.4)" />
    <ellipse cx="233" cy="96" rx="18" ry="22" fill="rgba(74,124,89,.4)" />
    <ellipse cx="220" cy="100" rx="10" ry="14" fill="rgba(74,124,89,.3)" />
    <ellipse cx="246" cy="98" rx="10" ry="14" fill="rgba(74,124,89,.3)" />
    <rect x="225" y="128" width="16" height="14" rx="2" fill="rgba(139,100,60,.4)" />
  </svg>
)

const Cuarto3 = () => (
  <svg viewBox="0 0 260 190" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="rz-c3" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#4A6A5A" /><stop offset="1" stopColor="#1A3025" />
      </linearGradient>
    </defs>
    <rect width="260" height="190" fill="url(#rz-c3)" />
    <rect x="0" y="135" width="260" height="55" fill="rgba(0,0,0,.25)" />
    <rect x="60" y="20" width="140" height="90" rx="3" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.2)" strokeWidth="1.5" />
    <rect x="68" y="28" width="58" height="74" fill="rgba(135,200,170,.12)" />
    <rect x="132" y="28" width="58" height="74" fill="rgba(220,190,120,.08)" />
    <line x1="130" y1="20" x2="130" y2="110" stroke="rgba(255,255,255,.18)" strokeWidth="1.5" />
    <rect x="20" y="100" width="70" height="6" rx="2" fill="rgba(255,255,255,.18)" />
    <rect x="28" y="106" width="5" height="35" fill="rgba(255,255,255,.1)" />
    <rect x="57" y="106" width="5" height="35" fill="rgba(255,255,255,.1)" />
    <rect x="43" y="88" width="14" height="14" rx="2" fill="rgba(193,98,47,.5)" />
    <rect x="200" y="30" width="50" height="110" rx="2" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.15)" strokeWidth="1" />
    <line x1="225" y1="30" x2="225" y2="140" stroke="rgba(255,255,255,.12)" strokeWidth="1" />
    <circle cx="219" cy="87" r="3" fill="rgba(255,255,255,.3)" />
    <circle cx="231" cy="87" r="3" fill="rgba(255,255,255,.3)" />
  </svg>
)

/* ══════════════════════════════════════
   DATOS
══════════════════════════════════════ */
const cuartos = [
  {
    id: 1, nombre: 'Cuarto amueblado individual',
    ubicacion: 'Col. Centro, cerca UTSH', precio: '1,200',
    badge: 'Disponible', badgeColor: 'rz-badge-green',
    feats: ['WiFi incluido', 'Agua y luz', 'Amueblado'], Img: Cuarto1,
  },
  {
    id: 2, nombre: 'Estudio privado completo',
    ubicacion: 'Zona UTSH · 5 min caminando', precio: '1,800',
    badge: 'Solo 1 lugar', badgeColor: 'rz-badge-orange',
    feats: ['Baño privado', 'WiFi', 'Cocina'], Img: Cuarto2,
  },
  {
    id: 3, nombre: 'Habitación en casa compartida',
    ubicacion: 'Col. Juárez · Cerca CBTis', precio: '850',
    badge: 'Disponible', badgeColor: 'rz-badge-green',
    feats: ['Cocina compartida', 'WiFi', 'Seguro'], Img: Cuarto3,
  },
]

/* ══════════════════════════════════════
   MODAL
══════════════════════════════════════ */
const Modal = ({ onLogin, onClose }) => (
  <div
    className="rz-modal-overlay"
    onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
  >
    <div style={{
      background: '#fdfaf6', borderRadius: '22px', padding: '44px 38px',
      width: '100%', maxWidth: '370px', textAlign: 'center', position: 'relative',
      boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
      animation: 'rzFadeUp 0.3s ease both',
    }}>
      <button onClick={onClose} style={{
        position: 'absolute', top: '16px', right: '18px',
        background: 'none', border: 'none', fontSize: '20px',
        cursor: 'pointer', color: '#ccc', lineHeight: 1,
      }}>✕</button>

      <div style={{ fontSize: '44px', marginBottom: '16px' }}>🔒</div>

      <h2 style={{
        fontFamily: "'Playfair Display', serif", fontSize: '23px',
        color: '#1c1510', marginBottom: '10px', fontWeight: 700,
      }}>
        Inicia sesión para continuar
      </h2>

      <p style={{ fontSize: '13.5px', color: '#aaa', marginBottom: '28px', lineHeight: 1.7 }}>
        Necesitas una cuenta para ver el detalle de los cuartos y contactar a los arrendadores.
      </p>

      <button onClick={onLogin} style={{
        width: '100%', padding: '14px',
        background: 'linear-gradient(135deg, #e07a4f, #c1622f)',
        border: 'none', borderRadius: '11px', fontSize: '15px',
        fontWeight: 500, color: '#fff', cursor: 'pointer',
        marginBottom: '14px', fontFamily: 'inherit',
        boxShadow: '0 6px 20px rgba(193,98,47,0.4)',
      }}>
        Iniciar sesión →
      </button>

      <p style={{ fontSize: '12.5px', color: '#bbb' }}>
        ¿No tienes cuenta?{' '}
        <button onClick={onLogin} style={{
          background: 'none', border: 'none', color: '#c1622f',
          fontWeight: 500, cursor: 'pointer', fontSize: '12.5px',
          fontFamily: 'inherit', padding: 0,
        }}>
          Regístrate gratis
        </button>
      </p>
    </div>
  </div>
)

/* ══════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════ */
const RentaZacLanding = ({ onLogin, onRegister }) => {
  const [modal, setModal] = useState(false)

  const goLogin    = () => onLogin    ? onLogin()    : null
  const goRegister = () => onRegister ? onRegister() : null
  const openModal  = () => setModal(true)
  const closeModal = () => setModal(false)
  const loginNow   = () => { closeModal(); goLogin() }

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className="rz-nav">
        <div className="rz-nav-logo">
          <div className="rz-nav-logo-icon">🏠</div>
          <span className="rz-nav-logo-text">Cozy House</span>
        </div>
        <div className="rz-nav-links">
          <a href="#">Inicio</a>
          <a href="#rz-cuartos">Cuartos</a>
          <a href="#rz-mapa">Ubicación</a>
          <a href="#rz-footer">Contacto</a>
        </div>
        <div className="rz-nav-buttons">
          <button className="rz-btn-outline" onClick={goLogin}>Iniciar sesión</button>
          <button className="rz-btn-primary" onClick={goRegister}>Registrarse</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="rz-hero">
        <div className="rz-hero-glow" />
        <div className="rz-hero-inner">

          <div className="rz-hero-left">
            <div className="rz-hero-tag">
              <span className="rz-hero-tag-dot" />
              Zacualtipan de Ángeles, Hidalgo
            </div>
            <h1 className="rz-hero-title">
              Tu cuarto ideal<br />
              para <em>estudiar, trabajar</em><br />
              y vivir bien.
            </h1>
            <p className="rz-hero-desc">
              Encuentra habitaciones amuebladas, seguras y accesibles,
              pensadas para trabajadores de las múltiples empresas y estudiantes de la UTSH, CBTis, CECyTE y más planteles.
              Que ofrece Zacualtipán Hidalgo México.
            </p>
            <div className="rz-hero-actions">
              <a href="#rz-cuartos" className="rz-btn-primary-large">Ver cuartos →</a>
              <button className="rz-btn-ghost-large" onClick={goRegister}>✦ Regístrate gratis</button>
            </div>
            <div className="rz-hero-stats">
              <div className="rz-stat">
                <span className="rz-stat-number">40+</span>
                <span className="rz-stat-label">Cuartos</span>
              </div>
              <div className="rz-stat">
                <span className="rz-stat-number">200+</span>
                <span className="rz-stat-label">Estudiantes</span>
              </div>
              <div className="rz-stat">
                <span className="rz-stat-number">4.8★</span>
                <span className="rz-stat-label">Calificación</span>
              </div>
            </div>
          </div>

          <div className="rz-hero-right" onClick={openModal}>
            <div className="rz-cards-stack">
              <div className="rz-room-card rz-card-1">
                <Cuarto1 />
                <div className="rz-card-info">
                  <div className="rz-card-info-name">Cuarto amueblado · Col. Centro</div>
                  <div className="rz-card-info-price">Desde $1,200/mes</div>
                </div>
              </div>
              <div className="rz-room-card rz-card-2">
                <Cuarto2 />
                <div className="rz-card-info">
                  <div className="rz-card-info-name">Estudio privado · Zona UTSH</div>
                  <div className="rz-card-info-price">Desde $1,500/mes</div>
                </div>
              </div>
              <div className="rz-room-card rz-card-3">
                <Cuarto3 />
                <div className="rz-card-info">
                  <div className="rz-card-info-name">Habitación compartida · Col. Juárez</div>
                  <div className="rz-card-info-price">Desde $800/mes</div>
                </div>
              </div>
              <div className="rz-verified-badge">
                <div className="rz-verified-icon">✅</div>
                <div>
                  <div className="rz-verified-text">Cuarto verificado</div>
                  <div className="rz-verified-sub">Revisado por Cozy House</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── CUARTOS ── */}
      <section className="rz-rooms" id="rz-cuartos">
        <div className="rz-section-head">
          <div className="rz-section-eyebrow">✦ Disponibles ahora</div>
          <h2 className="rz-section-title">Cuartos y departamentos</h2>
          <p className="rz-section-sub">
            Todos verificados, amueblados y cerca de los principales planteles y empresas de Zacualtipan.
          </p>
        </div>
        <div className="rz-rooms-grid">
          {cuartos.map(({ id, nombre, ubicacion, precio, badge, badgeColor, feats, Img }) => (
            <div key={id} className="rz-listing">
              <div className="rz-listing-img" onClick={openModal}>
                <Img />
                <span className={`rz-badge ${badgeColor}`}>{badge}</span>
              </div>
              <div className="rz-listing-body">
                <div className="rz-listing-name">{nombre}</div>
                <div className="rz-listing-loc">📍 {ubicacion}</div>
                <div className="rz-listing-feats">
                  {feats.map(f => <span key={f} className="rz-pill">{f}</span>)}
                </div>
                <div className="rz-listing-footer">
                  <div className="rz-listing-price">${precio} <span>/mes</span></div>
                  <button className="rz-btn-detail" onClick={openModal}>Ver detalle</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MAPA ── */}
      <section className="rz-map" id="rz-mapa">
        <div className="rz-map-inner">
          <div>
            <div className="rz-map-eyebrow">✦ Nuestra ubicación</div>
            <h2 className="rz-map-title">En el corazón de<br />Zacualtipan, Hidalgo</h2>
            <p className="rz-map-desc">
              Todos nuestros cuartos están cerca de los principales planteles
              educativos y empresas, con fácil acceso a transporte, tiendas y servicios.
            </p>
            <div className="rz-map-points">
              {[
                { icon: '🎓', name: 'UTSH', dist: '5–10 min en transporte' },
                { icon: '📚', name: 'CBTis 166', dist: '8 min caminando' },
                { icon: '🏫', name: 'CECyTE Hidalgo', dist: '12 min en transporte' },
                { icon: '🛒', name: 'Mercado y tiendas', dist: '2–5 min caminando' },
              ].map(p => (
                <div key={p.name} className="rz-map-point">
                  <div className="rz-map-point-icon">{p.icon}</div>
                  <div>
                    <div className="rz-map-point-name">{p.name}</div>
                    <div className="rz-map-point-dist">{p.dist}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rz-map-frame">
            <iframe
              title="Mapa Zacualtipan"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15056.123456789!2d-98.6548!3d20.6478!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1e3b1b1b1b1b1%3A0x1234567890abcdef!2sZacualtip%C3%A1n%20de%20%C3%81ngeles%2C%20Hgo.!5e0!3m2!1ses-419!2smx!4v1234567890"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="rz-cta">
        <div className="rz-cta-inner">
          <div className="rz-cta-eyebrow">✦ Empieza hoy</div>
          <h2 className="rz-cta-title">¿Listo para encontrar<br />tu cuarto o departamento ideal?</h2>
          <p className="rz-cta-sub">
            Crea tu cuenta gratis y accede a todos los cuartos y departamentos disponibles<br />
            en Zacualtipan de Ángeles, Hidalgo.
          </p>
          <div className="rz-cta-btns">
            <button className="rz-btn-ghost-large" onClick={goLogin}>Iniciar sesión</button>
            <button className="rz-btn-primary-large" onClick={goRegister}>Crear cuenta gratis →</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="rz-footer" id="rz-footer">
        <div className="rz-footer-grid">

          <div>
            <div className="rz-footer-logo">
              <div className="rz-footer-logo-icon">🏠</div>
              <span className="rz-footer-logo-text">Cozy House</span>
            </div>
            <p className="rz-footer-tagline">
              La plataforma de rentas pensada para estudiantes y trabajadoresen Zacualtipan de Ángeles, Hidalgo.
              Cuartos seguros, accesibles y verificados.
            </p>
            <div className="rz-footer-socials">
              <button className="rz-social" onClick={openModal}>📘</button>
              <button className="rz-social" onClick={openModal}>📸</button>
              <button className="rz-social" onClick={openModal}>💬</button>
              <button className="rz-social" onClick={openModal}>🎵</button>
            </div>
          </div>

          <div>
            <div className="rz-footer-col-title">Navegación</div>
            <div className="rz-footer-links">
              <a href="#" className="rz-footer-link">Inicio</a>
              <a href="#rz-cuartos" className="rz-footer-link">Ver cuartos</a>
              <a href="#rz-mapa" className="rz-footer-link">Ubicación</a>
              <button className="rz-footer-link" onClick={openModal}>Mis favoritos</button>
              <button className="rz-footer-link" onClick={openModal}>Mi perfil</button>
            </div>
          </div>

          <div>
            <div className="rz-footer-col-title">Cuartos</div>
            <div className="rz-footer-links">
              <button className="rz-footer-link" onClick={openModal}>Individuales</button>
              <button className="rz-footer-link" onClick={openModal}>Compartidos</button>
              <button className="rz-footer-link" onClick={openModal}>Estudios</button>
              <button className="rz-footer-link" onClick={openModal}>Con baño privado</button>
              <button className="rz-footer-link" onClick={openModal}>Cerca de UTSH</button>
            </div>
          </div>

          <div>
            <div className="rz-footer-col-title">Contacto</div>
            <div className="rz-footer-contact">
              {[
                { icon: '📍', text: 'Zacualtipan de Ángeles, Hidalgo, México' },
                { icon: '📞', text: '+52 771 123 4567' },
                { icon: '✉', text: 'hola@cozyhouse.mx' },
                { icon: '🕐', text: 'Lun – Sáb: 9:00 – 18:00' },
              ].map(c => (
                <div key={c.text} className="rz-footer-contact-row">
                  <span className="rz-footer-contact-icon">{c.icon}</span>
                  <span className="rz-footer-contact-text">{c.text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="rz-footer-bottom">
          <span className="rz-footer-copy">© 2025 Cozy House · Todos los derechos reservados.</span>
          <div className="rz-footer-bottom-links">
            <button className="rz-footer-bottom-link" onClick={openModal}>Términos</button>
            <button className="rz-footer-bottom-link" onClick={openModal}>Privacidad</button>
            <button className="rz-footer-bottom-link" onClick={openModal}>Cookies</button>
          </div>
        </div>
      </footer>

      {/* ── MODAL ── */}
      {modal && <Modal onLogin={loginNow} onClose={closeModal} />}
    </>
  )
}

export default RentaZacLanding
