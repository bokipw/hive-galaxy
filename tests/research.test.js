// Unit tests for js/systems/research.js (pure bonus/cost logic)
const test = require('node:test');
const assert = require('node:assert');
const { loadModules } = require('./harness');

function setup(stubs = {}) {
  return loadModules(['js/state.js', 'js/systems/research.js'], stubs);
}

test('initResearch — seeds every branch with a level-0 entry', () => {
  const s = setup();
  s.research = {};
  s.initResearch();
  assert.strictEqual(s.research.mining_metal.level, 0);
  assert.strictEqual(s.research.weapons.level, 0);
  assert.strictEqual(s.research.espionage.level, 0);
});

test('getResearchBonus — base bonus plus reached milestones', () => {
  const s = setup();
  s.research = { mining_metal: { level: 30 } };
  // base = 30 (lvl), milestone 25 -> +25
  assert.strictEqual(s.getResearchBonus('mining_metal'), 55);
});

test('getResearchBonus — 0 for unknown branch', () => {
  const s = setup();
  assert.strictEqual(s.getResearchBonus('does_not_exist'), 0);
});

test('getMilestoneBonusValue — maps effect keys, 0 for unknown', () => {
  const s = setup();
  assert.strictEqual(s.getMilestoneBonusValue('mining_metal_100'), 100);
  assert.strictEqual(s.getMilestoneBonusValue('energy_75'), 150);
  assert.strictEqual(s.getMilestoneBonusValue('nope'), 0);
});

test('mining prod bonus getters delegate to getResearchBonus', () => {
  const s = setup();
  s.research = {
    mining_metal: { level: 10 },
    mining_crystal: { level: 5 },
    mining_he3: { level: 0 },
  };
  assert.strictEqual(s.getMetalProdBonus(), 10);
  assert.strictEqual(s.getCrystalProdBonus(), 5);
  assert.strictEqual(s.getHe3ProdBonus(), 0);
});

test('getWeaponsDpsBonus — +1%/level and doubles at level 100', () => {
  const s = setup();
  s.research = { weapons: { level: 50 } };
  assert.strictEqual(s.getWeaponsDpsBonus(), 50);
  s.research = { weapons: { level: 100 } };
  assert.strictEqual(s.getWeaponsDpsBonus(), 200);
});

test('getWeaponsCritBonus — tiered thresholds', () => {
  const s = setup();
  const at = (lvl) => { s.research = { weapons: { level: lvl } }; return s.getWeaponsCritBonus(); };
  assert.strictEqual(at(10), 0);
  assert.strictEqual(at(25), 5);
  assert.strictEqual(at(50), 10);
  assert.strictEqual(at(75), 15);
  assert.strictEqual(at(100), 20);
});

test('shield bonuses — capacity, regen tiers, immunity', () => {
  const s = setup();
  s.research = { shields: { level: 80 } };
  assert.strictEqual(s.getShieldBonus(), 80);
  assert.strictEqual(s.getShieldRegenBonus(), 30);
  assert.strictEqual(s.isShieldImmune(), false);
  s.research = { shields: { level: 100 } };
  assert.strictEqual(s.isShieldImmune(), true);
});

test('getArmorDmgReduction — scaled with level cap tiers', () => {
  const s = setup();
  const at = (lvl) => { s.research = { armor: { level: lvl } }; return s.getArmorDmgReduction(); };
  assert.strictEqual(at(10), 3);   // floor(10*0.3)
  assert.strictEqual(at(50), 15);  // floor(50*0.3)=15
  assert.strictEqual(at(100), 25);
});

test('getEnergyCapBonus and isEnergyFreeInstance', () => {
  const s = setup();
  s.research = { energy: { level: 30 } };
  // 30*2 + 50 (>=25) = 110
  assert.strictEqual(s.getEnergyCapBonus(), 110);
  assert.strictEqual(s.isEnergyFreeInstance(), false);
  s.research = { energy: { level: 100 } };
  assert.strictEqual(s.isEnergyFreeInstance(), true);
});

test('getEspionageLevel — reads espionage branch level', () => {
  const s = setup();
  s.research = { espionage: { level: 42 } };
  assert.strictEqual(s.getEspionageLevel(), 42);
  s.research = {};
  assert.strictEqual(s.getEspionageLevel(), 0);
});

test('getResearchCost — next-level cost, unknown branch -> zeros', () => {
  const s = setup();
  s.research = { mining_metal: { level: 0 } };
  const cost = s.getResearchCost('mining_metal');
  // cost(lvl+1=1) = floor(500 * 1.08^1) = 540
  assert.strictEqual(cost.metal, 540);
  assert.strictEqual(cost.energy, 5);
  assert.deepEqual(s.getResearchCost('nope'), { metal: 0, crystal: 0, he3: 0, energy: 0 });
});

test('getResearchCost — applies laboratory research discount', () => {
  const s = setup({ getResearchDiscount: () => 50 });
  s.research = { mining_metal: { level: 0 } };
  const cost = s.getResearchCost('mining_metal');
  assert.strictEqual(cost.metal, Math.floor(540 * 0.5));
  assert.strictEqual(cost.energy, 5); // energy is not discounted
});

test('getResearchTimerSeconds — floor of 5 seconds, grows with level', () => {
  const s = setup();
  assert.strictEqual(s.getResearchTimerSeconds(1), 30);
  assert.strictEqual(s.getResearchTimerSeconds(0), Math.max(5, Math.round(30 * Math.pow(1.12, -1))));
  assert.ok(s.getResearchTimerSeconds(20) > s.getResearchTimerSeconds(10));
});

test('isResearchInstant — true when laboratory milestone grants it', () => {
  const s = setup({
    getBuildingMilestones: (k) => (k === 'laboratory' ? { 50: { researchInstant: true } } : {}),
  });
  s.buildings.laboratory.level = 50;
  assert.strictEqual(s.isResearchInstant(), true);
  s.buildings.laboratory.level = 10;
  assert.strictEqual(s.isResearchInstant(), false);
});
