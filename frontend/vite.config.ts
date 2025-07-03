import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/medications': 'http://localhost:8080',
      '/config': 'http://localhost:8080',
    },
  },
  base: '/micro-app-take-medicine/',
});
