/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DATA_SOURCE?: 'mock' | 'sheet';
  readonly VITE_EVENTS_CSV_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
