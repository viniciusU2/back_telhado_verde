/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_INMET_API_URL?: string
  readonly VITE_USE_MOCK_DATA?: string
  readonly VITE_STATION_TIMEZONE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
