import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import {
  doc,
  getDoc,
} from 'firebase/firestore'
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
} from 'lucide-react'

import {
  auth,
  db,
} from '../firebase/firebase'

import './AdminLogin.css'

function AdminLogin() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')

    if (!email.trim() || !password.trim()) {
      setMessage(
        'Please enter the admin email and password.'
      )
      return
    }

    try {
      setLoading(true)

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        )

      const user = userCredential.user

      const adminRef = doc(
        db,
        'users',
        user.uid
      )

      const adminSnapshot =
        await getDoc(adminRef)

      if (!adminSnapshot.exists()) {
        await signOut(auth)

        setMessage(
          'Administrator profile was not found.'
        )
        return
      }

      const adminData =
        adminSnapshot.data()

      const role = String(
        adminData.role || ''
      )
        .trim()
        .toLowerCase()

      if (role !== 'admin') {
        await signOut(auth)

        setMessage(
          'This account does not have administrator access.'
        )
        return
      }

      navigate('/admin')
    } catch (error) {
      console.error(
        'Admin login error:',
        error
      )

      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/user-not-found'
      ) {
        setMessage(
          'Incorrect admin email or password.'
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

  return (
    <main className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-icon">
          <Shield size={30} />
        </div>

        <h1>Admin Login</h1>

        <p className="admin-login-description">
          This page is restricted to authorized
          administrators only. Unauthorized access
          is prohibited.
        </p>

        <form
          className="admin-login-card"
          onSubmit={handleSubmit}
        >
          {message && (
            <div className="admin-login-message">
              {message}
            </div>
          )}

          <div className="admin-login-field">
            <label htmlFor="admin-email">
              Admin Email
            </label>

            <div className="admin-login-input-wrapper">
              <Mail size={18} />

              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="admin@gmail.com"
              />
            </div>
          </div>

          <div className="admin-login-field">
            <label htmlFor="admin-password">
              Password
            </label>

            <div className="admin-password-wrapper">
              <Lock size={18} />

              <input
                id="admin-password"
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
                className="admin-password-toggle"
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
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          <Link
            to="/forgot-password"
            className="admin-forgot-password"
          >
            Forgot password?
          </Link>

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading
              ? 'Checking Access...'
              : 'Enter Dashboard'}

            {!loading && (
              <ArrowRight size={18} />
            )}
          </button>
        </form>

        <Link
          to="/"
          className="admin-back-site"
        >
          ← Back to site
        </Link>
      </div>
    </main>
  )
}

export default AdminLogin