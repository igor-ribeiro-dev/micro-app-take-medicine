import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/medications': 'http://localhost:8080',
      '/config': 'http://localhost:8080',
    },
  },
}); 