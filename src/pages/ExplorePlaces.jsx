import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  X,
  ArrowUpDown,
} from 'lucide-react'
import {
  collection,
  getDocs,
} from 'firebase/firestore'

import { db } from '../firebase/firebase'
import PlaceCard from '../components/PlaceCard'

import './ExplorePlaces.css'

function ExplorePlaces() {
  const [searchParams] = useSearchParams()

  const initialSearch =
    searchParams.get('search') || ''

  const initialCity =
    searchParams.get('city') || ''

  const [places, setPlaces] = useState([])
  const [loadingPlaces, setLoadingPlaces] =
    useState(true)
  const [placesError, setPlacesError] =
    useState('')

  const [searchInput, setSearchInput] =
    useState(initialSearch)
  const [searchTerm, setSearchTerm] =
    useState(initialSearch)

  const [selectedCity, setSelectedCity] =
    useState(initialCity)
  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState('')
  const [
    selectedAccessibility,
    setSelectedAccessibility,
  ] = useState('')

  const [showFilters, setShowFilters] =
    useState(false)
  const [sortBy, setSortBy] = useState('')
  const [onlyVerified, setOnlyVerified] =
    useState(false)

  useEffect(() => {
    async function loadPlaces() {
      try {
        setLoadingPlaces(true)
        setPlacesError('')

        const snapshot = await getDocs(
          collection(db, 'places')
        )

        const firebasePlaces =
          snapshot.docs.map((document) => ({
            ...document.data(),
            id: document.id,
          }))

        setPlaces(firebasePlaces)
      } catch (error) {
        console.error(
          'Error loading places:',
          error
        )

        setPlacesError(
          'Could not load places. Please try again.'
        )
      } finally {
        setLoadingPlaces(false)
      }
    }

    loadPlaces()
  }, [])

  const cities = [
    ...new Set(
      places
        .map((place) => place.city)
        .filter(Boolean)
    ),
  ]

  const categories = [
    ...new Set(
      places
        .map((place) => place.category)
        .filter(Boolean)
    ),
  ]

  const accessibilityFeatures = [
    ...new Set(
      places.flatMap((place) =>
        Object.values(
          place.accessibility || {}
        )
          .flat()
          .map((feature) => feature.name)
          .filter(Boolean)
      )
    ),
  ]

  function handleSearch() {
    setSearchTerm(searchInput.trim())
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  function handleResetFilters() {
    setSearchInput('')
    setSearchTerm('')
    setSelectedCity('')
    setSelectedCategory('')
    setSelectedAccessibility('')
    setOnlyVerified(false)
    setSortBy('')
  }

  const filteredPlaces = places.filter(
    (place) => {
      const searchValue =
        searchTerm.toLowerCase()

      const name =
        place.name?.toLowerCase() || ''

      const city =
        place.city?.toLowerCase() || ''

      const category =
        place.category?.toLowerCase() || ''

      const address =
        place.address?.toLowerCase() || ''

      const matchesSearch =
        searchValue === '' ||
        name.includes(searchValue) ||
        city.includes(searchValue) ||
        category.includes(searchValue) ||
        address.includes(searchValue)

      const matchesCity =
        selectedCity === '' ||
        place.city === selectedCity

      const matchesCategory =
        selectedCategory === '' ||
        place.category === selectedCategory

      const matchesAccessibility =
        selectedAccessibility === '' ||
        Object.values(
          place.accessibility || {}
        )
          .flat()
          .some(
            (feature) =>
              feature.name ===
              selectedAccessibility
          )

      return (
        matchesSearch &&
        matchesCity &&
        matchesCategory &&
        matchesAccessibility
      )
    }
  )

  const sortedPlaces = [...filteredPlaces]
    .filter((place) => {
      if (onlyVerified) {
        return place.verified
      }

      return true
    })
    .sort((a, b) => {
      if (sortBy === 'mostReviews') {
        return (
          (b.reviews || 0) -
          (a.reviews || 0)
        )
      }

      if (sortBy === 'highestRated') {
        return (
          (b.ratingStars || 0) -
          (a.ratingStars || 0)
        )
      }

      if (sortBy === 'recentlyUpdated') {
        return (
          new Date(b.updatedAt || 0) -
          new Date(a.updatedAt || 0)
        )
      }

      return 0
    })

  return (
    <section className="explore-page">
      <div className="explore-container">
        <div className="explore-heading">
          <span className="section-label">
            EXPLORE PLACES
          </span>

          <h1>
            Find a place that works for you
          </h1>

          <p>
            Search and filter places by location,
            category, and accessibility features.
          </p>
        </div>

        <div className="explore-toolbar">
          <div className="explore-search">
            <Search size={20} />

            <input
              type="text"
              placeholder="Search by place, city, category, or address"
              value={searchInput}
              onChange={(event) =>
                setSearchInput(
                  event.target.value
                )
              }
              onKeyDown={handleKeyDown}
            />
          </div>

          <button
            type="button"
            className="explore-search-button"
            onClick={handleSearch}
          >
            <Search size={19} />
            Search
          </button>

          <button
            type="button"
            className={`filters-button ${
              showFilters
                ? 'filters-active'
                : ''
            }`}
            onClick={() =>
              setShowFilters(
                (current) => !current
              )
            }
          >
            {showFilters ? (
              <X size={19} />
            ) : (
              <SlidersHorizontal size={19} />
            )}

            Filters
          </button>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label htmlFor="city-filter">
                City
              </label>

              <select
                id="city-filter"
                value={selectedCity}
                onChange={(event) =>
                  setSelectedCity(
                    event.target.value
                  )
                }
              >
                <option value="">
                  All cities
                </option>

                {cities.map((city) => (
                  <option
                    key={city}
                    value={city}
                  >
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="category-filter">
                Category
              </label>

              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(event) =>
                  setSelectedCategory(
                    event.target.value
                  )
                }
              >
                <option value="">
                  All categories
                </option>

                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="accessibility-filter">
                Accessibility
              </label>

              <select
                id="accessibility-filter"
                value={selectedAccessibility}
                onChange={(event) =>
                  setSelectedAccessibility(
                    event.target.value
                  )
                }
              >
                <option value="">
                  All accessibility features
                </option>

                {accessibilityFeatures.map(
                  (feature) => (
                    <option
                      key={feature}
                      value={feature}
                    >
                      {feature}
                    </option>
                  )
                )}
              </select>
            </div>

            <button
              type="button"
              className="reset-filters-button"
              onClick={handleResetFilters}
            >
              <RotateCcw size={17} />
              Reset
            </button>
          </div>
        )}

        {loadingPlaces && (
          <div className="explore-status-message">
            Loading places...
          </div>
        )}

        {placesError && (
          <div className="explore-status-message error">
            {placesError}
          </div>
        )}

        {!loadingPlaces && !placesError && (
          <>
            <div className="results-header">
              <p className="results-count">
                <strong>
                  {sortedPlaces.length}
                </strong>{' '}
                {sortedPlaces.length === 1
                  ? 'place found'
                  : 'places found'}
              </p>

              <div className="results-controls">
                <div className="sort-control">
                  <label htmlFor="sort-select">
                    <ArrowUpDown size={17} />
                    Sort:
                  </label>

                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(event) =>
                      setSortBy(
                        event.target.value
                      )
                    }
                  >
                    <option value="">
                      - - -
                    </option>

                    <option value="mostReviews">
                      Most Reviews
                    </option>

                    <option value="highestRated">
                      Highest Rated
                    </option>

                    <option value="recentlyUpdated">
                      Recently Updated
                    </option>
                  </select>
                </div>

                <label className="verified-filter">
                  <input
                    type="checkbox"
                    checked={onlyVerified}
                    onChange={(event) =>
                      setOnlyVerified(
                        event.target.checked
                      )
                    }
                  />

                  Only verified
                </label>
              </div>
            </div>

            {sortedPlaces.length > 0 ? (
              <div className="places-grid">
                {sortedPlaces.map((place) => (
                  <PlaceCard
                    key={place.id}
                    place={place}
                  />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <Search size={34} />

                <h2>No places found</h2>

                <p>
                  Try changing your search or
                  filters.
                </p>

                <button
                  type="button"
                  onClick={handleResetFilters}
                >
                  Clear search and filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default ExplorePlaces