import { useState } from 'react'
import {
  Star,
  ThumbsUp,
  Flag
} from 'lucide-react'

import './ReviewCard.css'

function ReviewCard({ review }) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpful || 0)
  const [isHelpful, setIsHelpful] = useState(false)

  function handleHelpful() {
    if (isHelpful) {
      setHelpfulCount((count) => count - 1)
    } else {
      setHelpfulCount((count) => count + 1)
    }

    setIsHelpful((current) => !current)
  }

  function handleReport() {
    const confirmed = window.confirm(
      'Do you want to report this review?'
    )

    if (confirmed) {
      alert('Thank you. The review has been reported for moderation.')
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
                  star <= review.rating
                    ? 'currentColor'
                    : 'none'
                }
              />
            ))}

            <strong>
              {Number(review.rating).toFixed(1)}
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

        <button
          type="button"
          onClick={handleReport}
        >
          <Flag size={17} />
          Report
        </button>

      </div>

    </article>
  )
}

export default ReviewCard