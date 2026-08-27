import {
  ArrowLeft,
  BadgeCheck,
  Eye,
  MapPin,
  Pencil,
  PlusCircle,
  Search,
  ShieldOff,
  Trash2,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore'

import { db } from '../firebase/firebase'

import './AdminPlaces.css'

function AdminPlaces() {
  const [searchTerm, setSearchTerm] = useState('')
  const [firebasePlaces, setFirebasePlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    async function fetchPlaces() {
      try {
        const querySnapshot = await getDocs(
          collection(db, 'places')
        )

        const firestorePlaces =
          querySnapshot.docs.map(
            (document) => ({
              ...document.data(),
              id: document.id,
            })
          )

        setFirebasePlaces(firestorePlaces)

        const reviewsSnapshot = await getDocs(
          collection(db, 'reviews')
        )

        const reviewsData =
          reviewsSnapshot.docs.map(
            (reviewDocument) =>
              reviewDocument.data()
          )

        setReviews(reviewsData)
      } catch (error) {
        console.error(
          'Error loading places:',
          error
        )
      } finally {
        setLoading(false)
      }
    }

    fetchPlaces()
  }, [])

  const filteredPlaces = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase()

    if (!search) {
      return firebasePlaces
    }

    return firebasePlaces.filter((place) => {
      const name =
        place.name?.toLowerCase() || ''

      const city =
        place.city?.toLowerCase() || ''

      const category =
        place.category?.toLowerCase() || ''

      const address =
        place.address?.toLowerCase() || ''

      return (
        name.includes(search) ||
        city.includes(search) ||
        category.includes(search) ||
        address.includes(search)
      )
    })
  }, [searchTerm, firebasePlaces])

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

  function handleDeletePlace(place) {
    toast(
      ({ closeToast }) => (
        <div className="admin-delete-toast">
          <div>
            <strong>Delete place?</strong>

            <p>
              Are you sure you want to delete
              {` ${place.name}`}?
            </p>
          </div>

          <div className="admin-delete-toast-actions">
            <button
              type="button"
              onClick={closeToast}
            >
              Cancel
            </button>

            <button
              type="button"
              className="delete"
              onClick={async () => {
                closeToast()

                try {
                  const placeId = place.id

                  await deleteDoc(
                    doc(
                      db,
                      'places',
                      placeId
                    )
                  )

                  setFirebasePlaces(
                    (current) =>
                      current.filter(
                        (item) =>
                          item.id !== placeId
                      )
                  )

                  toast.success(
                    `${place.name} was deleted successfully.`
                  )
                } catch (error) {
                  console.error(
                    'Error deleting place:',
                    error
                  )

                  toast.error(
                    'Could not delete the place. Please try again.'
                  )
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        toastId: `delete-place-${place.id}`,
        autoClose: false,
        closeOnClick: false,
        draggable: false
      }
    )
  }

  async function handleToggleVerified(place) {
    const newVerified = !place.verified

    try {
      await updateDoc(
        doc(
          db,
          'places',
          place.id
        ),
        {
          verified: newVerified,
        }
      )

      setFirebasePlaces((current) =>
        current.map((item) =>
          item.id === place.id
            ? {
              ...item,
              verified: newVerified,
            }
            : item
        )
      )

      toast.success(
        newVerified
          ? `${place.name} is now verified.`
          : `${place.name} is now unverified.`
      )
    } catch (error) {
      console.error(
        'Error updating verified status:',
        error
      )

      toast.error(
        'Could not update verification status.'
      )
    }
  }

  return (
    <main className="admin-places-page">
      <div className="admin-places-container">
        <Link
          to="/admin"
          className="admin-back-link"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="admin-places-heading">
          <div>
            <span className="section-label">
              PLACE MANAGEMENT
            </span>

            <h1>Manage Places</h1>

            <p>
              View and manage the places available
              on AccessHub.
            </p>
          </div>

          <Link
            to="/admin/places/new"
            className="admin-add-place-button"
          >
            <PlusCircle size={19} />
            Add New Place
          </Link>
        </div>

        <section className="admin-places-toolbar">
          <div className="admin-places-search">
            <Search size={19} />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
              placeholder="Search places..."
              aria-label="Search places"
            />
          </div>

          <span className="admin-places-count">
            {filteredPlaces.length}{' '}
            {filteredPlaces.length === 1
              ? 'place'
              : 'places'}
          </span>
        </section>

        <section className="admin-places-card">
          {loading ? (
            <p className="admin-loading-text">
              Loading places...
            </p>
          ) : filteredPlaces.length > 0 ? (
            <div className="admin-places-table-wrapper">
              <table className="admin-places-table">
                <thead>
                  <tr>
                    <th>Place</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPlaces.map(
                    (place) => (
                      <tr key={place.id}>
                        <td>
                          <div className="admin-place-info">
                            {place.images?.[0] ? (
                              <img
                                src={
                                  place
                                    .images[0]
                                }
                                alt={
                                  place.name
                                }
                                className="admin-place-image"
                              />
                            ) : (
                              <div className="admin-place-image-placeholder">
                                No image
                              </div>
                            )}

                            <div>
                              <strong>
                                {place.name}
                              </strong>

                              <span>
                                ID: {place.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          {place.category}
                        </td>

                        <td>
                          <div className="admin-location-cell">
                            <MapPin
                              size={15}
                            />
                            <span>
                              {place.city}
                            </span>
                          </div>
                        </td>

                        <td>
                          <strong>
                            {getPlaceRating(place.id)}
                          </strong>
                        </td>

                        <td>
                          <span
                            className={
                              place.verified
                                ? 'admin-place-status verified'
                                : 'admin-place-status pending'
                            }
                          >
                            {place.verified ? (
                              <>
                                <BadgeCheck
                                  size={14}
                                />
                                Verified
                              </>
                            ) : (
                              <>
                                <ShieldOff
                                  size={14}
                                />
                                Not Verified
                              </>
                            )}
                          </span>
                        </td>

                        <td>
                          <div className="admin-place-actions">
                            <Link
                              to={`/places/${place.id}`}
                              className="admin-icon-button"
                              aria-label={`View ${place.name}`}
                              title="View place"
                            >
                              <Eye size={18} />
                            </Link>

                            <Link
                              to={`/admin/places/${place.id}/edit`}
                              className="admin-icon-button"
                              aria-label={`Edit ${place.name}`}
                              title="Edit place"
                            >
                              <Pencil
                                size={17}
                              />
                            </Link>

                            <button
                              type="button"
                              className={`admin-icon-button verify ${place.verified
                                  ? 'verified'
                                  : ''
                                }`}
                              onClick={() =>
                                handleToggleVerified(
                                  place
                                )
                              }
                              aria-label={
                                place.verified
                                  ? `Unverify ${place.name}`
                                  : `Verify ${place.name}`
                              }
                              title={
                                place.verified
                                  ? 'Unverify place'
                                  : 'Verify place'
                              }
                            >
                              <BadgeCheck
                                size={17}
                              />
                            </button>

                            <button
                              type="button"
                              className="admin-icon-button delete"
                              onClick={() =>
                                handleDeletePlace(
                                  place
                                )
                              }
                              aria-label={`Delete ${place.name}`}
                              title="Delete place"
                            >
                              <Trash2
                                size={17}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-places-empty">
              <Search size={30} />

              <h3>No places found</h3>

              <p>
                Try another place name, category,
                city, or address.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default AdminPlaces