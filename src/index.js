import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './global.css'
import { MsalProvider } from '@azure/msal-react'
import { PublicClientApplication, EventType } from '@azure/msal-browser'
import { msalConfig } from './auth/msalConfig'
import { BrowserRouter } from 'react-router-dom'

const pca = new PublicClientApplication(msalConfig)

// Keep active account up-to-date
pca.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS || event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) {
    const acct = (event.payload && event.payload.account) || pca.getAllAccounts()[0]
    if (acct) {
      try { pca.setActiveAccount(acct) } catch (_) {}
    }
  }
})

// Handle MSAL redirect and persist pending download state if provided
pca
  .handleRedirectPromise()
  .then((response) => {
    if (response && response.account) {
      try { pca.setActiveAccount(response.account) } catch (_) {}
      try {
        if (response.state) {
          const data = JSON.parse(response.state)
          if (data && typeof data === 'object') {
            if (data.email) window.localStorage.setItem('candidateEmail', String(data.email))
            if (data.cc) window.sessionStorage.setItem('pendingCourseCode', String(data.cc))
            if (data.next) window.sessionStorage.setItem('pendingRedirect', String(data.next))
            window.sessionStorage.setItem('pendingDownload', '1')
          }
        }
      } catch (_) {}
    } else {
      const current = pca.getActiveAccount()
      if (!current) {
        const all = pca.getAllAccounts()
        if (all && all.length > 0) {
          try { pca.setActiveAccount(all[0]) } catch (_) {}
        }
      }
    }
  })
  .catch(() => {})

createRoot(document.getElementById('root')).render(
  React.createElement(React.StrictMode, null, (
    React.createElement(MsalProvider, { instance: pca }, (
      React.createElement(BrowserRouter, null, React.createElement(App))
    ))
  ))
)
