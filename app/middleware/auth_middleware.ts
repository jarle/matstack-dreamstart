import type { Authenticators } from '@adonisjs/auth/types'
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
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    const bearerToken = ctx.request.qs()['bearerToken']

    if (bearerToken) {
      // This allows us to specify the bearer token in query parameters (iframes etc)
      ctx.request.headers()['authorization'] = `Bearer ${bearerToken}`
    }

    if (this.openRoutes.some((r) => ctx.request.parsedUrl.pathname?.startsWith(r))) {
      await ctx.auth.check()
      return next()
    }
    await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })
    return next()
  }
}