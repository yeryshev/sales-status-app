import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        // secure: false,
      },
      // '/ws': {
      //   target: 'ws://localhost:8000',
      //   ws: true,
      // },
    },
  },
  plugins: [react()],
});
