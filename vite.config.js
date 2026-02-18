import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Se actualiza sola en el celular
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'EpikEats Rancagua',
        short_name: 'EpikEats',
        description: 'Las mejores picadas de Rancagua en tu bolsillo',
        theme_color: '#ef233c', // Color de la barra de estado (Rojo Epik)
        background_color: '#ffffff',
        display: 'standalone', // <--- ESTO ES CLAVE: Quita la barra de URL
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Para que Android adapte el icono (redondo/cuadrado)
          }
        ]
      }
    })
  ],
})