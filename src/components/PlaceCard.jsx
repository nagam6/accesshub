import {
  MapPin,
  Star,
  Heart,
  BadgeCheck,
} from 'lucide-react'

import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../firebase/firebase'
import { showLoginToast } from '../utils/showLoginToast'

import './PlaceCard.css'
import { useFavorites } from '../context/FavoritesContext'

function PlaceCard({ place }) {

  const navigate = useNavigate()
  const { toggleFavorite, isFavorite } = useFavorites()
  const favorite = isFavorite(place.id)

    const accessibilityCount = Object.values(place.accessibility || {})
    .flat()
    .length

  return (
    <article className="place-card">

      <div className="place-image-wrapper">
{place.images?.[0] ? (
  <img
    src={place.images[0]}
    alt={place.name}
  />
) : (
  <div className="place-card-image-placeholder">
    <span>{place.name}</span>
  </div>
)}
        {place.verified && (
          <span className="verified-badge">
            <BadgeCheck size={16} />
            Verified
          </span>
        )}

          <button
  type="button"
  className={`favorite-button ${
    favorite ? 'favorite-button-active' : ''
  }`}
 onClick={() => {
  if (!auth.currentUser) {
    showLoginToast(navigate)
    return
  }

  toggleFavorite(place)
}}
  aria-label={
    favorite
      ? `Remove ${place.name} from favorites`
      : `Save ${place.name} to favorites`
  }
>
  <Heart
    size={20}
    fill={favorite ? 'currentColor' : 'none'}
  />
</button>
      </div>

      <div className="place-card-content">

        <h3>{place.name}</h3>

        <p className="place-category">
          {place.category}
        </p>

        <p className="place-location">
          <MapPin size={16} />
          {place.city} · {place.address}
        </p>

        <div className="place-rating">
          <Star size={18} fill="currentColor" />
          <strong>{place.ratingStars}</strong>
          <span>({place.reviews})</span>
        </div>

        <div className="place-accessibility-summary">
          {accessibilityCount} accessibility features
        </div>

       <Link
  to={`/places/${place.id}`}
  className="place-details-button"
  onClick={() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    })
  }}
>
  View Details
</Link>

      </div>
    </article>
  )
}

export default PlaceCard