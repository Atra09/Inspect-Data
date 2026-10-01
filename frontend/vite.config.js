import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    host: true, // Listen on all local IP addresses (192.168.x.x)
    port: 5175,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3003',
        changeOrigin: true,
        secure: false,
      },
      '/images': {
        target: 'http://127.0.0.1:3003',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
