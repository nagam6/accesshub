import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Accessibility,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield
} from 'lucide-react'
import {
  signInWithEmailAndPassword
} from 'firebase/auth'

import { auth } from '../firebase/firebase'
import './Login.css'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

async function handleSubmit(event) {
  event.preventDefault()

  setMessage('')

  if (!email.trim() || !password.trim()) {
    setMessage(
      'Please enter your email and password.'
    )
    return
  }

  try {
    setLoading(true)

    await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    )

    navigate('/profile')
  } catch (error) {
    console.error('Login error:', error)

    if (
      error.code === 'auth/invalid-credential' ||
      error.code === 'auth/wrong-password' ||
      error.code === 'auth/user-not-found'
    ) {
      setMessage(
        'Incorrect email or password.'
      )
    } else if (
      error.code === 'auth/invalid-email'
    ) {
      setMessage(
        'Please enter a valid email address.'
      )
    } else {
      setMessage(
        'Could not log in. Please try again.'
      )
    }
  } finally {
    setLoading(false)
  }
}
  function handleGuest() {
    navigate('/')
  }

  return (
    <main className="login-page">

      {/* HEADER */}

      <div className="login-header">

        <div className="login-logo-icon">
          <Accessibility size={28} />
        </div>

        <h1>Welcome Back</h1>

        <p>
          Log in to access your favorites and preferences.
        </p>

      </div>

      {/* LOGIN CARD */}

      <div className="login-card">

        {message && (
          <div className="login-message">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* EMAIL */}

          <div className="login-field">
            <label htmlFor="email">
              Email
            </label>

            <div className="login-input-wrapper">
              <Mail size={18} />

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* PASSWORD */}

          <div className="login-field">
            <label htmlFor="password">
              Password
            </label>

            <div className="login-input-wrapper">

              <Lock size={18} />

              <input
                id="password"
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="••••••••"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    (current) => !current
                  )
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

          {/* OPTIONS */}

          <div className="login-options">

            <Link to="/forgot-password">
              Forgot password?
            </Link>

          </div>

          {/* LOGIN */}

<button
  type="submit"
  className="login-button"
  disabled={loading}
>
  {loading ? 'Logging in...' : 'Log In'}
</button>

        </form>

        {/* DIVIDER */}

        <div className="login-divider">
          <span></span>
          <p>or</p>
          <span></span>
        </div>

        {/* GUEST */}

        <button
          type="button"
          className="guest-button"
          onClick={handleGuest}
        >
          Continue as Guest
        </button>

      </div>

      {/* SIGN UP */}

      <p className="login-signup">
        Don't have an account?{' '}

        <Link to="/register">
          Sign up
        </Link>
      </p>

      {/* ADMIN */}

      <Link
        to="/admin-login"
        className="admin-login-link"
      >
        <Shield size={16} />
        Admin Login
      </Link>

    </main>
  )
}

export default Login