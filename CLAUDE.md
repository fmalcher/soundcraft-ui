# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Structure of this workspace

This monorepo contains a library (`mixer-connection`) that controls an audio mixer (Soundcraft Ui12/16/24R) through the WebSocket protocol.
The `testbed` application uses this library and offers a simple testing UI to practically try out all features.
The `docs` folder contains a Docusaurus site with library documentation (published at https://fmalcher.github.io/soundcraft-ui).

## Projects

- `packages/mixer-connection` — Published library (`soundcraft-ui-connection` on npm). Zero production dependencies, pure RxJS observable API.
- `packages/testbed` — Angular demo application

## Common commands

```bash
# Build, test, lint (all projects)
npx nx run-many -t build
npx nx run-many -t test
npx nx run-many -t lint

# Single project
npx nx test mixer-connection
npx nx lint mixer-connection
npx nx build mixer-connection

# Format
npx nx format:check
npx nx format:write

# Serve testbed
npx nx serve testbed
```

## mixer-connection architecture

- **Entry point**: `SoundcraftUI` class (in `soundcraft-ui.ts`) is the main facade. All other facades are accessed through it (e.g. `conn.master.player`, `conn.master.input(0)`).
- **Facade pattern**: public classes (`Channel`, `MasterBus`, `AuxBus`, `FxBus`, `Player`, etc.) provide a human-readable API (e.g. `channel.setFaderLevel(0.5)`, `channel.mute()`)
- **WebSocket connection** (`mixer-connection.ts`): Built on RxJS `webSocket()`. Protocol commands: `SETD^path^value`, `SETS^path^value`, `BMSG^SYNC^...`. Automatic keepalive and reconnect.
- **State management** (`MixerStore`): Flat observable state via `scan()` from inbound messages. Selectors use a `select()` operator for reactive property access.
- **Object store**: Singleton caching of facade instances to prevent duplicates when accessing the same channel.
- **Transitions**: Fading with configurable easing (Linear, EaseIn, EaseOut, EaseInOut) and frame rate.
- **Channel types**: `i` (input), `l` (line), `p` (player), `f` (FX return), `s` (sub group), `a` (aux)
- **Bus types**: `master`, `aux`, `fx`
- **Fader values**: Internally stored as linear values (0..1) matching the fader position. The API also supports dB-based operations (e.g. `changeFaderLevelDB`) that convert between dB and linear.

## Testing

- Vitest with jsdom environment
- Test files colocated with source: `*.spec.ts`
- Tests must always cover as much as possible. All outbound messages must be verified in `outbound-messages.spec.ts`.
- Use the existing test patterns when writing new tests.
- Some classes are extended into subclasses that have their own tests. Keep in mind to cover all implementations.

# Guidelines for working with this project

- Before committing, verify correctness by running tests (`npx nx test`), linting (`npx nx lint`) and code formatting (`npx nx format:check`). Fix formatting with `npx nx format:write`.
- Always run `npx nx format:check` before pushing.
- Do not use `--reporter=verbose` with `npx nx test` — it causes tests to hang.
- Make sure the documentation matches the actual implementation. When adding new features or updating implementation/comments, the docs need to be updated.
- Report and fix mismatches between doc comments in the code and descriptions in the docs.
- Consult the `docs/` folder for context on features and API behavior before making changes.
- Always write tests when adding new API surface.

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` mcp tool to analyze and understand the specific project structure and dependencies
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors

<!-- nx configuration end-->
