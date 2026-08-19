import { Link } from 'react-router-dom'
import { Home, SearchX } from 'lucide-react'

import './NotFound.css'

function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-container">

        <div className="not-found-icon">
          <SearchX size={38} />
        </div>

        <div className="not-found-code">
          404
        </div>

        <h1>Page Not Found</h1>

        <p>
          Sorry, the page you're looking for doesn't
          exist or may have been moved.
        </p>

        <Link
          to="/"
          className="not-found-button"
        >
          <Home size={18} />
          Back to Home
        </Link>

      </div>
    </main>
  )
}

export default NotFound