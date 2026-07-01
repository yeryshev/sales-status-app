import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { OidcProvider } from './providers/OidcProvider'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <OidcProvider>
    <App />
      </OidcProvider>
    </BrowserRouter>
  </StrictMode>,
)
