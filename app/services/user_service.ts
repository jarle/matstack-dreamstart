import User from '#models/user';
import db from '@adonisjs/lucid/services/db';

export default class UserService {
  async getOrCreateUser(props: { id?: string; email: string; }) {
    const existingUser = await User.findBy('email', props.email)
    if (!existingUser) {
      const trx = await db.transaction()
      try {
        const newUser = await User.create(
          {
            id: props.id,
            email: props.email,
          },
          {
            client: trx,
          }
        )
        await trx.commit()

        return {
          type: 'new_user' as const,
          newUser,
        }
      } catch (error) {
        await trx.rollback()
        throw error
      }
    }
    return {
      type: 'existing_user' as const,
      existingUser,
    }
  }

  async getUser(email: string) {
    return await User.findBy('email', email)
  }
}