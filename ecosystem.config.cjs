// eslint-disable-next-line unicorn/prefer-module
module.exports = {
  apps: [
    {
      name: 'matstack-dreamstart',
      script: 'bin/server.js',
      // instances: 2, // uncomment to scale up your app
      kill_timeout: 810000,
      cron_restart: '10 */6 * * *',
      env: {
        NODE_ENV: 'production',
      },
    },
  ]
}
