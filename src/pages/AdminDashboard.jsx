import {
  Flag,
  Lightbulb,
  MapPin,
  MessageSquareText,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs } from 'firebase/firestore'

import { db } from '../firebase/firebase'

import './AdminDashboard.css'

function AdminDashboard() {
  const [places, setPlaces] = useState([])
  const [reviewCount, setReviewCount] = useState(0)
  const [reviews, setReviews] = useState([])
  const [pendingSuggestions, setPendingSuggestions] =
    useState(0)
  const [openReports, setOpenReports] = useState(0)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [
          placesSnapshot,
          reviewsSnapshot,
          suggestionsSnapshot,
          reportsSnapshot,
        ] = await Promise.all([
          getDocs(collection(db, 'places')),
          getDocs(collection(db, 'reviews')),
          getDocs(collection(db, 'suggestions')),
          getDocs(collection(db, 'reports')),
        ])

        const placesData = placesSnapshot.docs.map(
          (placeDocument) => ({
            ...placeDocument.data(),
            id: placeDocument.id,
          })
        )

        const suggestionsData =
          suggestionsSnapshot.docs.map(
            (suggestionDocument) =>
              suggestionDocument.data()
          )

        const reportsData =
          reportsSnapshot.docs.map(
            (reportDocument) =>
              reportDocument.data()
          )

        setPlaces(placesData)
        setReviewCount(reviewsSnapshot.size)
        setReviews(
          reviewsSnapshot.docs.map(
            (reviewDocument) =>
              reviewDocument.data()
          )
        )

        setPendingSuggestions(
          suggestionsData.filter(
            (suggestion) =>
              suggestion.status === 'pending'
          ).length
        )

        setOpenReports(
          reportsData.filter(
            (report) =>
              report.status === 'open'
          ).length
        )
      } catch (error) {
        console.error(
          'Error loading admin dashboard:',
          error
        )
      }
    }

    loadDashboard()
  }, [])

  const verifiedPlaces = places.filter(
    (place) => place.verified
  ).length

  function getPlaceRating(placeId) {
    const placeReviews = reviews.filter(
      (review) =>
        String(review.placeId) ===
        String(placeId)
    )

    if (placeReviews.length === 0) {
      return '0.0'
    }

    const total = placeReviews.reduce(
      (sum, review) =>
        sum + Number(review.ratingStars || 0),
      0
    )

    return (
      total / placeReviews.length
    ).toFixed(1)
  }
  return (
    <main className="admin-page">
      <div className="admin-container">
        <div className="admin-heading">
          <div>
            <span className="section-label">
              ADMINISTRATION
            </span>

            <h1>Admin Dashboard</h1>

            <p>
              Manage places, community submissions,
              reports, and accessibility information.
            </p>
          </div>

          <Link
            to="/admin/places/new"
            className="admin-add-button"
          >
            <PlusCircle size={19} />
            Add New Place
          </Link>
        </div>

        <section className="admin-stats">
          <article className="admin-stat-card">
            <div className="admin-stat-icon">
              <MapPin size={22} />
            </div>

            <div>
              <strong>{places.length}</strong>
              <span>Total Places</span>
            </div>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-icon">
              <ShieldCheck size={22} />
            </div>

            <div>
              <strong>{verifiedPlaces}</strong>
              <span>Verified Places</span>
            </div>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-icon">
              <Lightbulb size={22} />
            </div>

            <div>
              <strong>{pendingSuggestions}</strong>
              <span>Pending Suggestions</span>
            </div>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-icon">
              <Flag size={22} />
            </div>

            <div>
              <strong>{openReports}</strong>
              <span>Open Reports</span>
            </div>
          </article>
        </section>

        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <span className="section-label">
                MANAGEMENT
              </span>

              <h2>Manage AccessHub</h2>
            </div>
          </div>

          <div className="admin-management-grid">
            <Link
              to="/admin/places"
              className="admin-management-card"
            >
              <div className="admin-management-icon">
                <MapPin size={24} />
              </div>

              <div>
                <h3>Places</h3>

                <p>
                  Add, edit, verify, publish,
                  or remove places.
                </p>
              </div>

              <span>Manage →</span>
            </Link>

            <Link
              to="/admin/suggestions"
              className="admin-management-card"
            >
              <div className="admin-management-icon">
                <Lightbulb size={24} />
              </div>

              <div>
                <h3>Suggestions</h3>

                <p>
                  Review places submitted by
                  community members.
                </p>
              </div>

              <span>Review →</span>
            </Link>

            <Link
              to="/admin/reports"
              className="admin-management-card"
            >
              <div className="admin-management-icon">
                <Flag size={24} />
              </div>

              <div>
                <h3>Reports</h3>

                <p>
                  Review incorrect or outdated
                  accessibility information.
                </p>
              </div>

              <span>Review →</span>
            </Link>

            <Link
              to="/admin/reviews"
              className="admin-management-card"
            >
              <div className="admin-management-icon">
                <MessageSquareText size={24} />
              </div>

              <div>
                <h3>Reviews</h3>

                <p>
                  View and moderate community
                  reviews.
                </p>
              </div>

              <span>
                {reviewCount} reviews →
              </span>
            </Link>
          </div>
        </section>

        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <span className="section-label">
                RECENT PLACES
              </span>

              <h2>Place Overview</h2>
            </div>

            <Link
              to="/admin/places"
              className="admin-view-all"
            >
              View all places
            </Link>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Place</th>
                  <th>Category</th>
                  <th>City</th>
                  <th>Rating</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {places
                  .slice(0, 5)
                  .map((place) => (
                    <tr key={place.id}>
                      <td>
                        <strong>
                          {place.name}
                        </strong>
                      </td>

                      <td>{place.category}</td>
                      <td>{place.city}</td>

                      <td>
                        {getPlaceRating(place.id)}
                      </td>
                      <td>
                        <span
                          className={
                            place.verified
                              ? 'admin-status verified'
                              : 'admin-status pending'
                          }
                        >
                          {place.verified
                            ? 'Verified'
                            : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}

export default AdminDashboard