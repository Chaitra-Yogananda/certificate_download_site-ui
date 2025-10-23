import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './global.css'
import { MsalProvider } from '@azure/msal-react'
import { PublicClientApplication } from '@azure/msal-browser'
import { msalConfig } from './auth/msalConfig'

const pca = new PublicClientApplication(msalConfig)

createRoot(document.getElementById('root')).render(
  React.createElement(React.StrictMode, null, (
    React.createElement(MsalProvider, { instance: pca }, React.createElement(App))
  ))
)
