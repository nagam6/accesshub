import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import AccessibilityPanel from '../components/AccessibilityPanel'
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