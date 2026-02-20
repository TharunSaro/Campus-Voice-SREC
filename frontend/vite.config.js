import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'https://campusvoice-api-h528.onrender.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path,
      },
    },
  },
});


