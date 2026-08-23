import { Link, Outlet, useNavigate } from 'react-router-dom'
import {
  ExternalLink,
  Flag,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  MapPin,
  MessageSquareText,
  Shield,
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'

import './AdminLayout.css'

function AdminLayout() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  async function handleAdminLogout() {
    try {
      await logout()
      navigate('/admin-login')
    } catch (error) {
      console.error(
        'Error logging out:',
        error
      )
    }
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div className="admin-sidebar-logo">
            <Shield size={22} />
          </div>

          <div>
            <strong>AccessHub</strong>
            <span>ADMIN PANEL</span>
          </div>
        </div>

        <nav
          className="admin-sidebar-nav"
          aria-label="Admin navigation"
        >
          <Link to="/admin">
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link to="/admin/places">
            <MapPin size={18} />
            Places
          </Link>

          <Link to="/admin/suggestions">
            <Lightbulb size={18} />
            Suggestions
          </Link>

          <Link to="/admin/reports">
            <Flag size={18} />
            Reports
          </Link>

          <Link to="/admin/reviews">
            <MessageSquareText size={18} />
            Reviews
          </Link>
        </nav>

        <div className="admin-sidebar-bottom">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink size={18} />
            View Site
          </Link>

          <button
            type="button"
            onClick={handleAdminLogout}
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>

      <main className="admin-layout-content">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout