import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FavoritesProvider } from './context/FavoritesContext'
import { AuthProvider } from './context/AuthContext'
import { AccessibilityProvider } from './context/AccessibilityContext'
import './accessibility.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
        <AuthProvider>

    <FavoritesProvider>
      <AccessibilityProvider>
  <App />
  </AccessibilityProvider>
</FavoritesProvider>
    </AuthProvider>

  </StrictMode>,
)
