# Text-to-Speech for Summary Content

- Branch name: feature/tts-summary
- Type: Feature development
- State: Development

## Description

Add text-to-speech functionality to summary content that allows users to listen to any section of a summary. Users can click on any section or highlight text to play that specific content through a minimalistic audio player. The feature will be implemented as a paid feature behind a canary feature flag, initially available only to specific users. Non-subscribers will see the player controls but will be prompted to start a 7-day trial when attempting to use the feature.

## Definition of Done

- Users can click on any text in summaries to play the corresponding audio
- A minimalistic audio player is visible on the summary page
- Audio is generated on-demand using OpenAI's TTS service
- The feature is behind a programmatic canary feature flag (rule-based)
- Non-subscribers are prompted to start a 7-day trial when attempting to use the feature
- The feature works across all summary content

## Tasks

### Task 1: Create TTS Service Stub (done) ✅

Create a stub TTS service with a complete public interface:
- Run `node ace make:service TtsService` to create `app/services/tts_service.ts`
- Implement the following methods in the service:
  - `generateSpeech(text: string): Promise<AudioData>` - Main method to convert text to speech
  - `getAvailableVoices(): Promise<Voice[]>` - Method to get available voices (stub for future expansion)
- Create an in-memory implementation that returns mock audio data
- Register the service in `app/services/_index.ts` as a singleton
- Create a rule-based canary feature in `app/services/canary_feature/rules/tts_feature_rule.ts` that enables the feature for specific user emails
- Add the `tts` feature key to `CANARY_FEATURES` array in `app/services/canary_feature/features.ts`
- Register the rule in the canary feature service initialization
- Write unit tests for the TTS service public API

Important rules to follow:
- Follow `adding-services.mdc` conventions for service creation and registration
- Follow `canary-features.mdc` for implementing rule-based features
- Ensure proper TypeScript types without using `any` or `as`

### Task 2: Create TTS API Controller with OpenAI Integration (done) ✅

Implement the Adonis API controller with OpenAI TTS integration:
- Run `node ace make:controller Tts` to create a new controller at `app/controllers/tts_controller.ts`
- Implement the following API endpoints:
  - `POST /api/v2/tts/generate` - Converts text to speech using OpenAI's API and returns audio stream
  - `GET /api/v2/tts/voices` - Returns available OpenAI voice options
- Add these routes to `start/routes.ts` under a grouped prefix
- Inject the TTS service into the controller
- Implement feature check using `user.hasFeatureOrFail('tts')` in the controller
- Implement proper request validation using VineJS
- Set up direct streaming from OpenAI to the response with appropriate headers:
  - `Content-Type: audio/wav` (use WAV format for lower latency)
  - `Accept-Ranges: bytes`
- Add environment variable configuration for OpenAI API key
- Implement proper error handling for API limits or failures
- Create a simple unit test for the TTS service with `node ace make:test TtsService --suite=unit`
- Document the API endpoints and their parameters for future reference

Important rules to follow:
- Use POST for the generate endpoint to handle potentially large text inputs
- Use `hasFeatureOrFail` to secure the endpoint according to canary-features rules
- Configure proper streaming response that works with HTML5 `<audio>` elements
- Follow standard AdonisJS controller patterns
- Use VineJS for request validation
- Handle API rate limits and quota appropriately

### Task 3: Implement and Integrate Basic Audio Player (done) ✅

Create and integrate a minimal audio player at the top of the summary:
- Create `#web/routes/_auth+/r.$revisionId+/TtsPlayer.tsx` - A simple player component positioned at the top of the summary
- Implement the player using the native HTML5 `<audio>` element with basic controls
- Add a simple play button, progress bar, and volume control
- Implement basic state management for play/pause functionality
- Style using Tailwind and DaisyUI to match existing UI
- Make the player sticky at the top of the viewport when active so users can control it while scrolling
- Use appropriate z-index and subtle background to ensure readability over content
- Update `#web/routes/_auth+/r.$revisionId+/StreamedSummary.tsx` to include the TtsPlayer component at the top
- Update `#web/routes/_auth+/r.$revisionId+/StaticSummary.tsx` to include the TtsPlayer component at the top
- Pass the full summary text to the player component
- Set up the audio element to work with the POST API endpoint
- Add the `FeatureGate` component to conditionally render based on the canary feature
- Implement proper fetching and error handling
- Add a simple "Listen to this summary" label next to the player
- Implement a basic loading state for when audio is being fetched

Important rules to follow:
- Use the native HTML5 `<audio>` element for audio playback
- Keep the UI minimal and clean, matching the existing summary design
- Use Tailwind and DaisyUI for styling to match existing UI
- Use fetch for POST requests to the TTS API
- Ensure proper cleanup of audio resources in React components
- Follow existing component patterns for consistency
- Follow accessibility guidelines for audio controls
- Implement proper React patterns with hooks for state management
- Handle errors gracefully with user-friendly messages

### Task 4: Implement Subscription Prompt for Non-Subscribers ✅

Create a modal dialog for users without the TTS feature:
- Create `#web/routes/_auth+/r.$revisionId+/TtsSubscriptionPrompt.tsx` using DaisyUI's modal component
- Design the 7-day trial prompt with clear messaging
- Implement the logic to show the prompt when a non-subscriber attempts to use TTS
- Add a "Start Trial" button that will trigger the subscription flow
- Connect the prompt to the canary feature system to determine when to show it
- Create a simple troubleshooting guide for common issues that users might encounter

Important rules to follow:
- Use existing Modal component patterns
- Ensure clear messaging about the 7-day trial
- Follow existing UI conventions for subscription prompts
- Make the value proposition clear and compelling 