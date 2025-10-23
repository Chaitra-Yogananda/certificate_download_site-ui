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
      let account = instance.getActiveAccount()
      if (!account) {
        // Trigger login
        await instance.loginRedirect(loginRequest)
        return
      }

      let userEmail = account.username || account.mail || account.userPrincipalName
      let userName = account.name || ''

      // Try Graph for most accurate profile
      try {
        const token = await instance.acquireTokenSilent(loginRequest)
        const res = await fetch('https://graph.microsoft.com/v1.0/me', {
          headers: { Authorization: `Bearer ${token.accessToken}` },
        })
        if (res.ok) {
          const me = await res.json()
          userEmail = me.mail || me.userPrincipalName || userEmail
          userName = me.displayName || userName
        }
      } catch (_) {
        // ignore and fallback to account info
      }

      if (userEmail) localStorage.setItem('userEmail', userEmail)
      if (userName) localStorage.setItem('userName', userName)

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
