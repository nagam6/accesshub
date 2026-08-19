import { useState } from 'react'
import { Link } from 'react-router-dom'

import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../firebase/firebase'

import {
  Mail,
  ArrowLeft,
  KeyRound
} from 'lucide-react'

import './ForgotPassword.css'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    setMessage('')
    setSuccess(false)

    if (!email.trim()) {
      setMessage('Please enter your email address.')
      return
    }

    try {
      setLoading(true)

      await sendPasswordResetEmail(
        auth,
        email.trim()
      )

      setSuccess(true)
      setMessage(
        'Password reset email sent. Check your inbox.'
      )
    } catch (error) {
      console.error(
        'Password reset error:',
        error
      )

      if (error.code === 'auth/invalid-email') {
        setMessage(
          'Please enter a valid email address.'
        )
      } else {
        setMessage(
          'Could not send the reset email. Please try again.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="forgot-page">
      <div className="forgot-container">

        <div className="forgot-icon">
          <KeyRound size={28} />
        </div>

        <h1>Forgot Password?</h1>

        <p className="forgot-description">
          Enter your email address and we’ll send you
          a link to reset your password.
        </p>

        <form
          className="forgot-card"
          onSubmit={handleSubmit}
        >
          {message && (
            <div
              className={`forgot-message ${
                success ? 'success' : ''
              }`}
            >
              {message}
            </div>
          )}

          <div className="forgot-field">
            <label htmlFor="forgot-email">
              Email address
            </label>

            <div className="forgot-input-wrapper">
              <Mail size={18} />

              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            className="forgot-button"
            disabled={loading}
          >
            {loading
              ? 'Sending...'
              : 'Send Reset Link'}
          </button>
        </form>

        <Link
          to="/login"
          className="forgot-back-link"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>

      </div>
    </main>
  )
}

export default ForgotPassword