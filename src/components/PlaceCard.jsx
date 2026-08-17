import {
  MapPin,
  Star,
  Heart,
  BadgeCheck,
} from 'lucide-react'

import { Link } from 'react-router-dom'
import './PlaceCard.css'
import { useFavorites } from '../context/FavoritesContext'

function PlaceCard({ place }) {

  const { toggleFavorite, isFavorite } = useFavorites()
  const favorite = isFavorite(place.id)

    const accessibilityCount = Object.values(place.accessibility)
    .flat()
    .length

  return (
    <article className="place-card">

      <div className="place-image-wrapper">
        <img
          src={place.images[0]}
          alt={place.name}
          className="place-image"
        />

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
  onClick={() => toggleFavorite(place)}
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
          <strong>{place.rating}</strong>
          <span>({place.reviews})</span>
        </div>

        <div className="place-accessibility-summary">
          {accessibilityCount} accessibility features
        </div>

        <Link
          to={`/places/${place.id}`}
          className="place-details-button"
        >
          View Details
        </Link>

      </div>
    </article>
  )
}

export default PlaceCard