// ============================================================
// HIVE GALAXY — data/instances.js
// Sve instance (dungeoni) s nagradama i zahtjevima
// ============================================================

// ── INSTANCE TIPOVI ──
const INSTANCE_TYPES = {
  standard:    { name: 'Standard',    nameKey: 'inst_type.standard.name',    icon: '🌌', color: '#4488ff', desc: 'Obična instanca. Otvoren pristup.', descKey: 'inst_type.standard.desc' },
  restricted:  { name: 'Restricted',  nameKey: 'inst_type.restricted.name',  icon: '🔒', color: '#aa44ff', desc: 'Zahtijeva određenu moć flote.', descKey: 'inst_type.restricted.desc' },
  trial:       { name: 'Trial',       nameKey: 'inst_type.trial.name',       icon: '⚔️', color: '#ffaa00', desc: 'Timed challenge. Nagrade po ranku.', descKey: 'inst_type.trial.desc' },
  humanoid:    { name: 'Humanoid',    nameKey: 'inst_type.humanoid.name',    icon: '👤', color: '#ff6644', desc: 'Humanoidni protivnici. Specijalne nagrade.', descKey: 'inst_type.humanoid.desc' },
  pirate:      { name: 'Pirate',      nameKey: 'inst_type.pirate.name',      icon: '🏴‍☠️', color: '#884400', desc: 'Piratska flota. Ekskluzivni dropovi.', descKey: 'inst_type.pirate.desc' },
  constellation: { name: 'Constellation', nameKey: 'inst_type.constellation.name', icon: '⭐', color: '#ffcc33', desc: 'Endgame zona. Samo elitni igrači.', descKey: 'inst_type.constellation.desc' },
  boss:        { name: 'Boss Event',  nameKey: 'inst_type.boss.name',        icon: '👹', color: '#ff0044', desc: 'Globalni boss event. Drop only nagrade.', descKey: 'inst_type.boss.desc' },
  boss_rare:   { name: 'Rare Boss',   nameKey: 'inst_type.boss_rare.name',   icon: '💀', color: '#4488ff', desc: 'Rare Boss — cooldown 4-8h.', descKey: 'inst_type.boss_rare.desc' },
  boss_epic:   { name: 'Epic Boss',   nameKey: 'inst_type.boss_epic.name',   icon: '👹', color: '#aa44ff', desc: 'Epic Boss — cooldown 24-48h.', descKey: 'inst_type.boss_epic.desc' },
  boss_legendary: { name: 'Legendary Boss', nameKey: 'inst_type.boss_legendary.name', icon: '🌑', color: '#ffaa00', desc: 'Legendary Boss — cooldown 7 dana.', descKey: 'inst_type.boss_legendary.desc' },
  boss_master: { name: 'THE HIVE GOD', nameKey: 'inst_type.boss_master.name', icon: '👑', color: '#ffffff', desc: 'Master Boss — The Hive God.', descKey: 'inst_type.boss_master.desc' },
};

// ── DIFFICULTY SKALA ──
// 1 = početnik, 10 = endgame hardcore
const DIFFICULTY = {
  1:  { label: '⭐',          labelKey: 'difficulty.1.label',  color: '#aaffaa' },
  2:  { label: '⭐⭐',        labelKey: 'difficulty.2.label',  color: '#88ff88' },
  3:  { label: '⭐⭐⭐',      labelKey: 'difficulty.3.label',  color: '#ffff66' },
  4:  { label: '⭐⭐⭐⭐',    labelKey: 'difficulty.4.label',  color: '#ffcc44' },
  5:  { label: '★★★★★',      labelKey: 'difficulty.5.label',  color: '#ffaa22' },
  6:  { label: '★★★★★★',    labelKey: 'difficulty.6.label',  color: '#ff8800' },
  7:  { label: '★★★★★★★',  labelKey: 'difficulty.7.label',  color: '#ff6600' },
  8:  { label: '💀',          labelKey: 'difficulty.8.label',  color: '#ff4400' },
  9:  { label: '💀💀',        labelKey: 'difficulty.9.label',  color: '#ff2200' },
  10: { label: '💀💀💀',      labelKey: 'difficulty.10.label', color: '#ff0000' },
};

// Instance data je u instances_easy.js / instances_normal.js itd.

// ── RARITY COLOR ──
const INSTANCE_RARITY = {
  C: { name: 'Common',    nameKey: 'inst_rarity.C.name',    color: '#ffdd00', label: 'Obično',  labelKey: 'inst_rarity.C.label' },
  R: { name: 'Rare',      nameKey: 'inst_rarity.R.name',    color: '#4488ff', label: 'Rijetko', labelKey: 'inst_rarity.R.label' },
  E: { name: 'Epic',      nameKey: 'inst_rarity.E.name',    color: '#aa44ff', label: 'Epsko',   labelKey: 'inst_rarity.E.label' },
  L: { name: 'Legendary', nameKey: 'inst_rarity.L.name',    color: '#ffaa00', label: 'Legenda', labelKey: 'inst_rarity.L.label' },
};

// ── ROUTING — odaberi pravi data array po težini ──
function getActiveInstances() {
  const mode = (typeof _instDifficultyMode !== 'undefined' ? _instDifficultyMode : 'easy');
  if (mode === 'normal'    && typeof INSTANCES_NORMAL    !== 'undefined' && INSTANCES_NORMAL.length)    return INSTANCES_NORMAL;
  if (mode === 'nightmare' && typeof INSTANCES_NIGHTMARE !== 'undefined' && INSTANCES_NIGHTMARE.length) return INSTANCES_NIGHTMARE;
  if (mode === 'hell'      && typeof INSTANCES_HELL      !== 'undefined' && INSTANCES_HELL.length)      return INSTANCES_HELL;
  return typeof INSTANCES_EASY !== 'undefined' ? INSTANCES_EASY : [];
}

// ── HELPER FUNKCIJE ──

function getInstanceById(id) {
  return getActiveInstances().find(i => i.id === id) || null;
}

function getInstancesByType(type) {
  return getActiveInstances().filter(i => i.type === type);
}

function getInstancesByDifficulty(min, max) {
  return getActiveInstances().filter(i => i.difficulty >= min && i.difficulty <= max);
}

function getInstancesForPower(playerPower) {
  return getActiveInstances().filter(i => i.min_power <= playerPower);
}

function getStandardInstances() {
  return getActiveInstances().filter(i => i.type === 'standard').sort((a, b) => a.number - b.number);
}

function getDropSourceForItem(itemId) {
  const sources = [];
  for (const inst of getActiveInstances()) {
    const { drops } = inst;
    const allDrops = [
      ...(drops.guaranteed || []),
      ...(drops.chance || []).map(c => c.item),
      ...(drops.rank_S || []),
      ...(drops.rank_A || []),
      ...(drops.rank_B || []),
      ...(drops.rank_C || []),
      ...(drops.participation || []),
    ];
    if (allDrops.includes(itemId)) sources.push(inst.name);
  }
  return sources;
}

// Export
if (typeof module !== 'undefined') {
  module.exports = {
    INSTANCES_EASY, INSTANCE_TYPES, DIFFICULTY, INSTANCE_RARITY, getActiveInstances,
    getInstanceById, getInstancesByType,
    getInstancesByDifficulty, getInstancesForPower,
    getStandardInstances, getDropSourceForItem,
  };
}