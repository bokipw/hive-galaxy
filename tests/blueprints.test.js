// Unit tests for js/systems/blueprints.js
const test = require('node:test');
const assert = require('node:assert');
const { loadModules } = require('./harness');

function setup(stubs = {}) {
  return loadModules(
    [
      'data/ships.js',
      'data/weapons.js',
      'data/shields.js',
      'data/engines.js',
      'data/recon.js',
      'data/special.js',
      'js/state.js',
      'js/systems/blueprints.js',
    ],
    { dn: (item) => (item && (item.name || item.id)) || '', ...stubs },
    { renderBlueprints: () => {} },
  );
}

test('getRarityColor — known rarities and default', () => {
  const s = setup();
  assert.strictEqual(s.getRarityColor('E'), '#aa44ff');
  assert.strictEqual(s.getRarityColor('L'), '#ffaa00');
  assert.strictEqual(s.getRarityColor('???'), '#ffdd00');
});

test('getRarityModeLabel — returns markup per rarity, empty for unknown', () => {
  const s = setup();
  assert.ok(s.getRarityModeLabel('C').includes('Easy+'));
  assert.ok(s.getRarityModeLabel('L').includes('Hell only'));
  assert.strictEqual(s.getRarityModeLabel('X'), '');
});

test('getBpFragmentCost — per-rarity fragment cost with default', () => {
  const s = setup();
  assert.strictEqual(s.getBpFragmentCost('C'), 25);
  assert.strictEqual(s.getBpFragmentCost('R'), 15);
  assert.strictEqual(s.getBpFragmentCost('E'), 10);
  assert.strictEqual(s.getBpFragmentCost('L'), 5);
  assert.strictEqual(s.getBpFragmentCost('?'), 25);
});

test('getBpName — resolves ship and weapon names, falls back to id', () => {
  const s = setup();
  assert.strictEqual(s.getBpName('scout_Swift_I'), 'Swift I');
  assert.strictEqual(s.getBpName('w_kinetic_railgun_I'), 'Railgun I');
  assert.strictEqual(s.getBpName('totally_unknown_id'), 'totally_unknown_id');
});

test('countAllBlueprints — sums every catalog', () => {
  const s = setup();
  let expected = 0;
  Object.values(s.SHIPS).forEach((arr) => (expected += arr.length));
  expected += s.WEAPONS.length + s.SHIELDS.length + s.ENGINES.length +
    s.RECON_MODULES.length + s.SPECIAL_MODULES.length;
  assert.strictEqual(s.countAllBlueprints(), expected);
  assert.ok(s.countAllBlueprints() > 0);
});

test('unlockBlueprint — unlocks once, no-op if already owned', () => {
  const s = setup();
  s.ownedBlueprints = {};
  assert.strictEqual(s.unlockBlueprint('scout_Swift_I'), true);
  assert.strictEqual(s.ownedBlueprints['scout_Swift_I'], true);
  assert.strictEqual(s.unlockBlueprint('scout_Swift_I'), false);
});

test('craftBlueprint — consumes fragments and unlocks when enough', () => {
  const s = setup();
  s.ownedBlueprints = {};
  s.blueprintFragments = {};
  // scout_Swift_I is rarity C -> needs 25 fragments
  s.blueprintFragments['scout_Swift_I'] = 30;
  assert.strictEqual(s.craftBlueprint('scout_Swift_I'), true);
  assert.strictEqual(s.blueprintFragments['scout_Swift_I'], 5);
  assert.strictEqual(s.ownedBlueprints['scout_Swift_I'], true);
  assert.strictEqual(s.window._totalBpCrafted, 1);
});

test('craftBlueprint — refuses when fragments are insufficient', () => {
  const s = setup();
  s.ownedBlueprints = {};
  s.blueprintFragments = { scout_Swift_I: 1 };
  assert.strictEqual(s.craftBlueprint('scout_Swift_I'), false);
  assert.ok(!s.ownedBlueprints['scout_Swift_I']);
});

test('craftBlueprint — honors getBlueprintRarity override when present', () => {
  const s = setup({ getBlueprintRarity: () => 'L' }); // L -> needs 5 fragments
  s.ownedBlueprints = {};
  s.blueprintFragments = { some_item: 5 };
  assert.strictEqual(s.craftBlueprint('some_item'), true);
  assert.strictEqual(s.blueprintFragments['some_item'], 0);
});

test('filterBps — filters by owned/locked/all according to _bpFilter', () => {
  const s = setup();
  const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  const owned = (i) => i.id === 'a';
  s._bpFilter = 'all';
  assert.strictEqual(s.filterBps(items, owned).length, 3);
  s._bpFilter = 'owned';
  assert.deepEqual(s.filterBps(items, owned).map((i) => i.id), ['a']);
  s._bpFilter = 'locked';
  assert.deepEqual(s.filterBps(items, owned).map((i) => i.id), ['b', 'c']);
});
