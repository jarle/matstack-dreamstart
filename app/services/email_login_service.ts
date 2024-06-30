import EmailService from '#services/email_service/email_service';
import env from "#start/env";
import { inject } from "@adonisjs/core";
import { HttpContext } from '@adonisjs/core/http';
import app from '@adonisjs/core/services/app';
import router from "@adonisjs/core/services/router";
import { Limiter } from '@adonisjs/limiter';
import adonisLimiter from '@adonisjs/limiter/services/main';
import MailChecker from "mailchecker";

@inject()
export default class EmailLogin {
  private limiter: Limiter

  constructor(
    private emailService: EmailService,
  ) {
    this.limiter = adonisLimiter.use('redis', {
      requests: 5,
      duration: '1 hours'
    })
  }

  public isValid(email: string) {
    return MailChecker.isValid(email)
  }

  public async registerAttempt(http: HttpContext) {
    if (!app.inProduction) return true
    return this.limiter.attempt(
      http.request.ip(), () => true
    )
  }

  public sendLoginLink(email: string) {
    const url = router
      .builder()
      .prefixUrl(env.get('APP_URL'))
      .disableRouteLookup()
      .qs({ email })
      .makeSigned('/email-login', {
        expiresIn: '1h'
      })

    this.emailService.send('email_login', {
      to: email,
      state: {
        url
      }
    })
  }
}