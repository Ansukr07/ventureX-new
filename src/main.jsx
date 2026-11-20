import { hydrateRoot, createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const container = document.getElementById('root')

if (container && container.hasChildNodes()) {
  hydrateRoot(container, <App />)
} else if (container) {
  createRoot(container).render(<App />)
}
