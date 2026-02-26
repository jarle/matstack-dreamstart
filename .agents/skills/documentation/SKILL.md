---
name: documentation
description: Writing documentation. Use when key functionality is added or changed
---

# Documentation

- `docs/` contains documentation related to the application and service
- The main purpose of the documentation is to guide and inform future development and troubleshooting
  - Only document the system as-is and assume this is the state that it will stay in - do not mention non-goals or future plans.
- It is imperative that the documentation reflects the real system
- Avoid referring to low-value information that quickly becomes outdated
  - Example: specific versions etc
- Update the documentation when necessary to keep it relevant and correct
- Use the 80/20 principle when updating documentation
- Sacrifice grammar for the sake of concision
- Documentation should only explain the "why"/"what" and _not_ the "how".
  - The "how" is explained by the code itself
  - The documentation should be readable by non-technical people
- The docmentation focuses on overall architecture, flows, and system design - not implementation details that change over time
- All documentation should be linked from somewhere, starting with `docs/readme.md`
  - This makes the docs browsable on GitHub

### Formatting

- Markdown: sentences are always put on separate lines for cleaner git diffs.
