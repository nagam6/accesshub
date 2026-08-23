import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function AdminRoute({ children }) {
  const {user, userRole, authLoading} = useAuth()

 // Wait until Firebase restores the authentication session
  if (authLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          color: '#173843',
        }}
      >
        Checking administrator access...
      </div>
    )
  }

  if (!user) {
    return (
      <Navigate
        to="/admin-login"
        replace
      />
    )
  }

  if (userRole !== 'admin') {
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