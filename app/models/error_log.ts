import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ErrorLog extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare level: string

  @column()
  declare name: string | null

  @column()
  declare message: string

  @column()
  declare stack: string | null

  @column()
  declare context: any | null

  @column()
  declare hostname: string | null

  @column()
  declare pid: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}