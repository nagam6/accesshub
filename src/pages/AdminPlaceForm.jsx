import { useEffect, useState } from 'react'
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore'
import {
  Accessibility,
  ArrowLeft,
  Image,
  MapPin,
  Save,
  ShieldCheck,
} from 'lucide-react'
import { toast } from 'react-toastify'

import { db } from '../firebase/firebase'

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

  useEffect(() => {
    if (!isEditMode) {
      return
    }

    async function loadPlace() {
      try {
        const placeSnapshot = await getDoc(
          doc(db, 'places', id)
        )

        if (!placeSnapshot.exists()) {
          toast.error('Place not found.')
          navigate('/admin/places')
          return
        }

        const placeData = placeSnapshot.data()

        const accessibilityFeatures = Object.values(
          placeData.accessibility || {}
        ).flat()

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
            placeData.accessibility?.mobility?.some(
              (feature) =>
                feature.name ===
                'Wheelchair accessibility'
            ) || false,

          visual:
            placeData.accessibility?.visual?.length > 0,

          hearing:
            placeData.accessibility?.hearing?.length > 0,

          sensory:
            placeData.accessibility?.sensory?.length > 0,

          restroom:
            accessibilityFeatures.some(
              (feature) =>
                feature.name ===
                'Accessible restroom'
            ),

          parking: Boolean(
            placeData.visitInfo?.parking
          ),
        })
      } catch (error) {
        console.error(
          'Error loading place:',
          error
        )

        toast.error(
          'Could not load the place.'
        )
      } finally {
        setLoadingPlace(false)
      }
    }

    loadPlace()
  }, [id, isEditMode, navigate])

  function handleChange(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target

    setFormData((current) => ({
      ...current,
      [name]:
        type === 'checkbox'
          ? checked
          : value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (
      !formData.name.trim() ||
      !formData.category ||
      !formData.city.trim() ||
      !formData.address.trim()
    ) {
      toast.warning(
        'Please complete all required fields.'
      )
      return
    }

    const imageArray = formData.images
      .split('\n')
      .map((image) => image.trim())
      .filter(Boolean)

    const mobilityFeatures = []

    if (formData.mobility) {
      mobilityFeatures.push({
        name: 'Wheelchair accessibility',
        status: 'available',
      })
    }

    if (formData.restroom) {
      mobilityFeatures.push({
        name: 'Accessible restroom',
        status: 'available',
      })
    }

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
        mobility: mobilityFeatures,

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

        toast.success(
          'Place updated successfully.'
        )
      } else {
        await addDoc(
          collection(db, 'places'),
          {
            ...placeData,

            ratingStars: 0,
            reviews: 0,

            createdAt:
              new Date().toISOString(),

            updatedAt:
              new Date().toISOString(),
          }
        )

        toast.success(
          'Place added successfully.'
        )
      }

      navigate('/admin/places')
    } catch (error) {
      console.error(
        'Error saving place:',
        error
      )

      toast.error(
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

          <section className="admin-form-section">
            <div className="admin-form-section-heading">
              <div className="admin-form-section-icon">
                <Image size={21} />
              </div>

              <div>
                <h2>Place Images</h2>
                <p>Add one or more image URLs.</p>
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
              {[
                ['mobility', 'Wheelchair accessibility'],
                ['visual', 'Visual accessibility'],
                ['hearing', 'Hearing accessibility'],
                ['sensory', 'Sensory friendly'],
                ['restroom', 'Accessible restroom'],
                ['parking', 'Accessible parking'],
              ].map(([name, label]) => (
                <label
                  key={name}
                  className="admin-checkbox-card"
                >
                  <input
                    type="checkbox"
                    name={name}
                    checked={formData[name]}
                    onChange={handleChange}
                  />

                  <span>{label}</span>
                </label>
              ))}
            </div>
          </section>

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