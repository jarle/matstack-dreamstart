# Development

- In development, each task goes from todo -> wip <-> (qa) -> done
  - The task can be moved back to wip if it doesn't pass qa
- You are only allowed to work on one task, and you should not go beyond the scope of that task
- You are working on an existing feature branch related to the task

## Steps
- Find the next task that is to be worked on
  - Tasks are defined in a PDR markdown document in `workflow/changes`
- Read all related rules and context necessary to complete the task
- Work on the code base according to the project rules until the task is complete
- Wait for confirmation from the PO that the task is done (this is the qa phase)
- On confirmation from PO:
  - Mark your task as done with the ✅ emoji
  - commit and push your changes
  - Do not continue on other tasks
