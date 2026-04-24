import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      i18next: resolve(__dirname, './src/test/mocks/i18next.ts'),
      'react-i18next': resolve(
        __dirname,
        './src/test/mocks/react-i18next.ts',
      ),
    },
  },
});
