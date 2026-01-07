import "dotenv/config";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/*"],
      manifest: false,
      injectManifest: {
        swSrc: "/service-worker.js",
        globPatterns: ["**/*.{js,css,html,png,svg}"],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
    }),
  ],
  server: {
    host: process.env.CLIENT_HOST,
    port: process.env.CLIENT_PORT,
    proxy: {
      "/api": {
        target: process.env.PROXY_TARGET,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
