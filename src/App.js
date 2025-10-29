import React, { useEffect } from 'react'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { loginRequest } from './auth/msalConfig'
import CertificateDownloadPage from './page.jsx'

export default function App() {
  const isAuthenticated = useIsAuthenticated()
  const { instance, inProgress } = useMsal()
  const RUNTIME = (typeof window !== 'undefined' && window.__RUNTIME_CONFIG__) || {}
  const tenantIdEnv = RUNTIME.MSAL_TENANT_ID || import.meta.env.VITE_MSAL_TENANT_ID
  const clientIdEnv = RUNTIME.MSAL_CLIENT_ID || import.meta.env.VITE_MSAL_CLIENT_ID
  const isMsalConfigured = Boolean(tenantIdEnv && clientIdEnv && clientIdEnv !== '00000000-0000-0000-0000-000000000000')

  useEffect(() => {
    if (!isMsalConfigured) return
    if (!isAuthenticated && inProgress === 'none') {
      instance.loginRedirect({ ...loginRequest, prompt: 'select_account' })
    }
  }, [instance, isAuthenticated, inProgress, isMsalConfigured])

  if (isMsalConfigured && (!isAuthenticated || inProgress !== 'none')) {
    return React.createElement(
      'div',
      { className: 'min-h-screen flex items-center justify-center bg-white text-gray-700' },
      'Signing you in...'
    )
  }

  return React.createElement(CertificateDownloadPage)
}
