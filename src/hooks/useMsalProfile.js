import { useEffect } from 'react'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { loginRequest } from '../auth/msalConfig'

export function useMsalProfile({ appendEmailToUrl = true } = {}) {
  const { instance, accounts } = useMsal()
  const isAuthenticated = useIsAuthenticated()

  useEffect(() => {
    // Set active account if none
    const active = instance.getActiveAccount()
    if (!active && accounts.length > 0) {
      instance.setActiveAccount(accounts[0])
    }
  }, [accounts, instance])

  useEffect(() => {
    async function ensureLoginAndCacheProfile() {
      const tenantIdEnv = import.meta.env.VITE_MSAL_TENANT_ID
      const clientIdEnv = import.meta.env.VITE_MSAL_CLIENT_ID
      const allowedDomain = import.meta.env.VITE_ALLOWED_EMAIL_DOMAIN
      const configured = Boolean(tenantIdEnv && clientIdEnv && clientIdEnv !== '00000000-0000-0000-0000-000000000000')

      if (!configured) {
        return
      }

      const segments = window.location.pathname.split('/').filter(Boolean)
      const courseCode = segments.length ? segments[segments.length - 1] : ''
      if (courseCode) localStorage.setItem('courseCode', courseCode)

      let account = instance.getActiveAccount()
      if (!account) {
        // Trigger login
        await instance.loginRedirect({ ...loginRequest, redirectStartPage: window.location.href })
        return
      }

      const claims = account.idTokenClaims || {}
      const tokenTenantId = claims.tid
      const objectId = claims.oid

      if (tenantIdEnv && tokenTenantId && tokenTenantId !== tenantIdEnv) {
        localStorage.clear()
        await instance.logoutRedirect()
        return
      }

      let userEmail = account.username || account.mail || account.userPrincipalName
      let userName = account.name || ''
      let userType = ''

      // Try Graph for most accurate profile
      try {
        const token = await instance.acquireTokenSilent(loginRequest)
        const res = await fetch('https://graph.microsoft.com/v1.0/me?$select=displayName,mail,userPrincipalName,userType', {
          headers: { Authorization: `Bearer ${token.accessToken}` },
        })
        if (res.ok) {
          const me = await res.json()
          userEmail = me.mail || me.userPrincipalName || userEmail
          userName = me.displayName || userName
          userType = me.userType || userType
        }
      } catch (_) {
        // ignore and fallback to account info
      }

      if (userType && userType !== 'Member') {
        localStorage.clear()
        await instance.logoutRedirect()
        return
      }

      if (allowedDomain && userEmail) {
        const emailLower = String(userEmail).toLowerCase()
        const domainLower = String(allowedDomain).toLowerCase()
        if (!emailLower.endsWith(`@${domainLower}`)) {
          localStorage.clear()
          await instance.logoutRedirect()
          return
        }
      }

      if (userEmail) localStorage.setItem('userEmail', userEmail)
      if (userName) localStorage.setItem('userName', userName)
      if (tokenTenantId) localStorage.setItem('userTenantId', tokenTenantId)
      if (objectId) localStorage.setItem('userObjectId', objectId)
      if (userType) localStorage.setItem('userType', userType)
      localStorage.setItem('loginProvider', 'msal')
      localStorage.setItem('loginTime', new Date().toISOString())

      if (appendEmailToUrl && userEmail) {
        const url = new URL(window.location.href)
        if (!url.searchParams.get('email')) {
          url.searchParams.set('email', userEmail)
          window.history.replaceState({}, '', url.toString())
        }
      }
    }

    ensureLoginAndCacheProfile().catch(() => {})
  }, [instance, isAuthenticated, appendEmailToUrl])
}
