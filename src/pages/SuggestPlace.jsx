import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  addDoc,
  collection
} from 'firebase/firestore'

import {
  auth,
  db
} from '../firebase/firebase'
import {
  MapPin,
  Building2,
  Accessibility,
  CheckCircle2,
  Send
} from 'lucide-react'

import './SuggestPlace.css'

function SuggestPlace() {
  const navigate = useNavigate()
const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    category: '',
    address: '',
    description: '',
    accessibility: [],
  })

  const [submitted, setSubmitted] = useState(false)

  const accessibilityOptions = [
    'Wheelchair Access',
    'Step-free Entrance',
    'Elevator',
    'Accessible Restroom',
    'Accessible Parking',
    'Visual Accessibility',
    'Hearing Accessibility',
    'Quiet Environment',
  ]

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleAccessibilityChange(feature) {
    setFormData((current) => {
      const alreadySelected =
        current.accessibility.includes(feature)

      return {
        ...current,
        accessibility: alreadySelected
          ? current.accessibility.filter(
              (item) => item !== feature
            )
          : [...current.accessibility, feature],
      }
    })
  }

async function handleSubmit(event) {
  event.preventDefault()

  if (
    !formData.name.trim() ||
    !formData.city.trim() ||
    !formData.category.trim()
  ) {
    alert(
      'Please complete the required fields before submitting.'
    )
    return
  }

  if (!auth.currentUser) {
    navigate('/login')
    return
  }

  try {
    setSubmitting(true)

    const suggestionData = {
      userId: auth.currentUser.uid,

      userName:
        auth.currentUser.displayName ||
        auth.currentUser.email ||
        'AccessHub User',

      userEmail:
        auth.currentUser.email || '',

      name: formData.name.trim(),
      city: formData.city.trim(),
      category: formData.category,
      address: formData.address.trim(),
      description: formData.description.trim(),

      accessibility:
        formData.accessibility,

      status: 'pending',

      createdAt:
        new Date().toISOString(),
    }

    await addDoc(
      collection(db, 'suggestions'),
      suggestionData
    )

    setSubmitted(true)

    setFormData({
      name: '',
      city: '',
      category: '',
      address: '',
      description: '',
      accessibility: [],
    })
  } catch (error) {
    console.error(
      'Error submitting suggestion:',
      error
    )

    alert(
      'Could not submit your suggestion. Please try again.'
    )
  } finally {
    setSubmitting(false)
  }
}

  return (
    <main className="suggest-page">
      <div className="suggest-container">

        <section className="suggest-intro">
          <span className="section-label">
            COMMUNITY CONTRIBUTION
          </span>

          <h1>Suggest a Place</h1>

          <p>
            Know a place that should be on AccessHub?
            Share the basic details and accessibility
            information you know.
          </p>
        </section>

        {submitted && (
          <div className="suggest-success">
            <CheckCircle2 size={22} />

            <div>
              <strong>
                Thank you for your suggestion.
              </strong>

              <p>
                The place was submitted for review
                before being added to AccessHub.
              </p>
            </div>
          </div>
        )}

        <form
          className="suggest-form"
          onSubmit={handleSubmit}
        >

          <section className="suggest-form-section">

            <div className="form-section-heading">
              <Building2 size={22} />

              <div>
                <h2>Place information</h2>

                <p>
                  Tell us which place you would like
                  to suggest.
                </p>
              </div>
            </div>

            <div className="suggest-form-grid">

              <div className="suggest-field">
                <label htmlFor="name">
                  Place name *
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Example: Central Library"
                />
              </div>

              <div className="suggest-field">
                <label htmlFor="category">
                  Category *
                </label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">
                    Choose category
                  </option>

                  <option value="Restaurant">
                    Restaurant
                  </option>

                  <option value="Cafe">
                    Cafe
                  </option>

                  <option value="Museum">
                    Museum
                  </option>

                  <option value="Library">
                    Library
                  </option>

                  <option value="Shopping">
                    Shopping
                  </option>

                  <option value="Hotel">
                    Hotel
                  </option>

                  <option value="Community Center">
                    Community Center
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              <div className="suggest-field">
                <label htmlFor="city">
                  City *
                </label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Example: Haifa"
                />
              </div>

              <div className="suggest-field">
                <label htmlFor="address">
                  Address
                </label>

                <div className="input-with-icon">
                  <MapPin size={18} />

                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street or area"
                  />
                </div>
              </div>

            </div>

          </section>

          <section className="suggest-form-section">

            <div className="form-section-heading">
              <Accessibility size={22} />

              <div>
                <h2>Accessibility features</h2>

                <p>
                  Select the features you know are
                  available at this place.
                </p>
              </div>
            </div>

            <div className="suggest-accessibility-grid">

              {accessibilityOptions.map((feature) => (
                <label
                  key={feature}
                  className={`suggest-accessibility-option ${
                    formData.accessibility.includes(
                      feature
                    )
                      ? 'selected'
                      : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.accessibility.includes(
                      feature
                    )}
                    onChange={() =>
                      handleAccessibilityChange(
                        feature
                      )
                    }
                  />

                  <span>{feature}</span>
                </label>
              ))}

            </div>

          </section>

          <section className="suggest-form-section">

            <div className="suggest-field">
              <label htmlFor="description">
                Additional information
              </label>

              <textarea
                id="description"
                name="description"
                rows="6"
                value={formData.description}
                onChange={handleChange}
                placeholder="Share anything useful about the entrance, parking, restrooms, staff support, or other accessibility details..."
              />
            </div>

          </section>

          <div className="suggest-submit-area">
            <p>
              Your suggestion will be reviewed before
              it becomes official place information.
            </p>

           <button
  type="submit"
  className="suggest-submit-button"
  disabled={submitting}
>
  <Send size={18} />

  {submitting
    ? 'Submitting...'
    : 'Submit Suggestion'}
</button>
          </div>

        </form>

      </div>
    </main>
  )
}

export default SuggestPlace