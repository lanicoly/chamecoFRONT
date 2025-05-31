import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app.tsx'
import './index.css'
import { ChavesProvider } from './context/ChavesContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChavesProvider>
      <App />
    </ChavesProvider>
  </StrictMode>,
)


