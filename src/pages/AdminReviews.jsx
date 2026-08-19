import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  collection,
  deleteDoc,
  doc,
  getDocs
} from 'firebase/firestore'

import { db } from '../firebase/firebase'

import {
  ArrowLeft,
  MessageSquareText,
  Star,
  Trash2,
  UserRound
} from 'lucide-react'

import './AdminReviews.css'

function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [placesMap, setPlacesMap] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAdminReviews() {
      try {
        setLoading(true)

        const [
          reviewsSnapshot,
          placesSnapshot,
        ] = await Promise.all([
          getDocs(collection(db, 'reviews')),
          getDocs(collection(db, 'places')),
        ])

        const reviewsData =
          reviewsSnapshot.docs.map(
            (reviewDocument) => ({
              firestoreId:
                reviewDocument.id,

              ...reviewDocument.data(),
            })
          )

        reviewsData.sort(
          (a, b) =>
            new Date(b.visitDate || 0) -
            new Date(a.visitDate || 0)
        )

        const placesLookup = {}

        placesSnapshot.docs.forEach(
          (placeDocument) => {
            const placeData =
              placeDocument.data()

            const placeId =
              placeData.id ??
              placeDocument.id

            placesLookup[
              String(placeId)
            ] = {
              firestoreId:
                placeDocument.id,

              ...placeData,
            }
          }
        )

        setReviews(reviewsData)
        setPlacesMap(placesLookup)
      } catch (error) {
        console.error(
          'Error loading admin reviews:',
          error
        )
      } finally {
        setLoading(false)
      }
    }

    loadAdminReviews()
  }, [])

  async function handleDeleteReview(review) {
    const confirmed = window.confirm(
      `Delete this review by ${
        review.userName || 'this user'
      }?`
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteDoc(
        doc(
          db,
          'reviews',
          review.firestoreId
        )
      )

      setReviews((current) =>
        current.filter(
          (item) =>
            item.firestoreId !==
            review.firestoreId
        )
      )
    } catch (error) {
      console.error(
        'Error deleting review:',
        error
      )

      alert(
        'Could not delete the review.'
      )
    }
  }

  return (
    <main className="admin-reviews-page">
      <div className="admin-reviews-container">

        <Link
          to="/admin"
          className="admin-back-link"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="admin-reviews-heading">
          <span className="section-label">
            COMMUNITY REVIEWS
          </span>

          <h1>Manage Reviews</h1>

          <p>
            Review community feedback and remove
            inappropriate or irrelevant content.
          </p>
        </div>

        {loading ? (
          <div className="admin-reviews-empty">
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="admin-reviews-empty">
            No reviews found.
          </div>
        ) : (
          <div className="admin-reviews-list">

            {reviews.map((review) => {
              const place =
                placesMap[
                  String(review.placeId)
                ]

              return (
                <article
                  key={review.firestoreId}
                  className="admin-review-card"
                >

                  <div className="admin-review-top">

                    <div className="admin-review-user">

                      <div className="admin-review-avatar">
                        <UserRound size={20} />
                      </div>

                      <div>
                        <h2>
                          {review.userName ||
                            'AccessHub User'}
                        </h2>

                        <p>
                          {place?.name ||
                            `Place ${review.placeId}`}
                        </p>
                      </div>

                    </div>

                    <div className="admin-review-rating">
                      <Star
                        size={17}
                        fill="currentColor"
                      />

                      <strong>
                        {review.rating ?? 0}
                      </strong>
                    </div>

                  </div>

                  <p className="admin-review-comment">
                    {review.comment}
                  </p>

                  <div className="admin-review-meta">

                    <span>
                      {review.visitDate
                        ? new Date(
                            review.visitDate
                          ).toLocaleDateString()
                        : 'No date'}
                    </span>

                    <span>
                      Helpful: {review.helpful ?? 0}
                    </span>

                  </div>

                  <div className="admin-review-actions">

                    {place && (
                      <Link
                        to={`/places/${place.id}`}
                        className="admin-review-view-button"
                      >
                        <MessageSquareText size={16} />
                        View Place
                      </Link>
                    )}

                    <button
                      type="button"
                      className="admin-review-delete-button"
                      onClick={() =>
                        handleDeleteReview(review)
                      }
                    >
                      <Trash2 size={16} />
                      Delete Review
                    </button>

                  </div>

                </article>
              )
            })}

          </div>
        )}

      </div>
    </main>
  )
}

export default AdminReviews