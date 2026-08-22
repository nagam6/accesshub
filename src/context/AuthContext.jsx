import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'

import {
  onAuthStateChanged,
  signOut
} from 'firebase/auth'

import {
  doc,
  getDoc
} from 'firebase/firestore'

import {
  auth,
  db
} from '../firebase/firebase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        setUser(firebaseUser)

        if (!firebaseUser) {
          setUserRole(null)
          setAuthLoading(false)
          return
        }

        try {
          const userRef = doc(
            db,
            'users',
            firebaseUser.uid
          )

          const userSnapshot =
            await getDoc(userRef)

          if (userSnapshot.exists()) {
            const userData =
              userSnapshot.data()

            setUserRole(
              String(userData.role || 'user')
                .trim()
                .toLowerCase()
            )
          } else {
            setUserRole('user')
          }
        } catch (error) {
          console.error(
            'Error loading user role:',
            error
          )

          setUserRole('user')
        } finally {
          setAuthLoading(false)
        }
      }
    )

    return unsubscribe
  }, [])

  async function logout() {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        authLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}