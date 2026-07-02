// ============================================================
// HIVE GALAXY — data/passive_bonuses.js
// Strukturirani borbeni bonusi za SVE pasivne sposobnosti komandira.
// Ovaj fajl NE zamjenjuje commanders*.js — samo dodaje mehaničke vrijednosti.
//
// Struktura bonusa:
//   atk, hp, shield          — % bonus cijeloj floti
//   shield_regen             — % multiplikator shield regeneracije
//   hp_regen                 — % HP koji se obnovi po rundi
//   evasion                  — +agility poena (1 poena ≈ 1% evasion šanse)
//   speed                    — +speed poena
//   crit                     — +% crit šansa
//   crit_dmg                 — +% crit šteta (base 50%)
//   dmg_reduction            — % smanjenje primljene štete
//   heat_atk/kinetic_atk/
//   explosive_atk/magnetic_atk — % bonus DPS za taj tip oružja
//   battleship_atk/hp, fighter_atk/hp,
//   cruiser_atk/hp, scout_atk/evasion,
//   carrier_atk/hp, special_atk/all  — klasa-specifično
//   enemy_atk                — smanjuje neprijateljev DPS za %
//   enemy_crit               — smanjuje neprijateljevu crit šansu za %
//   kill_atk_stack           — na killu, ostatak +X% napad (kumulativno, max 60)
//   first_round_atk          — +X% napad SAMO u rundi 1
//   berserker_atk            — na <50% HP, +X% napad
//   dodge_chance             — X% šanse da napad potpuno promašuje
//   revive_chance            — X% šanse da mrtvi brod oživi sa 25% HP
//   double_hit_chance        — X% šanse da napad pogodi dvaput
//   round_atk_stack          — +X% napad svake runde (kumulativno, nema max)
//   hp_drain_start           — gubi X% HP na početku ali dobija atk_boost
//   hit_stack_atk            — svaki primljeni udar +X% napad (Krall stil)
// ============================================================

const CMD_PASSIVE_BONUSES = {

  // ══════════════════════════════════════════════════════════
  // ORIGIN — VANGUARD
  // ══════════════════════════════════════════════════════════

  // ── Common ──
  cmd_iron_rex:    { atk: 5 },
  cmd_blaze_korr:  { heat_atk: 8 },
  cmd_ragnar:      { berserker_atk: 15 },
  cmd_kane:        { kill_atk_stack: 4 },
  cmd_steele:      { crit: 5 },
  cmd_rork:        { explosive_atk: 10 },
  cmd_mira:        { first_round_atk: 20 },
  cmd_bray:        { speed: 1, evasion: 5 },

  // ── Rare ──
  cmd_kira_voss:   { atk: 10, hp: 5 },
  cmd_marcus_cole: { kill_atk_stack: 3 },
  cmd_zane:        { atk: 8, speed: 2 },
  cmd_helga:       { battleship_atk: 15, battleship_hp: 10 },
  cmd_drax:        { explosive_atk: 20 },
  cmd_brutus:      { crit: 5, crit_dmg: 50 },

  // ── Epic ──
  cmd_ares:        { atk: 15, crit: 10 },
  cmd_nemesis:     { kill_atk_stack: 4 },
  cmd_berserker:   { berserker_atk: 40 },
  cmd_titan_cmd:   { battleship_atk: 20, battleship_hp: 20, carrier_atk: 20, carrier_hp: 20 },

  // ── Legendary ──
  cmd_ragnarok:    { atk: 25, explosive_atk: 30 },
  cmd_annihilator: { crit_dmg: 100 },

  // ══════════════════════════════════════════════════════════
  // ORIGIN — SENTINEL
  // ══════════════════════════════════════════════════════════

  // ── Common ──
  cmd_aegis:       { shield: 10 },
  cmd_crest:       { cruiser_hp: 10 },
  cmd_ironwall:    { battleship_hp: 15, dmg_reduction: 5 },
  cmd_stone:       { dmg_reduction: 5 },
  cmd_ward:        { carrier_hp: 12, carrier_shield: 8 },
  cmd_bulwark:     { hp: 8 },
  cmd_rampart:     { enemy_crit: 5 },
  cmd_bastion:     { hp: 5, dmg_reduction: 5 },

  // ── Rare ──
  cmd_atlas:       { hp: 15, shield_regen: 20 },
  cmd_guardian:    { shield: 20 },
  cmd_fortis:      { explosive_reduction: 15, dmg_reduction: 5 },
  cmd_coda:        { hp_regen: 8 },
  cmd_valor:       { revive_chance: 10 },
  cmd_phalanx:     { dmg_reduction: 10 },

  // ── Epic ──
  cmd_bishop:      { shield: 20, enemy_crit: 10 },
  cmd_colossus:    { hp: 25, dmg_reduction: 12 },
  cmd_fortress:    { round_atk_stack: 0, hp: 10, dmg_reduction: 8 },
  cmd_mammoth:     { battleship_hp: 40, dmg_reduction: 20 },

  // ── Legendary ──
  cmd_gerty:       { hp: 30, shield_regen: 50, hp_regen: 8 },
  cmd_monolith:    { dmg_reduction: 30, dodge_chance: 20 },

  // ══════════════════════════════════════════════════════════
  // ORIGIN — TECHNOCRAT
  // ══════════════════════════════════════════════════════════

  // ── Common ──
  cmd_cipher:      { scout_evasion: 10, scout_speed: 10 },
  cmd_vector:      { crit: 5, crit_dmg: 20 },
  cmd_axiom:       { hp: 8 },
  cmd_grid:        { atk: 5 },
  cmd_byte:        { scout_speed: 8, fighter_speed: 8 },
  cmd_flux:        {},
  cmd_node:        { atk: 3, hp: 3, shield: 3 },
  cmd_helix:       { special_atk: 15, special_hp: 15 },

  // ── Rare ──
  cmd_nexus:       { atk: 10, hp: 10, shield: 10 },
  cmd_oracle:      { evasion: 20 },
  cmd_matrix:      { atk: 8, enemy_atk: 8 },
  cmd_qubit:       { dodge_chance: 15 },
  cmd_prism:       { reflect_dmg: 10 },
  cmd_sigma:       { kill_atk_stack: 2 },

  // ── Epic ──
  cmd_david:       { crit: 30, kill_atk_stack: 5 },
  cmd_cortex:      { atk: 15, hp: 15, shield: 15 },
  cmd_quantum:     { dodge_chance: 25, scout_evasion: 40, scout_atk: 20 },
  cmd_hyperion:    { heat_atk: 25, hp_regen: 3 },

  // ── Legendary ──
  cmd_hal:         { crit: 25, enemy_crit: 15, evasion: 10 },
  cmd_singularity: { atk: 20, hp: 20, shield: 20, enemy_atk: 10 },

  // ══════════════════════════════════════════════════════════
  // ORIGIN — SHADOW
  // ══════════════════════════════════════════════════════════

  // ── Common ──
  cmd_wraith:      { scout_evasion: 10 },
  cmd_phantom:     { scout_atk: 15 },
  cmd_echo:        { double_hit_chance: 10 },
  cmd_void:        { special_atk: 10 },
  cmd_specter:     { revive_chance: 5 },
  cmd_rael:        { evasion: 8 },
  cmd_fade:        { first_round_immune: 1 },
  cmd_glitch:      { enemy_self_chance: 8 },

  // ── Rare ──
  cmd_ghost:       { scout_atk: 15, scout_evasion: 15, fighter_atk: 15 },
  cmd_dagger:      { crit: 15, crit_dmg: 30 },
  cmd_noir:        { atk: 12 },
  cmd_mirage:      { dodge_chance: 20 },
  cmd_veil:        { enemy_crit: 20, evasion: 15 },
  cmd_shade:       { first_round_atk: 30 },

  // ── Epic ──
  cmd_ash:         { atk: 20, evasion: 15 },
  cmd_ava:         { evasion: 30, dodge_chance: 10 },
  cmd_roy:         { hit_stack_atk: 3 },
  cmd_nyx:         { evasion: 25, hp_on_miss: 2 },

  // ── Legendary ──
  cmd_samantha:    { atk: 30, hp: 30, shield: 30 },
  cmd_erebus:      { atk: 35, enemy_atk: 20 },

  // ══════════════════════════════════════════════════════════
  // ORIGIN — SOLAR
  // ══════════════════════════════════════════════════════════

  // ── Common ──
  cmd_nova:        { heat_atk: 8 },
  cmd_lyra:        { hp_regen: 5 },
  cmd_helios:      { hp: 8 },
  cmd_aurora:      { shield_regen: 15 },
  cmd_dawn:        { first_round_atk: 15 },
  cmd_flare:       { explosive_atk: 8 },
  cmd_pulse:       { hp_regen: 8 },
  cmd_solenne:     { atk: 12, hp: 12 },

  // ── Rare ──
  cmd_cassian:     { atk: 10 },
  cmd_lumina:      { hp: 15, hp_regen: 5 },
  cmd_solaris:     { heat_atk: 20, shield: 15 },
  cmd_beacon:      { speed: 2, evasion: 12 },
  cmd_vela:        { speed: 3, scout_atk: 20 },
  cmd_radiant:     { atk: 10, hp: 10, shield: 10 },

  // ── Epic ──
  cmd_seraph:      { hp: 20, shield: 20, hp_regen: 5, enemy_atk: 10 },
  cmd_celestia:    { heat_atk: 30, hp: 20 },
  cmd_aeon:        { hp_regen: 5, round_atk_stack: 5 },
  cmd_galatea:     { atk: 15, hp: 15, shield: 15 },

  // ── Legendary ──
  cmd_omnilux:     { hp: 30, atk: 30, shield: 30, hp_regen: 5 },
  cmd_genesis:     { round_atk_stack: 5, hp_regen: 5 },

  // ══════════════════════════════════════════════════════════
  // XENOS — KRALL
  // ══════════════════════════════════════════════════════════

  // ── Common ──
  xc_krall_rorg:   { hit_stack_atk: 2 },
  xc_krall_vrek:   { explosive_atk: 10 },
  xc_krall_tura:   { cruiser_hp: 12, cruiser_atk: 12 },
  xc_krall_grak:   { battleship_atk: 15 },
  xc_krall_skarr:  { hp_drain_start: 5, atk: 20 },
  xc_krall_droga:  { kill_hp_regen: 3 },
  xc_krall_keth:   { scout_atk: 10, scout_speed: 10, fighter_atk: 10, fighter_speed: 10 },
  xc_krall_morg:   { fighter_evasion: 8, fighter_atk: 8 },

  // ── Rare ──
  xc_krall_wrex:   { hp_regen: 8 },
  xc_krall_grunt:  { battleship_atk: 20, battleship_hp: 20, dmg_reduction: 8 },
  xc_krall_yorg:   { hp_drain_start: 15, atk: 30, hp_regen: 5 },
  xc_krall_varr:   { enemy_count_atk: 5 },
  xc_krall_thraka: { heat_reduction: 20, explosive_reduction: 20 },
  xc_krall_brakus: { round_atk_stack: 3 },

  // ── Epic ──
  xc_krall_urdnot:        { atk: 20, kill_hp_regen: 5 },
  xc_krall_kraga:         { special_atk: 30, heat_atk: 25 },
  xc_krall_predator:      { crit: 25, evasion: 10 },
  xc_krall_queen_krall:   { atk: 25, hp_regen: 8, hit_stack_atk: 8 },

  // ── Legendary ──
  xc_krall_overlord:      { atk: 30, enemy_atk: 20, kill_atk_stack: 5 },
  xc_krall_ancient_blood: { atk: 25, hp: 25, hp_regen: 8, revive_chance: 50 },

  // ══════════════════════════════════════════════════════════
  // XENOS — ETHEREAL
  // ══════════════════════════════════════════════════════════

  // ── Common ──
  xc_eth_liss:      { enemy_atk: 8 },
  xc_eth_vael:      { scout_evasion: 15 },
  xc_eth_sera:      { enemy_crit: 30 },
  xc_eth_zyn:       { magnetic_atk: 10 },
  xc_eth_mira_eth:  { atk: 5, hp_regen: 3 },
  xc_eth_kael:      { dodge_chance: 15 },
  xc_eth_thyra:     { hp_regen: 8 },
  xc_eth_rynn:      { speed: 2, evasion: 10 },

  // ── Rare ──
  xc_eth_tali:      { shield: 20, shield_regen: 15 },
  xc_eth_mordin:    { atk: 15, hp: 15, shield: 15 },
  xc_eth_neytiri:   { evasion: 20, hp_regen: 5 },
  xc_eth_spock:     { crit: 10, evasion: 15 },
  xc_eth_zeratul:   { evasion: 15 },
  xc_eth_lyss_rare: { magnetic_atk: 20, enemy_shield: 15 },

  // ── Epic ──
  xc_eth_javik:     { kill_atk_stack: 5 },
  xc_eth_kerrigan:  { crit: 25, round_atk_stack: 4 },
  xc_eth_thanos_eth:{ evasion: 25, enemy_crit: 20 },
  xc_eth_ego:       { atk: 20, hp: 20, shield: 20, hp_regen: 8 },

  // ── Legendary ──
  xc_eth_the_broker:  { evasion: 30, enemy_atk: 20, atk: 20 },
  xc_eth_sovereign:   { atk: 35, hp: 35, shield: 35, enemy_atk: 25 },

  // ══════════════════════════════════════════════════════════
  // XENOS — SYNTH
  // ══════════════════════════════════════════════════════════

  // ── Common ──
  xc_syn_unit_7:      { miss_stack_atk: 5 },
  xc_syn_cipher_x:    { enemy_crit: 10 },
  xc_syn_reaper_drone:{ scout_atk: 8, fighter_atk: 8, scout_speed: 8, fighter_speed: 8 },
  xc_syn_protocol_9:  { atk: 5, hp: 5, shield: 5 },
  xc_syn_null:        { special_atk: 12, special_hp: 12 },
  xc_syn_glitch_x:    { double_hit_chance: 10 },
  xc_syn_warden:      { dmg_reduction: 10 },
  xc_syn_echo_9:      { enemy_atk: 5 },

  // ── Rare ──
  xc_syn_legion:   { atk: 15, hp: 15, shield: 15, kill_atk_stack: 3 },
  xc_syn_ultron:   { round_atk_stack: 5 },
  xc_syn_vision:   {},
  xc_syn_hk47:     { crit: 20, crit_dmg: 50 },
  xc_syn_edi:      { atk: 12, hp: 12, shield: 12 },
  xc_syn_t800:     { dmg_reduction: 10, atk: 10 },

  // ── Epic ──
  xc_syn_matrix_oracle:{ dodge_chance: 30, crit: 20 },
  xc_syn_jarvis:       { atk: 20, hp: 20, shield: 20, dmg_reduction: 20 },
  xc_syn_shodan:       { dodge_chance: 25, enemy_atk: 25 },
  xc_syn_collective:   { fleet_size_atk: 15 },

  // ── Legendary ──
  xc_syn_reapers_will: { atk: 35, kill_atk_stack: 5 },
  xc_syn_god_machine:  { atk: 40, hp: 40, shield: 40, dodge_chance: 30 },

  // ══════════════════════════════════════════════════════════
  // XENOS — HIVE
  // ══════════════════════════════════════════════════════════

  // ── Common ──
  xc_hive_spore:        { kill_explosion: 20 },
  xc_hive_drone1:       { fighter_atk: 8, scout_atk: 8 },
  xc_hive_mycelium:     { hp_regen: 10 },
  xc_hive_swarm_7:      { berserker_atk: 20 },
  xc_hive_brood:        { dmg_reduction: 8, revive_chance: 10 },
  xc_hive_hivemind_beta:{ round_atk_stack: 3 },
  xc_hive_parasite:     { enemy_dot: 3 },
  xc_hive_groot:        { revive_chance: 30 },

  // ── Rare ──
  xc_hive_xenomorph_queen: { kill_atk_stack: 5, fleet_size_atk: 5 },
  xc_hive_groot_rare:      { hp_regen: 20 },
  xc_hive_overmind:        { fleet_size_atk: 4 },
  xc_hive_star_beast:      { hp: 15 },
  xc_hive_collective_mind: { atk: 10, hp: 10, shield: 10 },
  xc_hive_tyranid:         { kill_atk_stack: 3, kill_hp_regen: 2 },

  // ── Epic ──
  xc_hive_the_flood:     { enemy_dot: 5, hp_regen: 3 },
  xc_hive_zerg_swarm:    { round_atk_stack: 5 },
  xc_hive_world_eater:   { kill_atk_stack: 1, enemy_dot: 8 },
  xc_hive_guardian_ancient: { hp: 25, dmg_reduction: 12 },

  // ── Legendary ──
  xc_hive_star_mother: { atk: 35, hp: 35, shield: 35, revive_chance: 100 },
  xc_hive_omega_swarm: { round_atk_stack: 8, berserker_atk: 30 },

  // ══════════════════════════════════════════════════════════
  // XENOS — ANCIENT
  // ══════════════════════════════════════════════════════════

  // ── Common ──
  xc_anc_stone_eye:    { evasion: 5 },
  xc_anc_dust_walker:  { scout_evasion: 12, scout_speed: 12 },
  xc_anc_echo_time:    { atk: 8, hp: 8, dmg_reduction: 5 },
  xc_anc_void_elder:   { enemy_crit: 8 },
  xc_anc_mountain:     { dmg_reduction: 10, battleship_hp: 15 },
  xc_anc_first_light:  { heat_atk: 10, speed: 1 },
  xc_anc_deep_memory:  { atk: 5, hp: 5 },
  xc_anc_silent_world: { hp: 8, atk: 5 },

  // ── Rare ──
  xc_anc_thrall:       { magnetic_atk: 20, hp: 15 },
  xc_anc_worf:         { atk: 15 },
  xc_anc_elder_god:    { hp_regen: 8, hp: 10 },
  xc_anc_arbiter:      { atk: 12, hit_stack_atk: 5 },
  xc_anc_precursor:    { atk: 8, hp: 8, shield: 8 },
  xc_anc_star_forge:   { heat_atk: 25, atk: 15 },

  // ── Epic ──
  xc_anc_the_monitor:  { dmg_reduction: 25, shield: 30, shield_regen: 20 },
  xc_anc_the_didact:   { hp: 25, dmg_reduction: 15, kill_atk_stack: 8 },
  xc_anc_the_witness:  { atk: 20, hp: 20, shield: 20 },
  xc_anc_cosmic_horror:{ enemy_atk: 30, enemy_crit: 15 },

  // ── Legendary ──
  xc_anc_the_librarian:{ atk: 30, hp: 30, shield: 30, revive_chance: 20 },
  xc_anc_the_traveler: { atk: 35, hp: 35, shield: 35, hp_regen: 8 },

};

// ── Set svih standardizovanih ključeva koje agregator podržava ──
const _ALL_STD_KEYS = new Set([
  'atk','hp','shield','shield_regen','hp_regen','evasion','speed',
  'crit','crit_dmg','dmg_reduction',
  'heat_atk','kinetic_atk','explosive_atk','magnetic_atk',
  'heat_reduction','explosive_reduction',
  'battleship_atk','battleship_hp','fighter_atk','fighter_hp','fighter_evasion','fighter_speed',
  'cruiser_atk','cruiser_hp','cruiser_shield','scout_atk','scout_evasion','scout_speed',
  'carrier_atk','carrier_hp','carrier_shield','special_atk','special_hp',
  'enemy_atk','enemy_crit','enemy_shield',
  'kill_atk_stack','first_round_atk','berserker_atk','dodge_chance','revive_chance',
  'double_hit_chance','round_atk_stack','hp_drain_start','hit_stack_atk','kill_hp_regen',
  'first_round_immune','reflect_dmg','fleet_size_atk','miss_stack_atk','hp_on_miss',
  'enemy_dot','kill_explosion','enemy_self_chance',
]);

// ── Mapiranje Undead inline ključeva u standardizovane ──
const UNDEAD_KEY_MAP = {
  attack_bonus:     'atk',
  hp_bonus:         'hp',
  armor_bonus:      'dmg_reduction',
  evasion_bonus:    'evasion',
  speed_bonus:      'speed',
  crit_bonus:       'crit',
  shield_bonus:     'shield',
  dps_bonus:        'atk',
  agility_bonus:    'evasion',
  enemy_attack_debuff: 'enemy_atk',
  enemy_hp_debuff:  'enemy_shield',
  enemy_dps_debuff: 'enemy_atk',
  kill_stack_attack:'kill_atk_stack',
  kill_stack_dps:   'kill_atk_stack',
  kill_stack_all:   'kill_atk_stack',
  fleet_size_attack:'fleet_size_atk',
  first_round_attack:'first_round_atk',
  last_stand_attack:'berserker_atk',
  death_resist:     'dmg_reduction',
};

// ── Klasa-specifično mapiranje (kad Undead ima ship_class polje) ──
const UNDEAD_CLASS_KEYS = {
  attack_bonus:  { fighter:'fighter_atk', cruiser:'cruiser_atk', battleship:'battleship_atk', carrier:'carrier_atk', special:'special_atk', scout:'scout_atk' },
  hp_bonus:      { fighter:'fighter_hp',  cruiser:'cruiser_hp',  battleship:'battleship_hp',  carrier:'carrier_hp',  special:'special_hp' },
  speed_bonus:   { fighter:'fighter_speed', scout:'scout_speed' },
  evasion_bonus: { fighter:'fighter_evasion', scout:'scout_evasion' },
  armor_bonus:   { fighter:null, cruiser:null, battleship:'dmg_reduction', carrier:null, special:null, scout:null },
};

// ── Multiplikatori ocena (F-S) za pasivne bonuse ──
const GRADE_MULT = { S: 1.30, A: 1.20, B: 1.10, C: 1.00, D: 0.90, E: 0.80, F: 0.70 };

const _CLASS_MASTERY_KEY = {
  battleship_atk:'battleship', battleship_hp:'battleship',
  fighter_atk:'fighter', fighter_hp:'fighter', fighter_evasion:'fighter', fighter_speed:'fighter',
  cruiser_atk:'cruiser', cruiser_hp:'cruiser', cruiser_shield:'cruiser',
  scout_atk:'scout', scout_evasion:'scout', scout_speed:'scout',
  carrier_atk:'carrier', carrier_hp:'carrier', carrier_shield:'carrier',
  special_atk:'special', special_hp:'special',
};

const _WEAPON_MASTERY_KEY = {
  kinetic_atk:'kinetic', heat_atk:'heat', explosive_atk:'explosive', magnetic_atk:'magnetic',
};

function _getKeyMult(key, owned) {
  const cls = _CLASS_MASTERY_KEY[key];
  if (cls) { const g = owned?.masteryShips?.[cls]; return GRADE_MULT[g] || 1.0; }
  const wpn = _WEAPON_MASTERY_KEY[key];
  if (wpn) { const g = owned?.masteryWeapons?.[wpn]; return GRADE_MULT[g] || 1.0; }
  // global → koristi najvišu ocenu komandira (brodsku ili oružanu)
  const allShips = owned?.masteryShips || {};
  const allWeapons = owned?.masteryWeapons || {};
  let best = 1.0;
  for (const g of Object.values(allShips)) { const m = GRADE_MULT[g] || 1.0; if (m > best) best = m; }
  for (const g of Object.values(allWeapons)) { const m = GRADE_MULT[g] || 1.0; if (m > best) best = m; }
  return best;
}

function _applyMult(val, key, owned) {
  const m = _getKeyMult(key, owned);
  return m !== 1.0 ? Math.round(val * m) : val;
}

// ── Pronađi commander definiciju po ID-u ──
function _findCommanderById(id) {
  const allCmdArrays = [
    typeof COMMANDERS !== 'undefined' ? COMMANDERS : [],
    typeof COMMANDERS_XENOS !== 'undefined' ? COMMANDERS_XENOS : [],
    typeof COMMANDERS_UNDEAD !== 'undefined' ? COMMANDERS_UNDEAD : [],
  ];
  for (const arr of allCmdArrays) {
    const found = arr.find(c => c.id === id);
    if (found) return found;
  }
  return null;
}

// ── Agregiraj Undead inline bonuse (sa mastery multiplikatorom) ──
function _applyUndeadPassive(agg, passive, owned) {
  if (!passive) return;
  const cls = passive.ship_class || null;
  const addMaxKeys = ['kill_stack_attack','kill_stack_dps','kill_stack_all','first_round_attack','last_stand_attack','fleet_size_attack','kill_hp_regen',
    'dodge_chance','revive_chance','double_hit_chance','round_atk_stack','hp_drain_start',
    'hit_stack_atk','first_round_immune','reflect_dmg','miss_stack_atk','hp_on_miss',
    'enemy_dot','kill_explosion','enemy_self_chance','berserker_atk','first_round_atk'];
  const maxKeysSet = new Set(addMaxKeys);

  for (const [key, val] of Object.entries(passive)) {
    if (key === 'name' || key === 'nameKey' || key === 'desc' || key === 'descKey' || key === 'fleet_recovery' || key === 'ship_class') continue;
    if (!val || typeof val !== 'number') continue;

    const stdKey = UNDEAD_KEY_MAP[key] || (_ALL_STD_KEYS.has(key) ? key : null);
    if (!stdKey) continue;

    let targetKey = stdKey;
    let useMax = maxKeysSet.has(key);

    // Ako ima ship_class, pokušaj klasno mapiranje
    if (cls && UNDEAD_CLASS_KEYS[key]) {
      const clsKey = UNDEAD_CLASS_KEYS[key][cls];
      if (clsKey) {
        targetKey = clsKey;
      } else if (key === 'armor_bonus' && cls) {
        // armor_bonus sa ship_class → globalni dmg_reduction (ostaje stdKey)
      }
    }

    const finalVal = _applyMult(val, targetKey, owned);
    if (useMax) {
      if (finalVal > (agg[targetKey] || 0)) agg[targetKey] = finalVal;
    } else {
      agg[targetKey] = (agg[targetKey] || 0) + finalVal;
    }
  }
}

// ── HELPER: Uzmi sve bonuse od deployed komandira i agreguj ih ──
function getAggregatedCommanderBonuses(deployedCommanders) {
  const agg = {
    atk: 0, hp: 0, shield: 0,
    shield_regen: 0, hp_regen: 0,
    evasion: 0, speed: 0,
    crit: 0, crit_dmg: 0,
    dmg_reduction: 0,
    heat_atk: 0, kinetic_atk: 0, explosive_atk: 0, magnetic_atk: 0,
    heat_reduction: 0, explosive_reduction: 0,
    battleship_atk: 0, battleship_hp: 0,
    fighter_atk: 0, fighter_hp: 0, fighter_evasion: 0, fighter_speed: 0,
    cruiser_atk: 0, cruiser_hp: 0, cruiser_shield: 0,
    scout_atk: 0, scout_evasion: 0, scout_speed: 0,
    carrier_atk: 0, carrier_hp: 0, carrier_shield: 0,
    special_atk: 0, special_hp: 0,
    enemy_atk: 0, enemy_crit: 0, enemy_shield: 0,
    kill_atk_stack: 0,
    first_round_atk: 0,
    berserker_atk: 0,
    dodge_chance: 0,
    revive_chance: 0,
    double_hit_chance: 0,
    round_atk_stack: 0,
    hp_drain_start: 0,
    hit_stack_atk: 0,
    kill_hp_regen: 0,
    first_round_immune: 0,
    reflect_dmg: 0,
    fleet_size_atk: 0,
    miss_stack_atk: 0,
    hp_on_miss: 0,
    enemy_dot: 0,
    kill_explosion: 0,
    enemy_self_chance: 0,
  };

  if (!deployedCommanders || deployedCommanders.length === 0) return agg;

  deployedCommanders.forEach(cmd => {
    // cmd može biti string ID ili objekat sa .id
    const cmdId = typeof cmd === 'string' ? cmd : (cmd?.id || null);
    if (!cmdId) return;

    // 1. Pokušaj standardni CMD_PASSIVE_BONUSES lookup
    const b = CMD_PASSIVE_BONUSES[cmdId];
    if (b) {
      // Additive flat bonuses
      const addKeys = [
        'atk','hp','shield','shield_regen','hp_regen','evasion','speed',
        'crit','crit_dmg','dmg_reduction',
        'heat_atk','kinetic_atk','explosive_atk','magnetic_atk',
        'heat_reduction','explosive_reduction',
        'battleship_atk','battleship_hp',
        'fighter_atk','fighter_hp','fighter_evasion','fighter_speed',
        'cruiser_atk','cruiser_hp','cruiser_shield',
        'scout_atk','scout_evasion','scout_speed',
        'carrier_atk','carrier_hp','carrier_shield',
        'special_atk','special_hp',
        'enemy_atk','enemy_crit','enemy_shield',
      ];
      addKeys.forEach(k => { if (b[k]) agg[k] += b[k]; });

      const maxKeys = [
        'kill_atk_stack','first_round_atk','berserker_atk','dodge_chance',
        'revive_chance','double_hit_chance','round_atk_stack','hp_drain_start',
        'hit_stack_atk','kill_hp_regen','first_round_immune','reflect_dmg',
        'fleet_size_atk','miss_stack_atk','hp_on_miss','enemy_dot',
        'kill_explosion','enemy_self_chance',
      ];
      maxKeys.forEach(k => { if (b[k] && b[k] > agg[k]) agg[k] = b[k]; });
      return;
    }

    // 2. Undead fallback — čitaj inline keys iz commander definicije
    const def = _findCommanderById(cmdId);
    if (def && def.passive) {
      _applyUndeadPassive(agg, def.passive);
    }
  });

  return agg;
}
