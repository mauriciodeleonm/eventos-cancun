/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    // Pruebas deterministas: ignoran cualquier .env* local (ej. VITE_DATA_SOURCE=sheet
    // para probar la integración a mano) y siempre corren contra el mock data.
    env: {
      VITE_DATA_SOURCE: 'mock',
      VITE_EVENTS_CSV_URL: '',
    },
  },
});
