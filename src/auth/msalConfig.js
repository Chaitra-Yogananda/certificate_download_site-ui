const RUNTIME = (typeof window !== 'undefined' && window.__RUNTIME_CONFIG__) || {}

export const msalConfig = {
  auth: {
    clientId: RUNTIME.MSAL_CLIENT_ID || import.meta.env.VITE_MSAL_CLIENT_ID || '00000000-0000-0000-0000-000000000000',
    authority:
      RUNTIME.MSAL_AUTHORITY ||
      import.meta.env.VITE_MSAL_AUTHORITY ||
      `https://login.microsoftonline.com/${RUNTIME.MSAL_TENANT_ID || import.meta.env.VITE_MSAL_TENANT_ID}`,
    redirectUri: RUNTIME.REDIRECT_URI || import.meta.env.VITE_REDIRECT_URI || (typeof window !== 'undefined' ? window.location.origin : undefined),
    postLogoutRedirectUri: RUNTIME.REDIRECT_URI || import.meta.env.VITE_REDIRECT_URI || '/',
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ['User.Read', 'openid', 'profile'],
};

export const allowedEmailDomain = (RUNTIME.ALLOWED_EMAIL_DOMAIN || import.meta.env.VITE_ALLOWED_EMAIL_DOMAIN || 'ecanarys.com').toLowerCase()
