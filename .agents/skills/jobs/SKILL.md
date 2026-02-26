---
name: jobs
description: Background job conventions (BullMQ via @rlanz/bull-queue). Use when adding or editing jobs.
---

## Processing Jobs

- BullMQ is used for jobs through the library `@rlanz/bull-queue`
- New jobs are added using the command `node ace make:job my_job` and are placed in `app/jobs`
- The jobs file itself should not contain a lot of logic, but rather use services. The job file is mainly there for initiating an action and recovering a failing action.
