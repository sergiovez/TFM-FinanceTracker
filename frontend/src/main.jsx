// Modo estricto de React para detectar errores en desarrollo
import { StrictMode } from 'react'
// API moderna de React para renderizar la app
import { createRoot } from 'react-dom/client'
// Estilos globales
import './index.css'
import './App.css';
// Componente principal de la aplicación
import App from './App.jsx'

// Renderiza la aplicación dentro del div con id="root"
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
