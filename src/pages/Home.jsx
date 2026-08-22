import { Search, MapPin, Volume2, CheckCircle2, MessageSquareText, HandHeart } from 'lucide-react'
import homeBackgraund1 from '../assets/homeBackgraund1.png'
import homeBackgraund2 from '../assets/homeBackgraund2.png'
import homeBackgraund3 from '../assets/homeBackgraund3.png'
import {
  useAccessibility
} from '../context/AccessibilityContext'

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
import PlaceCard from '../components/PlaceCard'
import {
  useEffect,
  useState
} from 'react'

import { Link, useLocation, useNavigate} from 'react-router-dom'
import {
  collection,
  getDocs
} from 'firebase/firestore'

import { db } from '../firebase/firebase'
import './Home.css'

function Home() 
{
  const heroImages = [
  homeBackgraund1,
  homeBackgraund2,
  homeBackgraund3,
]

const [currentHeroImage, setCurrentHeroImage] =
  useState(0)
  const { settings } = useAccessibility()
  const location = useLocation()
  const navigate = useNavigate()
  const [places, setPlaces] = useState([])
  const cities = [
  ...new Set(
    places
      .map((place) => place.city)
      .filter(Boolean)
  ),
].sort()
const [heroSearch, setHeroSearch] = useState('')
const [heroCity, setHeroCity] = useState('')
const [isListening, setIsListening] = useState(false)
 const [loadingPlaces, setLoadingPlaces] = useState(true)

 useEffect(() => {
  if (settings.reduceMotion) {
    return
  }

  const interval =
    setInterval(() => {
      setCurrentHeroImage(
        (current) =>
          (current + 1) %
          heroImages.length
      )
    }, 5000)

  return () =>
    clearInterval(interval)
}, [
  heroImages.length,
  settings.reduceMotion
])

useEffect(() => {
  if (!location.hash) {
    return
  }

  const sectionId =
    location.hash.replace('#', '')

  setTimeout(() => {
    const section =
      document.getElementById(sectionId)

    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, 100)
}, [location.hash])
useEffect(() => {
  async function loadPlaces() {
    try {
      setLoadingPlaces(true)

      const snapshot = await getDocs(
        collection(db, 'places')
      )

const placesData = snapshot.docs.map(
  (document) => {
    const placeData = document.data()

    return {
      ...placeData,
      firestoreId: document.id,
      id: placeData.id ?? document.id,
    }
  }
)

      setPlaces(placesData)
    } catch (error) {
      console.error(
        'Error loading home places:',
        error
      )

      setPlaces([])
    } finally {
      setLoadingPlaces(false)
    }
  }

  loadPlaces()
}, [])

function showPreviousHeroImage() {
  setCurrentHeroImage((current) =>
    current === 0
      ? heroImages.length - 1
      : current - 1
  )
}

function showNextHeroImage() {
  setCurrentHeroImage((current) =>
    current === heroImages.length - 1
      ? 0
      : current + 1
  )
}


function handleHeroSearch() {
  const params = new URLSearchParams()

  if (heroSearch.trim()) {
    params.set(
      'search',
      heroSearch.trim()
    )
  }

  if (heroCity) {
    params.set(
      'city',
      heroCity
    )
  }

  const queryString = params.toString()

  navigate(
    queryString
      ? `/places?${queryString}`
      : '/places'
  )
}
function handleHeroListen() {
  if (!('speechSynthesis' in window)) {
    alert(
      'Text-to-speech is not supported in this browser.'
    )
    return
  }

  if (isListening) {
    window.speechSynthesis.cancel()
    setIsListening(false)
    return
  }

  window.speechSynthesis.cancel()

  const text = `
    Find places that work for you.
    Find public, local, and tourist places
    with clear accessibility information
    before you visit.
  `

  const speech =
    new SpeechSynthesisUtterance(text)

  speech.onend = () => {
    setIsListening(false)
  }

  speech.onerror = () => {
    setIsListening(false)
  }

  setIsListening(true)

  window.speechSynthesis.speak(speech)
}
  return (
    <>
<section
  className="hero-section"
  style={{
    backgroundImage:
      `url(${heroImages[currentHeroImage]})`
  }}
>

      <div className="hero-overlay"></div>

      <button
  type="button"
  className="hero-gallery-arrow hero-gallery-left"
  onClick={showPreviousHeroImage}
  aria-label="Previous image"
>
  ‹
</button>

<button
  type="button"
  className="hero-gallery-arrow hero-gallery-right"
  onClick={showNextHeroImage}
  aria-label="Next image"
>
  ›
</button>

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
      value={heroSearch}
      onChange={(event) =>
        setHeroSearch(event.target.value)
      }
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          handleHeroSearch()
        }
      }}
    />
  </div>

  <div className="search-field city-field">
    <MapPin size={21} />

<select
  value={heroCity}
  onChange={(event) =>
    setHeroCity(event.target.value)
  }
>
  <option value="">
    All Cities
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

  <button
    type="button"
    className="search-button"
    onClick={handleHeroSearch}
  >
    <Search size={20} />
    Search
  </button>

</div>
      <button
  type="button"
  className="listen-button"
  onClick={handleHeroListen}
>
  <Volume2 size={20} />

  {isListening
    ? 'Stop listening'
    : 'Listen to description'}
</button>
      </div>
    </section>

    <section className="accessibility-section" id="accessibility">
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
{!loadingPlaces &&
  places
    .filter((place) => place.verified)
    .slice(0, 3)
    .map((place) => (
      <PlaceCard
        key={place.firestoreId || place.id}
        place={place}
      />
    ))}
    </div>
      <div className="view-all-wrapper">
      <Link to="/places" className="view-all-link">
        View all →
      </Link>
    </div>
  </div>
</section>

<section className="how-it-works-section" id="how-it-works">
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