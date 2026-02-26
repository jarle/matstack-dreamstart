import User from '#models/user'
import UserService from '#services/user_service'
import UserSignUpService from '#services/user_signup_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

const validator = vine.compile(
  vine.object({
    email: vine.string().email(),
  })
)

@inject()
export default class EmailLoginController {
  constructor(
    private userService: UserService,
    private signUpService: UserSignUpService
  ) {}

  async index(http: HttpContext) {
    const { request, logger, response, auth } = http
    if (!request.hasValidSignature()) {
      return response.status(401).send('The URL signature is invalid')
    }
    const { email } = await request.validateUsing(validator)
    const profileResult = await this.userService.getOrCreateUser({ email })
    let user: User

    if (profileResult.newUser) {
      logger.info(`Created new user ${profileResult.newUser.email}`)
      await this.signUpService.postSignUp(profileResult.newUser, http)
      user = profileResult.newUser
    } else {
      user = profileResult.existingUser
    }

    await auth.use('web').login(user)
    const { redirectUrl } = await this.signUpService.postLogin(http)
    http.response.redirect(redirectUrl)
  }
}
