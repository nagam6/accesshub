import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import AdminRoute from './components/AdminRoute'
import AdminLayout from './layouts/AdminLayout'
import AppLayout from './layouts/AppLayout'

import About from './pages/About'
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'
import AdminPlaceForm from './pages/AdminPlaceForm'
import AdminPlaces from './pages/AdminPlaces'
import AdminReports from './pages/AdminReports'
import AdminReviews from './pages/AdminReviews'
import AdminSuggestions from './pages/AdminSuggestions'
import ExplorePlaces from './pages/ExplorePlaces'
import Favorites from './pages/Favorites'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import PlaceDetails from './pages/PlaceDetails'
import Profile from './pages/Profile'
import Register from './pages/Register'
import SuggestPlace from './pages/SuggestPlace'

const router = createBrowserRouter([
  // Main website
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

  // Authentication
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

  // Admin
  {
    path: '/admin-login',
    element: <AdminLogin />,
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: 'places',
        element: <AdminPlaces />,
      },
      {
        path: 'places/new',
        element: <AdminPlaceForm />,
      },
      {
        path: 'places/:id/edit',
        element: <AdminPlaceForm />,
      },
      {
        path: 'suggestions',
        element: <AdminSuggestions />,
      },
      {
        path: 'reports',
        element: <AdminReports />,
      },
      {
        path: 'reviews',
        element: <AdminReviews />,
      },
    ],
  },

  // Fallback
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