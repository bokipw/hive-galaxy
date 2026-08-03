# Unit tests

Unit tests for the game's logic modules, using **Node's built-in test runner**
(`node:test` + `node:assert`) — no npm dependencies and no `package.json`
required (the repo `.gitignore` intentionally excludes `package.json`).

## Running

```bash
# Run all tests
node --test tests/

# Run a single suite
node --test tests/economy.test.js

# Run with a per-file coverage report
node --test --experimental-test-coverage tests/
```

Requires Node 18+ (developed against Node 20).

## How it works

The game ships as plain `<script>` files that declare functions and mutable
state on the global scope (there is no module system / no `export`s). To
exercise them from Node, `harness.js`:

1. reads each source file,
2. rewrites column-0 `const`/`let` declarations to `var` so top-level bindings
   are shared across files — mirroring how the browser shares one global
   lexical scope between `<script>` tags — while keeping line numbers intact so
   the coverage report maps correctly,
3. runs each file as its own script inside a single shared `vm` context.

`loadModules(files, preStubs, postStubs)` returns the sandbox; declared
functions and top-level state are read/written directly as properties on it.
`postStubs` are applied *after* the sources run, to neutralise DOM-heavy
`render*` functions the sources define as globals.

## Covered modules

- `js/systems/economy.js` — resources, energy, production, depot, commander XP
- `js/systems/formations.js` — formation slots and stat bonuses
- `js/systems/research.js` — research bonuses, costs, milestones
- `js/systems/espionage.js` — spy success chance, reveal levels, drones, reports
- `js/systems/blueprints.js` — rarity helpers, blueprint unlock/craft, filtering

These were the highest-value pure-logic modules with no prior test coverage.
DOM/render-only code paths are intentionally left uncovered.
