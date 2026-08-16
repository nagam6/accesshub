import { useState } from 'react'
import { Link } from 'react-router-dom'
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

  function handleSubmit(event) {
    event.preventDefault()

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.confirmPassword.trim()
    ) {
      setMessage('Please complete all fields.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    setMessage('Account created successfully.')
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
          >
            <UserPlus size={18} />
            Create Account
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