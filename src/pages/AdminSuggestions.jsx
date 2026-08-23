import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle2,
  Clock3,
  XCircle,
} from 'lucide-react'
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { toast } from 'react-toastify'

import { db } from '../firebase/firebase'

import './AdminSuggestions.css'

function AdminSuggestions() {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSuggestions() {
      try {
        setLoading(true)

        const snapshot = await getDocs(
          collection(db, 'suggestions')
        )

        const suggestionData = snapshot.docs.map(
          (suggestionDocument) => ({
            firestoreId: suggestionDocument.id,
            ...suggestionDocument.data(),
          })
        )

        suggestionData.sort(
          (a, b) =>
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
        )

        setSuggestions(suggestionData)
      } catch (error) {
        console.error(
          'Error loading suggestions:',
          error
        )
      } finally {
        setLoading(false)
      }
    }

    loadSuggestions()
  }, [])

  function buildAccessibilityData(features = []) {
    const has = (feature) =>
      features.includes(feature)

    return {
      mobility: [
        has('Wheelchair Access') && {
          name: 'Wheelchair access',
          status: 'available',
        },
        has('Step-free Entrance') && {
          name: 'Step-free entrance',
          status: 'available',
        },
        has('Elevator') && {
          name: 'Elevator',
          status: 'available',
        },
        has('Accessible Restroom') && {
          name: 'Accessible restroom',
          status: 'available',
        },
        has('Accessible Parking') && {
          name: 'Accessible parking',
          status: 'available',
        },
      ].filter(Boolean),

      visual: [
        has('Visual Accessibility') && {
          name: 'Visual accessibility',
          status: 'available',
        },
      ].filter(Boolean),

      hearing: [
        has('Hearing Accessibility') && {
          name: 'Hearing accessibility',
          status: 'available',
        },
      ].filter(Boolean),

      sensory: [
        has('Quiet Environment') && {
          name: 'Quiet environment',
          status: 'available',
        },
      ].filter(Boolean),
    }
  }

  async function handleStatusChange(
    suggestionId,
    newStatus
  ) {
    try {
      await updateDoc(
        doc(
          db,
          'suggestions',
          suggestionId
        ),
        {
          status: newStatus,
          reviewedAt:
            new Date().toISOString(),
        }
      )

      setSuggestions((current) =>
        current.map((suggestion) =>
          suggestion.firestoreId === suggestionId
            ? {
                ...suggestion,
                status: newStatus,
              }
            : suggestion
        )
      )

      toast.success(
        newStatus === 'rejected'
          ? 'Suggestion rejected.'
          : 'Suggestion updated.'
      )
    } catch (error) {
      console.error(
        'Error updating suggestion:',
        error
      )

      toast.error(
        'Could not update the suggestion.'
      )
    }
  }

  function getStatusBadge(status) {
    if (status === 'approved') {
      return (
        <span className="suggestion-status approved">
          <CheckCircle2 size={14} />
          Approved
        </span>
      )
    }

    if (status === 'rejected') {
      return (
        <span className="suggestion-status rejected">
          <XCircle size={14} />
          Rejected
        </span>
      )
    }

    return (
      <span className="suggestion-status pending">
        <Clock3 size={14} />
        Pending
      </span>
    )
  }

  async function handleApprove(suggestion) {
    try {
      const newPlaceRef = doc(
        collection(db, 'places')
      )

      const placeData = {
        name: suggestion.name || '',
        category: suggestion.category || '',
        city: suggestion.city || '',
        address: suggestion.address || '',
        description: suggestion.description || '',

        ratingStars: 0,
        reviews: 0,
        verified: false,

        updatedAt:
          new Date().toISOString().split('T')[0],

        accessibilityMatch: 0,

        accessibility:
          buildAccessibilityData(
            suggestion.accessibility || []
          ),

        visitInfo: {
          parking:
            suggestion.accessibility?.includes(
              'Accessible Parking'
            )
              ? 'Accessible parking reported by the community.'
              : '',

          entrance:
            suggestion.accessibility?.includes(
              'Step-free Entrance'
            )
              ? 'Step-free entrance reported by the community.'
              : '',

          hours: '',
          phone: '',
          website: '',
          transport: '',
        },
      }

      const batch = writeBatch(db)

      batch.set(
        newPlaceRef,
        placeData
      )

      batch.update(
        doc(
          db,
          'suggestions',
          suggestion.firestoreId
        ),
        {
          status: 'approved',
          reviewedAt:
            new Date().toISOString(),
          approvedPlaceId:
            newPlaceRef.id,
        }
      )

      await batch.commit()

      setSuggestions((current) =>
        current.map((item) =>
          item.firestoreId === suggestion.firestoreId
            ? {
                ...item,
                status: 'approved',
                approvedPlaceId:
                  newPlaceRef.id,
              }
            : item
        )
      )

      toast.success(
        `"${suggestion.name}" was approved and added to Places.`
      )
    } catch (error) {
      console.error(
        'Error approving suggestion:',
        error
      )

      toast.error(
        'Could not approve this suggestion.'
      )
    }
  }

  return (
    <main className="admin-suggestions-page">
      <div className="admin-suggestions-container">
        <Link
          to="/admin"
          className="admin-back-link"
        >
          ← Back to Dashboard
        </Link>

        <div className="admin-suggestions-heading">
          <span className="section-label">
            COMMUNITY SUBMISSIONS
          </span>

          <h1>Place Suggestions</h1>

          <p>
            Review places submitted by AccessHub users.
          </p>
        </div>

        {loading ? (
          <div className="admin-suggestions-empty">
            Loading suggestions...
          </div>
        ) : suggestions.length === 0 ? (
          <div className="admin-suggestions-empty">
            No suggestions found.
          </div>
        ) : (
          <div className="admin-suggestions-list">
            {suggestions.map((suggestion) => (
              <article
                key={suggestion.firestoreId}
                className="admin-suggestion-card"
              >
                <div className="admin-suggestion-main">
                  <div>
                    <h2>{suggestion.name}</h2>

                    <p className="admin-suggestion-location">
                      {suggestion.city}
                      {' · '}
                      {suggestion.category}
                    </p>

                    {suggestion.address && (
                      <p>{suggestion.address}</p>
                    )}
                  </div>

                  {getStatusBadge(
                    suggestion.status
                  )}
                </div>

                {suggestion.description && (
                  <p className="admin-suggestion-description">
                    {suggestion.description}
                  </p>
                )}

                {suggestion.accessibility?.length > 0 && (
                  <div className="admin-suggestion-features">
                    {suggestion.accessibility.map(
                      (feature) => (
                        <span key={feature}>
                          {feature}
                        </span>
                      )
                    )}
                  </div>
                )}

                <div className="admin-suggestion-meta">
                  <span>
                    Suggested by{' '}
                    {suggestion.userName ||
                      suggestion.userEmail ||
                      'Unknown user'}
                  </span>

                  <span>
                    {suggestion.createdAt
                      ? new Date(
                          suggestion.createdAt
                        ).toLocaleDateString()
                      : ''}
                  </span>
                </div>

                {suggestion.status === 'pending' && (
                  <div className="admin-suggestion-actions">
                    <button
                      type="button"
                      className="suggestion-reject-button"
                      onClick={() =>
                        handleStatusChange(
                          suggestion.firestoreId,
                          'rejected'
                        )
                      }
                    >
                      <XCircle size={17} />
                      Reject
                    </button>

                    <button
                      type="button"
                      className="suggestion-approve-button"
                      onClick={() =>
                        handleApprove(suggestion)
                      }
                    >
                      <CheckCircle2 size={17} />
                      Approve
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default AdminSuggestions