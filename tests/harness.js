// ============================================================
// HIVE GALAXY — tests/harness.js
// Test harness for loading the game's global-scoped browser
// scripts into an isolated sandbox so their functions can be
// unit tested under Node's built-in test runner.
//
// The game ships as plain <script> files that declare functions
// and state on the global scope (no module system). To exercise
// them in Node we:
//   1. read each source file,
//   2. rewrite top-level `const`/`let` declarations to `var` so
//      the bindings become shared across files (mirroring how the
//      browser shares a single global lexical scope between script
//      tags) while keeping line numbers intact for coverage,
//   3. run each file as its own script inside one shared vm
//      context, preserving per-file coverage attribution.
// ============================================================

const fs = require('fs');
const vm = require('vm');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Rewrite only column-0 `const `/`let ` declarations to `var` so that
// top-level bindings attach to the shared context global (like browser
// script tags) without shifting line numbers used by the coverage report.
function rewriteTopLevelDeclarations(src) {
  return src
    .split('\n')
    .map((line) => line.replace(/^const /, 'var   ').replace(/^let /, 'var '))
    .join('\n');
}

// Default no-op stubs for the UI / persistence globals the systems call.
function defaultStubs() {
  return {
    console,
    setTimeout: () => 0,
    clearTimeout: () => {},
    setInterval: () => 0,
    clearInterval: () => {},
    // UI + persistence side effects — silenced during unit tests.
    toast: () => {},
    addLog: () => {},
    fmt: (n) => String(n),
    updateResUI: () => {},
    saveGame: () => {},
    renderFormations: () => {},
    renderBlueprints: () => {},
    renderEspionage: () => {},
    renderDepot: () => {},
    updateEnergyBalanceCard: () => {},
  };
}

// Load the given source files (paths relative to repo root) into a fresh
// shared sandbox. Extra stubs/overrides may be supplied and win over the
// defaults. Returns the sandbox object; declared functions and top-level
// state are accessible as properties on it.
function loadModules(files, extraStubs = {}, postStubs = {}) {
  const sandbox = Object.assign(defaultStubs(), extraStubs);
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);

  for (const rel of files) {
    const abs = path.join(ROOT, rel);
    const src = rewriteTopLevelDeclarations(fs.readFileSync(abs, 'utf8'));
    vm.runInContext(src, sandbox, { filename: abs });
  }
  // Overrides applied AFTER the sources run — used to neutralise DOM-heavy
  // render functions that the source files declare as global functions
  // (which would otherwise shadow the pre-load stubs).
  Object.assign(sandbox, postStubs);
  return sandbox;
}

module.exports = { loadModules, ROOT };
