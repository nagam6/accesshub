import { Search, SlidersHorizontal } from 'lucide-react'
import places from '../data/places'
import PlaceCard from '../components/PlaceCard'
import './ExplorePlaces.css'

function ExplorePlaces() {
  return (
    <section className="explore-page">
      <div className="explore-container">

        <div className="explore-heading">
          <span className="section-label">EXPLORE PLACES</span>
          <h1>Find a place that works for you</h1>
          <p>
            Search and filter places by location, category, and accessibility features.
          </p>
        </div>

        <div className="explore-toolbar">
          <div className="explore-search">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by place, city, or category"
            />
          </div>

          <button className="filters-button">
            <SlidersHorizontal size={19} />
            Filters
          </button>
        </div>

        <div className="results-header">
          <p>
            <strong>{places.length}</strong> places found
          </p>
        </div>

        <div className="places-grid">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>

      </div>
    </section>
  )
}

export default ExplorePlaces