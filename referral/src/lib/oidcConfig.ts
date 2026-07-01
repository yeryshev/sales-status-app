export const oidcConfig = {
  authority: `${import.meta.env.VITE_KEYCLOAK_OAUTH_URL}/auth/realms/${import.meta.env.VITE_KEYCLOAK_OAUTH_REALM}`,
  client_id: import.meta.env.VITE_KEYCLOAK_OAUTH_CLIENT_ID,
  client_secret: import.meta.env.VITE_KEYCLOAK_OAUTH_CLIENT_SECRET,
  redirect_uri: window.location.origin,
  response_type: 'code',
  scope: 'openid profile email',
  loadUserInfo: true,
  // Отключаем автоматическое обновление токена, чтобы избежать проблем с CORS
  automaticSilentRenew: false,
  // Отключаем автоматическую проверку сессии, чтобы избежать лишних запросов
  checkSessionInterval: 0,
};

