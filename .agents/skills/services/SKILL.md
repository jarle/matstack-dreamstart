---
name: services
description: AdonisJS service patterns (creation, registration, components). Use when adding or modifying services.
---

# Services

- The React Router frontend uses services in loaders/actions through the AdonisJS IoC container.
- Service classes are located under `app/services` (path alias `#services`)
- Services should be added with the command `node ace make:service ServiceName` which will instantiate a new class in the `#services` folder.
  - Make the service the default export from its own file
- Simple services can be one file, more intricate services get their own folder when more files are required (such as components, utils).
- The `@inject()` class decorator should be used to inject other services when needed.
- After adding a new service, it should be registered as a singleton in the IoC container at `app/services/_index.ts`
  - Use snake_case for the registration key
- Service methods should prefer to take the full User model instead of just userId

## Service design

- Services are built using Components.
- Services represents the _what_, Components represents the _how_ it's done.
- Both services and components are classes.
- Components can be placed in the same file as the main service if they are specific to that service
  - There's no CLI command for adding components
- One service can rely on many components

- Components are injected into services, and their main purpose is to be swapped with component fakes during testing.
  - This replaces the need for using mocking in tests.
- Fakes can be declared directly in test files if they are only relevant locally
- Component fakes can be stateful objects
