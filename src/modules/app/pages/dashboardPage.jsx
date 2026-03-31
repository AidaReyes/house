import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  FaUsers,
  FaUserTie,
  FaBuilding,
  FaFileContract,
  FaShieldHalved,
  FaKey,
  FaCircleCheck,
  FaClock,
  FaTriangleExclamation,
  FaChartLine,
  FaHouse,
  FaArrowRight,
  FaSpinner,
  FaCheckDouble,
  FaUserPlus,
  FaCalendarDays,
  FaEye,
  FaThumbsUp,
} from 'react-icons/fa6'

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
  const [refreshing, setRefreshing] = useState(false)

  const loadDashboardData = useCallback(async () => {
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

    const users = usersRes.status === 'fulfilled' ? usersRes.value || [] : []
    if (usersRes.status !== 'fulfilled') newErrors.push('No se pudieron cargar los usuarios')

    const roles = rolesRes.status === 'fulfilled' ? rolesRes.value || [] : []
    if (rolesRes.status !== 'fulfilled') newErrors.push('No se pudieron cargar los roles')

    const rents = rentsRes.status === 'fulfilled' ? rentsRes.value || [] : []
    if (rentsRes.status !== 'fulfilled') newErrors.push('No se pudieron cargar las rentas')

    const permits = permitsRes.status === 'fulfilled' ? permitsRes.value || [] : []
    if (permitsRes.status !== 'fulfilled') newErrors.push('No se pudieron cargar los permisos')

    const rooms = roomsRes.status === 'fulfilled' ? roomsRes.value || [] : []
    if (roomsRes.status !== 'fulfilled') newErrors.push('No se pudieron cargar las propiedades')

    setData({ users, roles, rents, permits, rooms })
    setErrors(newErrors)
  }, [])

  const loadData = useCallback(async (refresh = false) => {
    if (refresh) {
      setRefreshing(true)
      await loadDashboardData()
      setRefreshing(false)
    } else {
      setLoading(true)
      await loadDashboardData()
      setLoading(false)
    }
  }, [loadDashboardData])

  useEffect(() => {
    loadData()
  }, [loadData])

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString('es-ES') : ''

  const stats = useMemo(() => {
    const users = data.users || []
    const rooms = data.rooms || []
    const rents = data.rents || []

    const activeUsers = users.filter(u => u?.estado === true)
    const pendingRooms = rooms.filter(r => !r?.publicado)
    const publishedRooms = rooms.filter(r => r?.publicado)
    const activeRents = rents.filter(r => r?.status === 'activa')

    return {
      totalUsers: users.length,
      activeUsers: activeUsers.length,
      totalRooms: rooms.length,
      pendingRooms,
      publishedRooms,
      totalRents: rents.length,
      activeRents,
    }
  }, [data])

  const ListItem = ({ title, subtitle, badge, date }) => (
    <div className="dashboard-list-item">
      <div>
        <p className="item-title">{title}</p>
        <p className="item-subtitle">{subtitle}</p>
        {date && (
          <p className="item-date">
            <FaClock /> {formatDate(date)}
          </p>
        )}
      </div>
      {badge && <span className={`item-badge ${badge.type}`}>{badge.text}</span>}
    </div>
  )

  if (loading) {
    return (
      <div className="dashboard-page">
        <FaSpinner className="spin" />
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div className="dashboard-page">

      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>Panel de Control</h1>
          <p>Resumen general del sistema</p>
        </div>

        <button onClick={() => loadData(true)}>
          <FaSpinner className={refreshing ? 'spin' : ''} />
          Actualizar
        </button>
      </div>

      {/* ERRORES */}
      {errors.length > 0 && (
        <div className="dashboard-alerts">
          {errors.map((err, i) => (
            <div key={i} className="dashboard-alert">
              <FaTriangleExclamation /> {err}
            </div>
          ))}
        </div>
      )}

      {/* STATS */}
      <div className="dashboard-stats-grid">
        <div className="stat-card">
          <FaUsers />
          <span>Usuarios</span>
          <strong>{stats.totalUsers}</strong>
        </div>

        <div className="stat-card">
          <FaBuilding />
          <span>Propiedades</span>
          <strong>{stats.totalRooms}</strong>
        </div>

        <div className="stat-card">
          <FaFileContract />
          <span>Rentas activas</span>
          <strong>{stats.activeRents.length}</strong>
        </div>

        <div className="stat-card">
          <FaChartLine />
          <span>Activos</span>
          <strong>{stats.activeUsers}</strong>
        </div>
      </div>

      {/* LISTAS */}
      <div className="dashboard-main-grid">

        <div className="dashboard-panel">
          <h3>Propiedades en revisión</h3>

          {stats.pendingRooms.length > 0 ? (
            stats.pendingRooms.slice(0, 5).map((room, i) => (
              <ListItem
                key={i}
                title={room?.titulo}
                subtitle="Pendiente"
                badge={{ text: 'En revisión', type: 'warning' }}
                date={room?.createdAt}
              />
            ))
          ) : (
            <div className="empty-box">
              <FaCircleCheck />
              <p>Todo revisado</p>
            </div>
          )}
        </div>

        <div className="dashboard-panel">
          <h3>Últimas rentas</h3>

          {stats.totalRents > 0 ? (
            stats.activeRents.slice(0, 5).map((rent, i) => (
              <ListItem
                key={i}
                title="Renta"
                subtitle="Activa"
                badge={{ text: 'Activa', type: 'success' }}
                date={rent?.createdAt}
              />
            ))
          ) : (
            <div className="empty-box">
              <FaFileContract />
              <p>No hay rentas</p>
            </div>
          )}
        </div>

      </div>

      {/* RESUMEN */}
      <div className="dashboard-bottom-grid">

        <div className="dashboard-panel">
          <h3>Usuarios</h3>
          <div className="mini-stats">
            <div>
              <FaUsers />
              <span>Total</span>
              <strong>{stats.totalUsers}</strong>
            </div>
            <div>
              <FaUserTie />
              <span>Activos</span>
              <strong>{stats.activeUsers}</strong>
            </div>
          </div>
        </div>

        <div className="dashboard-panel">
          <h3>Sistema</h3>
          <div className="mini-stats">
            <div>
              <FaShieldHalved />
              <span>Roles</span>
              <strong>{data.roles.length}</strong>
            </div>
            <div>
              <FaKey />
              <span>Permisos</span>
              <strong>{data.permits.length}</strong>
            </div>
            <div>
              <FaCalendarDays />
              <span>Rentas</span>
              <strong>{stats.totalRents}</strong>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}

export default DashboardPage