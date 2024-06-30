import mail from '@adonisjs/mail/services/main'
import { MessageBodyTemplates, NodeMailerMessage } from '@adonisjs/mail/types'
import { Job } from '@rlanz/bull-queue'

interface SendMailJobPayload {
  mailerName: 'smtp'
  mailMessage: {
    message: NodeMailerMessage
    views: MessageBodyTemplates
  }
  config: any
}

export default class SendMailJob extends Job {
  // This is the path to the file that is used to create the job
  static get $$filepath() {
    return import.meta.url
  }

  /**
   * Base Entry point
   */
  async handle(payload: SendMailJobPayload) {
    const { mailMessage, config, mailerName } = payload

    await mail.use(mailerName).sendCompiled(mailMessage, config)
  }

  /**
   * This is an optional method that gets called when the retries has exceeded and is marked failed.
   */
  async rescue() { }
}
