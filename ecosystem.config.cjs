// eslint-disable-next-line unicorn/prefer-module
module.exports = {
  apps: [
    {
      name: 'matstack-dreamstart',
      script: 'bin/server.js',
      kill_timeout: 810000,
      cron_restart: '10 */6 * * *',
      env: {
        NODE_ENV: 'production',
      },
    },
  ]
}
