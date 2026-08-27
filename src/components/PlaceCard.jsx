import { useEffect, useState } from 'react'
import {
  BadgeCheck,
  Heart,
  MapPin,
  Star,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import {
  collection,
  getDocs,
} from 'firebase/firestore'

import { useFavorites } from '../context/FavoritesContext'
import { auth, db } from '../firebase/firebase'
import { showLoginToast } from '../utils/showLoginToast'

import './PlaceCard.css'

function PlaceCard({ place }) {
  const navigate = useNavigate()
  const { toggleFavorite, isFavorite } = useFavorites()

  const [reviewsCount, setReviewsCount] = useState(0)
  const [averageRating, setAverageRating] = useState('0.0')

  const favorite = isFavorite(place.id)

  const accessibilityCount = Object.values(
    place.accessibility || {}
  )
    .flat()
    .length

  useEffect(() => {
    async function loadReviews() {
      try {
        const snapshot = await getDocs(
          collection(db, 'reviews')
        )

        const placeReviews = snapshot.docs
          .map((reviewDocument) =>
            reviewDocument.data()
          )
          .filter(
            (review) =>
              String(review.placeId) ===
              String(place.id)
          )

        const count = placeReviews.length

        const average =
          count > 0
            ? (
                placeReviews.reduce(
                  (total, review) =>
                    total +
                    Number(review.ratingStars || 0),
                  0
                ) / count
              ).toFixed(1)
            : '0.0'

        setReviewsCount(count)
        setAverageRating(average)
      } catch (error) {
        console.error(
          'Error loading place reviews:',
          error
        )

        setReviewsCount(0)
        setAverageRating('0.0')
      }
    }

    loadReviews()
  }, [place.id])

  function handleFavoriteClick() {
    if (!auth.currentUser) {
      showLoginToast(navigate)
      return
    }

    toggleFavorite(place)
  }

  function handleViewDetails() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    })
  }

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
          onClick={handleFavoriteClick}
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
          <Star
            size={18}
            fill="currentColor"
          />

          <strong>{averageRating}</strong>
          <span>({reviewsCount})</span>
        </div>

        <div className="place-accessibility-summary">
          {accessibilityCount} accessibility features
        </div>

        <Link
          to={`/places/${place.id}`}
          className="place-details-button"
          onClick={handleViewDetails}
        >
          View Details
        </Link>
      </div>
    </article>
  )
}

export default PlaceCard