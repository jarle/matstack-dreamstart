/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const EmailLoginController = () => import('#controllers/email_login_controller')

router.get('/email-login', [EmailLoginController, 'index'])

router.any('*', async ({ reactRouterHandler }) => {
  return reactRouterHandler()
})
