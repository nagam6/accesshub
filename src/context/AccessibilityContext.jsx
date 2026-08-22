import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'

const AccessibilityContext =
  createContext()

const defaultSettings = {
  textSize: 'normal',
  highContrast: false,
  grayscale: false,
  reduceMotion: false,
}

export function AccessibilityProvider({
  children
}) {
const [settings, setSettings] = useState(() => {
  const savedSettings =
    sessionStorage.getItem(
      'accesshub-accessibility'
    )

  if (!savedSettings) {
    return defaultSettings
  }

  try {
    return JSON.parse(savedSettings)
  } catch {
    return defaultSettings
  }
})

  useEffect(() => {
      sessionStorage.setItem(
    'accesshub-accessibility',
    JSON.stringify(settings)
  )
    const root =
      document.documentElement

    root.dataset.textSize =
      settings.textSize

    root.classList.toggle(
      'access-high-contrast',
      settings.highContrast
    )

    root.classList.toggle(
      'access-grayscale',
      settings.grayscale
    )

    root.classList.toggle(
      'access-reduce-motion',
      settings.reduceMotion
    )
  }, [settings])

  function setTextSize(textSize) {
    setSettings((current) => ({
      ...current,
      textSize,
    }))
  }

  function toggleHighContrast() {
    setSettings((current) => ({
      ...current,
      highContrast:
        !current.highContrast,
    }))
  }

  function toggleGrayscale() {
    setSettings((current) => ({
      ...current,
      grayscale:
        !current.grayscale,
    }))
  }

  function toggleReduceMotion() {
    setSettings((current) => ({
      ...current,
      reduceMotion:
        !current.reduceMotion,
    }))
  }

  function resetAccessibility() {
    setSettings(defaultSettings)

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        setTextSize,
        toggleHighContrast,
        toggleGrayscale,
        toggleReduceMotion,
        resetAccessibility,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  return useContext(
    AccessibilityContext
  )
}