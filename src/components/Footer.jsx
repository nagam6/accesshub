import { Accessibility } from 'lucide-react'
import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">

        <div className="footer-brand">
          <div className="footer-logo-row">
            <div className="footer-logo-icon">
              <Accessibility size={22} />
            </div>

            <div>
              <h3>AccessHub</h3>
              <span>CLEAR PATH</span>
            </div>
          </div>

          <p>
            Helping people discover public places with clear and useful
            accessibility information before they visit.
          </p>
        </div>

        <div className="footer-column">
          <h4>Explore</h4>

          <Link to="/">Home</Link>
          <Link to="/places">Explore Places</Link>
          <Link to="/suggest-place">Suggest a Place</Link>
          <Link to="/favorites">Favorites</Link>
        </div>

        <div className="footer-column">
          <h4>Account</h4>

          <Link to="/login">Log In</Link>
          <Link to="/register">Register</Link>
          <Link to="/profile">Profile</Link>
        </div>

        <div className="footer-column">
          <h4>Accessibility</h4>

          <a href="#about">About AccessHub</a>
          <a href="#accessibility">Accessibility Features</a>
          <a href="#how-it-works">How It Works</a>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 AccessHub. Built with accessibility in mind.</p>
      </div>
    </footer>
  )
}

export default Footer