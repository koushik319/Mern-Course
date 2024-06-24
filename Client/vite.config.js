import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // build: {
  //   target: 'es2020', // Ensure es2020 or higher to support top-level await
  // },
  // esbuild: {
  //   target: 'esnext', // Ensure esnext target for modern JavaScript features
  // },
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5100/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    
  },
});