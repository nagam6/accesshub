import { Heart, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

import { useFavorites } from '../context/FavoritesContext'
import PlaceCard from '../components/PlaceCard'

import './Favorites.css'

function Favorites() {
  const { favorites } = useFavorites()

  return (
    <main className="favorites-page">
      <div className="favorites-container">

        <div className="favorites-heading">
          <div className="favorites-heading-icon">
            <Heart size={24} fill="currentColor" />
          </div>

          <div>
            <span className="section-label">
              YOUR SAVED PLACES
            </span>

            <h1>Favorites</h1>

            <p>
              Keep the places you want to remember in one place.
            </p>
          </div>
        </div>

        {favorites.length > 0 ? (
          <>
            <div className="favorites-results">
              <p>
                <strong>{favorites.length}</strong>{' '}
                {favorites.length === 1
                  ? 'saved place'
                  : 'saved places'}
              </p>
            </div>

            <div className="places-grid">
              {favorites.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="favorites-empty">
            <div className="favorites-empty-icon">
              <Heart size={34} />
            </div>

            <h2>No favorites yet</h2>

            <p>
              Save places you are interested in and they will appear here.
            </p>

            <Link
              to="/places"
              className="favorites-explore-button"
            >
              <Search size={18} />
              Explore Places
            </Link>
          </div>
        )}

      </div>
    </main>
  )
}

export default Favorites