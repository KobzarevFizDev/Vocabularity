import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router"
import './index.css'
import App from './App.tsx'
import { OpenAPI } from './api'

OpenAPI.BASE = import.meta.env.VITE_API_URL || '/api'

if (import.meta.env.DEV) {
  import('./mocks/browser').then(({ worker }) => worker.start())
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
      <App />
    </StrictMode>
  </BrowserRouter>
)
