/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COPILOT_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
