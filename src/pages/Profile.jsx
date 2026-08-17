import { useState } from 'react'
import {
  UserRound,
  Mail,
  Heart,
  MessageSquareText,
  Accessibility,
  Edit3,
  LogOut,
  CheckCircle2,
  LockKeyhole,
  Clock3,
  BadgeCheck,
  XCircle
} from 'lucide-react'

import { useFavorites } from '../context/FavoritesContext'
import './Profile.css'

function Profile() {
  const { favorites } = useFavorites()

  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)

  const [profile, setProfile] = useState({
    fullName: 'AccessHub User',
    email: 'user@accesshub.com',
    accessibilityPreferences: [
      'Wheelchair user',
      'Need accessible restroom',
      'Need quiet environment',
    ],
  })

  const [draftProfile, setDraftProfile] = useState(profile)

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')

  const accessibilityOptions = [
    'Wheelchair user',
    'Blind or low vision',
    'Deaf or hard of hearing',
    'Sensory sensitivity',
    'Need accessible restroom',
    'Need dedicated parking',
    'Need quiet environment',
  ]

  const submissions = [
    {
      id: 1,
      name: 'Haifa Art Museum',
      city: 'Haifa',
      category: 'Museum',
      submittedAt: 'Aug 17, 2026',
      status: 'pending',
    },
    {
      id: 2,
      name: 'Accessible Café',
      city: 'Nazareth',
      category: 'Cafe',
      submittedAt: 'Aug 10, 2026',
      status: 'approved',
    },
    {
      id: 3,
      name: 'Community Garden',
      city: 'Acre',
      category: 'Park',
      submittedAt: 'Aug 04, 2026',
      status: 'rejected',
    },
  ]

  function handleChange(event) {
    const { name, value } = event.target

    setDraftProfile((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handlePreferenceChange(preference) {
    setDraftProfile((current) => {
      const selected =
        current.accessibilityPreferences.includes(preference)

      return {
        ...current,
        accessibilityPreferences: selected
          ? current.accessibilityPreferences.filter(
              (item) => item !== preference
            )
          : [...current.accessibilityPreferences, preference],
      }
    })
  }

  function handleSave() {
    setProfile(draftProfile)
    setIsEditing(false)
  }

  function handleCancel() {
    setDraftProfile(profile)
    setIsEditing(false)
  }

  function handlePasswordUpdate(event) {
    event.preventDefault()

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setPasswordMessage('Please complete both password fields.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage('Passwords do not match.')
      return
    }

    setPasswordMessage('Password updated successfully.')
    setNewPassword('')
    setConfirmPassword('')
  }

  function handleLogout() {
    alert('You have been logged out.')
  }

  function getStatusContent(status) {
    if (status === 'approved') {
      return {
        icon: BadgeCheck,
        label: 'Approved',
      }
    }

    if (status === 'rejected') {
      return {
        icon: XCircle,
        label: 'Rejected',
      }
    }

    return {
      icon: Clock3,
      label: 'Pending',
    }
  }

  return (
    <main className="profile-page">
      <div className="profile-container">

        <div className="profile-heading">
          <span className="section-label">
            YOUR ACCOUNT
          </span>

          <h1>Profile</h1>

          <p>
            Manage your information, accessibility preferences,
            and submitted places.
          </p>
        </div>

        <section className="profile-card">
          <div className="profile-main">

            <div className="profile-avatar">
              <UserRound size={34} />
            </div>

            <div>
              <h2>{profile.fullName}</h2>

              <p>
                <Mail size={16} />
                {profile.email}
              </p>
            </div>

          </div>

          <button
            type="button"
            className="edit-profile-button"
            onClick={() => setIsEditing(true)}
          >
            <Edit3 size={17} />
            Edit Profile
          </button>
        </section>

        <section className="profile-stats">

          <div className="profile-stat-card">
            <Heart size={22} />
            <strong>{favorites.length}</strong>
            <span>Saved Places</span>
          </div>

          <div className="profile-stat-card">
            <MessageSquareText size={22} />
            <strong>3</strong>
            <span>Reviews</span>
          </div>

          <div className="profile-stat-card">
            <Accessibility size={22} />

            <strong>
              {profile.accessibilityPreferences.length}
            </strong>

            <span>Preferences</span>
          </div>

        </section>

        <div className="profile-tabs">

          <button
            type="button"
            className={
              activeTab === 'profile'
                ? 'profile-tab active'
                : 'profile-tab'
            }
            onClick={() => setActiveTab('profile')}
          >
            Profile & Preferences
          </button>

          <button
            type="button"
            className={
              activeTab === 'submissions'
                ? 'profile-tab active'
                : 'profile-tab'
            }
            onClick={() => setActiveTab('submissions')}
          >
            My Submissions
          </button>

        </div>

        {activeTab === 'profile' && (
          <>
            <section className="profile-section">

              <div className="profile-section-heading">
                <UserRound size={22} />

                <div>
                  <h2>Personal Information</h2>

                  <p>
                    Review or update your account details.
                  </p>
                </div>
              </div>

              <div className="profile-info-grid">

                <div className="profile-info-item">
                  <span>Full name</span>
                  <strong>{profile.fullName}</strong>
                </div>

                <div className="profile-info-item">
                  <span>Email address</span>
                  <strong>{profile.email}</strong>
                </div>

              </div>

            </section>

            <section className="profile-section">

              <div className="profile-section-heading">
                <Accessibility size={22} />

                <div>
                  <h2>Accessibility Preferences</h2>

                  <p>
                    Used to personalize accessibility information
                    and match scores.
                  </p>
                </div>
              </div>

              <div className="profile-preferences">

                {profile.accessibilityPreferences.length > 0 ? (
                  profile.accessibilityPreferences.map(
                    (preference) => (
                      <span
                        key={preference}
                        className="profile-preference-chip"
                      >
                        <CheckCircle2 size={15} />
                        {preference}
                      </span>
                    )
                  )
                ) : (
                  <p className="profile-empty-text">
                    No accessibility preferences selected.
                  </p>
                )}

              </div>

            </section>

            {isEditing && (
              <section className="profile-section">

                <div className="profile-section-heading">
                  <Edit3 size={22} />

                  <div>
                    <h2>Edit Profile</h2>

                    <p>
                      Update your account information and preferences.
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
                      value={draftProfile.fullName}
                      onChange={handleChange}
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
                      value={draftProfile.email}
                      onChange={handleChange}
                    />
                  </div>

                </div>

                <div className="profile-edit-preferences">

                  <h3>Accessibility Preferences</h3>

                  <div className="profile-preferences-grid">

                    {accessibilityOptions.map((preference) => (
                      <label
                        key={preference}
                        className={`profile-preference-option ${
                          draftProfile.accessibilityPreferences.includes(
                            preference
                          )
                            ? 'selected'
                            : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={draftProfile.accessibilityPreferences.includes(
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

                <div className="profile-form-actions">

                  <button
                    type="button"
                    className="profile-cancel-button"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="profile-save-button"
                    onClick={handleSave}
                  >
                    Save Changes
                  </button>

                </div>

              </section>
            )}

            <section className="profile-section">

              <div className="profile-section-heading">
                <LockKeyhole size={22} />

                <div>
                  <h2>Change Password</h2>

                  <p>
                    Choose a new password for your account.
                  </p>
                </div>
              </div>

              {passwordMessage && (
                <div className="profile-password-message">
                  {passwordMessage}
                </div>
              )}

              <form
                className="profile-password-form"
                onSubmit={handlePasswordUpdate}
              >

                <div className="profile-field">
                  <label htmlFor="new-password">
                    New password
                  </label>

                  <input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(event.target.value)
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
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
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
                  End your current AccessHub session.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                Log Out
              </button>

            </section>
          </>
        )}

        {activeTab === 'submissions' && (
          <section className="profile-submissions">

            <div className="profile-submissions-heading">
              <h2>My Place Suggestions</h2>

              <p>
                Track the places you suggested and their review status.
              </p>
            </div>

            <div className="submissions-list">

              {submissions.map((submission) => {
                const statusContent =
                  getStatusContent(submission.status)

                const StatusIcon = statusContent.icon

                return (
                  <article
                    key={submission.id}
                    className="submission-card"
                  >

                    <div>
                      <h3>{submission.name}</h3>

                      <p>
                        {submission.city} · {submission.category}
                      </p>

                      <span>
                        Submitted {submission.submittedAt}
                      </span>
                    </div>

                    <div
                      className={`submission-status status-${submission.status}`}
                    >
                      <StatusIcon size={15} />
                      {statusContent.label}
                    </div>

                  </article>
                )
              })}

            </div>

          </section>
        )}

      </div>
    </main>
  )
}

export default Profile