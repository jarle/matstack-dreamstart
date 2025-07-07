import type { ApplicationService } from '@adonisjs/core/types'
import queue from '@rlanz/bull-queue/services/main'

export default class QueueProvider {
  constructor(protected app: ApplicationService) {
  }

  /**
   * Register bindings to the container
   */
  register() { }

  /**
   * The container bindings have booted
   */
  async boot() { }

  /**
   * The application has been booted
   */
  async start() {
    const isValidEnvironment = ['web', 'test'].includes(this.app.getEnvironment())
    const isReleaseCommand = Boolean(process.env.RELEASE_COMMAND)
    if (isValidEnvironment && !isReleaseCommand) {
      queue.process({ queueName: 'default' })
    }
  }

  /**
   * The process has been started
   */
  async ready() { }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {
  }
}