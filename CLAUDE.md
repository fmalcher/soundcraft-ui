# Structure of this workspace

This monorepo contains a library (`mixer-connection`) that controls an audio mixer (Soundcraft Ui12/16/24R) through the WebSocket protocol.
The `testbed` application uses this library and offers a simple testing UI to practically try out all features.

The `docs` folder contains documentation for the library.

## Projects

- `packages/mixer-connection` — Published library (`soundcraft-ui-connection` on npm). Zero production dependencies, pure RxJS observable API.
- `packages/testbed` — Angular 21 demo application (Bootstrap 5 UI)

## mixer-connection architecture

- **Facade pattern**: 20+ public classes (`Channel`, `MasterBus`, `AuxBus`, `FxBus`, `Player`, etc.) provide a human-readable API (e.g. `channel.setFaderLevel(0.5)`, `channel.mute()`)
- **WebSocket connection** (`mixer-connection.ts`): Built on RxJS `webSocket()`. Messages use `3:::` prefix. Protocol commands: `SETD^path^value`, `SETS^path^value`, `BMSG^SYNC^...`. Automatic keepalive (1s) and reconnect (2s delay).
- **State management**: Flat observable state via `scan()` from inbound messages. Selectors use a `select()` operator for reactive property access.
- **Object store**: Singleton caching of facade instances to prevent duplicates when accessing the same channel.
- **Transitions**: Fading with configurable easing (Linear, EaseIn, EaseOut, EaseInOut) and frame rate.
- **Channel types**: `i` (input), `l` (line), `p` (player), `f` (FX return), `s` (sub group), `a` (aux)
- **Bus types**: `master`, `aux`, `fx`

## Testing

- Vitest with jsdom environment
- Test files colocated with source: `*.spec.ts`

# Guidelines for working with this project

- Before committing, verify correctness by running tests (`npx nx test`), linting (`npx nx lint`) and code formatting (`npx nx format:check`). Fix formatting with `npx nx format:write`.
- Always run `npx nx format:check` before pushing.
- Do not use `--reporter=verbose` with `npx nx test` — it causes tests to hang.
- Make sure the documentation matches the actual implementation.
- Report mismatches between doc comments in the code and descriptions in the docs.

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
