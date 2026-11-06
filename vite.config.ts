import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
  ssr: {
    // The build-time prerender (entry-server.tsx) runs on the Docker image's
    // Node 20, which can't import react-helmet-async's CommonJS build with
    // named imports. Bundle it into the SSR build instead of importing it
    // from node_modules at run time. (Client builds are unaffected.)
    noExternal: ['react-helmet-async'],
  },
  build: {
    // Chunk map for the prerender, which adds <link rel="modulepreload"> for
    // each page's code (scripts/prerender.mjs). Removed from dist afterwards.
    manifest: true,
    outDir: 'dist',
    sourcemap: false,
    cssCodeSplit: true,
  }
});
