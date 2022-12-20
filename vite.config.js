import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
import { version } from './package.json';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: './src/index.html',
        nested: './src/offline.html',
      },
    },
  },
  publicDir: '../public',
  base: './',
  outDir: './',
  appType: 'spa',
  plugins: [
    VitePWA({
      strategies: 'generateSW',
      injectRegister: 'auto',
      registerType: 'prompt',
      filename: 'service-worker.js',
      manifestFilename: 'whatdat.webmanifest',
      workbox: {
        navigateFallbackDenylist: [/^\/api/],
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
      },
      includeAssets: [
        './images/whatdat-icon-32.png',
        './images/whatdat-icon-64.png',
        './images/whatdat-icon-128.png',
      ],
      manifest: {
        name: 'What Dat?!?',
        short_name: 'What Dat?!?',
        description: 'What Dat?!?',
        icons: [
          {
            src: './images/whatdat-icon-32.png',
            type: 'image/png',
            sizes: '32x32',
          },
          {
            src: './images/whatdat-icon-48.png',
            type: 'image/png',
            sizes: '48x48',
          },
          {
            src: './images/whatdat-icon-64.png',
            type: 'image/png',
            sizes: '64x64',
          },
          {
            src: './images/whatdat-icon-72.png',
            type: 'image/png',
            sizes: '72x72',
          },
          {
            src: './images/whatdat-icon-96.png',
            type: 'image/png',
            sizes: '96x96',
          },
          {
            src: './images/whatdat-icon-128.png',
            type: 'image/png',
            sizes: '128x128',
          },
          {
            src: './images/whatdat-icon-144.png',
            type: 'image/png',
            sizes: '144x144',
          },
          {
            src: './images/whatdat-icon-512.png',
            type: 'image/png',
            sizes: '512x512',
          },
        ],
        homepage_url: 'https://whatdat.app/',
        version,
        id: '/',
        scope: '/',
        start_url: '/',
        display: 'standalone',
        lang: 'en-US',
        dir: 'auto',
        orientation: 'natural',
        background_color: '#0f2537',
        theme_color: '#2b3e50',
      },
    }),
  ],
});
