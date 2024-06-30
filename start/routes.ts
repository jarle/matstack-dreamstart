/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const EmailLoginController = () => import('#controllers/email_login_controller')

router.get('/email-login', [EmailLoginController, 'index'])

router.any('*', async ({ remixHandler }) => {
  return remixHandler()
})
  .use(
    middleware.auth({
      guards: ['web'],
    })
  )
