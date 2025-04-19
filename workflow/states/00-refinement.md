# Refinement

Refinement is started when the product owner (PO) queries for a new change to the application
- The outcome is a detailed document containing all tasks related to the feature
	- At the end we convert update the epic issue with an updated title and description
- The PRD doc should live in the directory `workflow/changes`

## Steps

Each step required acceptance from the PO before you can proceed.

1. Find the correct GitHub epic issue to work on using GitHub MCP
	- If no epic is specified, find one marked with the `epic`, without a `refinement-complete` label
1. Gather requirements and create draft document
1. Create task outline
1. Create detailed technical description for each task
	- Fill in one task at a time and wait for the PO to accept
1. Finish document

### Step 1: Gather requirements

- The PO will first prompt for a change to the application
- It is your job to:
	- Ask the PO as many follow-up questions as needed to flesh out details
	- Consider alternatives
	- Ultimately decide on the best way to achieve what the PO wants
- The PO doesn't know each detail of what is to be done upfront, it is an iterative conversation between you two
- When you are confident that you know what the PO wants, proceed to create the PDR draft with a proposed task list
	- Create the new branch for the change
	- Copy `workflow/changes/pdr-template.md` to a new document and fill out
	- The task list should be a simple bullet point list of tasks for now
		- Ask the PO for input on the task list

### Populate task outline

- Tasks will be worked on in the order they are defined
	- This makes ordering very important when populating tasks
- Consider low-frequency (LF) vs high-frequency (HF) changes: 
	- LF changes are lasting and hard to revert/change (such as database migrations, service implementations)
	- HF changes are easy to change (such as frontend components) and can be rapidly changed without much consequence
- Our way of working is always starting with implementing HF changes ASAP, and _stub_ the LF changes where possible
	- Wait with database migrations until the last moment
- Each task should be independently verifiable:
	- We should be able to interact with the frontend components

#### Task ordering suggestion

Based on previous work, this is a sensible ordering of tasks based on the HF/LF principle.
Remove those that don't apply:

- Create necessary stub services with complete public interface needed for the change
	- Make the fully functional
	- Inject other services as needed
	- Use in-memory js data structures to hold state if necessary
	- Only implement the minimal public API needed for the service
	- Don't add tests for these stubs
- Build/modify pages and UI components to use the stub services
	- Break up the tasks depending on how complicated the components are
	- The PO should only need to verify one view per task
- Create necessary migrations/models/factories
	- Verify that migrations and seeding works
- Replace stub implementations of services with real database/service/api interactions
	- Create tests for the public api
	- Tests will implicitly verify that the models and migrations are correctly configured. If models+migrations are not, they can be corrected since the code is not in production yet
- Add caching to the service(s) where performance is important
	- Our primary use case for caching is reducing database load for frequent operations
	- Avoid caching if not necessary as it introduces complexity

### Create detailed descriptions of each task

- Each junior developer will start their task with a blank context
- The tasks must be clearly specified so they can be worked on by junior developers
- The tasks should be technically detailed and mention concrete files or parts of the system that should be changed
- The tasks should specify any relevant commands that needs to be run
- For each task it is important to instruct the developer to what rules specific from `.cursor/rules/index.mdc` that should be read.
	- Add the most important/relevant rules into the task itself so the developer doesn't make any mistakes
	- You have much more background context than the developer, so it's important that you convey all relevant information/details to avoid developer mistakes

### Finish PDR document

You can finish the PDR when all tasks in the task outline has been filled out and is accepted by the PO.

#### Steps
- Ask permission from the PO to complete refinement
- Add the "refinement-complete" tag to the GitHub issue
- Change the PDR state to development
- Commit and push the updated branch
- Create a PR for the feature to main using MCP

Refinement is now complete! Your task is done.