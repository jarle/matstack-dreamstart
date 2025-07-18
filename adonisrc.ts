import { defineConfig } from '@adonisjs/core/app'

export default defineConfig({
  /*
  |--------------------------------------------------------------------------
  | Commands
  |--------------------------------------------------------------------------
  |
  | List of ace commands to register from packages. The application commands
  | will be scanned automatically from the "./commands" directory.
  |
  */
  commands: [
    () => import('@adonisjs/core/commands'),
    () => import('@adonisjs/lucid/commands'),
    () => import('@matstack/remix-adonisjs/commands'),
    () => import('@adonisjs/mail/commands'),
    () => import('@adonisjs/cache/commands'),
    () => import('adonis-sail/commands'),
    () => import('@rlanz/bull-queue/commands')
  ],

  /*
  |--------------------------------------------------------------------------
  | Service providers
  |--------------------------------------------------------------------------
  |
  | List of service providers to import and register when booting the
  | application
  |
  */
  providers: [
    () => import('@adonisjs/core/providers/app_provider'),
    () => import('@adonisjs/core/providers/hash_provider'),
    {
      file: () => import('@adonisjs/core/providers/repl_provider'),
      environment: ['repl', 'test'],
    },
    () => import('@adonisjs/core/providers/vinejs_provider'),
    () => import('@adonisjs/core/providers/edge_provider'),
    () => import('@adonisjs/session/session_provider'),
    () => import('@adonisjs/shield/shield_provider'),
    () => import('@adonisjs/static/static_provider'),
    () => import('@adonisjs/vite/vite_provider'),
    () => import('@matstack/remix-adonisjs/remix_provider'),
    () => import('#providers/service_provider'),
    () => import('@adonisjs/redis/redis_provider'),
    () => import('@adonisjs/lucid/database_provider'),
    () => import('@adonisjs/mail/mail_provider'),
    () => import('@adonisjs/auth/auth_provider'),
    () => import('@adonisjs/cache/cache_provider'),
    () => import('@rlanz/bull-queue/queue_provider'),
    () => import('@adonisjs/limiter/limiter_provider'),
    () => import('#providers/queue_provider')
  ],

  /*
  |--------------------------------------------------------------------------
  | Preloads
  |--------------------------------------------------------------------------
  |
  | List of modules to import before starting the application.
  |
  */
  preloads: [() => import('#start/routes'), () => import('#start/kernel')],

  /*
  |--------------------------------------------------------------------------
  | Tests
  |--------------------------------------------------------------------------
  |
  | List of test suites to organize tests by their type. Feel free to remove
  | and add additional suites.
  |
  */
  tests: {
    suites: [
      {
        files: ['tests/unit/**/*.spec(.ts|.js)'],
        name: 'unit',
        timeout: 2000,
      },
      {
        files: ['tests/functional/**/*.spec(.ts|.js)'],
        name: 'functional',
        timeout: 30000,
      },
    ],
    forceExit: false,
  },
  metaFiles: [
    {
      pattern: 'resources/views/**/*.edge',
      reloadServer: false,
    },
    {
      pattern: 'public/**',
      reloadServer: false,
    },
  ],
  assetsBundler: false,
  hooks: {
    onBuildStarting: [() => import('@matstack/remix-adonisjs/build_hook')],
  },
})
