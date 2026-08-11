import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'

function Home() {
  return <h1>AccessHub</h1>
}

function ExplorePlaces() {
  return <h1>Explore Places</h1>
}

function PlaceDetails() {
  return <h1>Place Details</h1>
}

function SuggestPlace() {
  return <h1>Suggest a Place</h1>
}

function Login() {
  return <h1>Login</h1>
}

function Register() {
  return <h1>Register</h1>
}

function ForgotPassword() {
  return <h1>Forgot Password</h1>
}

function Favorites() {
  return <h1>Favorites</h1>
}

function Profile() {
  return <h1>Profile</h1>
}

function AdminDashboard() {
  return <h1>Admin Dashboard</h1>
}

function NotFound() {
  return <h1>404 - Page Not Found</h1>
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/places',
    element: <ExplorePlaces />,
  },
  {
    path: '/places/:id',
    element: <PlaceDetails />,
  },
  {
    path: '/suggest-place',
    element: <SuggestPlace />,
  },
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
  {
    path: '/favorites',
    element: <Favorites />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/admin',
    element: <AdminDashboard />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App;