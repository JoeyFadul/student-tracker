import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import StudentTracker from './StudentTracker.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StudentTracker />
  </StrictMode>,
)
