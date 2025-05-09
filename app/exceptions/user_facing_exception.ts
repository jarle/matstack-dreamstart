import { Exception } from '@adonisjs/core/exceptions'

export default abstract class UserFacingException extends Exception {
  static type = 'UserFacing'
  static status: number
  readonly message: string

  constructor(props: { message: string, status: number }) {
    super(props.message, props.status)
    this.message = props.message
    this.status = props.status
  }
}