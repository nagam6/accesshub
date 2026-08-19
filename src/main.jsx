import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FavoritesProvider } from './context/FavoritesContext'
import { AuthProvider } from './context/AuthContext'


createRoot(document.getElementById('root')).render(
  <StrictMode>
        <AuthProvider>

    <FavoritesProvider>
  <App />
</FavoritesProvider>
    </AuthProvider>

  </StrictMode>,
)
