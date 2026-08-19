import { useEffect, useState } from 'react'
import { Link, useNavigate , useParams} from 'react-router-dom'

import { collection, addDoc, doc, getDoc, updateDoc} from 'firebase/firestore'
import { db } from '../firebase/firebase'

import {
  ArrowLeft,
  MapPin,
  Image,
  Accessibility,
  ShieldCheck,
  Save
} from 'lucide-react'

import './AdminPlaceForm.css'

function AdminPlaceForm() {
const navigate = useNavigate()
const { id } = useParams()

const isEditMode = Boolean(id)

const [isSubmitting, setIsSubmitting] = useState(false)
const [loadingPlace, setLoadingPlace] = useState(isEditMode)

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    city: '',
    address: '',
    description: '',
    images: '',
    verified: false,

    mobility: false,
    visual: false,
    hearing: false,
    sensory: false,
    restroom: false,
    parking: false,
  })

  function handleChange(event) {
    const { name, value, type, checked } = event.target

    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }
useEffect(() => {
  if (!isEditMode) {
    return
  }

  async function loadPlace() {
    try {
      const placeRef = doc(db, 'places', id)
      const placeSnapshot = await getDoc(placeRef)

      if (!placeSnapshot.exists()) {
        alert('Place not found.')
        navigate('/admin/places')
        return
      }

      const placeData = placeSnapshot.data()

setFormData({
  name: placeData.name || '',
  category: placeData.category || '',
  city: placeData.city || '',
  address: placeData.address || '',
  description: placeData.description || '',

  images: Array.isArray(placeData.images)
    ? placeData.images.join('\n')
    : '',

  verified: Boolean(placeData.verified),

  mobility:
    placeData.accessibility?.mobility?.length > 0,

  visual:
    placeData.accessibility?.visual?.length > 0,

  hearing:
    placeData.accessibility?.hearing?.length > 0,

  sensory:
    placeData.accessibility?.sensory?.length > 0,

  restroom:
    Object.values(placeData.accessibility || {})
      .flat()
      .some(
        (feature) =>
          feature.name === 'Accessible restroom'
      ),

  parking:
    Boolean(placeData.visitInfo?.parking),
})
    } catch (error) {
      console.error(
        'Error loading place:',
        error
      )

      alert('Could not load the place.')
    } finally {
      setLoadingPlace(false)
    }
  }

  loadPlace()
}, [id, isEditMode, navigate])

async function handleSubmit(event) {
  event.preventDefault()

  if (
    !formData.name.trim() ||
    !formData.category ||
    !formData.city.trim() ||
    !formData.address.trim()
  ) {
    alert('Please complete all required fields.')
    return
  }

  const imageArray = formData.images
    .split('\n')
    .map((image) => image.trim())
    .filter(Boolean)


const placeData = {
  name: formData.name.trim(),
  category: formData.category,
  city: formData.city.trim(),
  address: formData.address.trim(),
  description: formData.description.trim(),

  images:
    imageArray.length > 0
      ? imageArray
      : [
          'https://placehold.co/900x600?text=AccessHub+Place',
        ],

  verified: formData.verified,

  accessibilityMatch: 0,

  accessibility: {
    mobility: formData.mobility
      ? [
          {
            name: 'Wheelchair accessibility',
            status: 'available',
          },
        ]
      : [],

    visual: formData.visual
      ? [
          {
            name: 'Visual accessibility',
            status: 'available',
          },
        ]
      : [],

    hearing: formData.hearing
      ? [
          {
            name: 'Hearing accessibility',
            status: 'available',
          },
        ]
      : [],

    sensory: formData.sensory
      ? [
          {
            name: 'Sensory friendly',
            status: 'available',
          },
        ]
      : [],
  },

  visitInfo: {
    entrance: '',
    parking: formData.parking
      ? 'Accessible parking available.'
      : '',
    hours: '',
    phone: '',
    website: '',
    transport: '',
  },
}
  try {
    setIsSubmitting(true)

    if (isEditMode) {
      await updateDoc(
        doc(db, 'places', id),
        {
          ...placeData,
          updatedAt:
            new Date().toISOString(),
        }
      )

      alert(
        'Place updated successfully.'
      )
    } else {
      await addDoc(
        collection(db, 'places'),
        {
          ...placeData,

          rating: 0,
          reviews: 0,

          createdAt:
            new Date().toISOString(),

          updatedAt:
            new Date().toISOString(),
        }
      )

      alert(
        'Place added successfully.'
      )
    }

    navigate('/admin/places')
  } catch (error) {
    console.error(
      'Error saving place:',
      error
    )

    alert(
      'Could not save the place. Please try again.'
    )
  } finally {
    setIsSubmitting(false)
  }
}
  if (loadingPlace) {
  return (
    <main className="admin-place-form-page">
      <div className="admin-place-form-container">
        <p className="admin-form-loading">
          Loading place...
        </p>
      </div>
    </main>
  )
}
  return (
    <main className="admin-place-form-page">
      <div className="admin-place-form-container">

        <Link
          to="/admin/places"
          className="admin-form-back"
        >
          <ArrowLeft size={18} />
          Back to Manage Places
        </Link>

        <div className="admin-form-heading">
          <span className="section-label">
            PLACE MANAGEMENT
          </span>

<h1>
  {isEditMode
    ? 'Edit Place'
    : 'Add New Place'}
</h1>
        
        <p>
  {isEditMode
    ? 'Update the place information, accessibility details, images, and verification status.'
    : 'Add basic information, accessibility details, images, and verification status.'}
</p>
        </div>

        <form
          className="admin-place-form"
          onSubmit={handleSubmit}
        >

          {/* BASIC INFORMATION */}

          <section className="admin-form-section">

            <div className="admin-form-section-heading">
              <div className="admin-form-section-icon">
                <MapPin size={21} />
              </div>

              <div>
                <h2>Basic Information</h2>

                <p>
                  Enter the main information visitors
                  need to identify the place.
                </p>
              </div>
            </div>

            <div className="admin-form-grid">

              <div className="admin-form-group admin-full-field">
                <label htmlFor="name">
                  Place name *
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Example: Haifa Museum of Art"
                />
              </div>

              <div className="admin-form-group">
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
                    Select category
                  </option>

                  <option value="Museum">
                    Museum
                  </option>

                  <option value="Park">
                    Park
                  </option>

                  <option value="Restaurant">
                    Restaurant
                  </option>

                  <option value="Shopping">
                    Shopping
                  </option>

                  <option value="Attraction">
                    Attraction
                  </option>

                  <option value="Library">
                    Library
                  </option>

                  <option value="Public Service">
                    Public Service
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              <div className="admin-form-group">
                <label htmlFor="city">
                  City *
                </label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Haifa"
                />
              </div>

              <div className="admin-form-group admin-full-field">
                <label htmlFor="address">
                  Address *
                </label>

                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Full street address"
                />
              </div>

              <div className="admin-form-group admin-full-field">
                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows="5"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of the place..."
                />
              </div>

            </div>

          </section>

          {/* IMAGES */}

          <section className="admin-form-section">

            <div className="admin-form-section-heading">
              <div className="admin-form-section-icon">
                <Image size={21} />
              </div>

              <div>
                <h2>Place Images</h2>

                <p>
                  Add one or more image URLs.
                </p>
              </div>
            </div>

            <div className="admin-form-group">
              <label htmlFor="images">
                Image URLs
              </label>

              <textarea
                id="images"
                name="images"
                rows="5"
                value={formData.images}
                onChange={handleChange}
                placeholder={
                  'https://example.com/image-1.jpg\nhttps://example.com/image-2.jpg'
                }
              />

              <small>
                Put each image URL on a new line.
                The first image will be used as the
                main image.
              </small>
            </div>

          </section>

          {/* ACCESSIBILITY */}

          <section className="admin-form-section">

            <div className="admin-form-section-heading">
              <div className="admin-form-section-icon">
                <Accessibility size={21} />
              </div>

              <div>
                <h2>Accessibility Features</h2>

                <p>
                  Select the accessibility information
                  currently known for this place.
                </p>
              </div>
            </div>

            <div className="admin-accessibility-grid">

              <label className="admin-checkbox-card">
                <input
                  type="checkbox"
                  name="mobility"
                  checked={formData.mobility}
                  onChange={handleChange}
                />

                <span>
                  Wheelchair accessibility
                </span>
              </label>

              <label className="admin-checkbox-card">
                <input
                  type="checkbox"
                  name="visual"
                  checked={formData.visual}
                  onChange={handleChange}
                />

                <span>
                  Visual accessibility
                </span>
              </label>

              <label className="admin-checkbox-card">
                <input
                  type="checkbox"
                  name="hearing"
                  checked={formData.hearing}
                  onChange={handleChange}
                />

                <span>
                  Hearing accessibility
                </span>
              </label>

              <label className="admin-checkbox-card">
                <input
                  type="checkbox"
                  name="sensory"
                  checked={formData.sensory}
                  onChange={handleChange}
                />

                <span>
                  Sensory friendly
                </span>
              </label>

              <label className="admin-checkbox-card">
                <input
                  type="checkbox"
                  name="restroom"
                  checked={formData.restroom}
                  onChange={handleChange}
                />

                <span>
                  Accessible restroom
                </span>
              </label>

              <label className="admin-checkbox-card">
                <input
                  type="checkbox"
                  name="parking"
                  checked={formData.parking}
                  onChange={handleChange}
                />

                <span>
                  Accessible parking
                </span>
              </label>

            </div>

          </section>

          {/* VERIFICATION */}

          <section className="admin-form-section">

            <div className="admin-form-section-heading">
              <div className="admin-form-section-icon">
                <ShieldCheck size={21} />
              </div>

              <div>
                <h2>Verification</h2>

                <p>
                  Choose whether this place should
                  immediately appear as verified.
                </p>
              </div>
            </div>

            <label className="admin-verification-card">

              <input
                type="checkbox"
                name="verified"
                checked={formData.verified}
                onChange={handleChange}
              />

              <div>
                <strong>
                  Mark as verified
                </strong>

                <p>
                  Visitors will see the verified badge
                  on this place.
                </p>
              </div>

            </label>

          </section>

          {/* ACTIONS */}

          <div className="admin-form-actions">

            <Link
              to="/admin/places"
              className="admin-form-cancel"
            >
              Cancel
            </Link>

     <button
  type="submit"
  className="admin-form-submit"
  disabled={isSubmitting}
>
  <Save size={18} />

   {isSubmitting
    ? 'Saving...'
    : isEditMode
      ? 'Save Changes'
      : 'Add Place'}
</button>

          </div>

        </form>

      </div>
    </main>
  )
}
export default AdminPlaceForm