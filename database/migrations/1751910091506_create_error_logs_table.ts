import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'error_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('level', 20).notNullable()
      table.string('name').nullable()
      table.text('message').notNullable()
      table.text('stack').nullable()
      table.json('context').nullable()
      table.string('hostname').nullable()
      table.integer('pid').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}