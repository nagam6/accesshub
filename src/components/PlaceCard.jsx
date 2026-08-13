import {
  MapPin,
  Star,
  Heart,
  BadgeCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import './PlaceCard.css'


function PlaceCard({ place }) {
  return (
    <article className="place-card">

      <div className="place-image-wrapper">
        <img
          src={place.image}
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
          className="favorite-button"
          aria-label={`Save ${place.name} to favorites`}
        >
          <Heart size={20} />
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
          {place.accessibility.length} accessibility features
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