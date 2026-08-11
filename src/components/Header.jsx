import { NavLink } from 'react-router-dom'

function Header() {
  return (
    <header className="main-header">
      <div className="logo">AccessHub</div>

      <nav className="main-nav" aria-label="Main navigation">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/places">Explore</NavLink>
        <NavLink to="/suggest-place">Suggest a Place</NavLink>
        <NavLink to="/favorites">Favorites</NavLink>
        <NavLink to="/login">Login</NavLink>
      </nav>
    </header>
  )
}

export default Header