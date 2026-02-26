---
name: database-migrations
description: Lucid models/migrations conventions and safe workflows. Use when changing schema or models.
---

## Database Migrations

- Use AdonisJS Lucid to handle migrations and database models. Lucid is based on Knex.
- All models are placed in `app/models`, and all database interaction goes through these models.
- All database migrations are placed in `database/migrations`.
- For creating new migrations only: `node ace make:migration <table name>`
  - `--alter` to alter existing table, `--create` to create new
- For creating both migration and model at the same time (preferred): `node ace make:model --migration [--factory] User`
  - If you need seed data, the `--factory` flag can be used.
- Models should be updated to reflect the content of migrations
- Run `node ace migration:fresh --seed` instead of just `migration:run` when testing database changes to ensure a clean state.
- Always run your migrations before proceeding to make sure they work correctly.
- There is no need to create models for pivot tables
  - [See relationship reference if needed](resources/lucid-relationships.md)
- AdonisJS has naming conventions for how models and database tables+columns link
  - If you follow the conventions there is no need to specify column names in Model relationships
  - By default, the foreignKey is the camelCase representation of the parent model name and its primary key
- Creating a unit test for a service that relies on a specific model is a great way to see that your migration and model is configured correctly. Use the test to verify and correct the configuration. Errors at this point are most likely because you didn't follow proper convention when it comes to relationships.
- Migrations might output error because it cannot release the lock. That does not matter, continue anyway
- We prefer either UUID IDs or nanoid for primary keys
  - For models with an UUID ID, have them compose `UUIDModel` from `app/models/mixins.js`
- Prefer composing mixins for auto generated timestamps instead of having them directly in the model
