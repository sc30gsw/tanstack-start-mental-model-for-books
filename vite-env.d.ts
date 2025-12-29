interface ViteTypeOptions {
  // この行を追加することで ImportMetaEnv の型を厳密にし、不明なキーを許可しないように
  // できます。
  // strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly WORKOS_CLIENT_ID: string;
  readonly WORKOS_API_KEY: string;
  readonly WORKOS_REDIRECT_URI: string;
  readonly WORKOS_COOKIE_PASSWORD: string;
  readonly TURSO_DATABASE_URL: string;
  readonly TURSO_AUTH_TOKEN: string;
  readonly VITE_APP_URL: string;
}
