import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth'

import {
  doc,
  setDoc
} from 'firebase/firestore'

import {
  auth,
  db
} from '../firebase/firebase'

import {
  Accessibility,
  UserRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus
} from 'lucide-react'

import './Register.css'

function Register() {
const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accessibilityPreferences: [],
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }
  const accessibilityPreferences = [
  'Wheelchair user',
  'Blind or low vision',
  'Deaf or hard of hearing',
  'Sensory sensitivity',
  'Need accessible restroom',
  'Need dedicated parking',
  'Need quiet environment',
]

function handlePreferenceChange(preference) {
  setFormData((current) => {
    const isSelected =
      current.accessibilityPreferences.includes(preference)

    return {
      ...current,
      accessibilityPreferences: isSelected
        ? current.accessibilityPreferences.filter(
            (item) => item !== preference
          )
        : [
            ...current.accessibilityPreferences,
            preference,
          ],
    }
  })
}

async function handleSubmit(event) {
  event.preventDefault()

  setMessage('')

  if (
    !formData.fullName.trim() ||
    !formData.email.trim() ||
    !formData.password.trim() ||
    !formData.confirmPassword.trim()
  ) {
    setMessage('Please complete all fields.')
    return
  }

  if (
    formData.password !==
    formData.confirmPassword
  ) {
    setMessage('Passwords do not match.')
    return
  }

  if (formData.password.length < 6) {
    setMessage(
      'Password must be at least 6 characters.'
    )
    return
  }

  try {
    setLoading(true)

    // 1. Create Firebase Authentication account
    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        formData.email.trim(),
        formData.password
      )

    const user = userCredential.user

    // 2. Store the name in Firebase Authentication
    await updateProfile(user, {
      displayName: formData.fullName.trim(),
    })

    // 3. Create the Firestore user profile
    await setDoc(
      doc(db, 'users', user.uid),
      {
        uid: user.uid,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        role: 'user',
        accessibilityPreferences:
          formData.accessibilityPreferences,
        createdAt: new Date().toISOString(),
      }
    )

    setMessage(
      'Account created successfully!'
    )

    navigate('/profile')
  } catch (error) {
    console.error(
      'Registration error:',
      error
    )

    if (
      error.code ===
      'auth/email-already-in-use'
    ) {
      setMessage(
        'An account already exists with this email.'
      )
    } else if (
      error.code === 'auth/invalid-email'
    ) {
      setMessage(
        'Please enter a valid email address.'
      )
    } else if (
      error.code === 'auth/weak-password'
    ) {
      setMessage(
        'Please choose a stronger password.'
      )
    } else {
      setMessage(
        'Could not create your account. Please try again.'
      )
    }
  } finally {
    setLoading(false)
  }
}

  return (
    <main className="register-page">

      <div className="register-header">

        <div className="register-logo-icon">
          <Accessibility size={28} />
        </div>

        <h1>Create Your Account</h1>

        <p>
          Join AccessHub to save favorites and share your experience.
        </p>

      </div>

      <div className="register-card">

        {message && (
          <div className="register-message">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="register-field">
            <label htmlFor="fullName">
              Full name
            </label>

            <div className="register-input-wrapper">
              <UserRound size={18} />

              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your name"
              />
            </div>
          </div>

          <div className="register-field">
            <label htmlFor="email">
              Email
            </label>

            <div className="register-input-wrapper">
              <Mail size={18} />

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="register-field">
            <label htmlFor="password">
              Password
            </label>

            <div className="register-input-wrapper">
              <Lock size={18} />

              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
              />

              <button
                type="button"
                className="register-password-toggle"
                onClick={() =>
                  setShowPassword((current) => !current)
                }
                aria-label={
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <div className="register-field">
            <label htmlFor="confirmPassword">
              Confirm password
            </label>

            <div className="register-input-wrapper">
              <Lock size={18} />

              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
              />

              <button
                type="button"
                className="register-password-toggle"
                onClick={() =>
                  setShowConfirmPassword((current) => !current)
                }
                aria-label={
                  showConfirmPassword
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>
<div className="register-preferences">

  <div className="register-preferences-heading">
    <h3>
      Accessibility Preferences
      <span> (optional)</span>
    </h3>

    <p>
      Helps us calculate your match score automatically.
    </p>
  </div>

  <div className="register-preferences-grid">

    {accessibilityPreferences.map((preference) => (
      <label
        key={preference}
        className={`register-preference-option ${
          formData.accessibilityPreferences.includes(preference)
            ? 'selected'
            : ''
        }`}
      >
        <input
          type="checkbox"
          checked={formData.accessibilityPreferences.includes(
            preference
          )}
          onChange={() =>
            handlePreferenceChange(preference)
          }
        />

        <span>{preference}</span>
      </label>
    ))}

  </div>

</div>
          <label className="register-terms">
            <input type="checkbox" required />

            <span>
              I agree to the community guidelines and terms of use.
            </span>
          </label>

  <button
  type="submit"
  className="register-submit-button"
  disabled={loading}
>
  <UserPlus size={18} />

  {loading
    ? 'Creating Account...'
    : 'Create Account'}
</button>

        </form>

      </div>

      <p className="register-login-link">
        Already have an account?{' '}

        <Link to="/login">
          Log in
        </Link>
      </p>

    </main>
  )
}

export default Register