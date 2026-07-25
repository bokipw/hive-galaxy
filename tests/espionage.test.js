// Unit tests for js/systems/espionage.js
const test = require('node:test');
const assert = require('node:assert');
const { loadModules } = require('./harness');

function setup(stubs = {}) {
  return loadModules(
    ['js/state.js', 'js/systems/economy.js', 'js/systems/espionage.js'],
    { getEspionageLevel: () => 0, getDepotCapacity: () => 10 ** 9, ...stubs },
    { renderEspionage: () => {} },
  );
}

test('getEspSuccessChance — base chance with no modifiers', () => {
  const s = setup({ getEspionageLevel: () => 0 });
  Object.values(s.buildings).forEach((b) => (b.level = 0));
  // base 40 + 0 research + 0 drones - 0 penalty = 40
  assert.strictEqual(s.getEspSuccessChance(0, 0), 40);
});

test('getEspSuccessChance — drones capped at bonus max, research + penalty', () => {
  const s = setup({ getEspionageLevel: () => 20 });
  Object.values(s.buildings).forEach((b) => (b.level = 0));
  // 40 + 20*0.5 (=10) + min(100,30)=30 drones - 10*0.3 (=3) = 77
  assert.strictEqual(s.getEspSuccessChance(10, 100), 77);
});

test('getEspSuccessChance — clamps to [5, 95]', () => {
  const s = setup({ getEspionageLevel: () => 0 });
  Object.values(s.buildings).forEach((b) => (b.level = 0));
  assert.strictEqual(s.getEspSuccessChance(1000, 0), 5); // huge penalty -> floor 5
  assert.strictEqual(s.getEspSuccessChance(0, 30), 70);
  assert.strictEqual(s.getEspSuccessChance(0, 1000), 70); // drones capped at 30 -> 40+30=70
});

test('getEspSuccessChance — missile battery blocks spying on players', () => {
  const s = setup({ getEspionageLevel: () => 0 });
  Object.values(s.buildings).forEach((b) => (b.level = 0));
  s.buildings.missile_bat.level = 25;
  // targetIsPlayer -> -20 : 40 - 20 = 20
  assert.strictEqual(s.getEspSuccessChance(0, 0, true), 20);
  // not a player -> no block
  assert.strictEqual(s.getEspSuccessChance(0, 0, false), 40);
});

test('getEspionageRevealLevel — research-tier based, capped at 4', () => {
  const at = (lvl) => {
    const s = setup({ getEspionageLevel: () => lvl });
    Object.values(s.buildings).forEach((b) => (b.level = 0));
    return s.getEspionageRevealLevel();
  };
  assert.strictEqual(at(0), 0);
  assert.strictEqual(at(25), 1);
  assert.strictEqual(at(50), 2);
  assert.strictEqual(at(75), 3);
  assert.strictEqual(at(100), 4);
});

test('buyEspDrone — spends resources and increments drones', () => {
  const s = setup();
  s.R.metal = 10 ** 6; s.R.crystal = 10 ** 6; s.R.he3 = 10 ** 6;
  s.espDrones = 0;
  s.buyEspDrone(2);
  assert.strictEqual(s.espDrones, 2);
  assert.strictEqual(s.R.metal, 10 ** 6 - s.ESP_DRONE_COST.metal * 2);
});

test('buyEspDrone — refuses to exceed ESP_DRONE_MAX', () => {
  const s = setup();
  s.R.metal = 10 ** 9; s.R.crystal = 10 ** 9; s.R.he3 = 10 ** 9;
  s.espDrones = s.ESP_DRONE_MAX; // already at max
  s.buyEspDrone(1);
  assert.strictEqual(s.espDrones, s.ESP_DRONE_MAX);
});

test('buyEspDrone — refuses when resources are insufficient', () => {
  const s = setup();
  s.R.metal = 0; s.R.crystal = 0; s.R.he3 = 0;
  s.espDrones = 0;
  s.buyEspDrone(1);
  assert.strictEqual(s.espDrones, 0);
});

test('buildEspReport — reveals progressively more with higher levels', () => {
  const s = setup();
  const opp = {
    power: 1000,
    rating: 1500,
    resources: { metal: 5 },
    fleet: [
      { hp: 100, dps: 10, shield: 5, count: 2, name: 'Scout', armor: 'Light' },
      { hp: 200, dps: 20, shield: 0, count: 1, name: 'Cruiser', armor: 'Nano' },
    ],
  };
  const r0 = s.buildEspReport(opp, 0);
  assert.deepEqual(Object.keys(r0).sort(), ['power', 'rating']);

  const r1 = s.buildEspReport(opp, 1);
  assert.strictEqual(r1.hp, 300);

  const r2 = s.buildEspReport(opp, 2);
  assert.strictEqual(r2.dps, 30);
  assert.strictEqual(r2.shield, 5);

  const r3 = s.buildEspReport(opp, 3);
  assert.strictEqual(r3.ships.length, 2);
  assert.strictEqual(r3.ships[0].name, 'Scout');

  const r4 = s.buildEspReport(opp, 4);
  assert.strictEqual(r4.full, true);
  assert.deepEqual(r4.resources, { metal: 5 });
});

test('buildEspReport — falls back to power-derived estimates without a fleet', () => {
  const s = setup();
  const opp = { power: 1000, rating: 1200 };
  const r = s.buildEspReport(opp, 2);
  assert.strictEqual(r.hp, 2000);   // power * 2
  assert.strictEqual(r.dps, 100);   // power * 0.1
  assert.strictEqual(r.shield, 500); // power * 0.5
});
