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
  getDocs,
  query,
  runTransaction,
  where,
} from 'firebase/firestore'
import { toast } from 'react-toastify'
import {
  Accessibility,
  ArrowLeft,
  BadgeCheck,
  Bus,
  Check,
  ChevronDown,
  Clock,
  Ear,
  Eye,
  Globe,
  Heart,
  Info,
  MapPin,
  MessageSquareText,
  ParkingCircle,
  Phone,
  Share2,
  Sparkles,
  Star,
  Volume2,
} from 'lucide-react'

import ReviewCard from '../components/ReviewCard'
import { useFavorites } from '../context/FavoritesContext'
import { auth, db } from '../firebase/firebase'
import { showLoginToast } from '../utils/showLoginToast'

import './PlaceDetails.css'

function PlaceDetails() {
  const navigate = useNavigate()
  const { id } = useParams()

  const { toggleFavorite, isFavorite } =
    useFavorites()

  const [place, setPlace] = useState(null)
  const [loadingPlace, setLoadingPlace] =
    useState(true)
  const [placeError, setPlaceError] =
    useState('')

  const [isListening, setIsListening] =
    useState(false)
  const [selectedImage, setSelectedImage] =
    useState(0)

  const [showReviewForm, setShowReviewForm] =
    useState(false)
  const [showReportForm, setShowReportForm] =
    useState(false)

  const [newRating, setNewRating] =
    useState(5)
  const [newComment, setNewComment] =
    useState('')

  const [reportReason, setReportReason] =
    useState('')

  const [showAllReviews, setShowAllReviews] =
    useState(false)
  const [localReviews, setLocalReviews] =
    useState([])

  useEffect(() => {
    async function loadPlace() {
      try {
        setLoadingPlace(true)
        setPlaceError('')

        const placeSnapshot = await getDoc(
          doc(db, 'places', id)
        )

        if (!placeSnapshot.exists()) {
          setPlace(null)
          setPlaceError('Place not found.')
          return
        }

        setPlace({
          ...placeSnapshot.data(),
          id: placeSnapshot.id,
        })

        setSelectedImage(0)
      } catch (error) {
        console.error(
          'Error loading place:',
          error
        )

        setPlaceError(
          'Could not load this place.'
        )
      } finally {
        setLoadingPlace(false)
      }
    }

    loadPlace()
  }, [id])

  useEffect(() => {
    async function loadReviews() {
      if (!place) {
        setLocalReviews([])
        return
      }

      try {
        const reviewsQuery = query(
          collection(db, 'reviews'),
          where(
            'placeId',
            '==',
            place.id
          )
        )

        const snapshot = await getDocs(
          reviewsQuery
        )

        const firebaseReviews =
          snapshot.docs.map(
            (reviewDocument) => ({
              firestoreId:
                reviewDocument.id,
              ...reviewDocument.data(),
            })
          )

        firebaseReviews.sort(
          (a, b) =>
            new Date(b.visitDate || 0) -
            new Date(a.visitDate || 0)
        )

        setLocalReviews(firebaseReviews)
      } catch (error) {
        console.error(
          'Error loading reviews:',
          error
        )

        setLocalReviews([])
      }
    }

    loadReviews()
  }, [place])

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
      ${place.name}.
      ${place.category} in ${place.city}.
      Located at ${place.address || ''}.
      Accessibility match ${
        place.accessibilityMatch ?? 0
      } percent.
      ${place.description || ''}
      ${place.visitInfo?.entrance || ''}
      ${place.visitInfo?.parking || ''}
    `

    const speech =
      new SpeechSynthesisUtterance(text)

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

  if (loadingPlace) {
    return (
      <main className="place-details-page">
        <div className="place-details-container">
          <Link
            to="/places"
            className="back-to-explore"
          >
            <ArrowLeft size={18} />
            Back to Explore
          </Link>

          <div className="place-not-found">
            <h1>Loading place...</h1>

            <p>
              Please wait while we load the place
              information.
            </p>
          </div>
        </div>
      </main>
    )
  }

  if (placeError || !place) {
    return (
      <main className="place-details-page">
        <div className="place-details-container">
          <Link
            to="/places"
            className="back-to-explore"
          >
            <ArrowLeft size={18} />
            Back to Explore
          </Link>

          <div className="place-not-found">
            <h1>Place not found</h1>

            <p>
              {placeError ||
                'The place you are looking for does not exist.'}
            </p>
          </div>
        </div>
      </main>
    )
  }

  const favorite = isFavorite(place.id)

  const visibleReviews = showAllReviews
    ? localReviews
    : localReviews.slice(0, 2)
  
  const reviewsCount = localReviews.length

const averageRating =
  reviewsCount > 0
    ? (
        localReviews.reduce(
          (total, review) =>
            total +
            Number(review.ratingStars || 0),
          0
        ) / reviewsCount
      ).toFixed(1)
    : '0.0'

  const accessibilityGroups = [
    {
      title: 'Mobility Access',
      icon: Accessibility,
      items:
        place.accessibility?.mobility ||
        [],
    },
    {
      title: 'Visual Access',
      icon: Eye,
      items:
        place.accessibility?.visual ||
        [],
    },
    {
      title: 'Hearing Access',
      icon: Ear,
      items:
        place.accessibility?.hearing ||
        [],
    },
    {
      title: 'Sensory Access',
      icon: Sparkles,
      items:
        place.accessibility?.sensory ||
        [],
    },
  ]

  async function handleShare() {
    const shareData = {
      title: place.name,
      text: `Check accessibility information for ${place.name}`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        return
      }

      await navigator.clipboard.writeText(
        window.location.href
      )

      toast.success('Link copied!')
    } catch (error) {
      if (error?.name !== 'AbortError') {
        console.error(
          'Error sharing place:',
          error
        )

        toast.error(
          'Could not share this place.'
        )
      }
    }
  }

  function handleFavorite() {
    if (!auth.currentUser) {
      showLoginToast(navigate)
      return
    }

    toggleFavorite(place)
  }

  function openReviewForm() {
    if (!auth.currentUser) {
      showLoginToast(navigate)
      return
    }

    setShowReviewForm(true)
  }

  function openReportForm() {
    if (!auth.currentUser) {
      showLoginToast(navigate)
      return
    }

    setShowReportForm(true)
  }

  async function handleAddReview(event) {
    event.preventDefault()

    if (!auth.currentUser) {
      showLoginToast(navigate)
      return
    }

    if (!newComment.trim()) {
      toast.warning(
        'Please write a review before submitting.'
      )
      return
    }

    try {
      const ratingValue =
        Number(newRating)

      const reviewData = {
        placeId: place.id,
        userId:
          auth.currentUser.uid,

        userName:
          auth.currentUser.displayName ||
          auth.currentUser.email ||
          'AccessHub User',

        ratingStars: ratingValue,

        visitDate:
          new Date()
            .toISOString()
            .split('T')[0],

        comment:
          newComment.trim(),

        helpful: 0,
        helpfulUsers: [],
      }

      const placeRef = doc(
        db,
        'places',
        place.id
      )

      const reviewRef = doc(
        collection(db, 'reviews')
      )

      let updatedReviews = 0
      let updatedRating = 0

      await runTransaction(
        db,
        async (transaction) => {
          const placeSnapshot =
            await transaction.get(
              placeRef
            )

          if (!placeSnapshot.exists()) {
            throw new Error(
              'Place does not exist.'
            )
          }

          const placeData =
            placeSnapshot.data()

          const currentReviews =
            Number(
              placeData.reviews || 0
            )

          const currentRating =
            Number(
              placeData.ratingStars || 0
            )

          updatedReviews =
            currentReviews + 1

          updatedRating = Number(
            (
              (
                currentRating *
                  currentReviews +
                ratingValue
              ) /
              updatedReviews
            ).toFixed(1)
          )

          transaction.set(
            reviewRef,
            reviewData
          )

          transaction.update(
            placeRef,
            {
              reviews:
                updatedReviews,
              ratingStars:
                updatedRating,
            }
          )
        }
      )

      const newReview = {
        firestoreId: reviewRef.id,
        ...reviewData,
      }

      setLocalReviews((current) => [
        newReview,
        ...current,
      ])

      setPlace((current) => ({
        ...current,
        reviews: updatedReviews,
        ratingStars: updatedRating,
      }))

      setNewRating(5)
      setNewComment('')
      setShowReviewForm(false)

      toast.success(
        'Review submitted successfully!'
      )
    } catch (error) {
      console.error(
        'Error adding review:',
        error
      )

      toast.error(
        'Could not submit your review. Please try again.'
      )
    }
  }

  async function handleReportInformation(
    event
  ) {
    event.preventDefault()

    if (!auth.currentUser) {
      showLoginToast(navigate)
      return
    }

    if (!reportReason.trim()) {
      toast.warning(
        'Please describe the incorrect information.'
      )
      return
    }

    try {
      const reportData = {
        placeId: place.id,
        placeName: place.name,

        userId:
          auth.currentUser.uid,

        userName:
          auth.currentUser.displayName ||
          auth.currentUser.email ||
          'AccessHub User',

        reason:
          reportReason.trim(),

        status: 'open',

        createdAt:
          new Date().toISOString(),
      }

      await addDoc(
        collection(db, 'reports'),
        reportData
      )

      toast.success(
        'Thank you. Your report was submitted for review.'
      )

      setReportReason('')
      setShowReportForm(false)
    } catch (error) {
      console.error(
        'Error submitting report:',
        error
      )

      toast.error(
        'Could not submit the report. Please try again.'
      )
    }
  }

  return (
    <main className="place-details-page">
      <div className="place-details-container">
        <Link
          to="/places"
          className="back-to-explore"
        >
          <ArrowLeft size={18} />
          Back to Explore
        </Link>

        {place.images?.length > 0 && (
          <section className="place-gallery">
            <div className="gallery-main">
              <img
                src={
                  place.images[
                    selectedImage
                  ]
                }
                alt={place.name}
              />

              {place.verified && (
                <span className="details-verified-badge">
                  <BadgeCheck
                    size={17}
                  />
                  Verified
                </span>
              )}
            </div>

            <div className="gallery-thumbnails">
              {place.images.map(
                (image, index) => (
                  <button
                    key={`${place.id}-${index}`}
                    type="button"
                    className={`gallery-thumbnail ${
                      selectedImage ===
                      index
                        ? 'gallery-thumbnail-active'
                        : ''
                    }`}
                    onClick={() =>
                      setSelectedImage(
                        index
                      )
                    }
                    aria-label={`View image ${
                      index + 1
                    } of ${place.name}`}
                  >
                    <img
                      src={image}
                      alt={`${place.name} view ${
                        index + 1
                      }`}
                    />
                  </button>
                )
              )}
            </div>
          </section>
        )}

        <section className="place-details-header">
          <div className="place-main-info">
            <span className="place-details-category">
              {place.category}
            </span>

            <h1>{place.name}</h1>

            <p className="place-details-location">
              <MapPin size={18} />
              {place.city} ·{' '}
              {place.address}
            </p>

            <div className="place-details-rating">
              <Star
                size={18}
                fill="currentColor"
              />

              <strong>
                {averageRating}
              </strong>

              <span>
                ({reviewsCount}
                reviews)
              </span>
            </div>
          </div>

          <div className="place-details-actions">
            <button
              type="button"
              className={`details-action-button ${
                favorite
                  ? 'favorite-active'
                  : ''
              }`}
              onClick={handleFavorite}
            >
              <Heart
                size={19}
                fill={
                  favorite
                    ? 'currentColor'
                    : 'none'
                }
              />

              {favorite
                ? 'Saved'
                : 'Save'}
            </button>

            <button
              type="button"
              className="details-action-button"
              onClick={handleShare}
            >
              <Share2 size={19} />
              Share
            </button>
          </div>
        </section>

        <section className="accessibility-summary">
          <div className="match-score">
            <div className="match-score-number">
              {place.accessibilityMatch ??
                0}
              %
            </div>

            <div>
              <span>
                Accessibility match
              </span>

              <p>
                Based on available
                accessibility information.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="place-listen-button"
            onClick={handleListen}
          >
            <Volume2 size={20} />

            {isListening
              ? 'Stop listening'
              : 'Listen to description'}
          </button>
        </section>

        <section className="detailed-accessibility-section">
          <div className="details-section-heading">
            <span className="section-label">
              ACCESSIBILITY
            </span>

            <h2>
              Detailed Accessibility
              Information
            </h2>

            <p>
              Review the available accessibility
              features before planning your
              visit.
            </p>
          </div>

          <div className="accessibility-groups-grid">
            {accessibilityGroups.map(
              (group) => {
                const Icon = group.icon

                return (
                  <article
                    key={group.title}
                    className="accessibility-group-card"
                  >
                    <div className="accessibility-group-header">
                      <div className="accessibility-group-icon">
                        <Icon
                          size={22}
                        />
                      </div>

                      <h3>
                        {group.title}
                      </h3>
                    </div>

                    <div className="accessibility-group-items">
                      {group.items.length >
                      0 ? (
                        group.items.map(
                          (item) => (
                            <div
                              key={
                                item.name
                              }
                              className="accessibility-status-row"
                            >
                              <span>
                                {
                                  item.name
                                }
                              </span>

                              <span
                                className={`status-badge status-${item.status}`}
                              >
                                {item.status ===
                                  'available' && (
                                  <Check
                                    size={
                                      14
                                    }
                                  />
                                )}

                                {String(
                                  item.status ||
                                    'unknown'
                                ).replaceAll(
                                  '_',
                                  ' '
                                )}
                              </span>
                            </div>
                          )
                        )
                      ) : (
                        <p>
                          No information
                          available.
                        </p>
                      )}
                    </div>
                  </article>
                )
              }
            )}
          </div>
        </section>

        <section className="before-visit-section">
          <div className="details-section-heading">
            <span className="section-label">
              PLAN YOUR VISIT
            </span>

            <h2>Before You Visit</h2>

            <p>
              Helpful practical information
              for planning your visit.
            </p>
          </div>

          <div className="visit-info-grid">
            <div className="visit-info-card">
              <Accessibility
                size={21}
              />

              <div>
                <h3>Entrance</h3>
                <p>
                  {place.visitInfo
                    ?.entrance ||
                    'Not provided'}
                </p>
              </div>
            </div>

            <div className="visit-info-card">
              <ParkingCircle
                size={21}
              />

              <div>
                <h3>Parking</h3>
                <p>
                  {place.visitInfo
                    ?.parking ||
                    'Not provided'}
                </p>
              </div>
            </div>

            <div className="visit-info-card">
              <Clock size={21} />

              <div>
                <h3>
                  Opening Hours
                </h3>

                <p>
                  {place.visitInfo
                    ?.hours ||
                    'Not provided'}
                </p>
              </div>
            </div>

            <div className="visit-info-card">
              <Phone size={21} />

              <div>
                <h3>Contact</h3>

                <p>
                  {place.visitInfo
                    ?.phone ||
                    'Not provided'}
                </p>
              </div>
            </div>

            <div className="visit-info-card">
              <Globe size={21} />

              <div>
                <h3>Website</h3>

                <p>
                  {place.visitInfo
                    ?.website ||
                    'Not provided'}
                </p>
              </div>
            </div>

            <div className="visit-info-card">
              <Bus size={21} />

              <div>
                <h3>
                  Public Transport
                </h3>

                <p>
                  {place.visitInfo
                    ?.transport ||
                    'Not provided'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="community-actions">
          <div className="community-action-card">
            <MessageSquareText
              size={25}
            />

            <div>
              <h3>
                Share your experience
              </h3>

              <p>
                Help others by leaving a
                review after your visit.
              </p>
            </div>

            <button
              type="button"
              onClick={openReviewForm}
            >
              Add Review
            </button>
          </div>

          <div className="community-action-card">
            <Info size={25} />

            <div>
              <h3>
                Found incorrect
                information?
              </h3>

              <p>
                Report outdated or
                incorrect accessibility
                details.
              </p>
            </div>

            <button
              type="button"
              onClick={openReportForm}
            >
              Report Information
            </button>
          </div>
        </section>

        {showReviewForm && (
          <section className="action-form-card">
            <div className="action-form-heading">
              <h2>Add a Review</h2>

              <button
                type="button"
                className="close-form-button"
                onClick={() =>
                  setShowReviewForm(
                    false
                  )
                }
                aria-label="Close review form"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleAddReview}
            >
              <div className="form-group">
                <label htmlFor="review-rating">
                  Rating
                </label>

                <select
                  id="review-rating"
                  value={newRating}
                  onChange={(event) =>
                    setNewRating(
                      event.target.value
                    )
                  }
                >
                  <option value="5">
                    5 stars
                  </option>
                  <option value="4">
                    4 stars
                  </option>
                  <option value="3">
                    3 stars
                  </option>
                  <option value="2">
                    2 stars
                  </option>
                  <option value="1">
                    1 star
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="review-comment">
                  Your review
                </label>

                <textarea
                  id="review-comment"
                  rows="5"
                  value={newComment}
                  onChange={(event) =>
                    setNewComment(
                      event.target.value
                    )
                  }
                  placeholder="Share your experience..."
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-form-button"
                  onClick={() =>
                    setShowReviewForm(
                      false
                    )
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-form-button"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </section>
        )}

        {showReportForm && (
          <section className="action-form-card">
            <div className="action-form-heading">
              <h2>
                Report Incorrect
                Information
              </h2>

              <button
                type="button"
                className="close-form-button"
                onClick={() =>
                  setShowReportForm(
                    false
                  )
                }
                aria-label="Close report form"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={
                handleReportInformation
              }
            >
              <div className="form-group">
                <label htmlFor="report-reason">
                  What information is
                  incorrect?
                </label>

                <textarea
                  id="report-reason"
                  rows="5"
                  value={reportReason}
                  onChange={(event) =>
                    setReportReason(
                      event.target.value
                    )
                  }
                  placeholder="Describe what should be updated..."
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-form-button"
                  onClick={() =>
                    setShowReportForm(
                      false
                    )
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-form-button"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="reviews-section">
          <div className="reviews-heading">
            <h2>
              Reviews & Ratings{' '}
              <span className="reviews-title-count">
                ({localReviews.length})
              </span>
            </h2>
          </div>

          {localReviews.length > 0 ? (
            <div className="reviews-list">
              {visibleReviews.map(
                (review) => (
                  <ReviewCard
                    key={
                      review.firestoreId ||
                      review.id
                    }
                    review={review}
                  />
                )
              )}

              {localReviews.length > 2 && (
                <div className="show-more-reviews">
                  <button
                    type="button"
                    className="more-reviews-button"
                    onClick={() =>
                      setShowAllReviews(
                        (current) =>
                          !current
                      )
                    }
                  >
                    <span>
                      {showAllReviews
                        ? 'Less Reviews'
                        : 'More Reviews'}
                    </span>

                    <ChevronDown
                      size={19}
                      className={
                        showAllReviews
                          ? 'more-reviews-icon open'
                          : 'more-reviews-icon'
                      }
                    />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="reviews-empty">
              <p>
                No reviews yet for this
                place.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default PlaceDetails