import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastProvider } from './context/ToastifyContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { SidebarProvider } from './context/SidebarContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SidebarProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </SidebarProvider>
    </AuthProvider>
  </StrictMode>,
)
