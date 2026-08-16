import { useState } from 'react'
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  X,
  ArrowUpDown
} from 'lucide-react'

import places from '../data/places'
import PlaceCard from '../components/PlaceCard'
import './ExplorePlaces.css'

function ExplorePlaces() {
  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const [showFilters, setShowFilters] = useState(false)

  const [selectedCity, setSelectedCity] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedAccessibility, setSelectedAccessibility] = useState('')

  const [sortBy, setSortBy] = useState('')
  const [onlyVerified, setOnlyVerified] = useState(false)

  // Create filter options directly from the data
  const cities = [...new Set(places.map((place) => place.city))]

  const categories = [
    ...new Set(places.map((place) => place.category)),
  ]

 const accessibilityFeatures = [
  ...new Set(
    places.flatMap((place) =>
      Object.values(place.accessibility)
        .flat()
        .map((feature) => feature.name)
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
  }

  const filteredPlaces = places.filter((place) => {
    const searchValue = searchTerm.toLowerCase()

    const matchesSearch =
      searchValue === '' ||
      place.name.toLowerCase().includes(searchValue) ||
      place.city.toLowerCase().includes(searchValue) ||
      place.category.toLowerCase().includes(searchValue) ||
      place.address.toLowerCase().includes(searchValue)

    const matchesCity =
      selectedCity === '' ||
      place.city === selectedCity

    const matchesCategory =
      selectedCategory === '' ||
      place.category === selectedCategory

  const matchesAccessibility =
  selectedAccessibility === '' ||
  Object.values(place.accessibility)
    .flat()
    .some(
      (feature) =>
        feature.name === selectedAccessibility
    )

    return (
      matchesSearch &&
      matchesCity &&
      matchesCategory &&
      matchesAccessibility
    )
  })
const sortedPlaces = [...filteredPlaces]
  .filter((place) => {
    if (onlyVerified) {
      return place.verified
    }

    return true
  })
  .sort((a, b) => {
    if (sortBy === 'mostReviews') {
      return b.reviews - a.reviews
    }

    if (sortBy === 'highestRated') {
      return b.rating - a.rating
    }

    if (sortBy === 'recentlyUpdated') {
      return new Date(b.updatedAt) - new Date(a.updatedAt)
    }

    return 0
  })
  return (
    <section className="explore-page">
      <div className="explore-container">

        {/* Page Heading */}
        <div className="explore-heading">
          <span className="section-label">
            EXPLORE PLACES
          </span>

          <h1>Find a place that works for you</h1>

          <p>
            Search and filter places by location, category,
            and accessibility features.
          </p>
        </div>

        {/* Search */}
        <div className="explore-toolbar">

          <div className="explore-search">
            <Search size={20} />

            <input
              type="text"
              placeholder="Search by place, city, category, or address"
              value={searchInput}
              onChange={(event) =>
                setSearchInput(event.target.value)
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
              showFilters ? 'filters-active' : ''
            }`}
            onClick={() =>
              setShowFilters((current) => !current)
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

        {/* Filters */}
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
                  setSelectedCity(event.target.value)
                }
              >
                <option value="">All cities</option>

                {cities.map((city) => (
                  <option key={city} value={city}>
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
                  setSelectedCategory(event.target.value)
                }
              >
                <option value="">All categories</option>

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

        {/* Results */}
 <div className="results-header">
  <p className="results-count">
    <strong>{sortedPlaces.length}</strong>{' '}
    {sortedPlaces.length === 1
      ? 'place found'
      : 'places found'}
  </p>

  <div className="results-controls">
    <div className="sort-control">
      <label htmlFor="sort-select"><ArrowUpDown size={17} />
      Sort:</label>

      <select
        id="sort-select"
        value={sortBy}
        onChange={(event) =>
          setSortBy(event.target.value)
        }
      >
         <option value="">- - - </option>

        <option value="mostReviews">Most Reviews</option>
        <option value="highestRated">Highest Rated</option>
        <option value="recentlyUpdated">Recently Updated</option>
      </select>
    </div>

    <label className="verified-filter">
      <input
        type="checkbox"
        checked={onlyVerified}
        onChange={(event) =>
          setOnlyVerified(event.target.checked)
        }
      />
      Only verified
    </label>
  </div>
</div>

        {/* Cards */}
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
              Try changing your search or filters.
            </p>

            <button
              type="button"
              onClick={handleResetFilters}
            >
              Clear search and filters
            </button>
          </div>
        )}

      </div>
    </section>
  )
}

export default ExplorePlaces