import { useEffect } from 'react'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { loginRequest } from '../auth/msalConfig'

export function useMsalProfile({ appendEmailToUrl = true, manageLogin = false } = {}) {
  const { instance, accounts, inProgress } = useMsal()
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
      const RUNTIME = (typeof window !== 'undefined' && window.__RUNTIME_CONFIG__) || {}
      const tenantIdEnv = RUNTIME.MSAL_TENANT_ID || import.meta.env.VITE_MSAL_TENANT_ID
      const clientIdEnv = RUNTIME.MSAL_CLIENT_ID || import.meta.env.VITE_MSAL_CLIENT_ID
      const allowedDomain = RUNTIME.ALLOWED_EMAIL_DOMAIN || import.meta.env.VITE_ALLOWED_EMAIL_DOMAIN
      const configured = Boolean(tenantIdEnv && clientIdEnv && clientIdEnv !== '00000000-0000-0000-0000-000000000000')

      if (!configured) {
        return
      }

      const forcedKey = 'msalForcedLoginThisLoad'
      if (manageLogin && inProgress === 'none' && !sessionStorage.getItem(forcedKey)) {
        sessionStorage.setItem(forcedKey, '1')
        await instance.loginRedirect({ ...loginRequest, prompt: 'select_account' })
        return
      }

      let account = instance.getActiveAccount()

      if (!account && accounts.length > 0) {
        instance.setActiveAccount(accounts[0])
        account = accounts[0]
      }
      if (!account) {
        if (manageLogin && inProgress === 'none') {
          await instance.loginRedirect({ ...loginRequest, prompt: 'select_account' })
        }
        return
      }

      const claims = (account && account.idTokenClaims) || {}
      const tokenTenantId = claims.tid
      const objectId = claims.oid

      if (tenantIdEnv && tokenTenantId && tokenTenantId !== tenantIdEnv) {
        localStorage.clear()
        sessionStorage.clear()
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
          console.log(JSON.stringify(me))
          userEmail = me.mail || me.userPrincipalName || userEmail
          userName = me.displayName || userName
          userType = me.userType || userType
        }
      } catch (_) {
        // ignore and fallback to account info
      }

      if (userType && userType !== 'Member') {
        localStorage.clear()  
        sessionStorage.clear()
        await instance.logoutRedirect()
        return
      }

      if (allowedDomain && userEmail) {
        const emailLower = String(userEmail).toLowerCase()
        const domainLower = String(allowedDomain).toLowerCase()
        if (!emailLower.endsWith(`@${domainLower}`)) {
          localStorage.clear()
          sessionStorage.clear()
          await instance.logoutRedirect()
          return
        }
      }
console.log("account", userEmail,userName,userType,tokenTenantId,objectId)
      if (userEmail) { localStorage.setItem('userEmail', userEmail); sessionStorage.setItem('userEmail', userEmail) }
      if (userName) { localStorage.setItem('userName', userName); sessionStorage.setItem('userName', userName) }
      if (tokenTenantId) { localStorage.setItem('userTenantId', tokenTenantId); sessionStorage.setItem('userTenantId', String(tokenTenantId)) }
      if (objectId) { localStorage.setItem('userObjectId', objectId); sessionStorage.setItem('userObjectId', objectId) }
      if (userType) { localStorage.setItem('userType', userType); sessionStorage.setItem('userType', userType) }
      localStorage.setItem('loginProvider', 'msal')
      sessionStorage.setItem('loginProvider', 'msal')
      const nowIso = new Date().toISOString()
      localStorage.setItem('loginTime', nowIso)
      sessionStorage.setItem('loginTime', nowIso)

      if (appendEmailToUrl && userEmail) {
        const url = new URL(window.location.href)
        if (!url.searchParams.get('email')) {
          url.searchParams.set('email', userEmail)
          window.history.replaceState({}, '', url.toString())
        }
      }

      const hasEmail = !!(localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail'))
      const hasName = !!(localStorage.getItem('userName') || sessionStorage.getItem('userName'))
      if (!hasEmail || !hasName) {
        const retried = sessionStorage.getItem('msalRetryMissingProfile')
        if (!retried && manageLogin) {
          sessionStorage.setItem('msalRetryMissingProfile', '1')
          await instance.loginRedirect({ ...loginRequest, prompt: 'select_account' })
          return
        }
      } else {
        sessionStorage.removeItem('msalRetryMissingProfile')
      }
    }

    ensureLoginAndCacheProfile().catch(() => {})
  }, [instance, isAuthenticated, appendEmailToUrl, inProgress, manageLogin, accounts])
}
