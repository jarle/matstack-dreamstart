import { vitePlugin as remix } from '@remix-run/dev'
import { flatRoutes } from 'remix-flat-routes'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ isSsrBuild }) => ({
  base: '/assets/',
  plugins: [
    remix({
      appDirectory: 'resources/remix_app',
      buildDirectory: 'build/remix',
      serverBuildFile: 'server.js',
      ignoredRouteFiles: ['**/.*'],
      routes: async function (defineRoutes) {
        return flatRoutes('routes', defineRoutes, {
          appDir: 'resources/remix_app',
        })
      },
    }),
    tsconfigPaths(),

  ],
  optimizeDeps: {
    esbuildOptions: isSsrBuild
      ? {
          target: 'ES2022',
        }
      : {},
  },
}))
