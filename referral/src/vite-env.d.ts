/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KEYCLOAK_OAUTH_URL: string
  readonly VITE_KEYCLOAK_OAUTH_REALM: string
  readonly VITE_KEYCLOAK_OAUTH_CLIENT_ID: string
  readonly VITE_KEYCLOAK_OAUTH_CLIENT_SECRET: string
  readonly VITE_GET_DEALS: string
  readonly VITE_MAIN_CRM: string
  readonly VITE_SC_CRM: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

