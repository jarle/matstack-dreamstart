import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  redirectTo = '/login'

  openRoutes = [
    this.redirectTo,
    '/__manifest',
    '/check-email',
    '/register',
    '/email-login',
  ]

  async handle(
    ctx: HttpContext,
    next: NextFn,
  ) {
    await ctx.auth.check()
    return next()
  }
}