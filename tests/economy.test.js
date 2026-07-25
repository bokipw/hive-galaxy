// Unit tests for js/systems/economy.js
const test = require('node:test');
const assert = require('node:assert');
const { loadModules } = require('./harness');

// Build a fresh economy sandbox. `stubs` can override/extend globals such
// as getDepotCapacity, getBuildingMilestones and the various research /
// artifact bonus getters that economy.js consults through `typeof` guards.
function setup(stubs = {}) {
  return loadModules(['js/state.js', 'js/systems/economy.js'], {
    getDepotCapacity: () => 1000,
    ...stubs,
  });
}

test('canAfford — treats missing cost fields as zero', () => {
  const s = setup();
  s.R.metal = 100; s.R.crystal = 50; s.R.he3 = 10; s.R.energy = 5;
  assert.strictEqual(s.canAfford({ metal: 100, crystal: 50, he3: 10, energy: 5 }), true);
  assert.strictEqual(s.canAfford({}), true);
  assert.strictEqual(s.canAfford({ metal: 101 }), false);
  assert.strictEqual(s.canAfford({ energy: 6 }), false);
});

test('spendResources — deducts and tracks total spent', () => {
  const spy = [];
  const s = setup({ trackSpendResources: (m, c) => spy.push([m, c]) });
  s.R.metal = 500; s.R.crystal = 500; s.R.he3 = 500; s.R.energy = 500;
  s.spendResources({ metal: 100, crystal: 50, he3: 25, energy: 10 });
  assert.strictEqual(s.R.metal, 400);
  assert.strictEqual(s.R.crystal, 450);
  assert.strictEqual(s.R.he3, 475);
  assert.strictEqual(s.R.energy, 490);
  assert.strictEqual(s.window._totalResourcesSpent, 175); // energy excluded
  assert.deepStrictEqual(spy, [[100, 50]]);
});

test('getEnergyGen — baseline with no energy buildings', () => {
  const s = setup();
  Object.values(s.buildings).forEach((b) => (b.level = 0));
  assert.ok(Math.abs(s.getEnergyGen() - 0.005) < 1e-9);
});

test('getEnergyGen — solar + fusion + synergy at level 100', () => {
  const s = setup();
  Object.values(s.buildings).forEach((b) => (b.level = 0));
  s.buildings.solar.level = 100; // triggers 1.15x synergy
  // 0.005 + 100*4 + 0 + 0 + 0 = 400.005, times 1.15
  assert.ok(Math.abs(s.getEnergyGen() - 400.005 * 1.15) < 1e-6);
});

test('getEnergyGen — applies solar milestone genBonus', () => {
  const s = setup({ getBuildingMilestones: (k) => (k === 'solar' ? { 25: { genBonus: 50 } } : {}) });
  Object.values(s.buildings).forEach((b) => (b.level = 0));
  s.buildings.solar.level = 25;
  // solarGen = 25*4*(1+50/100) = 150 ; total = (0.005+150)*1.0
  assert.ok(Math.abs(s.getEnergyGen() - 150.005) < 1e-6);
});

test('getEnergyDrain — sums building drains and grid reduction', () => {
  const s = setup();
  Object.values(s.buildings).forEach((b) => (b.level = 0));
  s.buildings.metal_mine.level = 1; // +2
  s.buildings.hq.level = 1;         // +1
  // base 2 + 2 + 1 = 5
  assert.strictEqual(s.getEnergyDrain(), 5);
  s.buildings.grid.level = 100; // 50% reduction -> floor(5*0.5)=2 ... plus grid has no own drain
  assert.strictEqual(s.getEnergyDrain(), Math.floor(5 * 0.5));
});

test('getEnergyMax — battery base plus fusion x3 multiplier at level 100', () => {
  const s = setup();
  Object.values(s.buildings).forEach((b) => (b.level = 0));
  assert.strictEqual(s.getEnergyMax(), 100); // base only
  s.buildings.fusion.level = 100; // capMultiplier x3
  // base = 100 + fusion*1 = 200 ; *3
  assert.strictEqual(s.getEnergyMax(), 600);
});

test('getEnergyMinPct — 20% only when battery at level 100', () => {
  const s = setup();
  s.buildings.battery.level = 99;
  assert.strictEqual(s.getEnergyMinPct(), 0);
  s.buildings.battery.level = 100;
  assert.strictEqual(s.getEnergyMinPct(), 20);
});

test('getEnergyPenalty — scales with energy and net balance', () => {
  const s = setup();
  Object.values(s.buildings).forEach((b) => (b.level = 0));
  s.R.energy = 100;
  assert.strictEqual(s.getEnergyPenalty(), 1.0); // plenty of energy
  s.R.energy = 5; // net negative (gen 0.005 - drain 2), energy>0
  assert.strictEqual(s.getEnergyPenalty(), 0.5);
  s.R.energy = 0;
  assert.strictEqual(s.getEnergyPenalty(), 0.2);
});

test('getBaseProd — base production scales with mine levels and penalty', () => {
  const s = setup();
  Object.values(s.buildings).forEach((b) => (b.level = 0));
  s.buildings.metal_mine.level = 10;
  s.buildings.crystal_mine.level = 10;
  s.buildings.he3_refinery.level = 10;
  s.R.energy = 1000; // full penalty 1.0
  const p = s.getBaseProd();
  assert.ok(Math.abs(p.metal - 10 * 0.01) < 1e-9);
  assert.ok(Math.abs(p.crystal - 10 * 0.007) < 1e-9);
  assert.ok(Math.abs(p.he3 - 10 * 0.003) < 1e-9);
});

test('getProd — adds colony production when available', () => {
  const s = setup({ getTotalColonyProduction: () => ({ metal: 5, crystal: 3, he3: 1 }) });
  Object.values(s.buildings).forEach((b) => (b.level = 0));
  s.buildings.metal_mine.level = 0; // level||1 -> 1
  s.R.energy = 1000;
  const base = s.getBaseProd();
  const prod = s.getProd();
  assert.ok(Math.abs(prod.metal - (base.metal + 5)) < 1e-9);
  assert.ok(Math.abs(prod.crystal - (base.crystal + 3)) < 1e-9);
});

test('addToStorage — accepts production until capacity, then fills remainder', () => {
  const s = setup({ getDepotCapacity: () => 100 });
  assert.strictEqual(s.addToStorage({ metal: 30, crystal: 0, he3: 0 }), true);
  assert.strictEqual(s.storageBuffer.metal, 30);
  // incoming 100 would overflow (30+100>100): partial fill of remaining 70
  const ok = s.addToStorage({ metal: 100, crystal: 0, he3: 0 });
  assert.strictEqual(ok, false);
  assert.ok(Math.abs(s.storageBuffer.metal - 100) < 1e-9);
  // already full -> reject entirely
  assert.strictEqual(s.addToStorage({ metal: 10, crystal: 0, he3: 0 }), false);
});

test('pickupResources — moves floored buffer into R and resets buffer', () => {
  const s = setup();
  s.storageBuffer = { metal: 10.9, crystal: 5.2, he3: 0.4 };
  const before = s.R.metal;
  s.pickupResources();
  assert.strictEqual(s.R.metal, before + 10);
  assert.strictEqual(s.storageBuffer.metal, 0);
  assert.strictEqual(s.storageBuffer.crystal, 0);
  assert.strictEqual(s.storageBuffer.he3, 0);
  assert.strictEqual(s.window._totalDepotPickups, 1);
});

test('pickupResources — no-op when depot empty', () => {
  const s = setup();
  s.storageBuffer = { metal: 0.4, crystal: 0, he3: 0 };
  const before = s.R.metal;
  s.pickupResources();
  assert.strictEqual(s.R.metal, before);
  assert.strictEqual(s.window._totalDepotPickups, undefined);
});

test('tickEnergy — clamps energy between min and max', () => {
  const s = setup();
  Object.values(s.buildings).forEach((b) => (b.level = 0));
  s.buildings.battery.level = 100; // min 20% ; base cap...
  s.R.energy = 0;
  s.tickEnergy();
  const max = s.getEnergyMax();
  assert.ok(s.R.energy >= Math.floor(max * 0.2));
  assert.ok(s.R.energy <= max);
});

test('getExpForLevel — 120 * level^2.5', () => {
  const s = setup();
  assert.strictEqual(s.getExpForLevel(1), 120);
  assert.strictEqual(s.getExpForLevel(2), Math.floor(120 * Math.pow(2, 2.5)));
});

test('addExp — levels up commander and carries remaining exp', () => {
  const s = setup();
  s.commander.level = 1;
  s.commander.exp = 0;
  s.addExp(120); // exactly enough for level 1 -> 2
  assert.strictEqual(s.commander.level, 2);
  assert.strictEqual(s.commander.exp, 0);
  assert.strictEqual(s.commander.nextExp, s.getExpForLevel(2));
});

test('addExp — does not exceed level 100', () => {
  const s = setup();
  s.commander.level = 100;
  s.commander.exp = 0;
  s.addExp(10 ** 12);
  assert.strictEqual(s.commander.level, 100);
});
