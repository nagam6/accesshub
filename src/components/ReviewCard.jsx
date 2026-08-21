import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Star,
  ThumbsUp,
  Flag
} from 'lucide-react'
import {
  doc,
  runTransaction
} from 'firebase/firestore'

import { auth, db} from '../firebase/firebase'
import { showLoginToast } from '../utils/showLoginToast'

import './ReviewCard.css'

function ReviewCard({ review }) 
{
    const navigate = useNavigate()

  const [helpfulCount, setHelpfulCount] = useState(review.helpful || 0)
  const [isHelpful, setIsHelpful] = useState(false)

   useEffect(() => {
    const uid =
      auth.currentUser?.uid

    if (!uid) {
      setIsHelpful(false)
      return
    }

    setIsHelpful(
      review.helpfulUsers?.includes(uid) ||
      false
    )
  }, [review.helpfulUsers])

async function handleHelpful() {
  if (!auth.currentUser) {
    showLoginToast(navigate)
    return
  }

  if (!review.firestoreId) {
    console.error(
      'Review Firestore ID is missing.'
    )
    return
  }

  try {
    const reviewRef = doc(
      db,
      'reviews',
      review.firestoreId
    )

    const uid =
      auth.currentUser.uid

    let nextHelpful = false
    let nextCount = helpfulCount

    await runTransaction(
      db,
      async (transaction) => {
        const reviewSnapshot =
          await transaction.get(reviewRef)

        if (!reviewSnapshot.exists()) {
          throw new Error(
            'Review not found.'
          )
        }

        const reviewData =
          reviewSnapshot.data()

        const helpfulUsers =
          Array.isArray(
            reviewData.helpfulUsers
          )
            ? reviewData.helpfulUsers
            : []

        const alreadyHelpful =
          helpfulUsers.includes(uid)

        let updatedUsers

        if (alreadyHelpful) {
          updatedUsers =
            helpfulUsers.filter(
              (userId) =>
                userId !== uid
            )

          nextHelpful = false
        } else {
          updatedUsers = [
            ...helpfulUsers,
            uid,
          ]

          nextHelpful = true
        }

        /*
          Preserve existing seeded helpful
          count even if helpfulUsers was
          not present in older documents.
        */
        const currentCount =
          Number(
            reviewData.helpful || 0
          )

        nextCount = alreadyHelpful
          ? Math.max(
              0,
              currentCount - 1
            )
          : currentCount + 1

        transaction.update(
          reviewRef,
          {
            helpful: nextCount,
            helpfulUsers:
              updatedUsers,
          }
        )
      }
    )

    setHelpfulCount(nextCount)
    setIsHelpful(nextHelpful)

  } catch (error) {
    console.error(
      'Error updating helpful:',
      error
    )
  }
}

  return (
    <article className="review-card">

      <div className="review-top-row">

        <div className="review-user-info">
          <div className="review-avatar">
            {review.userName.charAt(0).toUpperCase()}
          </div>

          <h3>{review.userName}</h3>
        </div>

        <div className="review-rating-info">

          <div className="review-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={18}
                fill={
                  star <= review.ratingStars
                    ? 'currentColor'
                    : 'none'
                }
              />
            ))}

            <strong>
              {Number(review.ratingStars).toFixed(1)}
            </strong>
          </div>

          <span className="review-date">
            {review.visitDate}
          </span>

        </div>

      </div>

      <p className="review-comment">
        {review.comment}
      </p>

      <div className="review-actions">

        <button
          type="button"
          className={isHelpful ? 'helpful-active' : ''}
          onClick={handleHelpful}
        >
          <ThumbsUp
            size={17}
            fill={isHelpful ? 'currentColor' : 'none'}
          />

          Helpful ({helpfulCount})
        </button>

      </div>

    </article>
  )
}

export default ReviewCard