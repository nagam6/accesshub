import { Search, MapPin, Volume2, CheckCircle2, MessageSquareText, HandHeart } from 'lucide-react'
import homeBackgraund from '../assets/homeBackgraund.png'
import {
  Accessibility,
  Eye,
  Ear,
  Sparkles,
  Bath,
  Car,
  ArrowUpDown,
  Moon
} from 'lucide-react'

import AccessibilityCard from '../components/AccessibilityCard'

import places from '../data/places'
import PlaceCard from '../components/PlaceCard'
import { Link } from 'react-router-dom'

import './Home.css'

function Home() {
  return (
    <>
    <section className="hero-section"
    
  style={{ backgroundImage: `url(${homeBackgraund})` }}>

      <div className="hero-overlay"></div>

      <div className="hero-content">
        <h1 className="hero-title">
        <span>Find places that</span>
        <span className="hero-title-accent">work for you.</span>
        </h1>

  <p className="hero-text">
  Find public, local, and tourist places with clear accessibility
  <br />
  information before you visit.
</p>
        <div className="search-box">
          <div className="search-field">
            <Search size={21} />
            <input
              type="text"
              placeholder="Search for a place or category"
            />
          </div>

          <div className="search-field city-field">
            <MapPin size={21} />
            <select defaultValue="">
              <option value="" disabled>
                Choose city
              </option>
              <option value="haifa">Haifa</option>
              <option value="nazareth">Nazareth</option>
              <option value="acre">Acre</option>
            </select>
          </div>

          <button className="search-button">
            <Search size={20} />
            Search
          </button>
        </div>

        <button className="listen-button">
          <Volume2 size={20} />
          Listen to description
        </button>
      </div>
    </section>

    <section className="accessibility-section">
  <div className="accessibility-container">

    <div className="section-heading">
      <h2>Explore by accessibility need</h2>

      <p>
        Choose the accessibility features that matter to you and discover
        suitable places.
      </p>
    </div>

    <div className="accessibility-grid">

      <AccessibilityCard
        icon={Accessibility}
        title="Wheelchair Access"
        description="Ramps, step-free entrances, and wide accessible paths."
      />

      <AccessibilityCard
        icon={Eye}
        title="Visual Accessibility"
        description="Braille signs, clear guidance, and visual support."
      />

      <AccessibilityCard
        icon={Ear}
        title="Hearing Accessibility"
        description="Sign language support and clear visual alerts."
      />

      <AccessibilityCard
        icon={Sparkles}
        title="Sensory-Friendly"
        description="Calmer spaces with reduced sensory stimulation."
      />

      <AccessibilityCard
        icon={Bath}
        title="Accessible Restrooms"
        description="Accessible bathrooms designed for easier use."
      />

      <AccessibilityCard
        icon={Car}
        title="Accessible Parking"
        description="Dedicated and conveniently located parking spaces."
      />

      <AccessibilityCard
        icon={ArrowUpDown}
        title="Elevators Available"
        description="Working elevators providing access between floors."
      />

      <AccessibilityCard
        icon={Moon}
        title="Quiet Environment"
        description="Low-noise spaces suitable for quieter visits."
      />

    </div>
  </div>
</section>
<section className="featured-section">
  <div className="featured-container">
    <div className="featured-heading">
      <div>
        <h2>Featured accessible places</h2>
        <p>
          Discover places with useful accessibility information before you visit.
        </p>
      </div>
    </div>

    <div className="places-grid">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
      <div className="view-all-wrapper">
      <Link to="/places" className="view-all-link">
        View all →
      </Link>
    </div>
  </div>
</section>
<section className="how-it-works-section">
  <div className="how-it-works-container">

    <div className="how-it-works-heading">
      <h2>How AccessHub works</h2>
      <p>
        Three simple steps to help you plan a more accessible visit.
      </p>
    </div>

    <div className="steps-grid">

      <article className="step-card">
        <div className="step-top">
          <span className="step-number">01</span>

          <div className="step-icon">
            <Search size={24} />
          </div>
        </div>

        <h3>Search & filter</h3>

        <p>
          Find places by name, city, category, and the accessibility features
          that matter to you.
        </p>
      </article>

      <article className="step-card">
        <div className="step-top">
          <span className="step-number">02</span>

          <div className="step-icon">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <h3>Check accessibility details</h3>

        <p>
          Review clear information about available accessibility features
          before your visit.
        </p>
      </article>

      <article className="step-card">
        <div className="step-top">
          <span className="step-number">03</span>

          <div className="step-icon">
            <MessageSquareText size={24} />
          </div>
        </div>

        <h3>Share your experience</h3>

        <p>
          Leave a review, report outdated information, or suggest a new place
          to help the community.
        </p>
      </article>

    </div>
  </div>
</section>
<section className="suggest-cta">
  <div className="suggest-cta-content">
    <h2>Know an accessible place?</h2>

    <p>
      Help the community discover more accessible places by sharing what you know.
    </p>

    <Link to="/suggest-place" className="suggest-cta-button">
  <HandHeart size={20} />
  Suggest a Place
</Link>
  </div>
</section>
</>
  )
}

export default Home