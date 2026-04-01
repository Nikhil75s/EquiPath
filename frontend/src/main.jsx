import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { A11yProvider } from './context/A11yContext'
import { AriaLiveRegion } from './components/common/AriaLiveRegion'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <A11yProvider>
        <AriaLiveRegion>
          <AuthProvider>
            <App />
          </AuthProvider>
        </AriaLiveRegion>
      </A11yProvider>
    </BrowserRouter>
  </StrictMode>,
)
