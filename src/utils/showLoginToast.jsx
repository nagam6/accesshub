import { toast } from 'react-toastify'

export function showLoginToast(navigate) {
  toast(
    ({ closeToast }) => (
      <div className="login-toast-content">
        <div>
          <strong>Log in required</strong>

          <p>
            Please log in to use this feature.
          </p>
        </div>

        <button
          type="button"
          className="login-toast-button"
          onClick={() => {
            closeToast()
            navigate('/login')
          }}
        >
          Log In
        </button>
      </div>
    ),
    {
      toastId: 'login-required',
    }
  )
}