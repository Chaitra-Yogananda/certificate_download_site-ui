export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_MSAL_CLIENT_ID || '00000000-0000-0000-0000-000000000000',
    authority:
      import.meta.env.VITE_MSAL_AUTHORITY ||
      `https://login.microsoftonline.com/${import.meta.env.VITE_MSAL_TENANT_ID || 'common'}`,
    redirectUri: import.meta.env.VITE_REDIRECT_URI || (typeof window !== 'undefined' ? window.location.origin : undefined),
    postLogoutRedirectUri: import.meta.env.VITE_REDIRECT_URI || (typeof window !== 'undefined' ? window.location.origin : undefined),
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
