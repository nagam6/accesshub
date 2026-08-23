import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import { AccessibilityProvider } from './context/AccessibilityContext'
import { AuthProvider } from './context/AuthContext'
import { FavoritesProvider } from './context/FavoritesContext'

import './index.css'
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
  </StrictMode>
)
