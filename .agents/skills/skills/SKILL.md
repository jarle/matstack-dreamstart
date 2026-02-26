---
name: skills
description: Writing or updating skills. Use when updating/adding LLM skills.
---

# Documentation

- The main purpose of the skills is to guide and inform LLM-driven development
- It is imperative that the skills are accurate and kept updated
- Update the skills when necessary to keep it relevant and correct
- Use the 80/20 principle when updating skills
- Sacrifice grammar for the sake of concision
- Skills should clearly explain the "how" something is done.
- All skills should include frontmatter with name and description.
  - The skill name should match the file name
  - description should clearly mention _when_ a skill should be used.
- All skill frontmatter is loaded into the LLM agent at start, the agent then decides what skill to load based on the skill name/description.
- It's very important that the frontmatter is properly formatted, or it won't be loaded. Avoid using colons in frontmatter fields, as they will be interpreted as mapping values and give the error `mapping values are not allowed`
- Frontmatter should not contain colons
  - Bad example: `description: Use when: Working on frontend code`
  - Correct example: `description: Use when working on frontend code`
