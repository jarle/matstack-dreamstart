import UserProfile from '#models/user'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import EmailService from './email_service/email_service.js'

@inject()
export default class UserSignUpService {
  constructor(private emailService: EmailService) {}

  async postSignUp(user: UserProfile, http: HttpContext) {
    http.logger.info(`Created new user ${user.id}`)
    this.emailService.send('welcome', { to: user.email })
  }

  async postLogin(http: HttpContext) {
    let redirectUrl: string = http.session.pull('post-login-redirect') || '/'
    if (redirectUrl.startsWith('/logout')) {
      redirectUrl = '/'
    }
    http.logger.info(`Post-login redirect: ${redirectUrl}`)

    const url = new URL(redirectUrl, http.request.completeUrl())

    return {
      redirectUrl: url.toString(),
    }
  }
}
