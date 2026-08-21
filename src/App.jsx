import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'

import AppLayout from './layouts/AppLayout'

import Home from './pages/Home'
import ExplorePlaces from './pages/ExplorePlaces'
import PlaceDetails from './pages/PlaceDetails'
import SuggestPlace from './pages/SuggestPlace'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'
import About from './pages/About'

import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import AdminLogin from './pages/AdminLogin'

import AdminDashboard from './pages/AdminDashboard'
import AdminPlaces from './pages/AdminPlaces'
import AdminPlaceForm from './pages/AdminPlaceForm'
import AdminSuggestions from './pages/AdminSuggestions'
import AdminReports from './pages/AdminReports'
import AdminReviews from './pages/AdminReviews'

import AdminRoute from './components/AdminRoute'
import NotFound from './pages/NotFound'


import './App.css'

const router = createBrowserRouter([

  /* =========================
     MAIN ACCESSHUB WEBSITE
  ========================= */

  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },

      {
        path: 'places',
        element: <ExplorePlaces />,
      },

      {
        path: 'places/:id',
        element: <PlaceDetails />,
      },

      {
        path: 'suggest-place',
        element: <SuggestPlace />,
      },

      {
        path: 'favorites',
        element: <Favorites />,
      },

      {
        path: 'profile',
        element: <Profile />,
      },

      {
        path: 'about',
        element: <About />,
      },
    ],
  },

  /* =========================
     USER AUTH
  ========================= */

  {
    path: '/login',
    element: <Login />,
  },

  {
    path: '/register',
    element: <Register />,
  },

  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },

  /* =========================
     ADMIN LOGIN
  ========================= */

  {
    path: '/admin-login',
    element: <AdminLogin />,
  },

  /* =========================
     PROTECTED ADMIN ROUTES
  ========================= */

  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
  },

  {
    path: '/admin/places',
    element: (
      <AdminRoute>
        <AdminPlaces />
      </AdminRoute>
    ),
  },

  {
    path: '/admin/places/new',
    element: (
      <AdminRoute>
        <AdminPlaceForm />
      </AdminRoute>
    ),
  },

  {
    path: '/admin/places/:id/edit',
    element: (
      <AdminRoute>
        <AdminPlaceForm />
      </AdminRoute>
    ),
  },

  {
    path: '/admin/suggestions',
    element: (
      <AdminRoute>
        <AdminSuggestions />
      </AdminRoute>
    ),
  },

  {
    path: '/admin/reports',
    element: (
      <AdminRoute>
        <AdminReports />
      </AdminRoute>
    ),
  },

  {
    path: '/admin/reviews',
    element: (
      <AdminRoute>
        <AdminReviews />
      </AdminRoute>
    ),
  },

  /* =========================
     NOT FOUND
  ========================= */

  {
    path: '*',
    element: <NotFound />,
  },
])

function App() {
  return (
    <>
    <RouterProvider router={router} />



  <ToastContainer
    position="top-center"
    autoClose={5000}
    hideProgressBar
    newestOnTop
    closeOnClick={false}
    pauseOnHover
    draggable
    theme="light"
  />
</>
  )
}

export default App