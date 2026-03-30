import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { userService } from '../../user/service/user.service'
import { rolService } from '../../role/service/rolService'
import { rentService } from '../../rents/service/rents.service'
import { permisoService } from '../../permits/service/permsService'
import { roomsService } from '../../rooms/service/room.service'
import './dashboardStyle.css'

const DashboardPage = () => {
  const [data, setData] = useState({
    users: [],
    roles: [],
    rents: [],
    permits: [],
    rooms: [],
  })

  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState([])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setErrors([])

      const results = await Promise.allSettled([
        userService.getAll(),
        rolService.getAll(),
        rentService.getAll(),
        permisoService.getAll(),
        roomsService.getAll(),
      ])

      const [usersRes, rolesRes, rentsRes, permitsRes, roomsRes] = results
      const newErrors = []

      const users =
        usersRes.status === 'fulfilled'
          ? usersRes.value || []
          : (newErrors.push('No se pudieron cargar los usuarios'), [])

      const roles =
        rolesRes.status === 'fulfilled'
          ? rolesRes.value || []
          : (newErrors.push('No se pudieron cargar los roles'), [])

      const rents =
        rentsRes.status === 'fulfilled'
          ? rentsRes.value || []
          : (newErrors.push('No se pudieron cargar las rentas'), [])

      const permits =
        permitsRes.status === 'fulfilled'
          ? permitsRes.value || []
          : (newErrors.push('No se pudieron cargar los permisos'), [])

      const rooms =
        roomsRes.status === 'fulfilled'
          ? roomsRes.value || []
          : (newErrors.push('No se pudieron cargar las propiedades'), [])

      setData({
        users,
        roles,
        rents,
        permits,
        rooms,
      })

      setErrors(newErrors)
      setLoading(false)
    }

    load()
  }, [])

  const getDateValue = (item) => {
    return item?.createdAt || item?.updatedAt || 0
  }

  const getUserName = (user) => {
    return user?.nombre || user?.usuario || 'Sin nombre'
  }

  const getRoomTitle = (room) => {
    return room?.titulo || 'Propiedad sin título'
  }

  const getRoomOwner = (room) => {
    if (typeof room?.propietario === 'object' && room?.propietario !== null) {
      return room.propietario.nombre || room.propietario.usuario || 'Sin propietario'
    }
    return 'Propietario no disponible'
  }

  const getRentUser = (rent) => {
    if (typeof rent?.usuario === 'object' && rent?.usuario !== null) {
      return rent.usuario.nombre || rent.usuario.usuario || 'Sin usuario'
    }
    return 'Usuario no disponible'
  }

  const getRentRoom = (rent) => {
    if (typeof rent?.cuarto === 'object' && rent?.cuarto !== null) {
      return rent.cuarto.titulo || 'Propiedad sin título'
    }
    return 'Propiedad no disponible'
  }

  const stats = useMemo(() => {
    const users = data.users || []
    const rooms = data.rooms || []
    const rents = data.rents || []
    const roles = data.roles || []
    const permits = data.permits || []

    const publishedRooms = rooms.filter((room) => room?.publicado === true)
    const pendingRooms = rooms.filter((room) => room?.publicado === false)

    const activeRents = rents.filter((rent) => rent?.status === 'activa')
    const finishedRents = rents.filter((rent) => rent?.status === 'finalizada')
    const canceledRents = rents.filter((rent) => rent?.status === 'cancelada')

    const landlords = users.filter((user) => user?.tipoUsuario === 'arrendador')
    const clients = users.filter((user) => user?.tipoUsuario === 'cliente')
    const activeUsers = users.filter((user) => user?.estado === true)

    const recentPendingRooms = [...pendingRooms]
      .sort((a, b) => new Date(getDateValue(b)) - new Date(getDateValue(a)))
      .slice(0, 5)

    const recentPublishedRooms = [...publishedRooms]
      .sort((a, b) => new Date(getDateValue(b)) - new Date(getDateValue(a)))
      .slice(0, 5)

    const recentRents = [...rents]
      .sort((a, b) => new Date(getDateValue(b)) - new Date(getDateValue(a)))
      .slice(0, 5)

    const recentUsers = [...users]
      .sort((a, b) => new Date(getDateValue(b)) - new Date(getDateValue(a)))
      .slice(0, 5)

    return {
      totalUsers: users.length,
      activeUsers: activeUsers.length,
      totalRoles: roles.length,
      totalPermits: permits.length,
      totalRooms: rooms.length,
      publishedRooms,
      pendingRooms,
      totalRents: rents.length,
      activeRents,
      finishedRents,
      canceledRents,
      landlords,
      clients,
      recentPendingRooms,
      recentPublishedRooms,
      recentRents,
      recentUsers,
    }
  }, [data])

  return (
    <div className="dashboard-page">
      <div className="dashboard-header-box">
        <h1 className="dashboard-header-title">Hola, bienvenido a la pagina 404 NOT FOUND</h1>
        <p className="dashboard-header-sub">Resumen del sistema</p>
      </div>

      <div className="dashboard-actions">
      </div>

      {loading && <p className="muted">Cargando datos de inicio...</p>}

      {errors.length > 0 && (
        <div className="dashboard-warnings">
          {errors.map((err, index) => (
            <p key={index} className="error">{err}</p>
          ))}
        </div>
      )}

      {!loading && (
        <>
          <div className="welcome-card">
            <h2 className="welcome-title">Panel principal</h2>
            <p className="welcome-desc">
              Consulta rápidamente propiedades en revisión, propiedades publicadas,
              rentas activas y usuarios del sistema.
            </p>
          </div>

          <div className="card--container">
            <div className="stat-card">
              <div className="stat-title">Propiedades en revisión</div>
              <div className="stat-value">{stats.pendingRooms.length}</div>
              <Link to="/cuartos" className="stat-link">
                Revisar propiedades
              </Link>
            </div>

            <div className="stat-card">
              <div className="stat-title">Propiedades publicadas</div>
              <div className="stat-value">{stats.publishedRooms.length}</div>
              <Link to="/CuartosPublicados" className="stat-link">
                Ver publicadas
              </Link>
            </div>

            <div className="stat-card">
              <div className="stat-title">Rentas activas</div>
              <div className="stat-value">{stats.activeRents.length}</div>
              <Link to="/renta" className="stat-link">
                Ver rentas
              </Link>
            </div>

            <div className="stat-card">
              <div className="stat-title">Usuarios registrados</div>
              <div className="stat-value">{stats.totalUsers}</div>
              <Link to="/usuarios" className="stat-link">
                Ver usuarios
              </Link>
            </div>

            <div className="stat-card">
              <div className="stat-title">Propietarios</div>
              <div className="stat-value">{stats.landlords.length}</div>
              <Link to="/arrendador" className="stat-link">
                Ver propietarios
              </Link>
            </div>

            <div className="stat-card">
              <div className="stat-title">Clientes</div>
              <div className="stat-value">{stats.clients.length}</div>
              <Link to="/usuarios" className="stat-link">
                Ver clientes
              </Link>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-panel">
              <div className="dashboard-panel-header">
                <h3>Propiedades en revisión</h3>
                <Link to="/cuartos" className="panel-link">Ver todas</Link>
              </div>

              {stats.recentPendingRooms.length > 0 ? (
                <div className="dashboard-list">
                  {stats.recentPendingRooms.map((room, index) => (
                    <div
                      className="dashboard-list-item"
                      key={room?._id || index}
                    >
                      <div>
                        <p className="item-title">{getRoomTitle(room)}</p>
                        <p className="item-subtitle">
                          Propietario: {getRoomOwner(room)}
                        </p>
                      </div>
                      <span className="item-badge warning">En revisión</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">
                  No hay propiedades en revisión.
                </p>
              )}
            </div>

            <div className="dashboard-panel">
              <div className="dashboard-panel-header">
                <h3>Últimas rentas</h3>
                <Link to="/renta" className="panel-link">Ver todas</Link>
              </div>

              {stats.recentRents.length > 0 ? (
                <div className="dashboard-list">
                  {stats.recentRents.map((rent, index) => {
                    const badgeClass =
                      rent?.status === 'activa'
                        ? 'success'
                        : rent?.status === 'cancelada'
                          ? 'danger'
                          : 'neutral'

                    return (
                      <div
                        className="dashboard-list-item"
                        key={rent?._id || index}
                      >
                        <div>
                          <p className="item-title">{getRentUser(rent)}</p>
                          <p className="item-subtitle">
                            Propiedad: {getRentRoom(rent)}
                          </p>
                        </div>
                        <span className={`item-badge ${badgeClass}`}>
                          {rent?.status || 'sin estado'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="empty-state">
                  No hay rentas registradas.
                </p>
              )}
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-panel">
              <div className="dashboard-panel-header">
                <h3>Resumen de propiedades</h3>
              </div>

              <div className="mini-stats">
                <div className="mini-stat">
                  <span className="mini-stat-label">Total</span>
                  <strong className="mini-stat-value">{stats.totalRooms}</strong>
                </div>

                <div className="mini-stat">
                  <span className="mini-stat-label">En revisión</span>
                  <strong className="mini-stat-value">{stats.pendingRooms.length}</strong>
                </div>

                <div className="mini-stat">
                  <span className="mini-stat-label">Publicadas</span>
                  <strong className="mini-stat-value">{stats.publishedRooms.length}</strong>
                </div>
              </div>
            </div>

            <div className="dashboard-panel">
              <div className="dashboard-panel-header">
                <h3>Resumen de usuarios</h3>
              </div>

              <div className="mini-stats">
                <div className="mini-stat">
                  <span className="mini-stat-label">Activos</span>
                  <strong className="mini-stat-value">{stats.activeUsers}</strong>
                </div>

                <div className="mini-stat">
                  <span className="mini-stat-label">Propietarios</span>
                  <strong className="mini-stat-value">{stats.landlords.length}</strong>
                </div>

                <div className="mini-stat">
                  <span className="mini-stat-label">Clientes</span>
                  <strong className="mini-stat-value">{stats.clients.length}</strong>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default DashboardPage