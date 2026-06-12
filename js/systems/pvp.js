// ============================================================
// HIVE GALAXY — js/systems/pvp.js
// Čist PvP sistem — odvojeno od instanci
// ============================================================

if (!window.pvpShield) window.pvpShield = { active: false, expiresAt: null };

window._currentOpponents = window._currentOpponents || [];

// ── Armor damage reduction (defender armor type) ──
const PVP_ARMOR_REDUCTION = { Light: 0, Medium: 0.10, Heavy: 0.20, Nano: -0.10 };
const PVP_MAX_ROUNDS = 60;

// ── Izgradi battle-ready fleet od snimljenih slotova ──
// Koristi se za LOKALNOG igrača (A) koji ima sve podatke
function buildPvpFleetLocal() {
  const rawSlots = typeof getAllDeployedSlots === 'function' ? getAllDeployedSlots() : [];
  if (rawSlots.length === 0) return [];

  // Research bonusi
  const resDps    = typeof getWeaponsDpsBonus  === 'function' ? (1 + getWeaponsDpsBonus()  / 100) : 1;
  const resShield = typeof getShieldBonus      === 'function' ? (1 + getShieldBonus()      / 100) : 1;
  const resRegen  = typeof getShieldRegenBonus === 'function' ? (1 + getShieldRegenBonus() / 100) : 1;
  const resCrit   = typeof getWeaponsCritBonus === 'function' ? getWeaponsCritBonus() : 0;
  const resDmgRed = typeof getArmorDmgReduction === 'function' ? getArmorDmgReduction() : 0;
  const sfMult    = (buildings.ship_factory?.level || 0) >= 100 ? 1.05 : 1.0;

  // Artifact bonusi
  const ab = typeof getArtifactBonuses === 'function' ? getArtifactBonuses() : {};
  const artAtk  = (ab.attack || 0) + (ab.fleet || 0);
  const artHp   = (ab.hp    || 0) + (ab.fleet || 0);
  const artDef  = (ab.defense || 0) + (ab.resist || 0);
  const artCrit = ab.crit || 0;

  // Commander bonusi
  const deployed = window._deployedCommanders || [];
  const cb = (typeof getAggregatedCommanderBonuses === 'function' && deployed.length > 0)
    ? getAggregatedCommanderBonuses(deployed)
    : {};

  return rawSlots.map((slot, idx) => {
    const stats = typeof calcSlotStats === 'function' ? calcSlotStats(slot) : null;
    const ship  = typeof getShipById   === 'function' ? getShipById(slot.ship_id) : null;
    if (!stats || !ship) return null;

    const cls = slot.ship_id.split('_')[0];

    // Shield specijal i regen
    let shieldRegen = 0;
    let shieldSpec  = null;
    for (let si = 1; si <= 3; si++) {
      const sh = (slot[`shield_${si}`] && typeof getShieldById === 'function')
        ? getShieldById(slot[`shield_${si}`]) : null;
      if (!sh) continue;
      shieldRegen += sh.regen || 0;
      if (!shieldSpec && sh.special) shieldSpec = sh.special;
    }

    // Engine specijal
    const engId   = slot.engine_1 || null;
    const eng     = (engId && typeof getEngineById === 'function') ? getEngineById(engId) : null;
    const engSpec = eng?.special || null;

    // Baza
    let dps     = stats.dps    * resDps    * sfMult;
    let hp      = stats.hp                 * sfMult;
    let shield  = stats.shield * resShield * sfMult;
    let regen   = shieldRegen  * resRegen;
    let agility = stats.agility + (eng?.agility_bonus || 0);
    let speed   = stats.speed   + (eng?.speed > 1 ? eng.speed - 1 : 0);
    let dmgRed  = resDmgRed;
    let critBonus = resCrit;

    // Shield specijal
    if (shieldSpec?.type === 'max_shield_boost') shield *= (1 + shieldSpec.bonus / 100);
    if (shieldSpec?.type === 'extra_regen')       regen  *= (1 + shieldSpec.bonus / 100);

    // Artifact bonusi
    dps    *= (1 + artAtk  / 100);
    hp     *= (1 + artHp   / 100);
    shield *= (1 + artHp   / 100);
    dmgRed += artDef;
    critBonus += artCrit;

    // Commander bonusi — flat
    if (cb.atk)    dps     *= (1 + cb.atk    / 100);
    if (cb.hp)     { hp *= (1 + cb.hp / 100); shield *= (1 + cb.hp / 100); }
    if (cb.shield) shield  *= (1 + cb.shield / 100);
    if (cb.shield_regen) regen *= (1 + cb.shield_regen / 100);
    if (cb.evasion) agility = Math.min(90, agility + cb.evasion);
    if (cb.speed)   speed  += cb.speed;
    if (cb.crit)    critBonus += cb.crit;
    if (cb.dmg_reduction) dmgRed += cb.dmg_reduction;

    // Commander bonusi — klasa-specifični
    if (cls === 'battleship') {
      if (cb.battleship_atk) dps *= (1 + cb.battleship_atk / 100);
      if (cb.battleship_hp)  { hp *= (1 + cb.battleship_hp / 100); }
    }
    if (cls === 'fighter') {
      if (cb.fighter_atk)    dps     *= (1 + cb.fighter_atk    / 100);
      if (cb.fighter_hp)     hp      *= (1 + cb.fighter_hp     / 100);
      if (cb.fighter_evasion) agility = Math.min(90, agility + cb.fighter_evasion);
      if (cb.fighter_speed)  speed   += cb.fighter_speed;
    }
    if (cls === 'cruiser') {
      if (cb.cruiser_atk)    dps    *= (1 + cb.cruiser_atk    / 100);
      if (cb.cruiser_hp)     hp     *= (1 + cb.cruiser_hp     / 100);
      if (cb.cruiser_shield) shield *= (1 + cb.cruiser_shield / 100);
    }
    if (cls === 'scout') {
      if (cb.scout_atk)    dps     *= (1 + cb.scout_atk    / 100);
      if (cb.scout_evasion) agility = Math.min(90, agility + cb.scout_evasion);
      if (cb.scout_speed)  speed   += cb.scout_speed;
    }
    if (cls === 'carrier') {
      if (cb.carrier_atk) dps *= (1 + cb.carrier_atk / 100);
      if (cb.carrier_hp)  hp  *= (1 + cb.carrier_hp  / 100);
    }
    if (cls === 'special') {
      if (cb.special_atk) dps *= (1 + cb.special_atk / 100);
      if (cb.special_hp)  hp  *= (1 + cb.special_hp  / 100);
    }

    const finalShield = Math.floor(shield);
    return {
      id:           `a_${idx}`,
      ship_id:      slot.ship_id,
      name:         ship.name || slot.ship_id,
      count:        slot.count || 1,
      hp:           Math.floor(hp),
      maxHp:        Math.floor(hp),
      shield:       finalShield,
      maxShield:    finalShield,
      shieldRegen:  Math.floor(regen),
      dps:          Math.floor(dps),
      agility:      Math.min(90, agility),
      speed:        Math.max(1, speed),
      armor:        ship.armor || 'Light',
      dmgReduction: Math.min(60, dmgRed),
      critBonus,
      engineSpecial: engSpec || null,
      effects:      [],
      alive:        true,
      side:         'player',
    };
  }).filter(Boolean);
}

// ── Izgradi battle-ready fleet od snapshota (igrač B iz baze) ──
// Snapshot već ima sve stats snimljene — samo inicijalizujemo
function buildPvpFleetFromSnapshot(snapshotFleet) {
  return (snapshotFleet || []).map((s, idx) => ({
    id:           `b_${idx}`,
    ship_id:      s.ship_id,
    name:         s.name || s.ship_id,
    count:        s.count || 1,
    hp:           s.hp,
    maxHp:        s.hp,
    shield:       s.shield  || 0,
    maxShield:    s.shield  || 0,
    shieldRegen:  s.shield_regen || 0,
    dps:          s.dps,
    agility:      s.agility || 0,
    speed:        s.speed   || 1,
    armor:        s.armor   || 'Light',
    dmgReduction: s.dmg_reduction || 0,
    critBonus:    s.crit_bonus    || 0,
    engineSpecial: s.engine_special || null,
    effects:      [],
    alive:        true,
    side:         'enemy',
  })).filter(s => s.hp > 0 && s.dps > 0);
}

// ── PvP simulacija ──
function simulatePvpBattle(fleetA, fleetB) {
  const log = [];
  let round = 0;

  const allUnits = [...fleetA, ...fleetB];
  if (allUnits.length === 0) return { status: 'draw', round: 0, log };

  const alive = side => allUnits.filter(u => u.alive && u.side === side);

  while (round < PVP_MAX_ROUNDS) {
    round++;
    log.push({ type: 'round', msg: `━━━ RUNDA ${round} ━━━` });

    const active = allUnits.filter(u => u.alive);
    // Sortiramo po brzini — brži idu prvi
    active.sort((a, b) => b.speed - a.speed);

    for (const attacker of active) {
      if (!attacker.alive) continue;

      // Shield regen na početku poteza
      if (attacker.shieldRegen > 0 && attacker.shield < attacker.maxShield) {
        attacker.shield = Math.min(attacker.maxShield, attacker.shield + attacker.shieldRegen);
      }

      // Odaberi metu — nasumični živi neprijatelj
      const enemies = allUnits.filter(u => u.alive && u.side !== attacker.side);
      if (enemies.length === 0) break;
      const target = enemies[Math.floor(Math.random() * enemies.length)];

      // Dodge provjera
      if (target.agility > 0 && Math.random() * 100 < target.agility) {
        log.push({ type: 'miss', msg: `💨 ${target.name} izbjegao napad od ${attacker.name}` });
        continue;
      }

      // Kritični udarac
      const critChance = 5 + (attacker.critBonus || 0);
      const isCrit = Math.random() * 100 < critChance;
      const critMult = isCrit ? 1.5 : 1.0;

      // Damage kalkulacija
      const armorRed = PVP_ARMOR_REDUCTION[target.armor] || 0;
      const dmgRed   = (target.dmgReduction || 0) / 100;
      let dmg = Math.floor(attacker.dps * critMult * (1 - armorRed) * (1 - dmgRed));
      dmg = Math.max(1, dmg);

      // Engine specijal — void phase (dodge sve)
      if (target.engineSpecial?.type === 'void_phase') {
        const voidChance = target.engineSpecial.chance || 0;
        if (Math.random() * 100 < voidChance) {
          log.push({ type: 'effect', msg: `🕳️ ${target.name} ušao u void — imun na štetu!` });
          continue;
        }
      }

      // Primijeni štetu — shield prvi, pa hp
      let shieldDmg = 0;
      let hpDmg = 0;
      if (target.shield > 0) {
        shieldDmg = Math.min(target.shield, dmg);
        target.shield -= shieldDmg;
        hpDmg = dmg - shieldDmg;
      } else {
        hpDmg = dmg;
      }
      target.hp -= hpDmg;

      const critTxt = isCrit ? ' 💥KRIT' : '';
      log.push({
        type: 'attack',
        msg: `⚔️ ${attacker.name} → ${target.name}: ${fmt(dmg)} dmg${critTxt}${shieldDmg > 0 ? ` (${fmt(shieldDmg)} shield)` : ''}`
      });

      if (target.hp <= 0) {
        target.hp = 0;
        target.alive = false;
        log.push({ type: 'destroy', msg: `💀 ${target.name} uništen!` });
      }
    }

    // Provjeri završetak
    const aAlive = alive('player').length;
    const bAlive = alive('enemy').length;

    if (aAlive === 0 && bAlive === 0) {
      log.push({ type: 'info', msg: '⚖️ Obje flote uništene — neriješeno!' });
      return { status: 'draw', round, log };
    }
    if (bAlive === 0) {
      log.push({ type: 'info', msg: '🏆 Pobjeda!' });
      return { status: 'victory', round, log };
    }
    if (aAlive === 0) {
      log.push({ type: 'info', msg: '💀 Poraz!' });
      return { status: 'defeat', round, log };
    }
  }

  log.push({ type: 'info', msg: '⏱️ Maksimalan broj rundi — neriješeno.' });
  return { status: 'draw', round, log };
}

// ── ELO rating promjena ──
function calcRatingChange(myRating, oppRating, won) {
  const K = 32;
  const expected = 1 / (1 + Math.pow(10, (oppRating - myRating) / 400));
  const actual = won ? 1 : 0;
  return Math.round(K * (actual - expected));
}

// ── Dohvati protivnike iz Supabase ──
async function refreshOpponents() {
  const el = document.getElementById('opponentList');
  if (el) el.innerHTML = '<div style="color:#6a90b8;padding:20px;text-align:center">⏳ Tražim protivnike...</div>';

  if (!window._supa) {
    if (el) el.innerHTML = '<div style="color:#6a90b8;padding:20px;text-align:center">Nije moguće učitati protivnike.</div>';
    return;
  }

  const myId = window._supaSession
    ? window._supaSession.user.id
    : (window._hiveUser ? 'hive_' + window._hiveUser : null);

  const { data, error } = await window._supa
    .from('pvp_snapshots')
    .select('*')
    .neq('id', myId || '')
    .order('rating', { ascending: false })
    .limit(20);

  if (error || !data || data.length === 0) {
    window._currentOpponents = [];
    if (el) el.innerHTML = '<div style="color:#6a90b8;padding:20px;text-align:center">Nema dostupnih protivnika.</div>';
    return;
  }

  // Sortiraj po blizini ratinga
  const sorted = data.sort((a, b) =>
    Math.abs(a.rating - (pvp.rating || 1000)) - Math.abs(b.rating - (pvp.rating || 1000))
  );

  window._currentOpponents = sorted.slice(0, 8).map(row => ({
    id:       row.id,
    name:     row.username,
    rating:   row.rating  || 1000,
    level:    row.level   || 1,
    power:    row.power   || 0,
    fleet:    Array.isArray(row.fleet) ? row.fleet : [],
    isPremium: row.is_premium || false,
    updatedAt: row.updated_at,
  }));

  if (el) el.innerHTML = renderOpponentListHTML();
  toast('🔄 Protivnici učitani!', 'inf');
}

// ── Render liste protivnika ──
function renderOpponentListHTML() {
  if (window._currentOpponents.length === 0) {
    return '<div style="color:#6a90b8;padding:20px;text-align:center">Nema dostupnih protivnika.</div>';
  }

  const myRating = pvp.rating || 1000;

  return window._currentOpponents.map((opp, idx) => {
    const ratingDiff = opp.rating - myRating;
    const diffColor  = ratingDiff > 0 ? '#ff3355' : '#00ff88';
    const diffText   = (ratingDiff > 0 ? '+' : '') + ratingDiff;
    const fleetCount = opp.fleet ? opp.fleet.length : 0;
    const premBadge  = opp.isPremium ? '<span style="font-size:0.5rem;color:#ffcc44;border:1px solid #ffcc4444;padding:1px 5px;border-radius:3px;margin-left:5px">★ PREMIUM</span>' : '';

    return `
      <div class="card" style="margin-bottom:10px;border-color:rgba(255,51,85,0.2)">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <div>
            <div style="font-size:0.8rem;font-weight:700;color:white">${opp.name}${premBadge}</div>
            <div style="font-size:0.6rem;color:#6a90b8;margin-top:2px">
              Level ${opp.level} · Rating <span style="color:#ffcc44">${opp.rating}</span>
              <span style="color:${diffColor};margin-left:6px">(${diffText})</span>
            </div>
          </div>
          <div style="text-align:right">
            <div style="font-size:0.65rem;color:#00d4ff;font-family:'Orbitron',monospace">${fmt(opp.power)}</div>
            <div style="font-size:0.55rem;color:#6a90b8">${fleetCount} brodova</div>
          </div>
        </div>
        <button class="btn btn-danger" style="width:100%;font-size:0.68rem"
          onclick="startPvpBattle(${idx})">
          ⚔️ NAPADNI
        </button>
      </div>`;
  }).join('');
}

// ── Pokretanje PvP bitke ──
function startPvpBattle(oppIdx) {
  const opp = window._currentOpponents[oppIdx];
  if (!opp) return;

  // Provjeri shield
  if (window.pvpShield?.active && Date.now() < new Date(window.pvpShield.expiresAt).getTime()) {
    toast('🛡️ Tvoj shield je aktivan — ne možeš napadati!', 'warn');
    return;
  }

  // He3 trošak
  const he3Cost = 10;
  if (R.he3 < he3Cost) {
    toast(`⛽ Nedovoljno He3! Treba ${he3Cost}`, 'warn');
    return;
  }
  R.he3 -= he3Cost;
  if (typeof updateResUI === 'function') updateResUI();

  // Provjeri da li protivnik ima fleet
  if (!opp.fleet || opp.fleet.length === 0) {
    toast('⚠️ Protivnik nema raspoređenu flotu!', 'warn');
    return;
  }

  toast(`⚔️ Napadam ${opp.name}...`, 'inf');

  setTimeout(() => {
    const myFleet  = buildPvpFleetLocal();
    const oppFleet = buildPvpFleetFromSnapshot(opp.fleet);

    if (myFleet.length === 0) {
      toast('⚠️ Nemaš brodova u floti!', 'warn');
      return;
    }
    if (oppFleet.length === 0) {
      toast('⚠️ Protivnik nema validnu flotu!', 'warn');
      return;
    }

    const result = simulatePvpBattle(myFleet, oppFleet);
    const isVictory = result.status === 'victory';

    // Rating promjena
    const ratingChange = calcRatingChange(pvp.rating || 1000, opp.rating, isVictory);
    pvp.rating = Math.max(0, (pvp.rating || 1000) + ratingChange);

    // PvP dnevni broj
    window._dailyPvpCount = (window._dailyPvpCount || 0) + 1;

    // Plijen ako pobjeda
    let loot = { metal: 0, crystal: 0, he3: 0 };
    if (isVictory) {
      loot.metal   = Math.floor((opp.power || 10000) * 5);
      loot.crystal = Math.floor((opp.power || 10000) * 4);
      loot.he3     = Math.floor((opp.power || 10000) * 2);
      R.metal   += loot.metal;
      R.crystal += loot.crystal;
      R.he3     += loot.he3;
    }

    // Snimamo u PvP log
    if (!pvp.log) pvp.log = [];
    pvp.log.unshift({
      time:     Date.now(),
      opponent: opp.name,
      rating:   opp.rating,
      result:   result.status,
      rounds:   result.round,
      ratingChange,
      loot,
    });
    if (pvp.log.length > 20) pvp.log = pvp.log.slice(0, 20);

    if (typeof updateResUI === 'function') updateResUI();
    saveGame();

    renderPvpResult(result, opp, loot, ratingChange);
  }, 200);
}

// ── Prikaz rezultata bitke ──
function renderPvpResult(result, opp, loot, ratingChange) {
  const isVictory = result.status === 'victory';
  const isDraw    = result.status === 'draw';

  const statusColor = isVictory ? '#00ff88' : isDraw ? '#ffcc44' : '#ff3355';
  const statusText  = isVictory ? '🏆 POBJEDA!' : isDraw ? '⚖️ NERIJEŠENO' : '💀 PORAZ';

  const lootHtml = isVictory ? `
    <div style="margin:12px 0;padding:10px;background:rgba(0,255,136,0.06);border-radius:6px;border:1px solid rgba(0,255,136,0.15)">
      <div style="font-size:0.6rem;color:#00ff88;font-family:'Orbitron',monospace;margin-bottom:6px">PLIJEN</div>
      <div style="font-size:0.7rem;color:#c0d8f0">
        🔩 ${fmt(loot.metal)} · 💎 ${fmt(loot.crystal)} · ⛽ ${fmt(loot.he3)}
      </div>
    </div>` : '';

  const logHtml = result.log.slice(-30).map(e => `
    <div style="font-size:0.6rem;padding:1px 0;color:${
      e.type === 'round'   ? '#ffcc44' :
      e.type === 'destroy' ? '#ff3355' :
      e.type === 'miss'    ? '#6a90b8' :
      e.type === 'effect'  ? '#aa44ff' :
      e.type === 'info'    ? '#00ff88' :
      '#b0cce8'
    }">${e.msg}</div>`).join('');

  openModal(
    `⚔️ PvP — ${opp.name}`,
    `<div style="text-align:center;margin-bottom:14px">
      <div style="font-size:1.4rem;font-weight:700;color:${statusColor};font-family:'Orbitron',monospace">${statusText}</div>
      <div style="font-size:0.7rem;color:#6a90b8;margin-top:4px">${result.round} rundi · Rating: <span style="color:${ratingChange >= 0 ? '#00ff88' : '#ff3355'}">${ratingChange >= 0 ? '+' : ''}${ratingChange}</span></div>
    </div>
    ${lootHtml}
    <div style="max-height:220px;overflow-y:auto;background:rgba(0,0,0,0.3);border-radius:6px;padding:10px;font-family:'Share Tech Mono',monospace">
      ${logHtml}
    </div>`,
    [{ label: 'Zatvori', cls: 'btn-g', fn: () => { closeModal(); renderPvp(); } }]
  );
}

// ── PvP log ──
function renderPvpLogHTML() {
  if (!pvp.log || pvp.log.length === 0) {
    return '<div style="color:#6a90b8;font-size:0.7rem;text-align:center;padding:20px">Nema borbi još.</div>';
  }
  return pvp.log.map(e => {
    const color  = e.result === 'victory' ? '#00ff88' : e.result === 'draw' ? '#ffcc44' : '#ff3355';
    const icon   = e.result === 'victory' ? '🏆' : e.result === 'draw' ? '⚖️' : '💀';
    const d      = new Date(e.time);
    const timeStr = `${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`;
    return `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.04)">
        <div>
          <span style="color:${color};font-size:0.75rem">${icon} ${e.opponent}</span>
          <span style="color:#6a90b8;font-size:0.6rem;margin-left:8px">${e.rounds} rundi</span>
        </div>
        <div style="text-align:right">
          <span style="color:${e.ratingChange >= 0 ? '#00ff88' : '#ff3355'};font-size:0.7rem">${e.ratingChange >= 0 ? '+' : ''}${e.ratingChange}</span>
          <span style="color:#6a90b8;font-size:0.55rem;margin-left:6px">${timeStr}</span>
        </div>
      </div>`;
  }).join('');
}

// ── Glavni render PvP panela ──
function renderPvp() {
  const el = document.getElementById('pvpContent');
  if (!el) return;

  const shield    = window.pvpShield || { active: false };
  const shieldActive = shield.active && shield.expiresAt && Date.now() < new Date(shield.expiresAt).getTime();
  const shieldLeft   = shieldActive ? Math.ceil((new Date(shield.expiresAt).getTime() - Date.now()) / 60000) : 0;

  el.innerHTML = `
    <!-- Header stats -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px">
      <div style="background:rgba(0,0,0,0.3);border-radius:8px;padding:12px;text-align:center;border:1px solid rgba(255,204,68,0.15)">
        <div style="font-size:1.2rem;font-family:'Orbitron',monospace;color:#ffcc44">${pvp.rating || 1000}</div>
        <div style="font-size:0.55rem;color:#6a90b8;margin-top:2px">RATING</div>
      </div>
      <div style="background:rgba(0,0,0,0.3);border-radius:8px;padding:12px;text-align:center;border:1px solid rgba(0,212,255,0.15)">
        <div style="font-size:1.2rem;font-family:'Orbitron',monospace;color:#00d4ff">${pvp.wins || 0}</div>
        <div style="font-size:0.55rem;color:#6a90b8;margin-top:2px">POBJEDE</div>
      </div>
      <div style="background:rgba(0,0,0,0.3);border-radius:8px;padding:12px;text-align:center;border:1px solid rgba(255,51,85,0.15)">
        <div style="font-size:1.2rem;font-family:'Orbitron',monospace;color:#ff3355">${pvp.losses || 0}</div>
        <div style="font-size:0.55rem;color:#6a90b8;margin-top:2px">PORAZI</div>
      </div>
    </div>

    <!-- Shield status -->
    ${shieldActive ? `
    <div style="padding:10px 14px;background:rgba(0,212,255,0.06);border:1px solid rgba(0,212,255,0.2);border-radius:8px;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between">
      <span style="font-size:0.7rem;color:#00d4ff">🛡️ Shield aktivan — ${shieldLeft} min</span>
      <button onclick="deactivatePvpShield()" style="font-size:0.6rem;padding:3px 10px;background:rgba(255,51,85,0.1);border:1px solid rgba(255,51,85,0.3);color:#ff3355;border-radius:4px;cursor:pointer">Deaktiviraj</button>
    </div>` : `
    <div style="display:flex;gap:8px;margin-bottom:16px">
      <button onclick="activatePvpShield(4)" class="btn" style="flex:1;font-size:0.62rem">🛡️ Shield 4h (${fmt(50000)} metal)</button>
      <button onclick="refreshOpponents()" class="btn btn-g" style="flex:1;font-size:0.62rem">🔄 Osvježi</button>
    </div>`}

    <!-- Protivnici -->
    <div style="font-size:0.6rem;color:#ff3355;font-family:'Orbitron',monospace;letter-spacing:2px;margin-bottom:10px">⚔️ PROTIVNICI</div>
    <div id="opponentList">
      ${window._currentOpponents.length > 0 ? renderOpponentListHTML() : '<div style="color:#6a90b8;padding:20px;text-align:center">⏳ Učitavam...</div>'}
    </div>

    <!-- Log -->
    <div style="font-size:0.6rem;color:#6a90b8;font-family:'Orbitron',monospace;letter-spacing:2px;margin:20px 0 10px">📋 ISTORIJA BORBI</div>
    ${renderPvpLogHTML()}
  `;

  // Učitaj protivnike ako lista prazna
  if (window._currentOpponents.length === 0) refreshOpponents();
}

// ── Shield funkcije ──
function activatePvpShield(hours) {
  const metalCost = 50000;
  if (R.metal < metalCost) { toast(`Nedovoljno metala (${fmt(metalCost)})`, 'warn'); return; }
  R.metal -= metalCost;
  window.pvpShield = { active: true, expiresAt: new Date(Date.now() + hours * 3600000).toISOString() };
  if (typeof updateResUI === 'function') updateResUI();
  saveGame();
  renderPvp();
  toast(`🛡️ Shield aktivan ${hours}h!`, 'ok');
}

function deactivatePvpShield() {
  window.pvpShield = { active: false, expiresAt: null };
  saveGame();
  renderPvp();
}
