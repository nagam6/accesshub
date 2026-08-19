import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import Home from './pages/Home'
import ExplorePlaces from './pages/ExplorePlaces'
import PlaceDetails from './pages/PlaceDetails'
import SuggestPlace from './pages/SuggestPlace'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import AdminPlaces from './pages/AdminPlaces'
import AdminPlaceForm from './pages/AdminPlaceForm'
import About from './pages/About'
import NotFound from './pages/NotFound'
import AdminSuggestions from './pages/AdminSuggestions'
import AdminReports from './pages/AdminReports'
import './App.css'

const router = createBrowserRouter([
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
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'favorites',
        element: <Favorites />,
      },
      {
        path:'about',
        element:<About />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'admin',
        element: <AdminDashboard />,
      },
      {
        path: 'admin/places',
        element: <AdminPlaces />,
      },
           {
        path: 'admin/places/new',
        element: <AdminPlaceForm />,
      },
              {
        path: 'admin/places/:id/edit',
        element: <AdminPlaceForm />,
      },
                 {
        path: 'admin/suggestions',
        element: <AdminSuggestions />,
      },
                   {
        path: 'admin/reports',
        element: <AdminReports />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App;