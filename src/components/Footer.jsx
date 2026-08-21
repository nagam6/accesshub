import {
  Accessibility,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'

import {
  Link,
} from 'react-router-dom'

import './Footer.css'

function Footer() {
  // Logo → Home + top of page
  function handleLogoClick() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }

  return (
    <footer className="site-footer">
      <div className="footer-container">

        {/* BRAND */}

        <div className="footer-brand">

          <Link
            to="/"
            className="footer-logo-link"
            onClick={handleLogoClick}
          >
            <div className="footer-logo-row">

              <div className="footer-logo-icon">
                <Accessibility size={22} />
              </div>

              <div>
                <h3>AccessHub</h3>
                <span>CLEAR PATH</span>
              </div>

            </div>
          </Link>

          <p>
            Helping people discover public places
            with clear and useful accessibility
            information before they visit.
          </p>

        </div>

        {/* ACCESSIBILITY */}

        <div className="footer-column">
          <h4>Accessibility</h4>

          <Link
            to="/about"
            onClick={() => {
              window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'instant',
              })
            }}
          >
            About Us
          </Link>

    <a href="/#accessibility">
  Accessibility Features
</a>

<a href="/#how-it-works">
  How It Works
</a>
        </div>

        {/* ACCOUNT */}

        <div className="footer-column">
          <h4>Account</h4>

          <Link to="/login">
            Log In
          </Link>

          <Link to="/register">
            Register
          </Link>

          <Link to="/profile">
            Profile
          </Link>
        </div>

        {/* CONTACT */}

        <div className="footer-column footer-contact">
          <h4>Contact</h4>

          <p className="footer-contact-line">
            <Mail size={17} />
            <span>info@accesshub.com</span>
          </p>

          <p className="footer-contact-line">
            <Phone size={17} />
            <span>074-1234021</span>
          </p>

          <p className="footer-contact-line">
            <MapPin size={17} />
            <span>Nazareth, Israel</span>
          </p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © 2026 AccessHub, By Nagham Daban
        </p>
      </div>

    </footer>
  )
}

export default Footer