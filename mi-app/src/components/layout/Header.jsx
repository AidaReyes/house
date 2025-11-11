import './Header.css'

const Header = ({ title = 'Dashboard' }) => {
  return (
    <div className='content--header'>
      <h1 className='header--title'>{title}</h1>
      {/* Header ahora solo muestra el título. El buscador se mueve a páginas concretas (ej. Dashboard) */}
      <div className='header--activity' />
    </div>
  )
}

export default Header

