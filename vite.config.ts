import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: '/assets/',
  plugins: [
    reactRouter(),
    tsconfigPaths(),
  ],
  ssr: {
    // Avoid bundling adapter code
    external: ['@matstack/remix-adonisjs']
  }
})
