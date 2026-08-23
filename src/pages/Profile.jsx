import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { updatePassword } from 'firebase/auth'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where
} from 'firebase/firestore'
import { toast } from 'react-toastify'
import {
  Accessibility,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  Edit3,
  Heart,
  LockKeyhole,
  LogOut,
  Mail,
  MessageSquareText,
  UserRound,
  XCircle
} from 'lucide-react'

import { auth, db } from '../firebase/firebase'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'

import './Profile.css'

const accessibilityOptions = [
  'Wheelchair user',
  'Blind or low vision',
  'Deaf or hard of hearing',
  'Sensory sensitivity',
  'Need accessible restroom',
  'Need dedicated parking',
  'Need quiet environment'
]

function getStatusContent(status) {
  if (status === 'approved') {
    return {
      icon: BadgeCheck,
      label: 'Approved'
    }
  }

  if (status === 'rejected') {
    return {
      icon: XCircle,
      label: 'Rejected'
    }
  }

  return {
    icon: Clock3,
    label: 'Pending'
  }
}

function Profile() {
  const navigate = useNavigate()

  const {
    user,
    authLoading,
    logout
  } = useAuth()

  const { favorites } = useFavorites()

  const [activeTab, setActiveTab] =
    useState('profile')

  const [isEditing, setIsEditing] =
    useState(false)

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    accessibilityPreferences: []
  })

  const [draftProfile, setDraftProfile] = useState({
    fullName: '',
    email: '',
    accessibilityPreferences: []
  })

  const [loadingProfile, setLoadingProfile] =
    useState(true)

  const [reviewCount, setReviewCount] =
    useState(0)

  const [submissions, setSubmissions] =
    useState([])

  const [
    loadingSubmissions,
    setLoadingSubmissions
  ] = useState(true)

  const [newPassword, setNewPassword] =
    useState('')

  const [
    confirmPassword,
    setConfirmPassword
  ] = useState('')

  useEffect(() => {
    async function loadProfile() {
      if (authLoading) {
        return
      }

      if (!user) {
        setLoadingProfile(false)
        navigate('/login')
        return
      }

      try {
        setLoadingProfile(true)

        const userSnapshot = await getDoc(
          doc(
            db,
            'users',
            user.uid
          )
        )

        if (!userSnapshot.exists()) {
          toast.error(
            'User profile could not be found.',
            {
              toastId:
                'profile-not-found'
            }
          )
          return
        }

        const userData =
          userSnapshot.data()

        const loadedProfile = {
          fullName:
            userData.fullName ||
            user.displayName ||
            '',

          email:
            userData.email ||
            user.email ||
            '',

          accessibilityPreferences:
            userData.accessibilityPreferences ||
            []
        }

        setProfile(loadedProfile)
        setDraftProfile(loadedProfile)
      } catch (error) {
        console.error(
          'Error loading profile:',
          error
        )

        toast.error(
          'Could not load your profile.',
          {
            toastId:
              'profile-load-error'
          }
        )
      } finally {
        setLoadingProfile(false)
      }
    }

    loadProfile()
  }, [user, authLoading, navigate])

  useEffect(() => {
    async function loadReviewCount() {
      if (!user?.uid) {
        setReviewCount(0)
        return
      }

      try {
        const reviewsQuery = query(
          collection(db, 'reviews'),
          where(
            'userId',
            '==',
            user.uid
          )
        )

        const snapshot =
          await getDocs(reviewsQuery)

        setReviewCount(snapshot.size)
      } catch (error) {
        console.error(
          'Error loading review count:',
          error
        )

        setReviewCount(0)
      }
    }

    loadReviewCount()
  }, [user?.uid])

  useEffect(() => {
    async function loadSubmissions() {
      if (authLoading) {
        return
      }

      if (!user) {
        setSubmissions([])
        setLoadingSubmissions(false)
        return
      }

      try {
        setLoadingSubmissions(true)

        const submissionsQuery = query(
          collection(db, 'suggestions'),
          where(
            'userId',
            '==',
            user.uid
          )
        )

        const snapshot =
          await getDocs(
            submissionsQuery
          )

        const userSubmissions =
          snapshot.docs.map(
            (submissionDocument) => ({
              firestoreId:
                submissionDocument.id,

              ...submissionDocument.data()
            })
          )

        userSubmissions.sort(
          (a, b) =>
            new Date(
              b.createdAt || 0
            ) -
            new Date(
              a.createdAt || 0
            )
        )

        setSubmissions(
          userSubmissions
        )
      } catch (error) {
        console.error(
          'Error loading submissions:',
          error
        )

        setSubmissions([])
      } finally {
        setLoadingSubmissions(false)
      }
    }

    loadSubmissions()
  }, [user, authLoading])

  function handleChange(event) {
    const {
      name,
      value
    } = event.target

    setDraftProfile((current) => ({
      ...current,
      [name]: value
    }))
  }

  function handlePreferenceChange(
    preference
  ) {
    setDraftProfile((current) => {
      const selected =
        current.accessibilityPreferences
          .includes(preference)

      return {
        ...current,

        accessibilityPreferences:
          selected
            ? current
                .accessibilityPreferences
                .filter(
                  (item) =>
                    item !==
                    preference
                )
            : [
                ...current
                  .accessibilityPreferences,
                preference
              ]
      }
    })
  }

  async function handleSave() {
    const currentUser =
      auth.currentUser

    if (!currentUser) {
      navigate('/login')
      return
    }

    try {
      const userRef = doc(
        db,
        'users',
        currentUser.uid
      )

      await updateDoc(
        userRef,
        {
          fullName:
            draftProfile.fullName
              .trim(),

          accessibilityPreferences:
            draftProfile
              .accessibilityPreferences
        }
      )

      const updatedProfile = {
        ...draftProfile,

        fullName:
          draftProfile.fullName
            .trim()
      }

      setProfile(updatedProfile)
      setDraftProfile(
        updatedProfile
      )

      setIsEditing(false)

      toast.success(
        'Profile updated successfully.'
      )
    } catch (error) {
      console.error(
        'Error updating profile:',
        error
      )

      toast.error(
        'Could not update your profile.'
      )
    }
  }

  function handleCancel() {
    setDraftProfile(profile)
    setIsEditing(false)
  }

  async function handlePasswordUpdate(
    event
  ) {
    event.preventDefault()

    if (
      !newPassword.trim() ||
      !confirmPassword.trim()
    ) {
      toast.warning(
        'Please complete both password fields.'
      )
      return
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      toast.warning(
        'Passwords do not match.'
      )
      return
    }

    if (newPassword.length < 6) {
      toast.warning(
        'Password must be at least 6 characters.'
      )
      return
    }

    if (!user) {
      navigate('/login')
      return
    }

    try {
      await updatePassword(
        user,
        newPassword
      )

      setNewPassword('')
      setConfirmPassword('')

      toast.success(
        'Password updated successfully.'
      )
    } catch (error) {
      console.error(
        'Password update error:',
        error
      )

      if (
        error.code ===
        'auth/requires-recent-login'
      ) {
        toast.warning(
          'For security, please log out and log in again before changing your password.'
        )
      } else if (
        error.code ===
        'auth/weak-password'
      ) {
        toast.warning(
          'Please choose a stronger password.'
        )
      } else {
        toast.error(
          'Could not update the password. Please try again.'
        )
      }
    }
  }

  async function handleLogout() {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error(
        'Logout error:',
        error
      )

      toast.error(
        'Could not log out. Please try again.'
      )
    }
  }

  if (
    authLoading ||
    loadingProfile
  ) {
    return (
      <main className="profile-page">
        <div className="profile-container">
          <p>Loading profile...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="profile-page">
      <div className="profile-container">

        <header className="profile-heading">
          <span className="section-label">
            YOUR ACCOUNT
          </span>

          <h1>Profile</h1>

          <p>
            Manage your information,
            accessibility preferences,
            and submitted places.
          </p>
        </header>

        <section className="profile-card">
          <div className="profile-main">
            <div className="profile-avatar">
              <UserRound size={34} />
            </div>

            <div>
              <h2>
                {profile.fullName}
              </h2>

              <p>
                <Mail size={16} />
                {profile.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="edit-profile-button"
            onClick={() =>
              setIsEditing(true)
            }
          >
            <Edit3 size={17} />
            Edit Profile
          </button>
        </section>

        <section className="profile-stats">
          <article className="profile-stat-card">
            <Heart size={22} />

            <strong>
              {favorites.length}
            </strong>

            <span>
              Saved Places
            </span>
          </article>

          <article className="profile-stat-card">
            <MessageSquareText
              size={22}
            />

            <strong>
              {reviewCount}
            </strong>

            <span>Reviews</span>
          </article>

          <article className="profile-stat-card">
            <Accessibility
              size={22}
            />

            <strong>
              {
                profile
                  .accessibilityPreferences
                  .length
              }
            </strong>

            <span>
              Preferences
            </span>
          </article>
        </section>

        <nav
          className="profile-tabs"
          aria-label="Profile sections"
        >
          <button
            type="button"
            className={
              activeTab === 'profile'
                ? 'profile-tab active'
                : 'profile-tab'
            }
            onClick={() =>
              setActiveTab(
                'profile'
              )
            }
          >
            Profile & Preferences
          </button>

          <button
            type="button"
            className={
              activeTab ===
              'submissions'
                ? 'profile-tab active'
                : 'profile-tab'
            }
            onClick={() =>
              setActiveTab(
                'submissions'
              )
            }
          >
            My Submissions
          </button>
        </nav>

        {activeTab === 'profile' && (
          <>
            <section className="profile-section">
              <div className="profile-section-heading">
                <UserRound size={22} />

                <div>
                  <h2>
                    Personal Information
                  </h2>

                  <p>
                    Review or update your
                    account details.
                  </p>
                </div>
              </div>

              <div className="profile-info-grid">
                <div className="profile-info-item">
                  <span>
                    Full name
                  </span>

                  <strong>
                    {profile.fullName}
                  </strong>
                </div>

                <div className="profile-info-item">
                  <span>
                    Email address
                  </span>

                  <strong>
                    {profile.email}
                  </strong>
                </div>
              </div>
            </section>

            <section className="profile-section">
              <div className="profile-section-heading">
                <Accessibility
                  size={22}
                />

                <div>
                  <h2>
                    Accessibility
                    Preferences
                  </h2>

                  <p>
                    Used to personalize
                    accessibility information
                    and match scores.
                  </p>
                </div>
              </div>

              <div className="profile-preferences">
                {
                  profile
                    .accessibilityPreferences
                    .length > 0
                    ? profile
                        .accessibilityPreferences
                        .map(
                          (
                            preference
                          ) => (
                            <span
                              key={
                                preference
                              }
                              className="profile-preference-chip"
                            >
                              <CheckCircle2
                                size={
                                  15
                                }
                              />
                              {
                                preference
                              }
                            </span>
                          )
                        )
                    : (
                      <p className="profile-empty-text">
                        No accessibility
                        preferences selected.
                      </p>
                    )
                }
              </div>
            </section>

            {isEditing && (
              <section className="profile-section">
                <div className="profile-section-heading">
                  <Edit3 size={22} />

                  <div>
                    <h2>
                      Edit Profile
                    </h2>

                    <p>
                      Update your account
                      information and
                      preferences.
                    </p>
                  </div>
                </div>

                <div className="profile-edit-grid">
                  <div className="profile-field">
                    <label htmlFor="profile-name">
                      Full name
                    </label>

                    <input
                      id="profile-name"
                      name="fullName"
                      type="text"
                      value={
                        draftProfile
                          .fullName
                      }
                      onChange={
                        handleChange
                      }
                    />
                  </div>

                  <div className="profile-field">
                    <label htmlFor="profile-email">
                      Email
                    </label>

                    <input
                      id="profile-email"
                      name="email"
                      type="email"
                      value={
                        draftProfile
                          .email
                      }
                      disabled
                    />
                  </div>
                </div>

                <div className="profile-edit-preferences">
                  <h3>
                    Accessibility
                    Preferences
                  </h3>

                  <div className="profile-preferences-grid">
                    {accessibilityOptions.map(
                      (preference) => {
                        const selected =
                          draftProfile
                            .accessibilityPreferences
                            .includes(
                              preference
                            )

                        return (
                          <label
                            key={
                              preference
                            }
                            className={`profile-preference-option ${
                              selected
                                ? 'selected'
                                : ''
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={
                                selected
                              }
                              onChange={() =>
                                handlePreferenceChange(
                                  preference
                                )
                              }
                            />

                            <span>
                              {
                                preference
                              }
                            </span>
                          </label>
                        )
                      }
                    )}
                  </div>
                </div>

                <div className="profile-form-actions">
                  <button
                    type="button"
                    className="profile-cancel-button"
                    onClick={
                      handleCancel
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="profile-save-button"
                    onClick={
                      handleSave
                    }
                  >
                    Save Changes
                  </button>
                </div>
              </section>
            )}

            <section className="profile-section">
              <div className="profile-section-heading">
                <LockKeyhole
                  size={22}
                />

                <div>
                  <h2>
                    Change Password
                  </h2>

                  <p>
                    Choose a new password
                    for your account.
                  </p>
                </div>
              </div>

              <form
                className="profile-password-form"
                onSubmit={
                  handlePasswordUpdate
                }
              >
                <div className="profile-field">
                  <label htmlFor="new-password">
                    New password
                  </label>

                  <input
                    id="new-password"
                    type="password"
                    value={
                      newPassword
                    }
                    onChange={(event) =>
                      setNewPassword(
                        event.target.value
                      )
                    }
                    placeholder="Enter a new password"
                  />
                </div>

                <div className="profile-field">
                  <label htmlFor="confirm-new-password">
                    Confirm new password
                  </label>

                  <input
                    id="confirm-new-password"
                    type="password"
                    value={
                      confirmPassword
                    }
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                    placeholder="Repeat the new password"
                  />
                </div>

                <button
                  type="submit"
                  className="profile-save-button"
                >
                  Update Password
                </button>
              </form>
            </section>

            <section className="profile-logout-section">
              <div>
                <h2>Log out</h2>

                <p>
                  End your current
                  AccessHub session.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  handleLogout
                }
              >
                <LogOut size={18} />
                Log Out
              </button>
            </section>
          </>
        )}

        {activeTab ===
          'submissions' && (
          <section className="profile-submissions">
            <div className="profile-submissions-heading">
              <h2>
                My Place Suggestions
              </h2>

              <p>
                Track the places you
                suggested and their
                review status.
              </p>
            </div>

            <div className="submissions-list">
              {loadingSubmissions ? (
                <p className="profile-empty-text">
                  Loading submissions...
                </p>
              ) : submissions.length ===
                0 ? (
                <p className="profile-empty-text">
                  You haven't suggested
                  any places yet.
                </p>
              ) : (
                submissions.map(
                  (submission) => {
                    const {
                      icon: StatusIcon,
                      label
                    } =
                      getStatusContent(
                        submission.status
                      )

                    return (
                      <article
                        key={
                          submission
                            .firestoreId
                        }
                        className="submission-card"
                      >
                        <div>
                          <h3>
                            {
                              submission.name
                            }
                          </h3>

                          <p>
                            {
                              submission.city
                            }
                            {' · '}
                            {
                              submission
                                .category
                            }
                          </p>

                          <span>
                            Submitted{' '}
                            {submission.createdAt
                              ? new Date(
                                  submission.createdAt
                                ).toLocaleDateString()
                              : 'Unknown date'}
                          </span>
                        </div>

                        <div
                          className={`submission-status status-${
                            submission.status ||
                            'pending'
                          }`}
                        >
                          <StatusIcon
                            size={15}
                          />
                          {label}
                        </div>
                      </article>
                    )
                  }
                )
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

export default Profile