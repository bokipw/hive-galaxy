// ============================================================
// HIVE GALAXY — data/recon.js
// Recon moduli — SAMO za Izviđače (recon slot)
// ============================================================

const RECON_MODULES = [

  // ── Targeting System (Common) — tačnost oružja ──
  {
    id: 'mod_targeting_I',
    name: 'Targeting System I',
    variant: 'I', rarity: 'C', icon: '🎯',
    effect: { type: 'accuracy', bonus: 5, desc: '+5% tačnost svih oružja' },
    cost: { metal: 500, crystal: 300, he3: 150 },
    source: 'Upgrade Ship Factory II',
    desc: 'Sistem navođenja. Povećava tačnost oružja.',
  },
  {
    id: 'mod_targeting_II',
    name: 'Targeting System II',
    variant: 'II', rarity: 'C', icon: '🎯',
    effect: { type: 'accuracy', bonus: 10, desc: '+10% tačnost svih oružja' },
    cost: { metal: 1100, crystal: 700, he3: 340 },
    source: 'Humanoid 6',
    desc: 'Poboljšani sistem navođenja.',
  },
  {
    id: 'mod_targeting_III',
    name: 'Targeting System III',
    variant: 'III', rarity: 'C', icon: '🎯',
    effect: { type: 'accuracy', bonus: 15, desc: '+15% tačnost svih oružja' },
    cost: { metal: 2200, crystal: 1400, he3: 680 },
    source: 'Instanca 30',
    desc: 'Napredni sistem navođenja.',
  },

  // ── Deep Scanner (Rare) — detekcija ──
  {
    id: 'mod_scanner_I',
    name: 'Deep Scanner I',
    variant: 'I', rarity: 'R', icon: '📡',
    effect: { type: 'detection', bonus: 40, desc: '+40% Detection range' },
    cost: { metal: 1800, crystal: 1200, he3: 600 },
    source: 'Instanca 22',
    desc: 'Deep scan modul. Otkriva skrivene brodove i resurse.',
  },
  {
    id: 'mod_scanner_II',
    name: 'Deep Scanner II',
    variant: 'II', rarity: 'R', icon: '📡',
    effect: { type: 'detection', bonus: 70, desc: '+70% Detection range' },
    cost: { metal: 4000, crystal: 2700, he3: 1350 },
    source: 'Instanca 26',
    desc: 'Poboljšani deep scan modul.',
  },
  {
    id: 'mod_scanner_III',
    name: 'Deep Scanner III',
    variant: 'III', rarity: 'R', icon: '📡',
    effect: { type: 'detection', bonus: 100, desc: '+100% Detection range (duplo)' },
    cost: { metal: 8000, crystal: 5400, he3: 2700 },
    source: 'Restricted 4',
    desc: 'Napredni deep scan modul. Dupla detekcija.',
  },

  // ── Countermeasure (Epic) — odbijanje raketa ──
  {
    id: 'mod_countermeasure_I',
    name: 'Countermeasure I',
    variant: 'I', rarity: 'E', icon: '🚫',
    effect: { type: 'missile_evade', chance: 20, desc: '20% šansa odbijanja Missile napada' },
    cost: { metal: 5500, crystal: 4200, he3: 2600 },
    source: 'Restricted 3',
    desc: 'Countermeasure modul. Odbija rakete.',
  },
  {
    id: 'mod_countermeasure_II',
    name: 'Countermeasure II',
    variant: 'II', rarity: 'E', icon: '🚫',
    effect: { type: 'missile_evade', chance: 35, desc: '35% šansa odbijanja Missile napada' },
    cost: { metal: 12000, crystal: 9000, he3: 5600 },
    source: 'Restricted 5',
    desc: 'Poboljšani countermeasure modul.',
  },
  {
    id: 'mod_countermeasure_III',
    name: 'Countermeasure III',
    variant: 'III', rarity: 'E', icon: '🚫',
    effect: { type: 'missile_evade', chance: 50, desc: '50% šansa odbijanja Missile napada' },
    cost: { metal: 24000, crystal: 18000, he3: 11000 },
    source: 'Restricted 7',
    desc: 'Napredni countermeasure modul. Blokira svaku drugu raketu.',
  },

  // ── Evasion Matrix (Common) — dodge ──
  {
    id: 'mod_evasion_matrix_I',
    name: 'Evasion Matrix I',
    variant: 'I', rarity: 'C', icon: '🌀',
    effect: { type: 'dodge', chance: 8, desc: '+8% šansa izbjegavanja napada' },
    cost: { metal: 400, crystal: 300, he3: 120 },
    source: 'Humanoid 3',
    desc: 'Recon sistem za izbjegavanje.',
  },
  {
    id: 'mod_evasion_matrix_II',
    name: 'Evasion Matrix II',
    variant: 'II', rarity: 'C', icon: '🌀',
    effect: { type: 'dodge', chance: 16, desc: '+16% šansa izbjegavanja napada' },
    cost: { metal: 900, crystal: 680, he3: 280 },
    source: 'Instanca 15',
    desc: 'Poboljšani evasion matrix.',
  },
  {
    id: 'mod_evasion_matrix_III',
    name: 'Evasion Matrix III',
    variant: 'III', rarity: 'C', icon: '🌀',
    effect: { type: 'dodge', chance: 25, desc: '+25% šansa izbjegavanja napada' },
    cost: { metal: 1800, crystal: 1400, he3: 560 },
    source: 'Humanoid 9',
    desc: 'Napredni evasion matrix. Svaki četvrti napad promaši.',
  },

  // ── Stealth Cloak (Rare) — runda 1 zaštita ──
  {
    id: 'mod_stealth_cloak_I',
    name: 'Stealth Cloak I',
    variant: 'I', rarity: 'R', icon: '👻',
    effect: { type: 'stealth_round1', reduction: 30, desc: '-30% primljene štete u prvoj rundi borbe' },
    cost: { metal: 2200, crystal: 1800, he3: 900 },
    source: 'Restricted 2',
    desc: 'Stealth cloak. Izviđač je nevidljiv pri prvom kontaktu.',
  },
  {
    id: 'mod_stealth_cloak_II',
    name: 'Stealth Cloak II',
    variant: 'II', rarity: 'R', icon: '👻',
    effect: { type: 'stealth_round1', reduction: 50, desc: '-50% primljene štete u prvoj rundi borbe' },
    cost: { metal: 5000, crystal: 4000, he3: 2000 },
    source: 'Restricted 4',
    desc: 'Poboljšani stealth cloak.',
  },
  {
    id: 'mod_stealth_cloak_III',
    name: 'Stealth Cloak III',
    variant: 'III', rarity: 'R', icon: '👻',
    effect: { type: 'stealth_round1', reduction: 70, desc: '-70% primljene štete u prvoj rundi + kontranapad +20% šteta' },
    cost: { metal: 10000, crystal: 8000, he3: 4000 },
    source: 'Restricted 6',
    desc: 'Napredni stealth cloak. Gotovo nevidljiv u zasadi.',
  },

  // ── Sprint Drive (Epic) — inicijativa / first strike ──
  {
    id: 'mod_sprint_drive_I',
    name: 'Sprint Drive I',
    variant: 'I', rarity: 'E', icon: '💨',
    effect: { type: 'initiative', bonus: 2, desc: '+2 inicijativa — napada prije ostalih' },
    cost: { metal: 5500, crystal: 4500, he3: 2800 },
    source: 'Trial 2',
    desc: 'Sprint drive. Izviđač reaguje brže od svih.',
  },
  {
    id: 'mod_sprint_drive_II',
    name: 'Sprint Drive II',
    variant: 'II', rarity: 'E', icon: '💨',
    effect: { type: 'initiative', bonus: 4, first_strike_bonus: 15, desc: '+4 inicijativa + prvi napad +15% štete' },
    cost: { metal: 12000, crystal: 9500, he3: 6000 },
    source: 'Trial 5',
    desc: 'Poboljšani sprint drive. Uvijek ide prvi i udara jače.',
  },
  {
    id: 'mod_sprint_drive_III',
    name: 'Sprint Drive III',
    variant: 'III', rarity: 'E', icon: '💨',
    effect: { type: 'initiative', bonus: 6, first_strike_bonus: 30, desc: '+6 inicijativa + prvi napad +30% štete + garantovani krit' },
    cost: { metal: 24000, crystal: 19000, he3: 12000 },
    source: 'Trial 8',
    desc: 'Napredni sprint drive. Garantovani krit na prvi napad.',
  },

  // ── Shadow Protocol (Legendary) — evade + ambush ──
  {
    id: 'mod_shadow_protocol_I',
    name: 'Shadow Protocol I',
    variant: 'I', rarity: 'L', icon: '🕷️',
    effect: { type: 'shadow', evade: 15, ambush_dmg: 15, desc: '+15% evade + +15% šteta iz zasjede' },
    cost: { metal: 20000, crystal: 15000, he3: 9000 },
    source: 'Constellation 1',
    desc: 'Shadow protocol. Neuhvatljiv i smrtonosan iz zasjede.',
  },
  {
    id: 'mod_shadow_protocol_II',
    name: 'Shadow Protocol II',
    variant: 'II', rarity: 'L', icon: '🕷️',
    effect: { type: 'shadow', evade: 25, ambush_dmg: 25, desc: '+25% evade + +25% šteta + -1 cooldown oružja' },
    cost: { metal: 45000, crystal: 35000, he3: 21000 },
    source: 'Constellation 2',
    desc: 'Poboljšani shadow protocol.',
  },
  {
    id: 'mod_shadow_protocol_III',
    name: 'Shadow Protocol III',
    variant: 'III', rarity: 'L', icon: '🕷️',
    effect: { type: 'shadow', evade: 40, ambush_dmg: 40, execute: 8, desc: '+40% evade + +40% štada + 8% execute ispod 15% HP' },
    cost: { metal: 90000, crystal: 70000, he3: 42000 },
    source: 'Constellation 3',
    desc: 'Napredni shadow protocol. Ubija prije nego što ga itko vidi.',
  },
];

// ── HELPER FUNKCIJE ──
function getReconById(id) {
  return RECON_MODULES.find(m => m.id === id) || null;
}

function getReconByRarity(rarity) {
  return RECON_MODULES.filter(m => m.rarity === rarity);
}

// Export
if (typeof module !== 'undefined') {
  module.exports = { RECON_MODULES };
}
