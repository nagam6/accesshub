import {
  ArrowLeft,
  BadgeCheck,
  Eye,
  MapPin,
  Pencil,
  PlusCircle,
  Search,
  ShieldOff,
  Trash2
} from 'lucide-react'

import {useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore'

import { db } from '../firebase/firebase'

import './AdminPlaces.css'

function AdminPlaces() {

  const [searchTerm, setSearchTerm] = useState('')
  const [firebasePlaces, setFirebasePlaces] = useState([])
  const [loading, setLoading] = useState(true)

useEffect(() => {
  async function fetchPlaces() {
    try {
      const querySnapshot = await getDocs(
        collection(db, 'places')
      )

 const firestorePlaces = querySnapshot.docs.map((document) => ({
  firestoreId: document.id,
  ...document.data(),
}))

      setFirebasePlaces(firestorePlaces)
    } catch (error) {
      console.error('Error loading places:', error)
    } finally {
      setLoading(false)
    }
  }

  fetchPlaces()
}, [])


const filteredPlaces = useMemo(() => {
  const search = searchTerm.trim().toLowerCase()

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

async function handleDeletePlace(place) {
  const confirmed = window.confirm(
    `Delete ${place.name}?`
  )

  if (!confirmed) {
    return
  }

  try {
    const placeId =
      place.firestoreId || String(place.id)

    const placeRef = doc(
      db,
      'places',
      placeId
    )

    await deleteDoc(placeRef)

    setFirebasePlaces((current) =>
      current.filter(
        (item) =>
          (item.firestoreId || String(item.id)) !==
          placeId
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
}

async function handleToggleVerified(place) {
  try {
    const placeId =
      place.firestoreId || String(place.id)

    const placeRef = doc(
      db,
      'places',
      placeId
    )

    const newVerified =
      !place.verified

    await updateDoc(placeRef, {
      verified: newVerified,
    })

    setFirebasePlaces((current) =>
      current.map((item) =>
        (item.firestoreId || String(item.id)) ===
        placeId
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
                setSearchTerm(event.target.value)
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
                  {filteredPlaces.map((place) => (
                    <tr key={place.firestoreId || place.id}>

                      <td>
                        <div className="admin-place-info">

                        {place.images?.[0] ? (
  <img
    src={place.images[0]}
    alt={place.name}
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
                          <MapPin size={15} />
                          <span>{place.city}</span>
                        </div>
                      </td>

                      <td>
                        <strong>
                          {place.ratingStars ?? '—'}
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
                              <BadgeCheck size={14} />
                              Verified
                            </>
                          ) : (
                            <>
                              <ShieldOff size={14} />
                              Not Verified
                            </>
                          )}
                        </span>
                      </td>

                      <td>
                        <div className="admin-place-actions">

                    <Link
  to={`/places/${place.id}`}
  target="_blank"
  rel="noopener noreferrer"
  className="admin-icon-button"
  aria-label={`View ${place.name}`}
>
  <Eye size={18} />
</Link>
                          <Link
                            to={`/admin/places/${place.id}/edit`}
                            className="admin-icon-button"
                            aria-label={`Edit ${place.name}`}
                            title="Edit place"
                          >
                            <Pencil size={17} />
                          </Link>

                         <button
  type="button"
  className={`admin-icon-button verify ${ place.verified ? 'verified' : ''}`}
  onClick={() => handleToggleVerified(place)}
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
  <BadgeCheck size={17} />
</button>

                       <button
  type="button"
  className="admin-icon-button delete"
  onClick={() => handleDeletePlace(place)}
>
  <Trash2 size={17} />
</button>

                        </div>
                      </td>

                    </tr>
                  ))}
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