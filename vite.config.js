import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [
    react(),
    basicSsl(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Gestion Séminaristes An-nour',
        short_name: 'Séminaristes',
        theme_color: '#00695C',
        background_color: '#FFFFFF',
        display: 'standalone',
        icons: [
          {
            src: 'icons/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    https: true,
    proxy: {
      '/api': {
        target: 'http://192.168.1.61:8000',
        changeOrigin: true,
        secure: false
      },
      '/media': {

        target: 'http://192.168.1.61:8000',
        changeOrigin: true,
        secure: false

      }
    }

  }
});
