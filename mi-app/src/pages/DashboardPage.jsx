import React, { useEffect, useState } from 'react'
import ContentHeader from '../components/ContentHeader'
import Card from '../components/Card'
import { obtenerProductosAdaptados } from '../services/productosService'

const DashboardPage = () => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerProductosAdaptados()
        setProductos(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <p>Cargando productos...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="content">
      <ContentHeader />
      <Card productos={productos} />
    </div>
  )
}

export default DashboardPage
