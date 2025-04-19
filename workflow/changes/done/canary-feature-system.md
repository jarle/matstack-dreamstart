# User Canary Feature System

## Description

Implement a canary feature system that allows for conditional feature enabling for users. The system will support both static features (stored in the database and linked to users) and programmatically derived features (implied from user state). Static features must be defined through database migrations only and cannot be modified through the UI. Features will be assigned to users through the admin interface, and UI elements will be conditionally displayed based on feature availability. The implementation will use full stack React components to handle both frontend and backend aspects of the feature system.

## Tasks

### Task 1: Create Feature Service Stub ✅

Create a fully functional stub service for managing canary features that the UI components can interact with immediately:

1. Use `node ace make:service CanaryFeatureService` to create a new service class under `app/services`

2. Define the service interface with the following methods:
   - `hasFeature(user: UserProfile, featureKey: string): Promise<boolean>` - Check if a user has a specific feature enabled
   - `getUserFeatures(user: UserProfile): Promise<string[]>` - Get all feature keys enabled for a user
   - `getAllFeatures(): Promise<{ key: string, name: string, description?: string }[]>` - Get all available features
   - `assignFeatureToUser(user: UserProfile, featureKey: string): Promise<void>` - Assign a feature to a user
   - `removeFeatureFromUser(user: UserProfile, featureKey: string): Promise<void>` - Remove a feature from a user
   - `getUsersWithFeature(featureKey: string): Promise<UserProfile[]>` - Get all users with a specific feature

3. Implement using in-memory data structures:
   - Create private class properties to store features and user assignments:
     ```typescript
     private features: Map<string, { key: string, name: string, description?: string }> = new Map();
     private userFeatures: Map<string, Set<string>> = new Map(); // userId -> Set of feature keys
     ```
   - Initialize with sample data including the 'admin' feature
   - Add a private method for programmatic feature derivation that checks for admin role
   - Implement all public methods to work with these in-memory structures

4. Register the service as a singleton in `app/services/_index.ts`

5. Add proper TypeScript interfaces and documentation

The developer should read the `adding-services` rules before implementing this task to ensure correct service implementation and registration. This implementation should be solid enough to build the UI upon without waiting for database integration.

### Task 2: Define Feature Keys as String Literals ✅

Create a TypeScript type definition for available features to ensure type safety and predictability:

1. Create a new file `app/types/features.ts`:
   ```typescript
   export const CANARY_FEATURES = ['admin', 'beta_ui'] as const
   export type CanaryFeatureKey = typeof CANARY_FEATURES[number]
   ```

2. Update the CanaryFeatureService to use the new types:
   ```typescript
   import type { CanaryFeatureKey } from '#/types/features'
   
   class CanaryFeatureService {
     async hasFeature(user: UserProfile, featureKey: CanaryFeatureKey): Promise<boolean>
     async getUserFeatures(user: UserProfile): Promise<CanaryFeatureKey[]>
     async getAllFeatures(): Promise<{ key: CanaryFeatureKey, name: string, description?: string }[]>
     async assignFeatureToUser(user: UserProfile, featureKey: CanaryFeatureKey): Promise<void>
     async removeFeatureFromUser(user: UserProfile, featureKey: CanaryFeatureKey): Promise<void>
     async getUsersWithFeature(featureKey: CanaryFeatureKey): Promise<UserProfile[]>
   }
   ```

3. Update the FeatureGate component to use the new types:
   ```typescript
   interface FeatureGateProps {
     featureKey: CanaryFeatureKey
     children: React.ReactNode
     fallback?: React.ReactNode
   }
   ```

4. Update the feature hooks to use the new types:
   ```typescript
   function useFeature(featureKey: CanaryFeatureKey): boolean
   function useFeatures(): CanaryFeatureKey[]
   ```

5. Add documentation in the types file explaining:
   - How to add new features (must be added to CANARY_FEATURES array)
   - That features must have corresponding database migrations
   - That TypeScript will enforce valid feature keys at compile time

The developer should ensure that all feature keys used in the codebase are type-safe and that new features are properly added to both the type definition and the database through migrations.

### Task 3: Create Feature-Gated UI Component with Hooks ✅

Create a full stack React component in `resources+/FeatureGate.tsx` that includes both the UI component and hooks for feature flag checking:

1. Create the loader function that:
   - Retrieves the current user from the session
   - Uses the CanaryFeatureService to get the user's features
   - Returns the user's active features and all available features

2. Export the main FeatureGate component that:
   - Accepts `featureKey` prop to specify which feature to check
   - Accepts `children` prop with the content to conditionally render
   - Accepts `fallback` prop (optional) for content to show when feature is disabled
   - Shows children when feature is enabled, fallback content when disabled

3. Export custom hooks from the same file:
   - `useFeature(featureKey: string): boolean` - A hook that returns whether a feature is enabled
   - `useFeatures(): string[]` - A hook that returns all enabled feature keys for the current user

4. Implement proper loading and error states:
   - Show a skeleton or placeholder during loading phase
   - Gracefully handle error states
   - Memoize results to avoid unnecessary re-renders

5. Add example usage documentation in component comments:
   ```tsx
   // Example for FeatureGate component:
   <FeatureGate featureKey="admin">
     <AdminPanel />
   </FeatureGate>
   
   // Example for hooks:
   const isAdmin = useFeature('admin');
   if (isAdmin) {
     // Render admin-only UI
   }
   ```

The developer should read the `full-stack-components` rules before implementing this task to ensure correct implementation of the full stack component pattern with colocated hooks.

### Task 4: Integrate Feature Assignment into Admin UI ✅

Add feature assignment capabilities to the existing admin interface:

1. Create a new admin route for viewing features:
   - Create a route file at `routes/admin/features.tsx`
   - Implement a page to list all features with their descriptions
   - Display how many users are assigned each feature
   - Include a clear notice that features can only be added/modified through migrations

2. Create a new admin route for managing feature assignments:
   - Create a route file at `routes/admin/users/$userId/features.tsx`
   - Implement a page to show and modify a user's feature assignments
   - Add UI elements to assign and remove features from a user

3. Add feature assignment UI elements:
   - Create a checkbox list to assign existing features to users
   - Display both assigned and available features
   - Implement search/filter functionality for large feature lists
   - Show a badge or indicator for programmatically derived features that can't be assigned/unassigned

4. Add navigation links in the admin UI:
   - Add a "Features" link in the admin sidebar
   - Add a "Manage Features" link on the user detail page

5. Protect all feature management UI with the 'admin' feature:
   - Use the FeatureGate component to conditionally render the feature management UI
   - Ensure only administrators can access feature management routes

The developer should create a clean, user-friendly interface that follows the existing admin UI patterns and styling, while making it clear that features themselves can only be added through code changes and migrations.

### Task 5: Create Database Models and Migrations for Canary Features ✅

Create the necessary database models and migrations for storing canary features:

1. Create the `CanaryFeature` model with its migration in one step:
   - Execute `node ace make:model CanaryFeature --migration --factory`
   - Define model fields in the generated model file:
     - `key`: String (unique identifier for the feature)
     - `name`: String (human-readable name)
     - `description`: Text (optional explanation)
   - Update the migration file to create the table with:
     - `id` as primary key
     - `key` as unique string field 
     - `name` as string field
     - `description` as nullable text field
     - Timestamps for `created_at` and `updated_at`

2. Create migration for the pivot table (without creating a model):
   - Execute `node ace make:migration create_user_canary_features_table`
   - Create the pivot table with:
     - `id` as primary key
     - `user_id` as foreign key with index
     - `canary_feature_id` as foreign key with index
     - Timestamps for `created_at` and `updated_at`
     - Add a unique constraint on the combination of `user_id` and `canary_feature_id`

3. Implement model relationships:
   - In UserProfile model: Add `canaryFeatures` many-to-many relation to CanaryFeature
     ```typescript
     @manyToMany(() => CanaryFeature, {
       pivotTable: 'user_canary_features',
     })
     declare canaryFeatures: ManyToMany<typeof CanaryFeature>
     ```
   - In CanaryFeature model: Add `users` many-to-many relation to UserProfile
     ```typescript
     @manyToMany(() => UserProfile, {
       pivotTable: 'user_canary_features',
     })
     declare users: ManyToMany<typeof UserProfile>
     ```

4. Create a migration for the 'admin' feature:
   - Execute `node ace make:migration add_admin_canary_feature --alter`
   - In the migration's `up` method, add:
     ```typescript
     public async up() {
       await db.table('canary_features').insert({
         key: 'admin',
         name: 'Administrator Access',
         description: 'Enables administrator functionality',
         created_at: DateTime.now().toSQL(),
         updated_at: DateTime.now().toSQL(),
       })
     }
     ```
   - In the migration's `down` method, add:
     ```typescript
     public async down() {
       await db.from('canary_features').where('key', 'admin').delete()
     }
     ```

5. Run `node ace migration:fresh` to verify the migrations work correctly

The developer should read the `database-migrations` rule before implementing this task to ensure proper database changes. Note that features should only be added through migrations and not through the application UI.

### Task 6: Implement CanaryFeatureService with Database Integration ✅

Update the CanaryFeatureService to use the database models and implement programmatic feature derivation:

1. Refactor the CanaryFeatureService to:
   - Import and use the CanaryFeature model and UserProfile model
   - Replace in-memory data structures with database queries:
     - `hasFeature`: Check if a feature is enabled for a user (combining database features and rules-based features internally)
     - `getUserFeatures`: Get all features enabled for a user (combining both types without exposing their source)
     - `getAllFeatures`: Fetch all available features from database
     - Update all other methods to use the database

2. Ensure internal programmatic feature derivation:
   - Maintain the same behavior for programmatically derived features
   - Make sure the implementation details of how features are derived remain internal to the service
   - Ensure the service has the same interface so UI components don't need to change

3. Create service unit tests:
   - Create tests using `node ace make:test CanaryFeatureService --suite=unit`
   - Use database transactions to rollback changes:
     ```typescript
     group.each.setup(async () => {
       await db.beginGlobalTransaction()
       return () => db.rollbackGlobalTransaction()
     })
     ```
   - Test with the `testUser` from bootstrap.ts
   - Test the complete public interface (not implementation details):
     - Test that users get appropriate features based on database assignments
     - Test that rules-based features work without exposing how they're derived
     - Test feature assignment/removal operations

The developer should read both the `adding-services` and `testing` rules before implementing this task to ensure proper service implementation and testing.

### Task 7: Implement Redis Caching for Feature System (✅)

Add Redis caching to the CanaryFeatureService to improve performance and reduce database load:

1. Import the caching service:
   ```typescript
   import cache from "@adonisjs/cache/services/main"
   ```

2. Implement caching for expensive operations:
   - Cache `getAllFeatures` with a reasonable TTL:
     ```typescript
     async getAllFeatures() {
       return await cache.getOrSet({
         key: 'canary-features:all',
         factory: async () => {
           // Existing database query to fetch all features
         },
         ttl: 60 * 60, // Cache for 1 hour
       })
     }
     ```
   - Cache user feature results with user-specific keys:
     ```typescript
     async getUserFeatures(user: UserProfile) {
       return await cache.getOrSet({
         key: `canary-features:user:${user.id}`,
         factory: async () => {
           // Existing implementation
         },
         ttl: 60 * 15, // Cache for 15 minutes
       })
     }
     ```
   - Cache feature checks for specific user-feature combinations:
     ```typescript
     async hasFeature(user: UserProfile, featureKey: string) {
       return await cache.getOrSet({
         key: `canary-features:has:${user.id}:${featureKey}`,
         factory: async () => {
           // Existing implementation
         },
         ttl: 60 * 15, // Cache for 15 minutes
       })
     }
     ```

3. Implement cache invalidation:
   - Use tag-based cache invalidation for more efficient clearing
   - Add tags to group related cache entries 
   - Clear user-specific caches when their feature assignments change
   - Add a method to clear all feature caches when needed

The developer should read the `caching` rule before implementing this task to ensure proper use of the Redis caching system.

### Task 8: Create Rule Registry Service Stub (✅)

Create a stub service to manage and execute feature rules that UI components can use immediately:

1. Create a new file `app/services/canary_feature/features.ts` with:
   - Define `CANARY_FEATURES = ['admin'] as const`
   - Define `CanaryFeatureKey` type from the constant

2. Create a new stub service file `app/services/canary_feature/rule_registry_service.ts` with methods:
   - `getRules()`: Returns all registered rules (stubbed data)
   - `getRule(id)`: Finds a rule by id (stubbed data)
   - `applyRules(user)`: Returns features based on simple user criteria
   - `getRuleApplications(user)`: Returns which rules grant which features (stubbed data)

3. Implement using in-memory data structures:
   - Use hardcoded array of rule definitions
   - Create a simple rule application logic for the admin feature
   - Return meaningful but static data from all methods

4. Register the service in the container in `app/services/_index.ts`

5. Ensure this stub service provides:
   - Interface stability for UI components
   - Meaningful test data
   - Easy replacement with real implementation later

This service should provide all the functionality needed for the UI components without requiring the full rule implementation yet.

### Task 9: Add Rule Visualization in Admin UI (✅)

Update the admin interface to show and explain rule-based features using the stub service:

1. Modify the route file `routes/admin/features.tsx` to:
   - Get rule information from the RuleRegistryService
   - Pass rule data to the UI
   - Show a table of rules with their descriptions

2. Add a section to the features admin page that:
   - Explains that rules automatically grant features
   - Shows a table listing all rules and their purpose
   - Makes it clear that rules cannot be modified through the UI

3. Modify the user features page in `routes/admin/users/$userId/features.tsx` to:
   - Get rule-provided features for the user from the service
   - Display which rules are granting which features
   - Clearly differentiate between rule-based and manually assigned features
   - Prevent modification of rule-provided features

4. Ensure the UI design:
   - Is consistent with the existing admin interface
   - Uses appropriate UI components (tables, badges, alerts)
   - Provides clear explanation text for administrators

The developer should ensure the UI clearly separates rule-based features from manually assigned ones and makes this distinction obvious to administrators.

### Task 10: Create Feature Rule System Base Classes (todo)

Create the base interface and classes for the rule-based feature system:

1. Create a new directory `app/services/canary_feature/rules` to house all feature rules.

2. Create a base interface file `app/services/canary_feature/rules/feature_rule.ts` with:
   - An interface defining the contract for all feature rules
   - Properties: `id` (string), `name` (string), `description` (string)
   - Method signature: `evaluate(user: UserProfile): Promise<CanaryFeatureKey[]>`

3. Create a base abstract class in `app/services/canary_feature/rules/base_feature_rule.ts` that:
   - Implements the FeatureRule interface
   - Has a constructor accepting id, name, and description
   - Declares abstract evaluate method

4. Create test files for the base classes that verify:
   - The base classes work as expected
   - Derived classes can be properly instantiated
   - The type system enforces the correct contract

The developer should ensure the design allows for easy addition of new rules in the future and that the structure makes it straightforward to understand how the rule system works.

### Task 11: Implement Rule-Based Feature Derivation (todo)

Create the concrete rule implementations and update the service to use them:

1. Create an AdminRule implementation in `app/services/canary_feature/rules/admin_rule.ts` that:
   - Extends BaseFeatureRule
   - Provides meaningful id, name, and description
   - Implements the evaluate method to grant 'admin' feature to specific emails (e.g., 'jarle.mathiesen@gmail.com')

2. Create a placeholder rule for future use in `app/services/canary_feature/rules/premium_user_rule.ts` that:
   - Extends BaseFeatureRule
   - Provides proper id, name, and description
   - Implements an evaluate method that currently returns an empty array (placeholder for future)

3. Create an index file to export all rules in `app/services/canary_feature/rules/index.ts`:
   - Export an array of all rule instances
   - Export all rule types
   - Make it easy to add new rules in the future

4. Update the RuleRegistryService to use the actual rule implementations:
   - Import the rule array from the index file
   - Replace hardcoded rule logic with actual rule application
   - Maintain the same service interface so UI components don't need to change

5. Create test files for the rules that verify:
   - AdminRule grants admin feature to the specified email
   - AdminRule doesn't grant features to other users
   - PremiumUserRule behaves as expected
   - The registry correctly applies all rules

The developer should ensure that each rule is well-tested and that rules are isolated and focused on a single responsibility, following the testing practices outlined in the testing rule.

### Task 12: Integrate Rule System with Caching and CanaryFeatureService (✅)

Update the services to use caching and integrate with the existing CanaryFeatureService:

1. Add caching to RuleRegistryService:
   - Use cache keys with `canary-features:` prefix
   - Use appropriate tags for cache invalidation
   - Set reasonable TTL values for different query types

2. Refactor the CanaryFeatureService to use the RuleRegistryService:
   - Add a method to get the RuleRegistryService instance
   - Update `hasFeature()` to check rule-based features first, then database assignments
   - Update `getUserFeatures()` to combine features from rules and database
   - Add method `getUserRuleFeatures()` to get information about rule-granted features

3. Update cache invalidation across both services:
   - Ensure consistent cache tag naming
   - Provide methods to invalidate user-specific caches
   - Make sure changes in one service trigger invalidation in the other when needed

4. Add tests for the service integration:
   - Test that users with admin email get the admin feature through rules
   - Test that normal users don't get admin features
   - Test that manually assigned features work alongside rule features
   - Verify cache behavior works as expected

5. Update the assignFeatureToUser method to prevent assignment of features already provided by rules.

The developer should ensure that the integration maintains backwards compatibility with existing code while leveraging the new rule system, with special attention to cache invalidation and performance. 