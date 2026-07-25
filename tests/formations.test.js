// Unit tests for js/systems/formations.js
const test = require('node:test');
const assert = require('node:assert');
const { loadModules } = require('./harness');

function setup() {
  return loadModules(['js/state.js', 'js/systems/formations.js'], {}, {
    renderFormations: () => {},
  });
}

test('getActiveFormation — defaults to the free formation (id 0)', () => {
  const s = setup();
  assert.strictEqual(s.getActiveFormation().id, 0);
});

test('setFormation — activates a valid formation, ignores invalid id', () => {
  const s = setup();
  s.setFormation(1);
  assert.strictEqual(s.activeFormation, 1);
  assert.strictEqual(s.getActiveFormation().name, 'Delta');
  s.setFormation(999); // invalid -> unchanged
  assert.strictEqual(s.activeFormation, 1);
});

test('assignCommanderToFormationSlot — places, moves, and toggles off commanders', () => {
  const s = setup();
  s.window._formationSlots = Array(9).fill(null);
  s.assignCommanderToFormationSlot('cmdA', 0);
  assert.strictEqual(s.window._formationSlots[0], 'cmdA');
  // same commander to a new slot: removed from old, added to new
  s.assignCommanderToFormationSlot('cmdA', 5);
  assert.strictEqual(s.window._formationSlots[0], null);
  assert.strictEqual(s.window._formationSlots[5], 'cmdA');
  // assigning the same commander to the slot it already occupies toggles it off
  s.assignCommanderToFormationSlot('cmdA', 5);
  assert.strictEqual(s.window._formationSlots[5], null);
});

test('assignCommanderToFormationSlot — ignores out-of-range slots', () => {
  const s = setup();
  s.window._formationSlots = Array(9).fill(null);
  s.assignCommanderToFormationSlot('cmdA', -1);
  s.assignCommanderToFormationSlot('cmdA', 9);
  assert.strictEqual(s.getFilledFormationSlots(), 0);
});

test('removeCommanderFromFormationSlot — clears a slot', () => {
  const s = setup();
  s.window._formationSlots = Array(9).fill(null);
  s.window._formationSlots[3] = 'cmdX';
  s.removeCommanderFromFormationSlot(3);
  assert.strictEqual(s.window._formationSlots[3], null);
});

test('getFilledFormationSlots — counts non-null slots', () => {
  const s = setup();
  s.window._formationSlots = ['a', null, 'b', null, null, 'c', null, null, null];
  assert.strictEqual(s.getFilledFormationSlots(), 3);
});

test('getFormationBonus — returns zeroed bonus for free formation', () => {
  const s = setup();
  s.setFormation(0);
  assert.deepEqual(s.getFormationBonus(), { dps: 0, shield: 0, armor: 0, agility: 0, speed: 0 });
});

test('getFormationBonus — static formation exposes its configured bonus', () => {
  const s = setup();
  s.setFormation(2); // Štit: shield 20, armor 10
  const b = s.getFormationBonus();
  assert.strictEqual(b.shield, 20);
  assert.strictEqual(b.armor, 10);
  assert.strictEqual(b.dps, 0);
});

test('getFormationBonus — Roj (dynamic) scales dps per filled slot', () => {
  const s = setup();
  s.setFormation(6); // Roj: dps_per_slot 8, dynamic
  s.window._formationSlots = ['a', 'b', 'c', null, null, null, null, null, null];
  assert.strictEqual(s.getFormationBonus().dps, 24); // 8 * 3
  // with no slots filled it still counts as at least 1
  s.window._formationSlots = Array(9).fill(null);
  assert.strictEqual(s.getFormationBonus().dps, 8);
});

test('applyFormationToStats — returns stats untouched for free formation', () => {
  const s = setup();
  s.setFormation(0);
  const stats = { dps: 100, shield: 50, armor: 20, agility: 10, speed: 5 };
  assert.deepEqual(s.applyFormationToStats(stats), stats);
});

test('applyFormationToStats — applies percentage and additive bonuses with caps', () => {
  const s = setup();
  s.setFormation(8); // Legija: +5% everything (dps/shield/armor) + agility/speed additive
  const out = s.applyFormationToStats({ dps: 100, shield: 100, armor: 100, agility: 88, speed: 1 });
  assert.strictEqual(out.dps, 105);
  assert.strictEqual(out.shield, 105);
  assert.strictEqual(out.armor, 105);
  assert.strictEqual(out.agility, 90); // capped at 90 (88 + 5 -> 90)
  assert.strictEqual(out.speed, 6);
});
