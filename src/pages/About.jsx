import {
  Accessibility,
  BadgeCheck,
  CheckCircle2,
  Compass,
  Eye,
  HandHeart,
  HeartHandshake,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Users,
  Volume2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import './About.css'

const values = [
  {
    icon: Accessibility,
    title: 'Independence',
    description:
      'We help people make informed decisions about where they can go with more confidence.',
    className: 'value-teal',
  },
  {
    icon: Users,
    title: 'Inclusion',
    description:
      'AccessHub is designed for different accessibility needs and experiences.',
    className: 'value-blue',
  },
  {
    icon: ShieldCheck,
    title: 'Trusted Information',
    description:
      'Important place information can be reviewed and verified before becoming official.',
    className: 'value-green',
  },
  {
    icon: HeartHandshake,
    title: 'Community Contribution',
    description:
      'Visitors can share reviews, suggest places, and help improve accessibility information.',
    className: 'value-coral',
  },
  {
    icon: Eye,
    title: 'Respect',
    description:
      'Accessibility information should be clear, respectful, and useful without assumptions.',
    className: 'value-purple',
  },
  {
    icon: Sparkles,
    title: 'Accessible Technology',
    description:
      'The platform itself aims to be simple, readable, and accessible to use.',
    className: 'value-yellow',
  },
]

function About() {
  const [isListening, setIsListening] = useState(false)

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel()
    }
  }, [])

  function handleListen() {
    if (!('speechSynthesis' in window)) {
      toast.warning(
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
      About AccessHub.
      AccessHub helps people understand how accessible a place is before they visit.
      We bring clear accessibility information,
      community experiences,
      and verified updates together in one place.
      Plan with more confidence.
    `

    const speech = new SpeechSynthesisUtterance(text)

    speech.onstart = () => {
      setIsListening(true)
    }

    speech.onend = () => {
      setIsListening(false)
    }

    speech.onerror = () => {
      setIsListening(false)
    }

    window.speechSynthesis.speak(speech)
  }

  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-hero-decoration about-circle-one" />
        <div className="about-hero-decoration about-circle-two" />

        <div className="about-hero-content">
          <span className="about-badge">
            <CheckCircle2 size={16} />
            Community-driven accessibility information
          </span>

          <h1 className="about-hero-title">
            <span className="hero-title-accent">
              About AccessHub
            </span>
          </h1>

          <p>
            AccessHub helps people understand how accessible a place
            is before they visit. We bring clear accessibility
            information, community experiences, and verified updates
            together in one place.
          </p>

          <strong className="about-hero-message">
            Plan with more confidence.
          </strong>

          <button
            type="button"
            className="about-listen-button"
            onClick={handleListen}
          >
            <Volume2 size={19} />

            {isListening
              ? 'Stop listening'
              : 'Listen to description'}
          </button>
        </div>
      </section>

      <section className="about-values-section">
        <div className="about-container">
          <div className="about-section-heading">
            <span className="section-label">
              WHAT GUIDES US
            </span>

            <h2>Our Values</h2>

            <p>
              The principles behind the way AccessHub presents
              accessibility information and supports its community.
            </p>
          </div>

          <div className="values-grid">
            {values.map((value) => {
              const Icon = value.icon

              return (
                <article
                  key={value.title}
                  className={`value-card ${value.className}`}
                >
                  <div className="value-icon">
                    <Icon size={25} />
                  </div>

                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="about-impact-section">
        <div className="about-container">
          <div className="about-section-heading">
            <span className="section-label">
              WHY ACCESSHUB MATTERS
            </span>

            <h2>Useful information before the visit</h2>

            <p>
              AccessHub brings different parts of the accessibility
              journey together in one simple experience.
            </p>
          </div>

          <div className="impact-grid">
            <article className="impact-card">
              <div className="impact-icon">
                <Accessibility size={25} />
              </div>

              <h3>Clear accessibility details</h3>

              <p>
                Check mobility, visual, hearing, sensory,
                restroom, parking, and other accessibility features.
              </p>
            </article>

            <article className="impact-card">
              <div className="impact-icon">
                <MessageSquareText size={25} />
              </div>

              <h3>Community experiences</h3>

              <p>
                Reviews and contributions help visitors understand
                what a place is really like before going there.
              </p>
            </article>

            <article className="impact-card">
              <div className="impact-icon">
                <BadgeCheck size={25} />
              </div>

              <h3>Reviewed information</h3>

              <p>
                Suggestions and reports can be checked before
                official place information is updated.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="about-cta-section">
        <div className="about-cta-card">
          <div>
            <span className="about-cta-label">
              START EXPLORING
            </span>

            <h2>Start your accessibility journey</h2>

            <p>
              Find places that fit your needs or help the community
              by sharing a place you know.
            </p>
          </div>

          <div className="about-cta-actions">
            <Link
              to="/places"
              className="about-primary-button"
            >
              <Compass size={19} />
              Explore Places
            </Link>

            <Link
              to="/suggest-place"
              className="about-secondary-button"
            >
              <HandHeart size={19} />
              Suggest a Place
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default About