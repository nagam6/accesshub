import { Outlet, Link, useNavigate } from 'react-router-dom'
import {
  Shield,
  LayoutDashboard,
  MapPin,
  Lightbulb,
  Flag,
  MessageSquareText,
  ExternalLink,
  LogOut
} from 'lucide-react'

import { auth } from '../firebase/firebase'
import { signOut } from 'firebase/auth'

import './AdminLayout.css'

function AdminLayout() {
  const navigate = useNavigate()

  async function handleAdminLogout() {
    await signOut(auth)
    navigate('/admin-login')
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

        <nav className="admin-sidebar-nav">

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