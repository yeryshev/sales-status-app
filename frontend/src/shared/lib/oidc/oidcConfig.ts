import { AuthProviderProps } from 'react-oidc-context';
import { RoutePath } from '@/shared/const/router';

export const oidcConfig: AuthProviderProps = {
  authority: `${import.meta.env.VITE_KEYCLOAK_OAUTH_URL}/auth/realms/${import.meta.env.VITE_KEYCLOAK_OAUTH_REALM}`,
  client_id: import.meta.env.VITE_KEYCLOAK_OAUTH_CLIENT_ID,
  client_secret: import.meta.env.VITE_KEYCLOAK_OAUTH_CLIENT_SECRET,
  redirect_uri: window.location.origin + RoutePath.login,
  response_type: 'code',
  scope: 'openid profile email',
  loadUserInfo: true,
};
