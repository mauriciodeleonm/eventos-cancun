import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';

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
    // Excluye las pruebas de las skills de agentes de IA instaladas en .agents/.claude
    // (no son parte del proyecto, nunca se commitean — ver .git/info/exclude).
    exclude: [...configDefaults.exclude, '.agents/**', '.claude/**'],
    // Pruebas deterministas: ignoran cualquier .env* local (ej. VITE_DATA_SOURCE=sheet
    // para probar la integración a mano) y siempre corren contra el mock data.
    env: {
      VITE_DATA_SOURCE: 'mock',
      VITE_EVENTS_CSV_URL: '',
    },
  },
});
