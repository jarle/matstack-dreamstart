import ErrorLog from '#models/error_log'
import { HttpContext } from '@adonisjs/core/http'
import os from 'node:os'

export class ErrorLogService {
  /**
   * Log an error to the database
   */
  async logError(error: Error, context?: HttpContext) {
    try {
      await ErrorLog.create({
        level: 'error',
        name: error.name ?? error.constructor.name,
        message: error.message,
        stack: error.stack ?? null,
        context: {
          url: context?.request.url(),
          method: context?.request.method(),
          ip: context?.request.ip(),
          userAgent: context?.request.header('user-agent'),
          userId: context?.auth?.user?.id,
          timestamp: new Date().toISOString(),
        },
        hostname: os.hostname(),
        pid: process.pid
      })
    } catch (dbError) {
      // Log to stderr to avoid infinite loops
      console.error('Failed to save error log to database:', dbError)
    }
  }
}

export default ErrorLogService