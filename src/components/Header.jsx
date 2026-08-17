import { NavLink } from 'react-router-dom'
import {
  Accessibility,
  House,
  Compass,
  PlusCircle,
  CircleHelp,
  Heart,
  UserRound
} from 'lucide-react'
import './Header.css'

function Header() {
  return (
    <header className="site-header">
      <div className="header-container">

        {/* Logo */}
        <NavLink to="/" className="brand">
          <div className="brand-icon">
            <Accessibility size={25} strokeWidth={2.2} />
          </div>

          <div className="brand-text">
            <span className="brand-name">AccessHub</span>
            <span className="brand-tagline">CLEAR PATH</span>
          </div>
        </NavLink>

        {/* Navigation */}
        <nav className="main-nav" aria-label="Main navigation">

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            <House size={19} />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/places"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            <Compass size={19} />
            <span>Explore</span>
          </NavLink>

          <NavLink
            to="/suggest-place"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            <PlusCircle size={19} />
            <span>Suggest a Place</span>
          </NavLink>

     <NavLink
  to="/about"
  className={({ isActive }) =>
    isActive ? 'nav-link active' : 'nav-link'
  }
>
  <CircleHelp size={19} />
  <span>About</span>
</NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            <Heart size={19} />
            <span>Favorites</span>
          </NavLink>

        </nav>

        {/* Login */}
        <NavLink to="/login" className="login-button">
          <UserRound size={19} />
          <span>Log In</span>
        </NavLink>

      </div>
    </header>
  )
}

export default Header