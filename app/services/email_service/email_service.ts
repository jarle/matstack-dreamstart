import env from '#start/env'
import app from '@adonisjs/core/services/app'
import logger from '@adonisjs/core/services/logger'
import mail from '@adonisjs/mail/services/main'
import { MarkdownFile } from '@dimerapp/markdown'
import { toHtml } from '@dimerapp/markdown/utils'
import queue from '@rlanz/bull-queue/services/main'
import edge from 'edge.js'
import { existsSync } from 'node:fs'
import SendMailJob from '../../jobs/send_mail_job.js'
import { Email, emailSpecs } from './email_specs.js'

export type EmailState = Record<string, any>

export type EmailContent = {
  title: string
  content: string
}

export type EmailChannel = 'transactional' | 'marketing' | 'update'

export default class EmailService {
  private cache: Map<Email, EmailContent> = new Map()
  readonly specs: typeof emailSpecs

  constructor() {
    this.specs = emailSpecs
    // set bullmq handler https://docs.adonisjs.com/guides/digging-deeper/mail#queueing-emails
    mail.setMessenger((mailer) => {
      return {
        async queue(mailMessage, config) {
          await queue.dispatch(SendMailJob, {
            mailMessage,
            config,
            mailerName: mailer.name as any,
          })
        },
      }
    })
    {
      const views = Object.keys(emailSpecs)
      views.forEach((view) => {
        const path = app.viewsPath(`emails/${view}.edge`)
        if (!existsSync(path)) {
          logger.error(`Email view ${view} does not exist in ${path}`)
        }
      })
    }
  }

  async send(view: Email, config: { to: string; state?: EmailState; bcc?: Boolean }) {
    const spec = emailSpecs[view]
    const render = await this.render(view, config.state)
    await mail.sendLater((message) => {
      message.from(spec.from).to(config.to).html(render.content).subject(render.title)
      if (config.bcc) {
        message.bcc(env.get('EMAIL_OWNER'))
      }
    })
  }

  async render(view: Email, state?: EmailState): Promise<EmailContent> {
    const isStatic = !state
    const cached = isStatic && app.inProduction ? this.cache.get(view) : undefined
    if (cached) {
      return cached
    }

    let content = await edge.render(`emails/${view}`, state)
    if (!content.startsWith('#')) {
      throw new Error('Static email content must start with a h1 title')
    }
    const split = content.split('\n')
    const title = split[0].replace('#', '').trim()
    split.shift()
    content = split.join('\n')
    const markdown = new MarkdownFile(content)
    await markdown.process()

    const completeEmail = await edge.render('emails/base', {
      title,
      content: toHtml(markdown).contents,
    })

    const result = { title, content: completeEmail }

    if (isStatic && app.inProduction) {
      this.cache.set(view, result)
    }

    return result
  }
}
