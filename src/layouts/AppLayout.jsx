import { Outlet } from 'react-router-dom'

import AccessibilityPanel from '../components/AccessibilityPanel'
import Footer from '../components/Footer'
import Header from '../components/Header'

function AppLayout() {
  return (
    <>
      <div className="site-visual-content">
        <Header />

        <main>
          <Outlet />
        </main>

        <Footer />
      </div>

      <AccessibilityPanel />
    </>
  )
}

export default AppLayout