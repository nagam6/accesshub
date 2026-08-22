import {
  useEffect,
  useState
} from 'react'

import {
  Accessibility,
  Contrast,
  Eye,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  ZapOff
} from 'lucide-react'

import {
  useAccessibility
} from '../context/AccessibilityContext'

import './AccessibilityPanel.css'

function AccessibilityPanel() {
  const {
    settings,
    setTextSize,
    toggleHighContrast,
    toggleGrayscale,
    toggleReduceMotion,
    resetAccessibility,
  } = useAccessibility()

  const [open, setOpen] =
    useState(false)

  const [isReading, setIsReading] =
    useState(false)

  function handleReadPage() {
    if (
      !('speechSynthesis' in window)
    ) {
      return
    }

    if (isReading) {
      window.speechSynthesis.cancel()
      setIsReading(false)
      return
    }

    window.speechSynthesis.cancel()

    const main =
      document.querySelector('main')

    const pageText =
      main?.innerText || ''

    if (!pageText.trim()) {
      return
    }

    const speech =
      new SpeechSynthesisUtterance(
        pageText
      )

    speech.onstart = () => {
      setIsReading(true)
    }

    speech.onend = () => {
      setIsReading(false)
    }

    speech.onerror = () => {
      setIsReading(false)
    }

    window.speechSynthesis.speak(
      speech
    )
  }

  function handleReset() {
    resetAccessibility()

    setIsReading(false)
  }

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel()
    }
  }, [])

  return (
    <>
      <button
        type="button"
        className="accessibility-floating-button"
        onClick={() =>
          setOpen((current) => !current)
        }
        aria-label="Open accessibility settings"
        aria-expanded={open}
      >
        <Accessibility size={25} />
      </button>

      {open && (
        <aside
          className="accessibility-panel"
          aria-label="Accessibility settings"
        >
          <div className="accessibility-panel-header">

            <div>
              <span>
                ACCESSIBILITY
              </span>

              <h2>
                Accessibility Settings
              </h2>
            </div>

            <button
              type="button"
              className="accessibility-close-button"
              onClick={() =>
                setOpen(false)
              }
              aria-label="Close accessibility settings"
            >
              <X size={20} />
            </button>

          </div>

          <div className="accessibility-setting">

            <h3>Text Size</h3>

            <div className="accessibility-size-options">

              {[
                ['small', 'Small'],
                ['normal', 'Normal'],
                ['large', 'Large'],
                ['x-large', 'X-Large'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={
                    settings.textSize ===
                    value
                      ? 'active'
                      : ''
                  }
                  onClick={() =>
                    setTextSize(value)
                  }
                >
                  {label}
                </button>
              ))}

            </div>

          </div>

          <div className="accessibility-divider" />

          <button
            type="button"
            className={`accessibility-option ${
              settings.highContrast
                ? 'active'
                : ''
            }`}
            onClick={toggleHighContrast}
          >
            <Contrast size={20} />

            <div>
              <strong>
                High Contrast
              </strong>

              <span>
                Increase visual contrast
              </span>
            </div>

            <span className="accessibility-toggle">
              <span />
            </span>
          </button>

          <button
            type="button"
            className={`accessibility-option ${
              settings.grayscale
                ? 'active'
                : ''
            }`}
            onClick={toggleGrayscale}
          >
            <Eye size={20} />

            <div>
              <strong>
                Grayscale
              </strong>

              <span>
                Remove interface colors
              </span>
            </div>

            <span className="accessibility-toggle">
              <span />
            </span>
          </button>

          <button
            type="button"
            className={`accessibility-option ${
              settings.reduceMotion
                ? 'active'
                : ''
            }`}
            onClick={toggleReduceMotion}
          >
            <ZapOff size={20} />

            <div>
              <strong>
                Reduce Motion
              </strong>

              <span>
                Minimize animations
              </span>
            </div>

            <span className="accessibility-toggle">
              <span />
            </span>
          </button>

          <div className="accessibility-divider" />

          <button
            type="button"
            className={`accessibility-read-button ${
              isReading
                ? 'reading'
                : ''
            }`}
            onClick={handleReadPage}
          >
            {isReading ? (
              <VolumeX size={19} />
            ) : (
              <Volume2 size={19} />
            )}

            {isReading
              ? 'Stop Reading'
              : 'Read This Page'}
          </button>

          <button
            type="button"
            className="accessibility-reset-button"
            onClick={handleReset}
          >
            <RotateCcw size={18} />
            Reset Settings
          </button>

        </aside>
      )}
    </>
  )
}

export default AccessibilityPanel