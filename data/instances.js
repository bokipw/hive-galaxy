// ============================================================
// HIVE GALAXY — data/instances.js
// Sve instance (dungeoni) s nagradama i zahtjevima
// ============================================================

// ── INSTANCE TIPOVI ──
const INSTANCE_TYPES = {
  standard:    { name: 'Standard',    icon: '🌌', color: '#4488ff', desc: 'Obična instanca. Otvoren pristup.' },
  restricted:  { name: 'Restricted',  icon: '🔒', color: '#aa44ff', desc: 'Zahtijeva određenu moć flote.' },
  trial:       { name: 'Trial',       icon: '⚔️', color: '#ffaa00', desc: 'Timed challenge. Nagrade po ranku.' },
  humanoid:    { name: 'Humanoid',    icon: '👤', color: '#ff6644', desc: 'Humanoidni protivnici. Specijalne nagrade.' },
  pirate:      { name: 'Pirate',      icon: '🏴‍☠️', color: '#884400', desc: 'Piratska flota. Ekskluzivni dropovi.' },
  constellation: { name: 'Constellation', icon: '⭐', color: '#ffcc33', desc: 'Endgame zona. Samo elitni igrači.' },
  boss:        { name: 'Boss Event',  icon: '👹', color: '#ff0044', desc: 'Globalni boss event. Drop only nagrade.' },
  boss_rare:   { name: 'Rare Boss',   icon: '💀', color: '#4488ff', desc: 'Rare Boss — cooldown 4-8h.' },
  boss_epic:   { name: 'Epic Boss',   icon: '👹', color: '#aa44ff', desc: 'Epic Boss — cooldown 24-48h.' },
  boss_legendary: { name: 'Legendary Boss', icon: '🌑', color: '#ffaa00', desc: 'Legendary Boss — cooldown 7 dana.' },
  boss_master: { name: 'THE HIVE GOD', icon: '👑', color: '#ffffff', desc: 'Master Boss — The Hive God.' },
};

// ── DIFFICULTY SKALA ──
// 1 = početnik, 10 = endgame hardcore
const DIFFICULTY = {
  1:  { label: '⭐',          color: '#aaffaa' },
  2:  { label: '⭐⭐',        color: '#88ff88' },
  3:  { label: '⭐⭐⭐',      color: '#ffff66' },
  4:  { label: '⭐⭐⭐⭐',    color: '#ffcc44' },
  5:  { label: '★★★★★',      color: '#ffaa22' },
  6:  { label: '★★★★★★',    color: '#ff8800' },
  7:  { label: '★★★★★★★',  color: '#ff6600' },
  8:  { label: '💀',          color: '#ff4400' },
  9:  { label: '💀💀',        color: '#ff2200' },
  10: { label: '💀💀💀',      color: '#ff0000' },
};

// Instance data je u instances_easy.js / instances_normal.js itd.

// ── RARITY COLOR ──
const INSTANCE_RARITY = {
  C: { name: 'Common',    color: '#ffdd00', label: 'Obično'  },
  R: { name: 'Rare',      color: '#4488ff', label: 'Rijetko' },
  E: { name: 'Epic',      color: '#aa44ff', label: 'Epsko'   },
  L: { name: 'Legendary', color: '#ffaa00', label: 'Legenda' },
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