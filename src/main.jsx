import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

registerSW()

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/cibv-pwa">
    <App />
  </BrowserRouter>
)