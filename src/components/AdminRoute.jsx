import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

import {
  doc,
  getDoc
} from 'firebase/firestore'

import {
  auth,
  db
} from '../firebase/firebase'

function AdminRoute({ children }) {
  const [checking, setChecking] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function checkAdmin() {
      const user = auth.currentUser

      if (!user) {
        setIsAdmin(false)
        setChecking(false)
        return
      }

      try {
        const userSnapshot = await getDoc(
          doc(
            db,
            'users',
            user.uid
          )
        )

        if (!userSnapshot.exists()) {
          setIsAdmin(false)
          return
        }

        const userData =
          userSnapshot.data()

        const role =
          String(userData.role || '')
            .trim()
            .toLowerCase()

        setIsAdmin(role === 'admin')
      } catch (error) {
        console.error(
          'Admin route check error:',
          error
        )

        setIsAdmin(false)
      } finally {
        setChecking(false)
      }
    }

    checkAdmin()
  }, [])

  if (checking) {
    return (
      <div style={{ padding: '40px' }}>
        Checking administrator access...
      </div>
    )
  }

  if (!auth.currentUser) {
    return (
      <Navigate
        to="/admin-login"
        replace
      />
    )
  }

  if (!isAdmin) {
    return (
      <Navigate
        to="/"
        replace
      />
    )
  }

  return children
}

export default AdminRoute