import { AuthProvider } from 'react-oidc-context';
import { oidcConfig } from '@/shared/lib/oidc/oidcConfig';
import { ReactNode } from 'react';

interface OidcProviderProps {
  children: ReactNode;
}

export const OidcProvider = ({ children }: OidcProviderProps) => {
  return <AuthProvider {...oidcConfig}>{children}</AuthProvider>;
};
