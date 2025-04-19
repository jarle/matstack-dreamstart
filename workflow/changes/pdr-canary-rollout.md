# PDR: Programmatic Canary Rollout

**Document State:** `development`
**GitHub Epic:** [#355](https://github.com/jarle/youtube-summarized-website/issues/355)
**Author:** Gemini
**Branch:** `feat/canary-rollout-refinement`

## 1. Overview

Introduce a system for programmatic, percentage-based canary rollouts of features. This allows gradually enabling features for a subset of users based on their UUID, controlled via the admin panel. This integrates with the existing canary feature system described in @canary-features.mdc. Users with the specific `early-access` feature can bypass the percentage threshold for enabled rollouts.

## 2. Goals

- Allow administrators to define "Rollouts" for existing static canary features.
- Each Rollout specifies a target feature (e.g., `tts`) and a percentage (0-100).
- Users are assigned a programmatic feature (e.g., `tts-rollout`) if:
    - The rollout is enabled AND
    - (Their UUID hash falls within the configured percentage OR they have the `early-access` feature).
- Enable fine-grained control over feature exposure during development and release.
- Provide an admin UI to manage these rollouts (enable/disable, set/increase percentage).

## 3. Non-Goals

- Decreasing rollout percentages via the admin UI.
- Complex rollout strategies beyond simple percentage-based hashing (e.g., region-based, user-property-based rollouts - these should use existing rule-based features).
- UI for creating the underlying *static* features that rollouts target.

## 4. Proposed Implementation

1.  **Database Model:** Create a `CanaryRollout` model storing `target_feature_key` (string, references static features), `percentage` (integer 0-100), and `is_enabled` (boolean).
2.  **Rollout Rule:** Implement a new `RolloutFeatureRule` in `app/services/canary_feature/rules/`.
    *   It fetches all `CanaryRollout` records from the DB.
    *   It requires the user's complete feature set (including `early-access`) to be evaluated *before* this rule runs, or fetches it internally.
    *   For each **enabled** rollout:
        *   It checks if the user has the `early-access` feature.
        *   It hashes the user's UUID using a stable algorithm like `murmurhash3` with a consistent seed.
        *   If `userHasEarlyAccess || (hash(uuid, seed) % 100 < percentage)`, it adds `${target_feature_key}-rollout` to the user's feature set for the request.
    *   These programmatic keys (e.g., `tts-rollout`) are *not* added to the static `CANARY_FEATURES` list.
3.  **Admin Interface:** Add a new section/page at `/admin/rollouts` to manage `CanaryRollout` entries.
    *   List rollouts, showing target feature, percentage, and status.
    *   Allow enabling/disabling.
    *   Allow editing the percentage (only increasing allowed).
4.  **Feature Gating Update:** Modify `FeatureGate`, `useFeature`, `hasFeature`, and `hasFeatureOrFail` to accept an array of feature keys. The feature should be considered enabled if *any* of the provided keys are present in the user's feature set (OR logic). Example: `<FeatureGate featureKey={['tts', 'early-access', 'tts-rollout']}>`.

## 5. Open Questions / Concerns

-   **OR Logic in Feature Gating:** Current implementation only supports single keys. Modification is required as part of the tasks.
-   **Hashing Algorithm:** Use `murmurhash3` with a stable seed (e.g., from config/env).
-   **Admin UI Location:** Use `/admin/rollouts`.
-   **Rule Evaluation Order:** The `RolloutFeatureRule` needs access to the result of other rules/static assignments (specifically `early-access`). Need to ensure the `CanaryFeatureService` or `RuleRegistryService` provides the necessary context or evaluates rules in an order that makes `early-access` available when `RolloutFeatureRule` runs.

---
_This document is a draft and subject to change based on PO feedback._

## Detailed Tasks

Fill out one task at a time and wait for PO confirmation before proceeding to the next.

### Task 1 (✅): Create Admin UI for Canary Rollouts

**Goal:** Set up the basic structure and stubbed functionality for the admin UI to manage canary rollouts.

**Implementation Details:**
- Create a new Remix route file following the `remix-flat-routes` convention for the path `/admin/rollouts`. Suggestion: `resources/remix_app/routes/admin+/rollouts+/index.tsx`.
- Add a link to this new page in the admin sidebar/navigation component. Identify the correct layout file (likely within `resources/remix_app/routes/admin+/`) and add a navigation item pointing to `/admin/rollouts` using appropriate DaisyUI/Tailwind classes and Lucid icons if suitable.
- Create React components within the route file or preferably extracted into `#web/components/admin/rollouts/` for:
    - A table (using DaisyUI table component) to display a list of rollouts. Use hardcoded/stubbed data matching the eventual `CanaryRollout` structure (e.g., `[{ id: 'uuid1', targetFeatureKey: 'tts', percentage: 50, isEnabled: true }, ...]`). Columns: Target Feature Key, Percentage, Status (Enabled/Disabled), Actions.
    - Action buttons/links within the table for `Enable`/`Disable` and `Edit Percentage`.
    - A modal (using DaisyUI modal component) triggered by the 'Edit Percentage' button, containing a form with a number input for the percentage and a submit button.
- Implement a basic Remix `loader` function within `routes/admin+/rollouts+/index.tsx` to return the stubbed rollout data.
- Implement Remix `action` functions within the same file to handle form submissions:
    - Use separate actions distinguished by form data (e.g., an `_action` hidden input) or route conventions for Enable, Disable, and Update Percentage.
    - For now, these actions should just receive the form data (use standard `request.formData()`), log the intent and relevant IDs/values, and return a success or placeholder response. No actual backend interaction yet.
- Apply Tailwind and DaisyUI classes for styling, ensuring consistency with the existing admin panel design.

**Rules to Reference:**
- `tech-stack`: Use React, Remix (React Router), Tailwind, DaisyUI, Lucid icons.
- `remix-flat-routes`: For route file structure.
- `frontend-rules`: General frontend guidelines, component structure.
- `form-data`: Handling form submissions via Remix actions.
- `code-style`: Styling, component extraction, naming.
- `path-aliases`: Use `#web/*` alias for imports from `resources/remix_app/`.

**Verification (PO):**
- Run the Remix development server (developer should provide instructions if needed).
- Navigate to the admin section and verify the new 'Rollouts' link appears in the navigation.
- Click the link and navigate to `/admin/rollouts`.
- Verify the table displays the stubbed rollout data correctly.
- Click the 'Enable'/'Disable' buttons and check the browser's network tab or server console for the expected action log/response (developer should indicate where to look).
- Click the 'Edit Percentage' button to open the modal.
- Enter a value in the modal's form and submit. Check for the expected action log/response.
- Ensure the UI styling is consistent with other admin pages.

---

### Task 2 (✅): Update Feature Gating Logic for OR Condition

**Goal:** Modify the core feature gating functions and components to accept an array of feature keys and enable access if *any* key matches.

**Implementation Details:**
- **`app/services/canary_feature/canary_feature_service.ts`:**
    - Modify the `hasFeature` method signature to accept `featureKey: CanaryFeatureKey | CanaryFeatureKey[]`.
    - Update the implementation:
        - If `featureKey` is an array, iterate through it. Return `true` as soon as `_hasSingleFeature(user, key)` returns `true` for any key in the array. Return `false` if none match.
        - If `featureKey` is a single string, call `_hasSingleFeature(user, featureKey)`.
    - Extract the current logic of `hasFeature` into a private helper method `_hasSingleFeature(user: UserProfile, featureKey: CanaryFeatureKey): Promise<boolean>` to avoid duplication. Review caching implications: the current cache key `canary-features:has:${user.id}:${featureKey}` works for single keys. For arrays, consider either skipping the specific `hasFeature` cache (relying on the underlying `getUserFeatures` cache) or designing a more complex cache key/strategy if performance analysis deems it necessary. For now, prioritize correctness and rely on the `getUserFeatures` cache.
- **`app/models/user_profile.ts**:**
    - Modify `hasFeatureOrFail` method signature to accept `featureKey: CanaryFeatureKey | CanaryFeatureKey[]`.
    - Pass the `featureKey` (single or array) directly to the updated `canaryFeatureService.hasFeature` method. Update the `FeatureNotEnabledException` message to clearly indicate which set of features was required if an array was passed and none matched.
- **Frontend (`#web/`):**
    - Find the `FeatureGate` component (likely located via `grep` or codebase search, potentially in `#web/components/`). Modify its props to accept `featureKey: CanaryFeatureKey | CanaryFeatureKey[]`. Update its internal logic to correctly call `useFeature` with the single key or array.
    - Find the `useFeature` hook (likely in `#web/hooks/` or near `FeatureGate`). Modify it to accept `featureKey: CanaryFeatureKey | CanaryFeatureKey[]`. Update its logic: It should fetch *all* user features (using `useFeatures` or a similar existing hook/loader data) and then check if the single requested feature key exists OR if *any* of the keys in the requested array exist in the user's full feature list.
- **Type Updates:** Update any relevant type definitions (e.g., function signatures, prop types) throughout the codebase where these feature keys are passed or used to reflect the `CanaryFeatureKey | CanaryFeatureKey[]` possibility.

**Rules to Reference:**
- `canary-features`: Understand the existing feature system components being modified.
- `code-style`: Maintain code quality, handle type updates correctly (avoid `any`).
- `testing`: Add/update tests for the modified logic.
- `caching`: Consider caching implications as noted above.

---

### Task 3 (✅): Implement `RolloutFeatureRule`

**Goal:** Create the new rule that determines programmatic rollout features based on user UUID, DB configuration, and `early-access` status, returning keys defined in a dedicated `ROLLOUT_FEATURES` list, using the unified `CanaryFeatureKey` type.

**Implementation Details:**
- **Define Feature Types:**
    - Edit `app/services/canary_feature/features.ts`.
    - Keep the existing `export const CANARY_FEATURES = [...] as const;`
    - Add a new exported array: `export const ROLLOUT_FEATURES = ['tts-rollout'] as const;` (Add others later).
    - Introduce temporary internal types: `type _CanaryFeatureKey = typeof CANARY_FEATURES[number];` and `type _RolloutFeatureKey = typeof ROLLOUT_FEATURES[number];`
    - **Redefine the main exported type**: `export type CanaryFeatureKey = _CanaryFeatureKey | _RolloutFeatureKey;` This unified type should be used throughout the application.
    - Update the `evaluate` method signature in `base_feature_rule.ts` (and `feature_rule.ts`) to return `Promise<CanaryFeatureKey[]>`. Ensure other rules conform.
- **Create Rule File:** Create `app/services/canary_feature/rules/rollout_feature_rule.ts`.
- Define `RolloutFeatureRule` extending `BaseFeatureRule`.
- Implement constructor (ID: `'rollout-rule'`, name, description).
- Implement `evaluate(user: UserProfile): Promise<CanaryFeatureKey[]>` (note return type uses the redefined union `CanaryFeatureKey`):
    - **(Stubbed DB Access):** Use hardcoded rollouts `const stubbedRollouts = [{ target_feature_key: 'tts', percentage: 50, is_enabled: true }, ...]`
    - **Determine `early-access`:** Inject `CanaryFeatureService` via constructor (`@inject()`). Check `await this.canaryFeatureService.hasFeature(user, 'early-access')`. (Note: `hasFeature` must also accept the unified `CanaryFeatureKey`).
    - Get user UUID (`user.id`).
    - Install/import `murmurhash3`.
    - Get/define seed.
    - Initialize `grantedFeatures: CanaryFeatureKey[] = []`.
    - Iterate through enabled `stubbedRollouts`.
    - For each rollout:
        - Construct the potential rollout key string: `const potentialKey = \`${rollout.target_feature_key}-rollout\`;`
        - **Check if Defined in `ROLLOUT_FEATURES`:** Import `ROLLOUT_FEATURES`. Verify if `potentialKey` exists in this array.
        - If not defined, log warning and continue.
        - If defined:
            - Check `userHasEarlyAccess` status.
            - Calculate `hashResult = murmurhash.v3(user.id, seed) % 100`.
            - If `userHasEarlyAccess || hashResult < rollout.percentage`:
                - Add `potentialKey as CanaryFeatureKey` to `grantedFeatures`. (Assertion is safe; `_RolloutFeatureKey` is part of the union `CanaryFeatureKey`).
    - Return `Array.from(new Set(grantedFeatures))`.
- **Register Rule:** Add `new RolloutFeatureRule()` to `rules` array in `app/services/canary_feature/rules/index.ts`.

**Rules to Reference:**
- `canary-features`: Feature definition in `features.ts`, `BaseFeatureRule`, rule registration.
- `code-style`: Use DI, async/await, type correctness.
- `tech-stack`: AdonisJS conventions.

**Commands:**
- `npm install murmurhash3`

**Process Note:** Remember to add new `${feature}-rollout` keys to `ROLLOUT_FEATURES` in `features.ts` when configuring new rollouts.

**Verification (PO):**
- Developer should demonstrate via unit tests (mocking DB access, using stubbed DB data, using actual `ROLLOUT_FEATURES`):
    - Only `tts-rollout` is returned when conditions are met.
    - Keys for rollouts targeting features where `${feature}-rollout` is not in `ROLLOUT_FEATURES` are never returned.
    - The return type is `CanaryFeatureKey[]` (the redefined union type).
    - The manual DB lookup for `early_access` is tested.
    - All conditions are tested.

---

### Task 4 (✅): Create `CanaryRollout` Database Model & Migration (using AdonisJS `ace`)

**Goal:** Define the database structure and corresponding Lucid model for rollout configurations.

**Implementation Details:**
- **Create Model, Migration & Factory:** Generate the necessary files using the preferred AdonisJS command:
  `node ace make:model CanaryRollout --migration --factory`
  (This creates `app/models/CanaryRollout.ts`, `database/migrations/timestamp_create_canary_rollouts_table.ts`, and `database/factories/CanaryRolloutFactory.ts`)
- **Edit Migration File:** Open the generated migration file (e.g., `database/migrations/timestamp_create_canary_rollouts_table.ts`). Update the `up` method to define the `canary_rollouts` table schema:
  ```typescript
  import { BaseSchema } from '@adonisjs/lucid/schema'

  export default class extends BaseSchema {
    protected tableName = 'canary_rollouts'

    async up() {
      this.schema.createTable(this.tableName, (table) => {
        table.uuid('id').primary()
        // References a key conceptually from the CANARY_FEATURES/ROLLOUT_FEATURES lists
        // Validation that the key is valid should occur in application logic (e.g., admin UI)
        table.string('target_feature_key').notNullable()
        table.integer('percentage').unsigned().notNullable().defaultTo(0) // Range 0-100
        table.boolean('is_enabled').notNullable().defaultTo(false)

        table.timestamp('created_at').notNullable()
        table.timestamp('updated_at').notNullable()

        // Optional: Index for faster lookups of enabled rollouts
        // table.index(['is_enabled'], 'canary_rollouts_is_enabled_index')
      })
    }

    async down() {
      this.schema.dropTable(this.tableName)
    }
  }
  ```
- **Update Model File:** Open `app/models/canary_rollout.ts`. Ensure the model columns (`@column` decorators) match the migration schema (`id`, `targetFeatureKey`, `percentage`, `isEnabled`, `createdAt`, `updatedAt`). Add the `CanaryRolloutId` opaque type if desired.
- **Update Factory File:** Open `database/factories/canary_rollout_factory.ts`. Define basic states (`enabled`, `disabled`) and ensure the default definition provides sensible values, potentially referencing keys from `features.ts` for `targetFeatureKey`:
  ```typescript
  import Factory from '@adonisjs/lucid/factories'
  import CanaryRollout from '#models/canary_rollout'
  // Import feature lists if needed for realistic keys
  // import { CANARY_FEATURES } from '#services/canary_feature/features'

  export const CanaryRolloutFactory = Factory.define(CanaryRollout, ({ faker }) => {
    // const targetKey = faker.helpers.arrayElement(CANARY_FEATURES) // Example
    return {
      targetFeatureKey: 'tts', // Or use faker based on imported lists
      percentage: faker.number.int({ min: 0, max: 100 }),
      isEnabled: faker.datatype.boolean(),
    }
  })
    .state('enabled', (row) => (row.isEnabled = true))
    .state('disabled', (row) => (row.isEnabled = false))
    .build()
  ```
- **Run Migrations (Fresh):** Apply migrations to ensure a clean state, including seeding if applicable:
  `node ace migration:fresh --seed`

**Rules to Reference:**
- `database-migrations`: Use preferred `make:model --migration --factory` command, run `migration:fresh --seed`, ensure model matches migration.
- `tech-stack`: Use AdonisJS `ace` commands, Lucid ORM.
- `code-style`: Model and factory structure.
- `testing`: Importance of factories and fresh migrations for testing.

**Commands:**
- `node ace make:model CanaryRollout --migration --factory`
- `node ace migration:fresh --seed`

**Verification (PO):**
- Developer should confirm:
    - The `node ace migration:fresh --seed` command completed successfully.
    - Using a DB tool or `node ace repl`, the `canary_rollouts` table exists with the correct schema.
    - The `CanaryRollout` model in `app/models/` correctly reflects the table columns.
    - The factory can be used to create instances (e.g., `await CanaryRolloutFactory.create()`) in `node ace repl` or a test.

---

### Task 5 (✅): Connect Admin UI and `RolloutFeatureRule` to Backend Service

**Goal:** Replace stubbed data/logic in the Admin UI with real interactions via a dedicated backend service. Connect the `RolloutFeatureRule` to use the database via the `CanaryRollout` model.

**Implementation Details:**

1.  **Create `CanaryRolloutService` (Backend):**
    *   Create the service file using the AdonisJS command: `node ace make:service CanaryRollout` (this creates `app/services/CanaryRolloutService.ts`).
    *   Define the `CanaryRolloutService` class and ensure it is the `default export` of the file.
    *   Implement methods for:
        *   `listRollouts(): Promise<CanaryRollout[]>`: Fetches all rollouts, ordered.
        *   `enableRollout(id: string): Promise<CanaryRollout>`: Finds rollout by ID, sets `isEnabled = true`, saves, handles cache invalidation, returns updated rollout. Throws exception if not found.
        *   `disableRollout(id: string): Promise<CanaryRollout>`: Finds rollout by ID, sets `isEnabled = false`, saves, handles cache invalidation, returns updated rollout. Throws exception if not found.
        *   `updateRolloutPercentage(id: string, percentage: number): Promise<CanaryRollout>`: Finds rollout by ID, validates percentage (integer, `<= 100`, `>= current percentage`), updates, saves, handles cache invalidation, returns updated rollout. Throws exception if not found or validation fails.
    *   Use the `CanaryRollout` Lucid model for database interactions within this service.
    *   Use the `@inject()` decorator if injecting other services (like `@adonisjs/cache` for caching/invalidation).
    *   Register the service as a singleton in `app/services/_index.ts` with a key like `'canary_rollout_service'`.

2.  **Update Admin UI (`resources/remix_app/routes/admin+/rollouts+/index.tsx`):**
    *   **Loader Update:**
        *   Remove direct import of `CanaryRollout` model.
        *   Use the `context` object to get the service: `const rolloutService = await context.make('canary_rollout_service')`.
        *   Fetch data using the service, wrapping the call: `const { result: rollouts, error } = await withErrorHandling(async () => await rolloutService.listRollouts());`
        *   Handle the `error` case appropriately (e.g., show an error message).
        *   Return only the necessary fields from `rollouts` for the UI (inline mapping or simple DTO). Let TypeScript infer the loader return type.
    *   **Action(s) Update:**
        *   Remove direct import of `CanaryRollout` model.
        *   Use the `context` object to get the service: `const rolloutService = await context.make('canary_rollout_service')`.
        *   **Validation:** Define a VineJS schema using `intentValidation` for the possible form submissions (intents: 'enableRollout', 'disableRollout', 'updatePercentage').
            *   `enableRollout`/`disableRollout` intents should include a `rolloutId: vine.string().uuid()`. Add hidden inputs with `name="intent"` and `name="rolloutId"` to the corresponding `fetcher.Form` components on the frontend.
            *   `updatePercentage` intent should include `rolloutId: vine.string().uuid()` and `percentage: vine.number().min(0).max(100)`. Add corresponding hidden/visible inputs to the modal form on the frontend.
        *   Validate the incoming request: `const validated = await context.request.validateUsing(actionValidator)`.
        *   **Execute Action based on Intent:** Use a switch statement or if/else block on `validated.intent`:
            *   If `validated.intent === 'enableRollout'`, call `rolloutService.enableRollout(validated.rolloutId)`. Wrap this call in `withErrorHandling`.
            *   If `validated.intent === 'disableRollout'`, call `rolloutService.disableRollout(validated.rolloutId)`. Wrap this call in `withErrorHandling`.
            *   If `validated.intent === 'updatePercentage'`, call `rolloutService.updateRolloutPercentage(validated.rolloutId, validated.percentage)`. Wrap this call in `withErrorHandling`.
        *   Handle potential errors returned by `withErrorHandling` (e.g., validation errors passed down from the service, 'not found' errors). Communicate these back to the frontend (the `withErrorHandling` result can be returned from the action for the `fetcher` to use).
        *   On success, throw a redirect back to the rollouts page to refresh the data: `throw redirect('/admin/rollouts')`.

3.  **Update `RolloutFeatureRule` (`app/services/canary_feature/rules/rollout_feature_rule.ts`):**
    *   **Evaluate Method Update:**
        *   Ensure it correctly imports and uses the `CanaryRollout` model for database queries (`CanaryRollout.query().where('is_enabled', true).exec()`). This is appropriate within a backend service.
        *   Load the hashing seed from `Env`: `const seed = Env.get('ROLLOUT_SEED', 'default-fallback-seed')`. Ensure `ROLLOUT_SEED` is defined.
        *   Consider caching the `activeRollouts` query result using `@adonisjs/cache` if needed, as described previously.

**Rules to Reference:**
-   `remix-general`: Use IoC (`context.make`), `withErrorHandling`, throw redirects, avoid `json`, map DTOs, type inference, VineJS validation.
-   `remix-service-interaction`: Interact via IoC container, keep logic in services.
-   `tech-stack`: AdonisJS Lucid, Remix, Env variables, VineJS.
-   `caching`: Cache invalidation in service actions, potential caching in the rule/service.
-   `code-style`: Error handling, validation logic, service structure.
-   `database-migrations`: Ensure service aligns with the model/migration.

**Verification (PO):**
-   **Service Functionality:** Verify service methods work correctly via tests or `node ace repl`.
-   **Admin UI Functionality:** Retest all UI interactions (viewing, enabling, disabling, updating percentage) ensuring they now go through the service layer, handle errors gracefully, and redirect correctly. Check network requests and server logs if necessary.
-   **Rule Functionality:** Retest the rule's logic remains correct, fetching data from the database as expected.

---

### Task 6 (LF): Add Backend Unit Tests

**Goal:** Implement unit tests for the new backend service and rule logic to ensure correctness and prevent regressions, focusing on isolated component testing.

**Implementation Details:**
- **Test Suite:** Use the `unit` test suite (`node ace make:test --suite=unit`) as per convention for testing service/rule logic in isolation.
- **Test `CanaryRolloutService`:**
    - Create a test file: `tests/unit/canary_rollout_service.spec.ts`.
    - Mock database interactions. Since this is a unit test, avoid direct DB calls. You might need to:
        - Mock the `CanaryRollout` model itself or its query builder methods.
        - Use a testing utility or library for mocking Lucid models/queries if available, or manually stub methods.
    - Write tests for each public method (`listRollouts`, `enableRollout`, `disableRollout`, `updateRolloutPercentage`).
    - For methods that modify data, assert that the correct model methods (e.g., `save`, updates to properties) were called with the expected arguments on the mocked model.
    - Test validation logic within `updateRolloutPercentage` thoroughly.
    - Instantiate the service using `await app.container.make('canary_rollout_service')` (or instantiate directly if dependency injection isn't strictly needed for the mocks).
    - Mock any injected dependencies like `@adonisjs/cache` if cache interactions need to be verified.
- **Test `RolloutFeatureRule`:**
    - Create a test file: `tests/unit/rollout_feature_rule.spec.ts`.
    - Test the `evaluate` method in isolation.
    - Mock dependencies:
        - Mock the `CanaryRollout` model/queries to return controlled test data for enabled rollouts.
        - Mock the injected `CanaryFeatureService` (specifically the `hasFeature` method) to simulate the user having/not having `early-access`.
        - Consider mocking `murmurhash3` if specific hash results are needed for boundary condition testing, otherwise focus on logic paths based on the comparison (`< percentage`).
    - Test various scenarios:
        - Rollout enabled/disabled (controlled via mocked DB response).
        - User has/doesn't have `early-access` (controlled via mocked `CanaryFeatureService`).
        - Different percentages.
        - Target feature key exists/doesn't exist in `ROLLOUT_FEATURES`.
    - Assert that the `evaluate` method returns the expected array of `CanaryFeatureKey`s for each scenario.
    - Instantiate the rule directly, providing mocked dependencies to its constructor if needed (or use the container if mocks can be easily bound).

**Rules to Reference:**
- `testing`: Provides commands (`make:test`, `test`), suite structure, service instantiation (`app.container.make`), test naming conventions. Focus on unit testing principles (mocking).
- `canary-features`: For understanding the rule and features being tested.
- `code-style`: Apply principles to test code.

**Commands:**
- `node ace make:test CanaryRolloutService --suite=unit`
- `node ace make:test RolloutFeatureRule --suite=unit`
- `node ace test unit`

**Verification (PO):**
- Developer should demonstrate that the added tests pass when running the unit suite (`node ace test unit`).
- Review the test names, coverage, and mocking strategies to ensure the core logic of the service and rule is adequately tested in isolation.

---
