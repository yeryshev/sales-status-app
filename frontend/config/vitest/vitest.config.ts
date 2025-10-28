import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, '../..', 'src'),
    },
  },
  plugins: [react()],
  test: {
    include: ['**/*.test.tsx', '**/*.test.ts'],
    globals: true,
    environment: 'jsdom',
    setupFiles: './config/vitest/setupTests.tsx',
  },
  optimizeDeps: {
    include: ['@mui/material', '@mui/x-date-pickers'],
  },
  define: {
    'process.env.NODE_ENV': '"test"',
  },
});
