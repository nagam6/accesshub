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

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import places from '../data/places'
import './AdminPlaces.css'

function AdminPlaces() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPlaces = useMemo(() => {
    const search = searchTerm.trim().toLowerCase()

    if (!search) {
      return places
    }

    return places.filter((place) => {
      const name = place.name?.toLowerCase() || ''
      const city = place.city?.toLowerCase() || ''
      const category = place.category?.toLowerCase() || ''
      const address = place.address?.toLowerCase() || ''

      return (
        name.includes(search) ||
        city.includes(search) ||
        category.includes(search) ||
        address.includes(search)
      )
    })
  }, [searchTerm])

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

          {filteredPlaces.length > 0 ? (
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
                    <tr key={place.id}>

                      <td>
                        <div className="admin-place-info">

                          <img
                            src={
                              Array.isArray(place.image)
                                ? place.image[0]
                                : place.image
                            }
                            alt=""
                          />

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
                          {place.rating ?? '—'}
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
                            className="admin-icon-button"
                            aria-label={`View ${place.name}`}
                            title="View place"
                          >
                            <Eye size={17} />
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
                            className="admin-icon-button verify"
                            aria-label={
                              place.verified
                                ? `Unverify ${place.name}`
                                : `Verify ${place.name}`
                            }
                            title={
                              place.verified
                                ? 'Unverify'
                                : 'Verify'
                            }
                          >
                            <BadgeCheck size={17} />
                          </button>

                          <button
                            type="button"
                            className="admin-icon-button delete"
                            aria-label={`Delete ${place.name}`}
                            title="Delete place"
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