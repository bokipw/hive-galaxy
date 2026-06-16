// pvp.js - HIVE GALAXY PvP system
// 1. Fleet builders
// 2. Simulacija (cisti math)
// 3. Game callbacks (poziva pvp-battle-3d.js)
// 4. ELO rating
// 5. Supabase protivnici
// 6. Pokretanje bitke
// 7. PvP panel UI
// 8. Shield

if (!window.pvpShield) window.pvpShield = { active: false, expiresAt: null };
window._currentOpponents = window._currentOpponents || [];

const PVP_ARMOR_REDUCTION = { Light: 0, Medium: 0.10, Heavy: 0.20, Nano: -0.10 };
const PVP_MAX_ROUNDS = 60;

// ============================================================
// 1. FLEET BUILDERS
// ============================================================

function buildPvpFleetLocal() {
  const rawSlots = typeof getAllDeployedSlots === 'function' ? getAllDeployedSlots() : [];
  if (rawSlots.length === 0) return [];
  const resDps    = typeof getWeaponsDpsBonus  === 'function' ? (1 + getWeaponsDpsBonus()  / 100) : 1;
  const resShield = typeof getShieldBonus      === 'function' ? (1 + getShieldBonus()      / 100) : 1;
  const resRegen  = typeof getShieldRegenBonus === 'function' ? (1 + getShieldRegenBonus() / 100) : 1;
  const resCrit   = typeof getWeaponsCritBonus === 'function' ? getWeaponsCritBonus() : 0;
  const resDmgRed = typeof getArmorDmgReduction === 'function' ? getArmorDmgReduction() : 0;
  const sfMult    = (buildings.ship_factory?.level || 0) >= 100 ? 1.05 : 1.0;
  const ab = typeof getArtifactBonuses === 'function' ? getArtifactBonuses() : {};
  const artAtk  = (ab.attack || 0) + (ab.fleet || 0);
  const artHp   = (ab.hp    || 0) + (ab.fleet || 0);
  const artDef  = (ab.defense || 0) + (ab.resist || 0);
  const artCrit = ab.crit || 0;
  const deployed = window._deployedCommanders || [];
  const cb = (typeof getAggregatedCommanderBonuses === 'function' && deployed.length > 0)
    ? getAggregatedCommanderBonuses(deployed) : {};

  // Defense building milestones → fleet bonuses
  let bldAtkBonus = 0, bldCritBonus = 0;
  let bldShieldBonus = 0, bldShieldRegenBonus = 0, bldDmgRedBonus = 0;
  let bldEvasionBonus = 0, bldSpeedBonus = 0;
  if (typeof getBuildingMilestones === 'function') {
    const turretLv    = buildings.turret?.level    || 0;
    const missileLv   = buildings.missile_bat?.level || 0;
    const shieldGenLv = buildings.shield_gen?.level  || 0;
    Object.entries(getBuildingMilestones('turret')).forEach(([mlvl, d]) => {
      if (turretLv >= parseInt(mlvl)) {
        if (d.fleetAtkBonus)  bldAtkBonus  = Math.max(bldAtkBonus,  d.fleetAtkBonus);
        if (d.fleetCritBonus) bldCritBonus = Math.max(bldCritBonus, d.fleetCritBonus);
      }
    });
    Object.entries(getBuildingMilestones('missile_bat')).forEach(([mlvl, d]) => {
      if (missileLv >= parseInt(mlvl)) {
        if (d.fleetEvasionBonus) bldEvasionBonus = Math.max(bldEvasionBonus, d.fleetEvasionBonus);
        if (d.fleetSpeedBonus)   bldSpeedBonus   = Math.max(bldSpeedBonus,   d.fleetSpeedBonus);
      }
    });
    Object.entries(getBuildingMilestones('shield_gen')).forEach(([mlvl, d]) => {
      if (shieldGenLv >= parseInt(mlvl)) {
        if (d.fleetShieldBonus)       bldShieldBonus       = Math.max(bldShieldBonus,       d.fleetShieldBonus);
        if (d.fleetShieldRegenBonus)  bldShieldRegenBonus  = Math.max(bldShieldRegenBonus,  d.fleetShieldRegenBonus);
        if (d.fleetDmgReductionBonus) bldDmgRedBonus       = Math.max(bldDmgRedBonus,       d.fleetDmgReductionBonus);
      }
    });
  }

  return rawSlots.map((slot, idx) => {
    const stats = typeof calcSlotStats === 'function' ? calcSlotStats(slot) : null;
    const ship  = typeof getShipById   === 'function' ? getShipById(slot.ship_id) : null;
    if (!stats || !ship) return null;
    const cls = slot.ship_id.split('_')[0];
    let shieldRegen = 0, shieldSpec = null;
    for (let si = 1; si <= 3; si++) {
      const sh = (slot['shield_'+si] && typeof getShieldById === 'function') ? getShieldById(slot['shield_'+si]) : null;
      if (!sh) continue;
      shieldRegen += sh.regen || 0;
      if (!shieldSpec && sh.special) shieldSpec = sh.special;
    }
    const engId = slot.engine_1 || null;
    const eng   = (engId && typeof getEngineById === 'function') ? getEngineById(engId) : null;
    const engSpec = eng?.special || null;
    let dps = stats.dps * resDps * sfMult, hp = stats.hp * sfMult;
    let shield = stats.shield * resShield * sfMult, regen = shieldRegen * resRegen;
    let agility = stats.agility + (eng?.agility_bonus || 0);
    let speed = stats.speed + (eng?.speed > 1 ? eng.speed - 1 : 0);
    let dmgRed = resDmgRed, critBonus = resCrit;
    if (shieldSpec?.type === 'max_shield_boost') shield *= (1 + shieldSpec.bonus / 100);
    if (shieldSpec?.type === 'extra_regen')       regen  *= (1 + shieldSpec.bonus / 100);
    dps *= (1 + artAtk / 100); hp *= (1 + artHp / 100); shield *= (1 + artHp / 100);
    dmgRed += artDef; critBonus += artCrit;
    if (cb.atk)    dps    *= (1 + cb.atk    / 100);
    if (cb.hp)     { hp *= (1 + cb.hp / 100); shield *= (1 + cb.hp / 100); }
    if (cb.shield) shield *= (1 + cb.shield / 100);
    if (cb.shield_regen) regen *= (1 + cb.shield_regen / 100);
    if (cb.evasion) agility = Math.min(90, agility + cb.evasion);
    if (cb.speed)   speed  += cb.speed;
    if (cb.crit)    critBonus += cb.crit;
    if (cb.dmg_reduction) dmgRed += cb.dmg_reduction;
    if (cls === 'battleship') { if (cb.battleship_atk) dps *= (1+cb.battleship_atk/100); if (cb.battleship_hp) hp *= (1+cb.battleship_hp/100); }
    if (cls === 'fighter')   { if (cb.fighter_atk) dps *= (1+cb.fighter_atk/100); if (cb.fighter_hp) hp *= (1+cb.fighter_hp/100); if (cb.fighter_evasion) agility = Math.min(90,agility+cb.fighter_evasion); if (cb.fighter_speed) speed += cb.fighter_speed; }
    if (cls === 'cruiser')   { if (cb.cruiser_atk) dps *= (1+cb.cruiser_atk/100); if (cb.cruiser_hp) hp *= (1+cb.cruiser_hp/100); if (cb.cruiser_shield) shield *= (1+cb.cruiser_shield/100); }
    if (cls === 'scout')     { if (cb.scout_atk) dps *= (1+cb.scout_atk/100); if (cb.scout_evasion) agility = Math.min(90,agility+cb.scout_evasion); if (cb.scout_speed) speed += cb.scout_speed; }
    if (cls === 'carrier')   { if (cb.carrier_atk) dps *= (1+cb.carrier_atk/100); if (cb.carrier_hp) hp *= (1+cb.carrier_hp/100); }
    if (cls === 'special')   { if (cb.special_atk) dps *= (1+cb.special_atk/100); if (cb.special_hp) hp *= (1+cb.special_hp/100); }
    // Defense buildings
    if (bldAtkBonus)       dps    *= (1 + bldAtkBonus / 100);
    if (bldCritBonus)      critBonus += bldCritBonus;
    if (bldShieldBonus)    shield *= (1 + bldShieldBonus / 100);
    if (bldShieldRegenBonus) regen *= (1 + bldShieldRegenBonus / 100);
    if (bldEvasionBonus)   agility = Math.min(90, agility + bldEvasionBonus);
    if (bldSpeedBonus)     speed  += bldSpeedBonus;
    if (bldDmgRedBonus)    dmgRed += bldDmgRedBonus;
    const finalShield = Math.floor(shield);
    return { id:'a_'+idx, ship_id:slot.ship_id, name:ship.name||slot.ship_id, count:slot.count||1,
      hp:Math.floor(hp), maxHp:Math.floor(hp), shield:finalShield, maxShield:finalShield,
      shieldRegen:Math.floor(regen), dps:Math.floor(dps), agility:Math.min(90,agility),
      speed:Math.max(1,speed), armor:ship.armor||'Light', dmgReduction:Math.min(60,dmgRed),
      critBonus, engineSpecial:engSpec||null, effects:[], alive:true, side:'player' };
  }).filter(Boolean);
}

function buildPvpFleetFromSnapshot(snapshotFleet) {
  return (snapshotFleet || []).map((s, idx) => ({
    id:'b_'+idx, ship_id:s.ship_id, name:s.name||s.ship_id, count:s.count||1,
    hp:s.hp, maxHp:s.hp, shield:s.shield||0, maxShield:s.shield||0,
    shieldRegen:s.shield_regen||0, dps:s.dps, agility:s.agility||0, speed:s.speed||1,
    armor:s.armor||'Light', dmgReduction:s.dmg_reduction||0, critBonus:s.crit_bonus||0,
    engineSpecial:s.engine_special||null, effects:[], alive:true, side:'enemy',
  })).filter(s => s.hp > 0 && s.dps > 0);
}

// ============================================================
// 2. SIMULACIJA - cisti math, bez DOM-a
// ============================================================

function simulatePvpBattle(fleetA, fleetB) {
  const clone = u => JSON.parse(JSON.stringify(u));
  const units = [...fleetA.map(clone), ...fleetB.map(clone)];
  const log = [];
  const armorMod = { Light:1, Medium:0.9, Heavy:0.8, Nano:1.1 };
  const alive = side => units.filter(u => u.side === side && u.alive);
  let round = 0;

  while (round < PVP_MAX_ROUNDS) {
    round++;
    log.push({ type:'round', msg:'⚔️ RUNDA' + round + ' ===' });
    const attackers = units.filter(u => u.alive).sort((a,b) => b.speed - a.speed);
    for (const att of attackers) {
      if (!att.alive) continue;
      const enemies = alive(att.side === 'player' ? 'enemy' : 'player');
      if (enemies.length === 0) break;
      const target = enemies[Math.floor(Math.random() * enemies.length)];
      if (target.engineSpecial && target.engineSpecial.type === 'void_phase') {
        if (Math.random() * 100 < (target.engineSpecial.chance || 0)) {
          log.push({ type:'effect', msg:'🌀 ' + target.name + ' fazira u void - imun!', attackerId:att.id, targetId:target.id }); continue;
        }
      }
      if (Math.random() * 100 < (target.agility || 0)) {
        log.push({ type:'miss', msg:'💨 ' + att.name + ' promasuje ' + target.name, attackerId:att.id, targetId:target.id }); continue;
      }
      let dmg = att.dps;
      const critChance = 5 + (att.critBonus || 0);
      const isCrit = Math.random() * 100 < critChance;
      if (isCrit) dmg *= 1.5;
      dmg *= armorMod[target.armor] || 1;
      dmg *= 1 - ((target.dmgReduction || 0) / 100);
      dmg = Math.max(1, Math.round(dmg));
      const shieldDmg = Math.min(target.shield, dmg);
      target.shield -= shieldDmg;
      target.hp = Math.max(0, target.hp - (dmg - shieldDmg));
      var critTxt = isCrit ? ' KRIT' : '';
      var shieldTxt = shieldDmg > 0 ? ' (' + fmt(shieldDmg) + ' SHD)' : '';
      log.push({ type:'attack', msg:'🔫 ' + att.name + ' -> ' + target.name + ': ' + fmt(dmg) + ' dmg' + critTxt + shieldTxt,
        attackerId:att.id, targetId:target.id, damage:dmg, isCrit:isCrit, shieldDmg:shieldDmg,
        hpAfter:target.hp, hpMax:target.maxHp, shieldAfter:target.shield, shieldMax:target.maxShield });
      if (target.hp <= 0 && target.alive) {
        target.alive = false;
        log.push({ type:'destroy', msg:'💥 ' + target.name + ' unisten!', targetId:target.id });
      }
    }
    units.filter(u => u.alive && u.shieldRegen > 0).forEach(u => {
      const before = u.shield;
      u.shield = Math.min(u.maxShield, u.shield + u.shieldRegen);
      if (u.shield > before) log.push({ type:'effect', msg:'🛡️ ' + u.name + ' +' + fmt(u.shield-before) + ' shield', targetId:u.id });
    });
    const pAlive = alive('player').length > 0, eAlive = alive('enemy').length > 0;
    if (!eAlive && !pAlive) { log.push({ type:'info', msg:'⚖️ Nerijaseno!' }); return { status:'draw',    round:round, log:log }; }
    if (!eAlive)            { log.push({ type:'info', msg:'🏆 Pobjeda!' });     return { status:'victory', round:round, log:log }; }
    if (!pAlive)            { log.push({ type:'info', msg:'💀 Poraz!' });      return { status:'defeat',  round:round, log:log }; }
  }
  log.push({ type:'info', msg:'⏱️ Maks. rundi - nerijaseno.' });
  return { status:'draw', round:PVP_MAX_ROUNDS, log:log };
}

// ============================================================
// 3. GAME CALLBACKS - poziva ih pvp-battle-3d.js
// ============================================================

function addPvpLog(msg, type) {
  var el = document.getElementById('pvpBattleLog');
  if (!el) return;
  var col = type==='round'?'#ffcc44':type==='destroy'?'#ff3355':type==='miss'?'#6a90b8':type==='effect'?'#aa44ff':type==='info'?'#00ff88':'#b0cce8';
  var div = document.createElement('div');
  div.style.cssText = 'font-size:0.52rem;padding:2px 0;border-bottom:1px solid rgba(255,255,255,0.03);color:'+col;
  div.textContent = msg;
  el.appendChild(div);
  el.scrollTop = el.scrollHeight;
}

function closePvpBattleModal() {
  var el = document.getElementById('pvpBattleModal');
  if (el) el.remove();
  renderPvp();
}

// pvp-battle-3d.js postavlja window._pvpBattleResult i window._pvpBattleOpp prije poziva
function finishPvpBattle() {
  var result = window._pvpBattleResult;
  var opp    = window._pvpBattleOpp;
  if (!result || !opp) return;
  var isVictory = result.status === 'victory';
  var ratingChange = calcRatingChange(pvp.rating||1000, opp.rating, isVictory);
  pvp.rating = Math.max(0, (pvp.rating||1000) + ratingChange);
  if (isVictory) pvp.wins = (pvp.wins||0)+1;
  else if (result.status==='defeat') pvp.losses = (pvp.losses||0)+1;
  window._dailyPvpCount = (window._dailyPvpCount||0)+1;
  if (isVictory) window._weeklyPvpCount = (window._weeklyPvpCount||0)+1;
  if (isVictory) window._dailyPvpWinCount = (window._dailyPvpWinCount||0)+1;
  var loot = { metal:0, crystal:0, he3:0, bocrypto:0 };
  if (isVictory) {
    loot.metal    = 100000;
    loot.crystal  = 100000;
    loot.he3      = 100000;
    loot.bocrypto = 1100;
    R.metal    += loot.metal;
    R.crystal  += loot.crystal;
    R.he3      += loot.he3;
    R.bocrypto  = (R.bocrypto || 0) + loot.bocrypto;
  }
  if (!pvp.log) pvp.log = [];
  pvp.log.unshift({ time:Date.now(), opponent:opp.name, rating:opp.rating, result:result.status, rounds:result.round, ratingChange:ratingChange, loot:loot });
  if (pvp.log.length>20) pvp.log = pvp.log.slice(0,20);
  if (typeof updateResUI==='function') updateResUI();
  saveGame();
  window._pvpBattleResult = null;
  window._pvpBattleOpp    = null;
}

// ============================================================
// 4. ELO RATING
// ============================================================
function calcRatingChange(myRating, oppRating, won) {
  var my = myRating  || 1000;
  var op = oppRating || 1000;
  var K = 32, expected = 1 / (1 + Math.pow(10, (op - my) / 400));
  return Math.round(K * ((won ? 1 : 0) - expected));
}

// ============================================================
// 5. SUPABASE - protivnici
// ============================================================
async function refreshOpponents() {
  var el = document.getElementById('opponentList');
  if (el) el.innerHTML = '<div style="color:#6a90b8;padding:20px;text-align:center">'+t('pvp.searching')+'</div>';
  if (!window._supa) { if (el) el.innerHTML = '<div style="color:#6a90b8;padding:20px;text-align:center">'+t('pvp.cannotLoad')+'</div>'; return; }
  var myId = window._supaSession ? window._supaSession.user.id : (window._hiveUser?'hive_'+window._hiveUser:null);
  var res = await window._supa.from('pvp_snapshots').select('*').neq('id',myId||'').order('rating',{ascending:false}).limit(20);
  var data = res.data, error = res.error;
  if (error || !data || data.length===0) {
    window._currentOpponents = [];
    if (el) el.innerHTML = '<div style="color:#6a90b8;padding:20px;text-align:center">'+t('pvp.noOpponents')+'</div>';
    return;
  }
  var sorted = data.sort((a,b) => Math.abs(a.rating-(pvp.rating||1000)) - Math.abs(b.rating-(pvp.rating||1000)));
  window._currentOpponents = sorted.slice(0,8).map(row => ({
    id:row.id, name:row.username, rating:row.rating||1000, level:row.level||1,
    power:row.power||0, fleet:Array.isArray(row.fleet)?row.fleet:[], isPremium:row.is_premium||false, updatedAt:row.updated_at,
  }));
  if (el) el.innerHTML = renderOpponentListHTML();
  toast(t('pvp.loaded'),'inf');
}

function renderOpponentListHTML() {
  if (window._currentOpponents.length===0) return '<div style="color:#6a90b8;padding:20px;text-align:center">Nema dostupnih protivnika.</div>';
  var myRating = pvp.rating||1000;
  return window._currentOpponents.map((opp,idx) => {
    var diff=opp.rating-myRating, dc=diff>0?'#ff3355':'#00ff88';
    var prem=opp.isPremium?'<span style="font-size:0.5rem;color:#ffcc44;border:1px solid #ffcc4444;padding:1px 5px;border-radius:3px;margin-left:5px">PREMIUM</span>':'';
    return '<div class="card" style="margin-bottom:10px;border-color:rgba(255,51,85,0.2)">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">' +
      '<div><div style="font-size:0.8rem;font-weight:700;color:white">'+opp.name+prem+'</div>' +
      '<div style="font-size:0.6rem;color:#6a90b8;margin-top:2px">Level '+opp.level+' Rating <span style="color:#ffcc44">'+opp.rating+'</span> <span style="color:'+dc+'">'+(diff>0?'+':'')+diff+'</span></div></div>' +
      '<div style="text-align:right"><div style="font-size:0.65rem;color:#00d4ff;font-family:Orbitron,monospace">'+fmt(opp.power)+'</div>' +
      '<div style="font-size:0.55rem;color:#6a90b8">'+(opp.fleet?opp.fleet.length:0)+' brodova</div></div>' +
      '</div>' +
      '<button class="btn btn-danger" style="width:100%;font-size:0.68rem" onclick="startPvpBattle('+idx+')">⚔️ NAPADNI (1000 ⚡ + 1000 BOCRYPTO)</button>' +
      '</div>';
  }).join('');
}

// ============================================================
// 6. POKRETANJE BITKE
// ============================================================
function startPvpBattle(oppIdx) {
  if (document.getElementById('pvpBattleModal')) closePvpBattleModal();
  var opp = window._currentOpponents[oppIdx];
  if (!opp) return;
  if (window.pvpShield && window.pvpShield.active && Date.now()<new Date(window.pvpShield.expiresAt).getTime()) { toast(t('pvp.shieldActive'),'warn'); return; }
  var energyCost=1000, bocCost=1000;
  // Provjeri flotu PRIJE oduzimanja resursa
  var myFleet = buildPvpFleetLocal();
  if (myFleet.length===0) { toast(t('pvp.noFleet'),'warn'); return; }
  if (!opp.fleet||opp.fleet.length===0) { toast(t('pvp.enemyNoFleet'),'warn'); return; }
  if (R.energy<energyCost) { toast(t('pvp.notEnoughEnergy',{cost:energyCost}),'warn'); return; }
  if ((R.bocrypto||0)<bocCost) { toast(t('pvp.notEnoughBocrypto',{cost:bocCost}),'warn'); return; }
  R.energy -= energyCost;
  R.bocrypto = (R.bocrypto||0) - bocCost;
  if (typeof updateResUI==='function') updateResUI();
  toast(t('pvp.attacking',{name:opp.name}),'inf');
  setTimeout(function() {
    var oppFleet=buildPvpFleetFromSnapshot(opp.fleet);
    if (oppFleet.length===0) { toast(t('pvp.enemyNoValidFleet'),'warn'); return; }
    openPvpBattleVisual(myFleet, oppFleet, opp);
  }, 200);
}

// ============================================================
// 7. PvP PANEL UI
// ============================================================
function renderPvpLogHTML() {
  if (!pvp.log||pvp.log.length===0) return '<div style="color:#6a90b8;font-size:0.7rem;text-align:center;padding:20px">Nema borbi jos.</div>';
  return pvp.log.map(function(e) {
    var col=e.result==='victory'?'#00ff88':e.result==='draw'?'#ffcc44':'#ff3355';
    var icon=e.result==='victory'?'🏆':e.result==='draw'?'[=]':'💀';
    var d=new Date(e.time), ts=d.getHours()+':'+String(d.getMinutes()).padStart(2,'0');
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.04)">' +
      '<div><span style="color:'+col+';font-size:0.75rem">'+icon+' '+e.opponent+'</span><span style="color:#6a90b8;font-size:0.6rem;margin-left:8px">'+e.rounds+' rundi</span></div>' +
      '<div style="text-align:right"><span style="color:'+(e.ratingChange>=0?'#00ff88':'#ff3355')+';font-size:0.7rem">'+(e.ratingChange>=0?'+':'')+e.ratingChange+'</span><span style="color:#6a90b8;font-size:0.55rem;margin-left:6px">'+ts+'</span></div>' +
      '</div>';
  }).join('');
}

function renderPvp() {
  var el = document.getElementById('pvpContent');
  if (!el) return;
  var shield=window.pvpShield||{active:false};
  var sa=shield.active&&shield.expiresAt&&Date.now()<new Date(shield.expiresAt).getTime();
  var sl=sa?Math.ceil((new Date(shield.expiresAt).getTime()-Date.now())/60000):0;
  el.innerHTML =
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px">' +
      '<div style="background:rgba(0,0,0,0.3);border-radius:8px;padding:12px;text-align:center;border:1px solid rgba(255,204,68,0.15)"><div style="font-size:1.2rem;font-family:Orbitron,monospace;color:#ffcc44">'+(pvp.rating||1000)+'</div><div style="font-size:0.55rem;color:#6a90b8;margin-top:2px">RATING</div></div>' +
      '<div style="background:rgba(0,0,0,0.3);border-radius:8px;padding:12px;text-align:center;border:1px solid rgba(0,212,255,0.15)"><div style="font-size:1.2rem;font-family:Orbitron,monospace;color:#00d4ff">'+(pvp.wins||0)+'</div><div style="font-size:0.55rem;color:#6a90b8;margin-top:2px">POBJEDE</div></div>' +
      '<div style="background:rgba(0,0,0,0.3);border-radius:8px;padding:12px;text-align:center;border:1px solid rgba(255,51,85,0.15)"><div style="font-size:1.2rem;font-family:Orbitron,monospace;color:#ff3355">'+(pvp.losses||0)+'</div><div style="font-size:0.55rem;color:#6a90b8;margin-top:2px">PORAZI</div></div>' +
    '</div>' +
    (sa
      ? '<div style="padding:10px 14px;background:rgba(0,212,255,0.06);border:1px solid rgba(0,212,255,0.2);border-radius:8px;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between"><span style="font-size:0.7rem;color:#00d4ff">Shield aktivan - '+sl+' min</span><button onclick="deactivatePvpShield()" style="font-size:0.6rem;padding:3px 10px;background:rgba(255,51,85,0.1);border:1px solid rgba(255,51,85,0.3);color:#ff3355;border-radius:4px;cursor:pointer">Deaktiviraj</button></div>'
      : '<div style="display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap"><button onclick="activatePvpShield(4,300)" class="btn" style="flex:1;font-size:0.6rem">🛡️ 4h (300 BOCRYPTO)</button><button onclick="activatePvpShield(12,600)" class="btn" style="flex:1;font-size:0.6rem">🛡️ 12h (600 BOCRYPTO)</button><button onclick="activatePvpShield(24,1000)" class="btn" style="flex:1;font-size:0.6rem">🛡️ 24h (1000 BOCRYPTO)</button><button onclick="refreshOpponents()" class="btn btn-g" style="flex:1;font-size:0.6rem">Osvjezi</button></div>'
    ) +
    '<div style="padding:8px 12px;background:rgba(0,255,136,0.05);border:1px solid rgba(0,255,136,0.15);border-radius:8px;margin-bottom:14px;font-size:0.65rem;color:#00ff88">⚔️ PvP MATCH DUELS — brodovi se ne gube nakon bitke</div>' +
    '<div style="font-size:0.6rem;color:#ff3355;font-family:Orbitron,monospace;letter-spacing:2px;margin-bottom:10px">PROTIVNICI</div>' +
    '<div id="opponentList">'+(window._currentOpponents.length>0?renderOpponentListHTML():'<div style="color:#6a90b8;padding:20px;text-align:center">Ucitavam...</div>')+'</div>' +
    '<div style="font-size:0.6rem;color:#6a90b8;font-family:Orbitron,monospace;letter-spacing:2px;margin:20px 0 10px">ISTORIJA BORBI</div>' +
    renderPvpLogHTML();
  if (window._currentOpponents.length===0) refreshOpponents();
}

// ============================================================
// 8. SHIELD
// ============================================================
function activatePvpShield(hours, cost) {
  if (cost === undefined) cost = 300;
  if ((R.bocrypto||0) < cost) { toast(t('pvp.notEnoughBocShield',{cost:cost}),'warn'); return; }
  R.bocrypto = (R.bocrypto||0) - cost;
  window.pvpShield = { active:true, expiresAt:new Date(Date.now()+hours*3600000).toISOString() };
  if (typeof updateResUI==='function') updateResUI();
  saveGame(); renderPvp(); toast(t('pvp.shieldBought',{hours:hours}),'ok');
}
function deactivatePvpShield() {
  window.pvpShield = { active:false, expiresAt:null };
  saveGame(); renderPvp();
}
