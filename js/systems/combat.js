// ============================================================
// HIVE GALAXY — js/systems/combat.js
// Automatska simulacija borbe — rundni sistem
// ============================================================

// ── STANJE AKTIVNE BORBE ──
let activeBattle = null;

// ── OKLOP OTPORNOSTI ──
// ARMOR_RESISTANCE je definisan u data/ships.js
// Vrijednosti su u % (75 = 75% damage = 0.75x multiplikator)

// ── PRIMJENA ARTIFACT BONUSA NA BITKU ──
function applyEquippedArtifactBonuses(playerSide) {
  if (typeof getArtifactBonuses !== 'function') return;
  const ab = getArtifactBonuses();

  const atkBonus    = (ab.attack   || 0);
  const defBonus    = (ab.defense  || 0);
  const critBonus   = (ab.crit     || 0);
  const hpBonus     = (ab.hp       || 0);
  const resistBonus = (ab.resist   || 0);
  const fleetBonus  = (ab.fleet    || 0);

  if (!atkBonus && !defBonus && !critBonus && !hpBonus && !resistBonus && !fleetBonus) return;

  playerSide.forEach(unit => {
    if (atkBonus || fleetBonus) {
      const totalAtk = atkBonus + fleetBonus;
      unit.dps     = Math.floor(unit.dps     * (1 + totalAtk / 100));
      unit.baseDps = unit.dps;
    }
    if (hpBonus || fleetBonus) {
      const totalHp = hpBonus + fleetBonus;
      const mult = 1 + totalHp / 100;
      unit.hp      = Math.floor(unit.hp      * mult);
      unit.maxHp   = unit.hp;
      if (unit.shield > 0) {
        unit.shield    = Math.floor(unit.shield    * mult);
        unit.maxShield = unit.shield;
      }
    }
    if (defBonus) {
      unit._dmgReduction = (unit._dmgReduction || 0) + defBonus;
    }
    if (critBonus) {
      unit._resCritBonus = (unit._resCritBonus || 0) + critBonus;
    }
    if (resistBonus) {
      unit._dmgReduction = (unit._dmgReduction || 0) + resistBonus;
    }
  });
}

// ── PRIMJENA COMMANDER PASSIVE BONUSA NA BITKU ──
function applyCommanderPassivesToBattle(playerSide, enemySide) {
  if (typeof getAggregatedCommanderBonuses !== 'function') return;
  const deployed = window._deployedCommanders || [];
  if (deployed.length === 0) return;

  const b = getAggregatedCommanderBonuses(deployed);

  // Sačuvaj bonus objekat na battle-u za per-round efekte
  window._activeCmdBonuses = b;

  // ── PRIMIJENI NA SVE PLAYER BRODOVE ──
  playerSide.forEach(unit => {
    const shipClass = unit.ship?.id?.split('_')[0] || '';

    // Flat fleet bonusi
    if (b.atk)           { unit.dps     = Math.floor(unit.dps     * (1 + b.atk / 100)); unit.baseDps = unit.dps; }
    if (b.hp)            { const mult = 1 + b.hp / 100; unit.hp = Math.floor(unit.hp * mult); unit.maxHp = unit.hp; }
    if (b.shield)        { const mult = 1 + b.shield / 100; unit.shield = Math.floor(unit.shield * mult); unit.maxShield = unit.shield; }
    if (b.shield_regen)  { unit.shieldRegen = Math.floor(unit.shieldRegen * (1 + b.shield_regen / 100)); }
    if (b.hp_regen)      { unit._cmdHpRegen = (unit._cmdHpRegen || 0) + b.hp_regen; }
    if (b.evasion)       { unit.agility = Math.min(90, unit.agility + b.evasion); }
    if (b.speed)         { unit.speed += b.speed; }
    if (b.crit)          { unit._resCritBonus = (unit._resCritBonus || 0) + b.crit; }
    if (b.crit_dmg)      { unit._critDmgBonus = (unit._critDmgBonus || 0) + b.crit_dmg; }
    if (b.dmg_reduction) { unit._dmgReduction = (unit._dmgReduction || 0) + b.dmg_reduction; }

    // Weapon-type bonusi (čuvamo za primjenu u performAttack)
    if (b.heat_atk)      unit._wepBonus_heat      = (unit._wepBonus_heat      || 0) + b.heat_atk;
    if (b.kinetic_atk)   unit._wepBonus_kinetic    = (unit._wepBonus_kinetic    || 0) + b.kinetic_atk;
    if (b.explosive_atk) unit._wepBonus_explosive  = (unit._wepBonus_explosive  || 0) + b.explosive_atk;
    if (b.magnetic_atk)  unit._wepBonus_magnetic   = (unit._wepBonus_magnetic   || 0) + b.magnetic_atk;

    // Damage type reductions (čuvamo za incoming dmg)
    if (b.heat_reduction)      unit._typeRed_heat      = (unit._typeRed_heat      || 0) + b.heat_reduction;
    if (b.explosive_reduction) unit._typeRed_explosive = (unit._typeRed_explosive || 0) + b.explosive_reduction;

    // ── Klasa-specifični bonusi ──
    const cls = shipClass;
    if (cls === 'battleship') {
      if (b.battleship_atk) { unit.dps = Math.floor(unit.dps * (1 + b.battleship_atk/100)); unit.baseDps = unit.dps; }
      if (b.battleship_hp)  { const m = 1 + b.battleship_hp/100; unit.hp = Math.floor(unit.hp * m); unit.maxHp = unit.hp; }
    }
    if (cls === 'fighter') {
      if (b.fighter_atk)     { unit.dps = Math.floor(unit.dps * (1 + b.fighter_atk/100)); unit.baseDps = unit.dps; }
      if (b.fighter_hp)      { const m = 1 + b.fighter_hp/100; unit.hp = Math.floor(unit.hp * m); unit.maxHp = unit.hp; }
      if (b.fighter_evasion) { unit.agility = Math.min(90, unit.agility + b.fighter_evasion); }
      if (b.fighter_speed)   { unit.speed += b.fighter_speed; }
    }
    if (cls === 'cruiser') {
      if (b.cruiser_atk)    { unit.dps = Math.floor(unit.dps * (1 + b.cruiser_atk/100)); unit.baseDps = unit.dps; }
      if (b.cruiser_hp)     { const m = 1 + b.cruiser_hp/100; unit.hp = Math.floor(unit.hp * m); unit.maxHp = unit.hp; }
      if (b.cruiser_shield) { const m = 1 + b.cruiser_shield/100; unit.shield = Math.floor(unit.shield * m); unit.maxShield = unit.shield; }
    }
    if (cls === 'scout') {
      if (b.scout_atk)     { unit.dps = Math.floor(unit.dps * (1 + b.scout_atk/100)); unit.baseDps = unit.dps; }
      if (b.scout_evasion) { unit.agility = Math.min(90, unit.agility + b.scout_evasion); }
      if (b.scout_speed)   { unit.speed += b.scout_speed; }
    }
    if (cls === 'carrier') {
      if (b.carrier_atk)    { unit.dps = Math.floor(unit.dps * (1 + b.carrier_atk/100)); unit.baseDps = unit.dps; }
      if (b.carrier_hp)     { const m = 1 + b.carrier_hp/100; unit.hp = Math.floor(unit.hp * m); unit.maxHp = unit.hp; }
      if (b.carrier_shield) { const m = 1 + b.carrier_shield/100; unit.shield = Math.floor(unit.shield * m); unit.maxShield = unit.shield; }
    }
    if (cls === 'special') {
      if (b.special_atk) { unit.dps = Math.floor(unit.dps * (1 + b.special_atk/100)); unit.baseDps = unit.dps; }
      if (b.special_hp)  { const m = 1 + b.special_hp/100; unit.hp = Math.floor(unit.hp * m); unit.maxHp = unit.hp; }
    }

    // Per-round/conditional flagovi (čuvamo za combat loop)
    if (b.first_round_atk)    unit._firstRoundAtkBonus  = (unit._firstRoundAtkBonus  || 0) + b.first_round_atk;
    if (b.berserker_atk)      unit._berserkerAtk        = Math.max(unit._berserkerAtk || 0, b.berserker_atk);
    if (b.dodge_chance)       unit._dodgeChance         = Math.min(75, (unit._dodgeChance || 0) + b.dodge_chance);
    if (b.revive_chance)      unit._reviveChance        = Math.min(95, (unit._reviveChance || 0) + b.revive_chance);
    if (b.double_hit_chance)  unit._doubleHitChance     = Math.min(80, (unit._doubleHitChance || 0) + b.double_hit_chance);
    if (b.round_atk_stack)    unit._roundAtkStack       = Math.max(unit._roundAtkStack || 0, b.round_atk_stack);
    if (b.kill_atk_stack)     unit._killAtkStack        = Math.max(unit._killAtkStack || 0, b.kill_atk_stack);
    if (b.hit_stack_atk)      unit._hitStackAtk         = Math.max(unit._hitStackAtk || 0, b.hit_stack_atk);
    if (b.first_round_immune) unit._firstRoundImmune    = true;
    if (b.reflect_dmg)        unit._reflectDmg          = (unit._reflectDmg || 0) + b.reflect_dmg;
    if (b.fleet_size_atk)     unit._fleetSizeAtk        = Math.max(unit._fleetSizeAtk || 0, b.fleet_size_atk);
    if (b.miss_stack_atk)     unit._missStackAtk        = Math.max(unit._missStackAtk || 0, b.miss_stack_atk);
    if (b.hp_on_miss)         unit._hpOnMiss            = Math.max(unit._hpOnMiss || 0, b.hp_on_miss);

    // hp_drain_start: gubi % HP na početku, ali DPS bonus već je dodat
    if (b.hp_drain_start) {
      const drained = Math.floor(unit.hp * b.hp_drain_start / 100);
      unit.hp = Math.max(1, unit.hp - drained);
    }
  });

  // ── FLEET SIZE ATK — primijeni sada kad znamo veličinu flote ──
  if (b.fleet_size_atk) {
    const aliveCount = playerSide.filter(u => u.alive).length;
    const bonus = b.fleet_size_atk * aliveCount / 100;
    playerSide.forEach(unit => {
      unit.dps = Math.floor(unit.dps * (1 + bonus));
      unit.baseDps = unit.dps;
    });
  }

  // ── PRIMIJENI DEBUFOVE NA NEPRIJATELJA ──
  if (b.enemy_atk || b.enemy_crit || b.enemy_shield) {
    enemySide.forEach(enemy => {
      if (b.enemy_atk)    enemy.dps     = Math.floor(enemy.dps    * (1 - b.enemy_atk    / 100));
      if (b.enemy_crit)   enemy._enemyCritPen  = (enemy._enemyCritPen || 0) + b.enemy_crit;
      if (b.enemy_shield) { const m = Math.max(0, 1 - b.enemy_shield/100); enemy.shield = Math.floor(enemy.shield * m); enemy.maxShield = enemy.shield; }
    });
  }
}

// ── INICIJALIZACIJA BORBE ──
function initBattle(playerSlots, enemyGroups, instanceData) {
  // Pripremi igrača
  const playerSide = playerSlots
    .filter(s => s !== null)
    .map((slot, idx) => {
      const ship      = getShipById(slot.ship_id);
      const stats     = calcSlotStats(slot);
      const fleetIdx  = fleet.indexOf(slot);

      // Prikupi sve shield slotove (shield_1, shield_2, shield_3)
      let shieldSpec = null;
      let baseRegen  = 0;
      for (let si = 1; si <= 3; si++) {
        const sid = slot[`shield_${si}`];
        if (!sid) continue;
        const sh = (typeof getShieldById === 'function') ? getShieldById(sid) : null;
        if (!sh) continue;
        baseRegen += sh.regen || 0;
        // Uzmi specijal od prvog štita koji ga ima
        if (!shieldSpec && sh.special) shieldSpec = sh.special;
      }

      // max_shield_boost — povećava max shield odmah
      let baseShield = stats.shield;
      if (shieldSpec?.type === 'max_shield_boost') {
        baseShield = Math.floor(baseShield * (1 + shieldSpec.bonus / 100));
      }

      // extra_regen — povećava regen po rundi
      if (shieldSpec?.type === 'extra_regen') {
        baseRegen = Math.floor(baseRegen * (1 + shieldSpec.bonus / 100));
      }

      // ── MOTOR — čitaj engine_1 slot ──
      const engId   = slot.engine_1 || null;
      const eng     = (engId && typeof getEngineById === 'function') ? getEngineById(engId) : null;
      const engSpec = eng?.special || null;

      // fleet_aura i divine_speed se primjenjuju kasnije na cijeloj floti
      let baseAgility = stats.agility + (eng?.agility_bonus || 0);
      let baseSpeed   = stats.speed   + (eng?.speed > 1 ? (eng.speed - 1) : 0);

      // ── MODULE SLOT — čitaj module_1 slot (fighter/cruiser) ──
      const moduleId1  = slot.module_1 || null;
      const moduleMod1 = (moduleId1 && typeof getModuleById === 'function') ? getModuleById(moduleId1) : null;
      const moduleSpec = moduleMod1?.effect || null;

      // ── RECON MODUL — čitaj recon_1 slot (samo izviđači) ──
      const reconId   = slot.recon_1 || null;
      const reconMod  = (reconId && typeof getModuleById === 'function') ? getModuleById(reconId) : null;
      const reconSpec = reconMod?.effect || null;

      // ── SPECIAL MODUL — čitaj special_1 slot (battleship/carrier) ──
      const specialId   = slot.special_1 || null;
      const specialMod  = (specialId && typeof getModuleById === 'function') ? getModuleById(specialId) : null;
      const specialSpec = specialMod?.effect || null;

      // Primijeni initiative bonus od Sprint Drive odmah na agility/speed
      if (reconSpec?.type === 'initiative') {
        baseAgility += reconSpec.bonus || 0;
        baseSpeed   += Math.floor((reconSpec.bonus || 0) / 2);
      }

      // ── RESEARCH BONUSI ──
      const resDpsBonus    = typeof getWeaponsDpsBonus    === 'function' ? (1 + getWeaponsDpsBonus()    / 100) : 1;
      const resShieldBonus = typeof getShieldBonus        === 'function' ? (1 + getShieldBonus()        / 100) : 1;
      const resRegenBonus  = typeof getShieldRegenBonus   === 'function' ? (1 + getShieldRegenBonus()   / 100) : 1;
      const resCritBonus   = (typeof getWeaponsCritBonus === 'function' ? getWeaponsCritBonus() : 0)
                           + (instanceData?.pvpCritBonus || 0);
      const resArmorRed    = typeof getArmorDmgReduction  === 'function' ? getArmorDmgReduction()  : 0;
      const resShieldImm   = typeof isShieldImmune        === 'function' ? isShieldImmune()        : false;

      const resDps    = Math.floor(stats.dps    * resDpsBonus);
      const resShield = Math.floor(baseShield   * resShieldBonus);
      const resRegen  = Math.floor(baseRegen    * resRegenBonus);

      return {
        id:            `p_${idx}`,
        slotIndex:     slot._ownerIdx ?? idx,
        side:          'player',
        name:          shipDesigns.find(d => d.id === slot.design_id)?.name || ship?.name || 'Brod',
        ship_id:       slot.ship_id,
        slot,
        _slot:         slot,   // direktna referenca za applyPlayerLosses
        ship,
        fleetIdx,
        count:         slot.count,
        hp:            stats.hp,
        maxHp:         stats.hp,
        shield:        resShield,
        maxShield:     resShield,
        shieldRegen:   resRegen,
        shieldSpecial: shieldSpec,
        dps:           resDps,
        baseDps:       resDps,        // čuvamo original za reactive_boost
        _resCritBonus: resCritBonus,  // krit bonus iz research
        _resArmorRed:  resArmorRed,   // armor damage reduction iz research
        _shieldImmune: resShieldImm,  // shield ne može pasti na 0
        agility:       baseAgility,
        speed:         baseSpeed,
        armor:         ship?.armor || 'Light',
        engineSpecial:  engSpec,
        moduleSpecial:  moduleSpec,
        reconSpecial:   reconSpec,
        specialSpecial: specialSpec,
        _weaponRanges: _getSlotWeaponRanges(slot),
        _weaponCDs: (() => { const w = _getSlotWeaponRanges(slot); return w.map(() => 0); })(),
        reactiveTriggered: false,
        stealthUsed:   false,            // stealth_round1 se koristi samo u rundi 1
        voidImmune:    false,
        effects:       [],
        alive:         true,
      };
    });

  // ── FLEET AURA — primijeni agility bonus na sve saveznike ──
  // Uzimamo najveći fleet_aura/divine_speed bonus od svih igrača
  let fleetAuraBonus = 0;
  for (const unit of playerSide) {
    const es = unit.engineSpecial;
    if (es?.type === 'fleet_aura')  fleetAuraBonus = Math.max(fleetAuraBonus, es.bonus || 0);
    if (es?.type === 'divine_speed') fleetAuraBonus = Math.max(fleetAuraBonus, 5); // divine base aura
  }
  if (fleetAuraBonus > 0) {
    for (const unit of playerSide) {
      unit.agility += fleetAuraBonus;
    }
  }

  // ── SPECIAL MODUL: Fleet Beacon / Titan Carrier — fleet-wide bonusi ──
  for (const unit of playerSide) {
    const ss = unit.specialSpecial;
    if (!ss) continue;
    if (ss.type === 'fleet_regen') {
      // Fleet Beacon: svim saveznicima dodaj regen HP flag
      for (const ally of playerSide) {
        ally._fleetRegen = Math.max(ally._fleetRegen || 0, ss.regen_pct || 0);
      }
    }
    if (ss.type === 'titan') {
      // Titan Carrier: fleet HP bonus + shield bonus
      for (const ally of playerSide) {
        if (ss.fleet_hp)     { ally.hp = Math.floor(ally.hp * (1 + ss.fleet_hp / 100)); ally.maxHp = ally.hp; }
        if (ss.fleet_shield) { ally.shield = Math.floor(ally.shield * (1 + ss.fleet_shield / 100)); ally.maxShield = ally.shield; }
        if (ss.regen_pct)    { ally._fleetRegen = Math.max(ally._fleetRegen || 0, ss.regen_pct); }
      }
    }
    if (ss.type === 'dreadnought') {
      // Dreadnought Protocol: samo na ovaj brod
      unit.dps     = Math.floor(unit.dps * (1 + (ss.atk || 0) / 100));
      unit.baseDps = unit.dps;
      unit._dmgReduction = (unit._dmgReduction || 0) + (ss.reduction || 0);
      unit._executeThreshold = Math.max(unit._executeThreshold || 0, ss.execute || 0);
      unit._empImmune = ss.emp_immune || false;
    }
  }

  // ── PRIMIJENI FORMACIJSKI BONUS ──
  if (typeof getFormationBonus === 'function') {
    const fBonus = getFormationBonus();
    const anyBonus = fBonus.dps || fBonus.shield || fBonus.armor || fBonus.agility || fBonus.speed;
    if (anyBonus) {
      for (const unit of playerSide) {
        if (fBonus.dps)     { unit.dps     = Math.floor(unit.dps     * (1 + fBonus.dps     / 100)); unit.baseDps = unit.dps; }
        if (fBonus.shield)  { unit.shield  = Math.floor(unit.shield  * (1 + fBonus.shield  / 100)); unit.maxShield = unit.shield; }
        if (fBonus.armor)   { /* armor je tip, koristimo armored_bonus */ unit._armorBonus = (unit._armorBonus || 0) + fBonus.armor; }
        if (fBonus.agility) { unit.agility = Math.min(90, unit.agility + fBonus.agility); }
        if (fBonus.speed)   { unit.speed   = Math.max(1,  unit.speed  + fBonus.speed); }
        unit.maxHp = unit.hp;
      }
    }
  }

  // Pripremi neprijatelja
  const enemySide = enemyGroups.map((group, idx) => {
    const shipClass = group.ship_id ? group.ship_id.split('_')[0] : '';
    return {
      id:        `e_${idx}`,
      slotIndex: group.col ? (group.row - 1) * 3 + (group.col - 1) : idx,
      side:      'enemy',
      name:      group.name,
      ship_id:   group.ship_id || null,
      count:     group.count,
      hp:        group.hp,
      maxHp:     group.hp,
      shield:    group.shield || 0,
      maxShield: group.shield || 0,
      dps:       group.dps,
      agility:   group.agility || 0,
      speed:     group.speed || 1,
      armor:     group.armor || 'Light',
      _weaponRanges: _getClassWeaponRange(shipClass),
      _weaponCDs: _getClassWeaponRange(shipClass).map(() => 0),
      effects:   [],
      alive:     true,
    };
  });

  // ── COMMANDER PASSIVE BONUSI ──
  applyCommanderPassivesToBattle(playerSide, enemySide);

  // ── ARTIFACT BONUSI ──
  applyEquippedArtifactBonuses(playerSide);

  activeBattle = {
    instance:    instanceData,
    player:      playerSide,
    enemy:       enemySide,
    round:       0,
    maxRounds:   50,
    distance:    10,
    log:         [],
    status:      'active',  // active, victory, defeat, draw
    rewards:     null,
  };

  return activeBattle;
}

// ── SIMULIRAJ CIJELU BORBU ──
function simulateBattle(playerSlots, enemyGroups, instanceData) {
  const battle = initBattle(playerSlots, enemyGroups, instanceData);

  while (battle.status === 'active' && battle.round < battle.maxRounds) {
    simulateRound(battle);
  }

  if (battle.status === 'active') {
    battle.status = 'draw';
    battle.log.push({ round: battle.round, type: 'info', msg: '⏱️ Borba je završena izjednačenjem (max rundi).' });
  }

  return battle;
}

// ── JEDNA RUNDA ──
function simulateRound(battle) {
  battle.round++;
  const round = battle.round;
  battle.log.push({ round, type: 'round', msg: `━━━ RUNDA ${round} ━━━` });

  // ── ZATVARANJE DISTANCE ──
  const allAlive = [...battle.player, ...battle.enemy].filter(u => u.alive);
  if (allAlive.length > 0) {
    const avgSpeed = allAlive.reduce((s, u) => s + (u.speed || 1), 0) / allAlive.length;
    const closingSpeed = Math.max(1, Math.floor(avgSpeed * 0.5));
    battle.distance = Math.max(1, battle.distance - closingSpeed);
    battle.log.push({ round, type: 'effect', msg: `📏 Distance: ${battle.distance} (zatvaranje: ${closingSpeed}/rundi)` });
  }

  // Svi aktivni učesnici
  const allUnits = allAlive;

  // Sortiraj po speed — first_strike/divine_speed uvijek idu prvi, onda po speed, pa agility
  // Range utiče na štetu (falloff van dometa), ne na redoslijed
  allUnits.sort((a, b) => {
    const aFirst = (a.engineSpecial?.type === 'first_strike' || a.engineSpecial?.type === 'divine_speed') ? 1 : 0;
    const bFirst = (b.engineSpecial?.type === 'first_strike' || b.engineSpecial?.type === 'divine_speed') ? 1 : 0;
    if (bFirst !== aFirst) return bFirst - aFirst;
    if (b.speed !== a.speed) return b.speed - a.speed;
    return b.agility - a.agility;
  });

  // ── ENGINE: void_phase — roll na početku runde ──
  for (const unit of allUnits) {
    unit.voidImmune = false;
    const es = unit.engineSpecial;
    if (!es) continue;
    let voidChance = 0;
    if (es.type === 'void_phase')   voidChance = es.chance || 0;
    if (es.type === 'divine_speed') voidChance = 20 + (unit.variant === 'II' ? 5 : unit.variant === 'III' ? 10 : 0);
    if (voidChance > 0 && Math.random() * 100 < voidChance) {
      unit.voidImmune = true;
      battle.log.push({ round, type: 'effect', msg: `🕳️ ${unit.name} ušao u void fazu — imun na svu štetu ovu rundu!` });
    }
  }

  for (const attacker of allUnits) {
    if (!attacker.alive) continue;

    // Smanji cooldown naoružanja
    if (attacker._weaponCDs) {
      for (let wi = 0; wi < attacker._weaponCDs.length; wi++) {
        if (attacker._weaponCDs[wi] > 0) attacker._weaponCDs[wi]--;
      }
    }

    // Procesiraj efekte na početku poteza
    const stunned = processEffects(attacker, battle);
    if (!attacker.alive) continue;
    if (stunned) continue;

    // Odaberi metu
    const enemies = attacker.side === 'player' ? battle.enemy : battle.player;
    const targets = enemies.filter(e => e.alive);
    if (targets.length === 0) break;

    // Napadni
    performAttack(attacker, targets, battle, round);

    // ── ENGINE: double_strike — šansa za drugi napad ──
    const es = attacker.engineSpecial;
    if (es && (es.type === 'double_strike') && attacker.alive) {
      if (Math.random() * 100 < es.chance) {
        const targets2 = (attacker.side === 'player' ? battle.enemy : battle.player).filter(e => e.alive);
        if (targets2.length > 0) {
          battle.log.push({ round, type: 'effect', msg: `⚔️⚔️ ${attacker.name} DOUBLE STRIKE!` });
          performAttack(attacker, targets2, battle, round);
        }
      }
    }

    // ── COMMANDER PASSIVE: double_hit_chance ──
    if (attacker.side === 'player' && attacker.alive && (attacker._doubleHitChance || 0) > 0) {
      if (Math.random() * 100 < attacker._doubleHitChance) {
        const targets2b = (battle.enemy).filter(e => e.alive);
        if (targets2b.length > 0) {
          battle.log.push({ round, type: 'effect', msg: `💫 ${attacker.name} PASIVNI DUPLI UDAR!` });
          performAttack(attacker, targets2b, battle, round);
        }
      }
    }

    // ── SPECIAL: Heavy Barrage — šansa za duplu salvu svih oružja ──
    const ss = attacker.specialSpecial;
    if (ss?.type === 'double_fire' && attacker.alive) {
      if (Math.random() * 100 < (ss.chance || 0)) {
        const targets3 = (attacker.side === 'player' ? battle.enemy : battle.player).filter(e => e.alive);
        if (targets3.length > 0) {
          if (ss.crit_on_double) attacker._forceCritNext = true;
          battle.log.push({ round, type: 'effect', msg: `💣 ${attacker.name} HEAVY BARRAGE — dupla salva!` });
          performAttack(attacker, targets3, battle, round);
        }
      }
    }

    // ── ENGINE: reactive_boost — kad HP < 50%, jednom trajno +DPS ──
    if (attacker.engineSpecial?.type === 'reactive_boost' && !attacker.reactiveTriggered) {
      if (attacker.hp < attacker.maxHp * 0.5) {
        const boost = attacker.engineSpecial.bonus || 20;
        attacker.dps = Math.floor(attacker.baseDps * (1 + boost / 100));
        attacker.reactiveTriggered = true;
        battle.log.push({ round, type: 'effect', msg: `🔄 ${attacker.name} REACTIVE BOOST: +${boost}% DPS aktiviran!` });
      }
    }
  }

  // ── ENGINE: hp_regen — obnavljanje HP na kraju runde ──
  for (const unit of battle.player) {
    if (!unit.alive) continue;
    const es = unit.engineSpecial;
    if (es?.type === 'hp_regen' && unit.hp < unit.maxHp) {
      const healed = Math.min(es.amount, unit.maxHp - unit.hp);
      unit.hp += healed;
    }
    // ── SPECIAL: Fleet Beacon / Titan Carrier — fleet HP regen ──
    if (unit._fleetRegen > 0 && unit.hp < unit.maxHp) {
      const healed = Math.floor(unit.maxHp * unit._fleetRegen / 100);
      unit.hp = Math.min(unit.maxHp, unit.hp + healed);
    }
    // ── COMMANDER PASSIVE: hp_regen po rundi ──
    if (unit._cmdHpRegen > 0 && unit.hp < unit.maxHp) {
      const healed = Math.floor(unit.maxHp * unit._cmdHpRegen / 100);
      unit.hp = Math.min(unit.maxHp, unit.hp + healed);
    }
    // ── COMMANDER PASSIVE: round_atk_stack — svaka runda +X% ──
    if (unit._roundAtkStack > 0) {
      const boost = Math.floor(unit.baseDps * unit._roundAtkStack / 100);
      unit.dps = Math.min(unit.dps + boost, unit.baseDps * 5); // max 5× base
    }
  }

  // ── COMMANDER PASSIVE: enemy_dot — neprijatelji gube HP po rundi ──
  const cmdBonuses = window._activeCmdBonuses;
  if (cmdBonuses && cmdBonuses.enemy_dot > 0) {
    for (const enemy of battle.enemy) {
      if (!enemy.alive) continue;
      const dotDmg = Math.floor(enemy.maxHp * cmdBonuses.enemy_dot / 100);
      enemy.hp = Math.max(0, enemy.hp - dotDmg);
      if (enemy.hp <= 0) {
        enemy.alive = false;
        battle.log.push({ round, type: 'destroy', msg: `☠️ ${enemy.name} UNIŠTEN od pasivne zaraze!` });
      }
    }
  }

  // ── SPECIAL: Drone Swarm DoT tick — nanosi štetu svim neprijateljima koji imaju dot_swarm ──
  for (const unit of [...battle.player, ...battle.enemy]) {
    if (!unit.alive) continue;
    const dotIdx = unit.effects.findIndex(e => e.type === 'dot_swarm');
    if (dotIdx === -1) continue;
    const dot = unit.effects[dotIdx];
    const dotDmg = Math.floor(unit.maxHp * (dot.dmg_pct || 5) / 100);
    unit.hp = Math.max(0, unit.hp - dotDmg);
    battle.log.push({ round, type: 'effect', msg: `🐝 Drone Swarm: ${unit.name} -${dotDmg} HP (još ${dot.duration - 1} rundi)` });
    dot.duration--;
    if (dot.duration <= 0) unit.effects.splice(dotIdx, 1);
    if (unit.hp <= 0) { unit.alive = false; battle.log.push({ round, type: 'destroy', msg: `💀 ${unit.name} UNIŠTEN od Drone Swarm!` }); }
  }

  // Shield regeneracija na kraju runde (samo igrači)
  for (const unit of battle.player) {
    if (!unit.alive) continue;
    const isDisabled = unit.effects.some(e => e.type === 'shield_disable');
    if (!isDisabled && unit.shieldRegen > 0 && unit.shield < unit.maxShield) {
      unit.shield = Math.min(unit.maxShield, unit.shield + unit.shieldRegen);
    }
  }

  // Provjeri kraj borbe
  const playerAlive = battle.player.some(u => u.alive);
  const enemyAlive  = battle.enemy.some(u => u.alive);

  if (!playerAlive && !enemyAlive) {
    battle.status = 'draw';
    battle.log.push({ round, type: 'result', msg: '💥 Obje strane uništene — izjednačenje!' });
  } else if (!enemyAlive) {
    battle.status = 'victory';
    battle.log.push({ round, type: 'result', msg: '🏆 POBJEDA!' });
  } else if (!playerAlive) {
    battle.status = 'defeat';
    battle.log.push({ round, type: 'result', msg: '💀 PORAZ!' });
  }
}

// ── NAPAD ──
function performAttack(attacker, targets, battle, round) {
  if (!attacker._weaponRanges || !attacker._weaponCDs) return;
  for (let wi = 0; wi < attacker._weaponRanges.length; wi++) {
    const wpn = attacker._weaponRanges[wi];
    if (!wpn) continue;
    if (battle.distance < wpn.min || battle.distance > wpn.max) continue;
    if (attacker._weaponCDs[wi] > 0) continue;
    const alive = targets.filter(t => t.alive);
    if (alive.length === 0) break;
    const target = alive.reduce((a, b) => {
      const ai = a.slotIndex ?? 99, bi = b.slotIndex ?? 99;
      if (ai !== bi) return ai < bi ? a : b;
      return a.hp < b.hp ? a : b;
    });
    _fireWeapon(attacker, wi, wpn, target, targets, battle, round);
    attacker._weaponCDs[wi] = wpn.cooldown || 0;
  }
}

function _calcHitChance(attacker, wpn, target) {
  const baseHit = 100;
  const agilityPenalty = (target.agility || 0) * 4;
  const steeringBonus  = (wpn.steering || 5) * 4;
  const dodgePenalty   = Math.floor((target.dodge || 0) / 12);
  const missStackBonus = Math.min(20, (attacker._missStack || 0) * 2);
  const reconAccuracy  = (attacker.reconSpecial?.type === 'targeting' ? (attacker.reconSpecial.accuracy || 0) : 0);
  return Math.max(20, Math.min(100, baseHit + steeringBonus + missStackBonus + reconAccuracy - agilityPenalty - dodgePenalty));
}

function _hasShieldPenetration(wpn) {
  return wpn.dmgType === 'Kinetic' || wpn.dmgType === 'Heat' || wpn.dmgType === 'Magnetic';
}

function _checkIntercept(attacker, wpn, target, battle, round) {
  const interceptorSide = target.side === 'player' ? battle.player : battle.enemy;
  const interceptors = [];
  for (const unit of interceptorSide) {
    if (!unit.alive || unit.id === target.id) continue;
    const slot = unit._slot;
    const guns = _getWeaponsByIntercept(slot);
    for (const g of guns) {
      interceptors.push({ unit, chance: g.chance });
    }
  }
  if (interceptors.length === 0 && !target._weaponRanges) return false;
  for (const int of interceptors) {
    if (Math.random() * 100 < int.chance) {
      battle.log.push({ round, type: 'miss', msg: `🛡️ ${int.unit.name} presreo projektil ${wpn.id} namijenjen ${target.name}!` });
      return true;
    }
  }
  // PPC defence — target-ov sopstveni weapon interceptor
  if (target._weaponRanges) {
    for (const tw of target._weaponRanges) {
      if (tw.intercept && Math.random() * 100 < tw.intercept) {
        battle.log.push({ round, type: 'miss', msg: `🛡️ ${target.name} PPC presreo projektil ${wpn.id}!` });
        return true;
      }
    }
  }
  return false;
}

function _applyScatter(wi, wpn, attacker, primaryTarget, targets, battle, round, effectiveDmg) {
  if (wpn.dmgType !== 'Kinetic' && wpn.dmgType !== 'Heat' && wpn.dmgType !== 'Explosive') return;
  const sameRow = targets.filter(t => t.alive && t.id !== primaryTarget.id && (t.slotIndex ?? 99) === (primaryTarget.slotIndex ?? 99));
  if (sameRow.length === 0) return;
  const scatterDmg = Math.floor(effectiveDmg * 0.35);
  const scatterTargets = sameRow.slice(0, 2);
  for (const st of scatterTargets) {
    let stShieldDmg = 0, stHpDmg = 0;
    if (st.shield > 0) {
      stShieldDmg = Math.min(st.shield, scatterDmg);
      st.shield -= stShieldDmg;
      stHpDmg = scatterDmg - stShieldDmg;
    } else {
      stHpDmg = scatterDmg;
    }
    st.hp = Math.max(0, st.hp - stHpDmg);
    battle.log.push({ round, type: 'effect', msg: `💥 SCATTER! ${attacker.name}'s ${wpn.id} pogodio ${st.name} sa ${scatterDmg} štete (${stShieldDmg} shield, ${stHpDmg} HP)!` });
    if (st.hp <= 0) {
      st.alive = false;
      battle.log.push({ round, type: 'destroy', msg: `💀 ${st.name} UNIŠTEN od scatter štete!` });
    }
  }
}

function _fireWeapon(attacker, wi, wpn, target, targets, battle, round) {
  const weaponDmgType = wpn.dmgType || 'Kinetic';

  // 1. HIT CHANCE (G2O: agility vs steering)
  const hitChance = _calcHitChance(attacker, wpn, target);
  if (Math.random() * 100 >= hitChance) {
    if (attacker._missStackAtk > 0) {
      attacker.dps = Math.floor(attacker.dps * (1 + attacker._missStackAtk / 100));
    }
    battle.log.push({ round, type: 'miss', msg: `💨 ${attacker.name}'s ${wpn.id} promašio ${target.name}! (${Math.round(hitChance)}% hit)` });
    return;
  }

  // 2. INTERCEPT CHECK
  if (_checkIntercept(attacker, wpn, target, battle, round)) return;

  // 3. Random damage unutar dmgMin-dmgMax, pomnožen s brojem brodova u slotu
  const _count = attacker.count || 1;
  let dmg = (wpn.dmgMin + Math.floor(Math.random() * (wpn.dmgMax - wpn.dmgMin + 1))) * _count;

  // ── COMMANDER PASSIVE: first_round_atk bonus ──
  if (round === 1 && attacker.side === 'player' && attacker._firstRoundAtkBonus > 0) {
    dmg = Math.floor(dmg * (1 + attacker._firstRoundAtkBonus / 100));
  }

  // ── COMMANDER PASSIVE: berserker — pri <50% HP +X% napad ──
  if (attacker.side === 'player' && attacker._berserkerAtk > 0 && attacker.hp < attacker.maxHp * 0.5) {
    dmg = Math.floor(dmg * (1 + attacker._berserkerAtk / 100));
  }

  // ── ARMOR RESISTANCE ──
  const armorType     = target.armor || 'Light';
  const resistance    = (typeof ARMOR_RESISTANCE !== 'undefined' && ARMOR_RESISTANCE[armorType])
                        ? ARMOR_RESISTANCE[armorType]
                        : { Kinetic: 100, Heat: 100, Magnetic: 100, Explosive: 100 };
  const resistPct     = resistance[weaponDmgType] ?? 100;
  dmg = Math.floor(dmg * (resistPct / 100));

  // ── ENGINE: armor_boost ──
  const tEng = target.engineSpecial;
  if (tEng?.type === 'armor_boost' && tEng.bonus > 0) {
    dmg = Math.floor(dmg * (1 - tEng.bonus / 100));
  }

  // ── ENGINE: void_phase ──
  if (target.voidImmune) {
    battle.log.push({ round, type: 'miss', msg: `🕳️ ${target.name} u void fazi — ${attacker.name}'s ${wpn.id} prošao kroz nju!` });
    return;
  }

  // ── ENGINE: warp_skip ──
  const tEngine = target.engineSpecial;
  if (tEngine?.type === 'warp_skip') {
    if (Math.random() * 100 < tEngine.chance) {
      battle.log.push({ round, type: 'miss', msg: `👻 ${target.name} warp skip — ${attacker.name}'s ${wpn.id} negiran!` });
      return;
    }
  }

  // ── RECON: Stealth Cloak ──
  if (target.reconSpecial?.type === 'stealth_round1' && round === 1 && !target.stealthUsed) {
    const red = target.reconSpecial.reduction || 0;
    dmg = Math.floor(dmg * (1 - red / 100));
    target.stealthUsed = true;
    battle.log.push({ round, type: 'effect', msg: `👻 ${target.name} STEALTH CLOAK: -${red}% štete u rundi 1!` });
  }

  // ── RECON: Evasion Matrix / Shadow Protocol ──
  const reconEvade = (target.reconSpecial?.type === 'dodge'   ? (target.reconSpecial.chance || 0) : 0)
                   + (target.reconSpecial?.type === 'shadow'  ? (target.reconSpecial.evade  || 0) : 0);
  if (reconEvade > 0 && Math.random() * 100 < reconEvade) {
    battle.log.push({ round, type: 'miss', msg: `🌀 ${target.name} RECON DODGE — ${attacker.name}'s ${wpn.id} izbjegnut! (${reconEvade}%)` });
    return;
  }

  // ── SPECIAL: Iron Fortress ──
  if (target.specialSpecial?.type === 'fortress') {
    const red = target.specialSpecial.reduction || 0;
    dmg = Math.floor(dmg * (1 - red / 100));
  }

  // ── _dmgReduction ──
  if (target._dmgReduction > 0) {
    dmg = Math.floor(dmg * (1 - target._dmgReduction / 100));
  }

  // ── COMMANDER PASSIVE: dodge_chance ──
  if (target.side === 'player' && target._dodgeChance > 0) {
    if (Math.random() * 100 < target._dodgeChance) {
      if (attacker._missStackAtk > 0) {
        attacker.dps = Math.floor(attacker.dps * (1 + attacker._missStackAtk / 100));
        attacker.baseDps = Math.max(attacker.baseDps, attacker.dps);
      }
      battle.log.push({ round, type: 'miss', msg: `🌀 ${target.name} COMMANDER DODGE! (${target._dodgeChance}%)` });
      return;
    }
  }

  // ── COMMANDER: first_round_immune ──
  if (round === 1 && target.side === 'player' && target._firstRoundImmune) {
    battle.log.push({ round, type: 'miss', msg: `🌑 ${target.name} nevidljiv u rundi 1 — ${attacker.name}'s ${wpn.id} promašio!` });
    return;
  }

  // ── AGILITY EVADE ──
  const isGuided = getAttackerIsGuided(attacker);
  if (!isGuided) {
    const evadeChance = Math.min(60, target.agility * 0.5);
    if (Math.random() * 100 < evadeChance) {
      if (target._hpOnMiss > 0) {
        const hpGain = Math.floor(target.maxHp * target._hpOnMiss / 100);
        target.hp = Math.min(target.maxHp, target.hp + hpGain);
      }
      battle.log.push({ round, type: 'miss', msg: `💨 ${target.name} izbjegao ${attacker.name}'s ${wpn.id}!` });
      return;
    }
  }

  // ── SHIELD BLOCK ──
  const tShield = target.shieldSpecial;
  if ((tShield?.type === 'block' || tShield?.type === 'block_reflect') && target.shield > 0) {
    const blockChance = tShield.type === 'block_reflect' ? (tShield.block || 0) : tShield.chance;
    if (Math.random() * 100 < blockChance) {
      battle.log.push({ round, type: 'effect', msg: `🛡️ ${target.name} BLOKIRAO ${attacker.name}'s ${wpn.id}!` });
      return;
    }
  }

  // ── HIGH_DAMAGE ──
  const highDmgBonus = getAttackerHighDamageBonus(attacker);
  if (highDmgBonus > 0) {
    dmg = Math.floor(dmg * (1 + highDmgBonus / 100));
  }

  // ── SPECIAL: Siege Core ──
  if (attacker.specialSpecial?.type === 'armor_pen') {
    const pen = attacker.specialSpecial.bonus || 0;
    const lostToDmgType = Math.floor(dmg * (resistPct / 100));
    const penBonus = Math.floor((dmg - lostToDmgType) * (pen / 100));
    dmg += penBonus;
  }

  // ── RECON: Shadow Protocol ambush ──
  if (attacker.reconSpecial?.type === 'shadow' && attacker.side === 'player') {
    const ambush = attacker.reconSpecial.ambush_dmg || 0;
    if (ambush > 0) dmg = Math.floor(dmg * (1 + ambush / 100));
  }

  // ── RECON: Sprint Drive first_strike_bonus ──
  if (attacker.reconSpecial?.type === 'initiative' && attacker.reconSpecial.first_strike_bonus && !attacker._firstStrikeDone) {
    dmg = Math.floor(dmg * (1 + attacker.reconSpecial.first_strike_bonus / 100));
    attacker._firstStrikeDone = true;
  }

  // ── RESEARCH armor reduction ──
  if (target.side === 'player' && (target._resArmorRed || 0) > 0) {
    dmg = Math.floor(dmg * (1 - target._resArmorRed / 100));
  }

  // ── COMMANDER weapon-type bonus ──
  if (attacker.side === 'player') {
    const wt = weaponDmgType?.toLowerCase();
    const wBonus = attacker[`_wepBonus_${wt}`] || 0;
    if (wBonus > 0) dmg = Math.floor(dmg * (1 + wBonus / 100));
  }

  // ── COMMANDER type reduction ──
  if (target.side === 'player') {
    const wt = weaponDmgType?.toLowerCase();
    const tRed = target[`_typeRed_${wt}`] || 0;
    if (tRed > 0) dmg = Math.floor(dmg * (1 - tRed / 100));
  }

  // ── CRIT ──
  let isCrit = false;
  const critBonus = getAttackerCritBonus(attacker) + (attacker._resCritBonus || 0);
  const forceCrit = !!attacker._forceCritNext;
  if (forceCrit) attacker._forceCritNext = false;
  const guaranteedCrit = attacker.reconSpecial?.type === 'initiative' && attacker.reconSpecial.first_strike_bonus >= 30 && !attacker._guaranteedCritDone;
  if (forceCrit || guaranteedCrit || Math.random() * 100 < (5 + critBonus)) {
    const critMult = 1.5 + ((attacker._critDmgBonus || 0) / 100);
    dmg = Math.floor(dmg * critMult);
    isCrit = true;
    if (guaranteedCrit) attacker._guaranteedCritDone = true;
  }

  // ── ARMOR_MELT ──
  const meltEff = target.effects?.find(e => e.type === 'armor_melt');
  if (meltEff) {
    dmg = Math.floor(dmg * (1 + meltEff.value / 100));
  }

  // ── SHIELD PENETRATION (G2O: Ballistic/Directional probijaju shield) ──
  const shieldPen = _hasShieldPenetration(wpn);

  // ── SHIELD RESIST ──
  let shieldResistPct = 0;
  if (target.shield > 0 && tShield) {
    if (tShield.type === 'kinetic_resist'  && weaponDmgType === 'Kinetic')  shieldResistPct = tShield.bonus || 0;
    if (tShield.type === 'heat_resist'     && weaponDmgType === 'Heat')     shieldResistPct = tShield.bonus || 0;
    if (tShield.type === 'magnetic_resist' && weaponDmgType === 'Magnetic') shieldResistPct = tShield.bonus || 0;
    if (tShield.type === 'explosive_resist'&& weaponDmgType === 'Explosive') shieldResistPct = tShield.bonus || 0;
  }
  const effectiveDmg = shieldResistPct > 0 ? Math.floor(dmg * (1 - shieldResistPct / 100)) : dmg;

  // ── PRIMIJENI ŠTETU ──
  let shieldDmg = 0;
  let hpDmg     = 0;

  if (target.shield > 0) {
    if (shieldPen) {
      // shieldPen = probija shield, ide direktno na HP
      hpDmg = effectiveDmg;
      battle.log.push({ round, type: 'effect', msg: `⚡ ${attacker.name}'s ${wpn.id} probija shield ${target.name}!` });
    } else {
      shieldDmg = Math.min(target.shield, effectiveDmg);
      target.shield -= shieldDmg;
      if (target._shieldImmune && target.shield <= 0) target.shield = 1;
      hpDmg = effectiveDmg - shieldDmg;
    }
  } else {
    hpDmg = effectiveDmg;
  }

  target.hp = Math.max(0, target.hp - hpDmg);
  if (target.hp <= 0) { target.alive = false; battle.log.push({ round, type: 'destroy', msg: `💀 ${target.name} UNIŠTEN!` }); }

  // ── EOS SHIELD: 30% šansa da apisorbuje duplo ──
  // (handled by shield special elsewhere, this is a note)

  // ── TRACKING ──
  if (attacker.side === 'player') {
    window._totalDamageDealt = (window._totalDamageDealt || 0) + effectiveDmg;
  }

  // ── STABILITY-BASED DESTRUCTION (G2O) ──
  // Each ship in stack has structure HP. Stability = ships that must be overkilled
  // before a ship actually dies. Damage accumulates, then ships die in stability batches.
  // Only applies if ship survived the raw damage (stability can't "save" a dead fleet).
  let shipsDestroyed = 0;
  if (target.hp > 0 && target.structure > 0 && hpDmg > 0) {
    const stability = target.stability || 999;
    const shipsBefore = target.count || 1;
    const rawLoss = Math.floor(hpDmg / Math.max(1, target.structure));
    if (rawLoss >= stability) {
      shipsDestroyed = Math.min(shipsBefore - 1, Math.floor(rawLoss / stability));
    }
    if (shipsDestroyed > 0) {
      target.count = Math.max(1, shipsBefore - shipsDestroyed);
      target.hp = target.count * target.structure;
    }
  }

  // LOG
  const critTxt   = isCrit ? ' 💥KRIT!' : '';
  const shldTxt   = shieldDmg > 0 ? ` (${shieldDmg} shield, ${hpDmg} HP)` : '';
  const resistTxt = shieldResistPct > 0 ? ` [-${shieldResistPct}% resist]` : '';
  const penTxt    = shieldPen ? ' ⚡shield pen' : '';
  battle.log.push({
    round,
    type: 'attack',
    msg:  `⚔️ ${attacker.name}[${wpn.id}] → ${target.name}: ${effectiveDmg} štete${shldTxt}${resistTxt}${critTxt}${penTxt}`,
    dmg: effectiveDmg, attacker: attacker.id, target: target.id,
    dmgType: weaponDmgType, isCrit, shieldDmg, hpDmg, shipsDestroyed,
  });

  // ── SHIELD REFLECT ──
  if (tShield?.type === 'reflect' && shieldDmg > 0) {
    if (Math.random() * 100 < tShield.chance) {
      const reflectDmg = Math.floor(shieldDmg * 0.3);
      attacker.hp = Math.max(0, attacker.hp - reflectDmg);
      battle.log.push({ round, type: 'effect', msg: `🪞 ${target.name} odbio ${reflectDmg} štete nazad na ${attacker.name}!` });
      if (attacker.hp <= 0) { attacker.alive = false; battle.log.push({ round, type: 'destroy', msg: `💀 ${attacker.name} UNIŠTEN od refleksije!` }); }
    }
  }

  // ── SHIELD EXPLOSION_RETALIATE ──
  if (tShield?.type === 'explosion_retaliate' && target.shield > 0) {
    if (Math.random() * 100 < tShield.chance) {
      const counterTargets = (target.side === 'player' ? battle.enemy : battle.player).filter(u => u.alive).slice(0, 2);
      const counterDmg = Math.floor(dmg * 0.4);
      counterTargets.forEach(ct => {
        ct.hp = Math.max(0, ct.hp - counterDmg);
        battle.log.push({ round, type: 'effect', msg: `💥 ${target.name} detonator kontra: ${ct.name} -${counterDmg} HP!` });
        if (ct.hp <= 0) { ct.alive = false; battle.log.push({ round, type: 'destroy', msg: `💀 ${ct.name} UNIŠTEN!` }); }
      });
    }
  }

  // ── SHIELD STUN ──
  if (tShield?.type === 'stun' && target.shield > 0) {
    if (Math.random() * 100 < tShield.chance) {
      attacker.effects.push({ type: 'stun', duration: 1 });
      battle.log.push({ round, type: 'effect', msg: `⚡ ${target.name} stunuo ${attacker.name}! (1 runda)` });
    }
  }

  // ── SHIELD BLOCK_REFLECT ──
  if (tShield?.type === 'block_reflect' && shieldDmg > 0) {
    if (Math.random() * 100 < (tShield.reflect || 0)) {
      const reflectDmg = Math.floor(shieldDmg * 0.3);
      attacker.hp = Math.max(0, attacker.hp - reflectDmg);
      battle.log.push({ round, type: 'effect', msg: `🌐 ${target.name} block_reflect: ${reflectDmg} nazad na ${attacker.name}!` });
      if (attacker.hp <= 0) { attacker.alive = false; battle.log.push({ round, type: 'destroy', msg: `💀 ${attacker.name} UNIŠTEN od block_reflect!` }); }
    }
  }

  // ── SHIELD ABSORB ──
  if (tShield?.type === 'absorb' && hpDmg > 0) {
    const absorbed = Math.floor(hpDmg * (tShield.amount / 100));
    if (absorbed > 0) {
      target.shield = Math.min(target.maxShield, target.shield + absorbed);
      battle.log.push({ round, type: 'effect', msg: `🌊 ${target.name} absorbovao ${absorbed} shield iz štete!` });
    }
  }

  // ── SHIELD INSTANT_RECOVERY ──
  if (tShield?.type === 'instant_recovery' && target.shield < target.maxShield) {
    if (Math.random() * 100 < tShield.chance) {
      target.shield = target.maxShield;
      battle.log.push({ round, type: 'effect', msg: `🔮 ${target.name} trenutno obnovio cijeli shield!` });
    }
  }

  // ── IRON FORTRESS REFLECT ──
  if (target.specialSpecial?.type === 'fortress' && hpDmg > 0) {
    const reflPct = target.specialSpecial.reflect || 0;
    if (reflPct > 0) {
      const reflDmg = Math.floor(hpDmg * reflPct / 100);
      attacker.hp = Math.max(0, attacker.hp - reflDmg);
      battle.log.push({ round, type: 'effect', msg: `🏯 ${target.name} IRON FORTRESS: odbio ${reflDmg} štete nazad!` });
      if (attacker.hp <= 0) { attacker.alive = false; battle.log.push({ round, type: 'destroy', msg: `💀 ${attacker.name} UNIŠTEN od Iron Fortress!` }); }
    }
  }

  // ── DRONE SWARM ──
  if (target.specialSpecial?.type === 'dot_swarm' && attacker.side !== target.side) {
    const sw = target.specialSpecial;
    if (Math.random() * 100 < (sw.chance || 0)) {
      attacker.effects.push({ type: 'dot_swarm', dmg_pct: sw.dmg_pct || 5, rounds: sw.rounds || 3, duration: sw.rounds || 3 });
      battle.log.push({ round, type: 'effect', msg: `🐝 ${target.name} DRONE SWARM na ${attacker.name}: -${sw.dmg_pct}% HP/${sw.rounds} rundi!` });
    }
  }

  // ── EXECUTE ──
  const execThresh = Math.max(target._executeThreshold || 0,
    attacker.specialSpecial?.type === 'dreadnought' ? (attacker.specialSpecial.execute || 0) : 0,
    attacker.reconSpecial?.type   === 'shadow'      ? (attacker.reconSpecial.execute   || 0) : 0);
  if (execThresh > 0 && target.hp > 0 && target.hp < target.maxHp * (execThresh / 100)) {
    target.hp = 0;
    battle.log.push({ round, type: 'effect', msg: `💀 EXECUTE! ${target.name} je ispod ${execThresh}% HP — momentalno uništen!` });
  }

  // ── WEAPON SPECIAL EFFECTS ──
  applyWeaponEffect(attacker, target, battle, round);

  // ── COMMANDER REFLECT ──
  if (target.side === 'player' && target._reflectDmg > 0 && hpDmg > 0 && attacker.alive) {
    const reflectDmg = Math.floor(hpDmg * target._reflectDmg / 100);
    if (reflectDmg > 0) {
      attacker.hp = Math.max(0, attacker.hp - reflectDmg);
      battle.log.push({ round, type: 'effect', msg: `🔄 ${target.name} reflektovao ${reflectDmg} štete nazad!` });
      if (attacker.hp <= 0) { attacker.alive = false; battle.log.push({ round, type: 'destroy', msg: `💀 ${attacker.name} UNIŠTEN od refleksije!` }); }
    }
  }

  // ── SCATTER ──
  _applyScatter(wi, wpn, attacker, target, targets, battle, round, effectiveDmg);

  // ── PROVJERA DA LI JE META UNIŠTENA ──
  if (target.hp <= 0) {
    if (target.side === 'player' && !target._revivedOnce && (target._reviveChance || 0) > 0) {
      if (Math.random() * 100 < target._reviveChance) {
        target.hp = Math.floor(target.maxHp * 0.25);
        target._revivedOnce = true;
        battle.log.push({ round, type: 'effect', msg: `☠️ REVIVE! ${target.name} oživio sa 25% HP! (${target._reviveChance}%)` });
        return;
      }
    }
    target.alive = false;
    target.hp    = 0;
    battle.log.push({ round, type: 'destroy', msg: `💀 ${target.name} UNIŠTEN!` });
    if (target.side === 'enemy' && attacker.side === 'player') {
      const stackBonus = attacker._killAtkStack || 0;
      if (stackBonus > 0) {
        const side = battle.player.filter(u => u.alive);
        side.forEach(u => {
          const boost = Math.floor(u.baseDps * stackBonus / 100);
          u.dps = Math.min(u.dps + boost, u.baseDps * 3);
        });
        battle.log.push({ round, type: 'effect', msg: `⚔️ Kill Stack: flota +${stackBonus}% napad!` });
      }
      const killRegen = attacker._killHpRegen || 0;
      if (killRegen > 0) {
        const side = battle.player.filter(u => u.alive);
        side.forEach(u => {
          const heal = Math.floor(u.maxHp * killRegen / 100);
          u.hp = Math.min(u.maxHp, u.hp + heal);
        });
      }
    }
    if (target.side === 'enemy') {
      window._totalShipsDestroyed = (window._totalShipsDestroyed || 0) + (target.count || 1);
    }
  }
}

// ── WEAPON RANGE POMOĆNE FUNKCIJE ──
function _getWeaponSteering(subtype, variant) {
  const base = { Ballistic: 6, Directional: 5, Missile: 4, FighterBay: 7 }[subtype] || 5;
  const tier = { 'I': 0, 'II': 1, 'III': 2 }[variant] || 0;
  return base + tier * 0.5;
}

function _getSlotWeaponRanges(slot) {
  const ranges = [];
  for (let i = 1; i <= 4; i++) {
    const wid = slot[`weapon_${i}`];
    if (!wid) continue;
    const wpn = typeof getWeaponById === 'function' ? getWeaponById(wid) : null;
    if (wpn && wpn.range) {
      const dmgRange = Math.floor((wpn.dps || 0) * 0.2);
      ranges.push({
        slotIdx: i,
        id: wpn.id,
        min: wpn.range.min,
        max: wpn.range.max,
        dmgMin: Math.max(1, (wpn.dps || 0) - dmgRange),
        dmgMax: (wpn.dps || 0) + dmgRange,
        cooldown: wpn.cooldown || 0,
        dmgType: wpn.dmgType || 'Kinetic',
        special: wpn.special || null,
        steering: _getWeaponSteering(wpn.subtype, wpn.variant),
        intercept: wpn.intercept || 0,
      });
    }
  }
  return ranges;
}

function _getClassWeaponRange(shipClass) {
  const map = {
    scout:     [{ slotIdx: 1, id: `${shipClass}_weapon`, min: 1, max: 2, dmgMin: 60, dmgMax: 100, cooldown: 0, dmgType: 'Kinetic', special: null, steering: 6, intercept: 0 }],
    fighter:   [{ slotIdx: 1, id: `${shipClass}_weapon`, min: 1, max: 2, dmgMin: 60, dmgMax: 100, cooldown: 0, dmgType: 'Kinetic', special: null, steering: 6, intercept: 0 }],
    cruiser:   [{ slotIdx: 1, id: `${shipClass}_weapon`, min: 2, max: 5, dmgMin: 40, dmgMax: 80, cooldown: 1, dmgType: 'Kinetic', special: null, steering: 5, intercept: 0 }],
    battleship:[{ slotIdx: 1, id: `${shipClass}_weapon`, min: 5, max: 8, dmgMin: 30, dmgMax: 60, cooldown: 2, dmgType: 'Kinetic', special: null, steering: 4, intercept: 0 }],
    carrier:   [{ slotIdx: 1, id: `${shipClass}_weapon`, min: 6, max: 10, dmgMin: 100, dmgMax: 180, cooldown: 3, dmgType: 'Kinetic', special: null, steering: 7, intercept: 0 }],
    special:   [{ slotIdx: 1, id: `${shipClass}_weapon`, min: 5, max: 8, dmgMin: 30, dmgMax: 60, cooldown: 2, dmgType: 'Kinetic', special: null, steering: 4, intercept: 0 }],
  };
  return map[shipClass] || [{ slotIdx: 1, id: `default_weapon`, min: 1, max: 2, dmgMin: 60, dmgMax: 100, cooldown: 0, dmgType: 'Kinetic', special: null, steering: 6, intercept: 0 }];
}

function _getInRangeWeapons(weaponRanges, distance) {
  return (weaponRanges || []).filter(w => distance >= w.min && distance <= w.max);
}

function _getWeaponsByIntercept(slot) {
  const interceptors = [];
  if (!slot) return interceptors;
  for (const key of ['weapon_1','weapon_2','weapon_3','weapon_4']) {
    const wid = slot[key];
    if (!wid) continue;
    const wpn = typeof getWeaponById === 'function' ? getWeaponById(wid) : null;
    if (!wpn) continue;
    if (wpn.intercept) interceptors.push({ chance: wpn.intercept, id: wpn.id });
  }
  return interceptors;
}

// ── TIP ŠTETE NAPADAČA ──
function getAttackerDmgType(attacker) {
  if (attacker._activeDmgType) return attacker._activeDmgType;
  if (!attacker.slot) return 'Kinetic';
  const weapons = ['weapon_1','weapon_2','weapon_3','weapon_4'];
  for (const w of weapons) {
    const wid = attacker.slot[w];
    if (wid) {
      const wpn = getWeaponById(wid);
      if (wpn) return wpn.dmgType || 'Kinetic';
    }
  }
  return 'Kinetic';
}

// ── DA LI NAPADAČ IMA GUIDED ORUŽJE ──
function getAttackerIsGuided(attacker) {
  if (!attacker.slot) return false;
  const weapons = ['weapon_1','weapon_2','weapon_3','weapon_4'];
  for (const w of weapons) {
    const wid = attacker.slot[w];
    if (!wid) continue;
    const wpn = getWeaponById(wid);
    const t = wpn?.special?.type;
    if (t === 'guided' || t === 'guided_dot' || t === 'guided_motor_disable' || t === 'guided_module_destroy') return true;
  }
  return false;
}

// ── HIGH DAMAGE BONUS ──
function getAttackerHighDamageBonus(attacker) {
  if (!attacker.slot) return 0;
  const weapons = ['weapon_1','weapon_2','weapon_3','weapon_4'];
  let bonus = 0;
  for (const w of weapons) {
    const wid = attacker.slot[w];
    if (!wid) continue;
    const wpn = getWeaponById(wid);
    if (wpn?.special?.type === 'high_damage') bonus = Math.max(bonus, wpn.special.bonus || 0);
  }
  return bonus;
}

// ── CRIT BONUS OD DIRECTIONAL ORUŽJA ──
function getAttackerCritBonus(attacker) {
  if (!attacker.slot) return 0;
  const weapons = ['weapon_1','weapon_2','weapon_3','weapon_4'];
  let bonus = 0;
  for (const w of weapons) {
    const wid = attacker.slot[w];
    if (!wid) continue;
    const wpn = getWeaponById(wid);
    if (wpn?.special?.type === 'crit') bonus = Math.max(bonus, wpn.special.bonus || 0);
  }
  return bonus;
}

// ── SPECIJALNI EFEKTI ORUŽJA ──
function applyWeaponEffect(attacker, target, battle, round) {
  if (!attacker.slot) return;

  const weapons = ['weapon_1','weapon_2','weapon_3','weapon_4'];
  for (const w of weapons) {
    const wid = attacker.slot[w];
    if (!wid) continue;
    const wpn = getWeaponById(wid);
    if (!wpn?.special) continue;

    const spec = wpn.special;
    const roll = Math.random() * 100;

    // BURN — gorenje po rundama
    if (spec.type === 'burn' && roll < spec.chance) {
      const dmgPR = spec.dmgPerRound || (spec.duration === 2 ? 20 : 35);
      target.effects.push({ type: 'burn', duration: spec.duration, dmgPerRound: dmgPR });
      battle.log.push({ round, type: 'effect', msg: `🔥 ${target.name} gori! (${spec.duration} runde, ${dmgPR}/rundi)` });
    }

    // SHIELD DISABLE — onesposobljava shield N rundi
    if (spec.type === 'shield_disable' && roll < spec.chance) {
      target.effects.push({ type: 'shield_disable', duration: spec.duration || 1 });
      battle.log.push({ round, type: 'effect', msg: `🧲 ${target.name} shield onesposobljen (${spec.duration || 1} runde)!` });
    }

    // AREA — pogađa još brodova (Explosive Ballistic)
    if (spec.type === 'area' && roll < spec.chance) {
      const otherTargets = (attacker.side === 'player' ? battle.enemy : battle.player)
        .filter(e => e.alive && e.id !== target.id)
        .slice(0, spec.extra_targets || 1);
      otherTargets.forEach(t => {
        let areaDmg = Math.floor(attacker.dps * 0.5);
        if (t.shield > 0) {
          const shieldAbsorb = Math.min(t.shield, areaDmg);
          t.shield -= shieldAbsorb;
          areaDmg  -= shieldAbsorb;
        }
        t.hp = Math.max(0, t.hp - areaDmg);
        battle.log.push({ round, type: 'effect', msg: `💣 Area šteta: ${t.name} -${areaDmg} HP` });
        if (t.hp <= 0) { t.alive = false; battle.log.push({ round, type: 'destroy', msg: `💀 ${t.name} UNIŠTEN!` }); }
      });
    }

    // ARMOR_MELT — privremeno smanjuje oklop mete
    if (spec.type === 'armor_melt') {
      target.effects.push({ type: 'armor_melt', value: spec.value || 10, duration: spec.duration || 1 });
      battle.log.push({ round, type: 'effect', msg: `🔥 ${target.name} oklop istopljen: -${spec.value}% def (${spec.duration || 1} runde)` });
    }

    // WEAPON_DISABLE — onesposobljava oružje mete
    if (spec.type === 'weapon_disable' && roll < spec.chance) {
      target.effects.push({ type: 'weapon_disable', duration: spec.duration || 1 });
      battle.log.push({ round, type: 'effect', msg: `🔧 ${target.name} oružje onesposobljeno (${spec.duration || 1} runde)!` });
    }

    // SHIELD_PENETRATE — dio štete ide direktno kroz shield u HP
    if (spec.type === 'shield_penetrate' && target.shield > 0) {
      const penetratePct = spec.bonus || 20;
      const extraHpDmg   = Math.floor(attacker.dps * (penetratePct / 100));
      target.hp = Math.max(0, target.hp - extraHpDmg);
      battle.log.push({ round, type: 'effect', msg: `🔱 ${attacker.name} probio shield: ${extraHpDmg} direktno u HP ${target.name}!` });
      if (target.hp <= 0) { target.alive = false; battle.log.push({ round, type: 'destroy', msg: `💀 ${target.name} UNIŠTEN!` }); }
    }

    // EMP_STUN — šansa stuna + eventualno shield disable
    if (spec.type === 'emp_stun' && roll < spec.chance) {
      target.effects.push({ type: 'stun', duration: spec.duration || 1 });
      battle.log.push({ round, type: 'effect', msg: `⚡ EMP! ${target.name} stunovan (${spec.duration || 1} runde)!` });
      if (spec.duration >= 2) {
        target.effects.push({ type: 'shield_disable', duration: 1 });
        battle.log.push({ round, type: 'effect', msg: `🧲 ${target.name} shield onesposobljen od EMP-a!` });
      }
    }

    // GUIDED — 100% pogodak (evade se preskače) + bonus šteta
    // Napomena: guided se primjenjuje u performAttack (evade skip), ovdje bonus šteta
    if (spec.type === 'guided' && spec.bonus) {
      const guidedBonus = Math.floor(attacker.dps * (spec.bonus / 100));
      if (target.shield > 0) {
        const sa = Math.min(target.shield, guidedBonus);
        target.shield -= sa;
        target.hp = Math.max(0, target.hp - (guidedBonus - sa));
      } else {
        target.hp = Math.max(0, target.hp - guidedBonus);
      }
      battle.log.push({ round, type: 'effect', msg: `🎯 Guided bonus: ${guidedBonus} extra štete na ${target.name}` });
      if (target.hp <= 0) { target.alive = false; battle.log.push({ round, type: 'destroy', msg: `💀 ${target.name} UNIŠTEN!` }); }
    }

    // GUIDED_DOT — guided + burn DoT
    if (spec.type === 'guided_dot') {
      target.effects.push({ type: 'burn', duration: spec.dot_dur || 2, dmgPerRound: spec.dot_dmg || 15 });
      battle.log.push({ round, type: 'effect', msg: `🎯🔥 Guided gorenje: ${target.name} -${spec.dot_dmg}/rundi (${spec.dot_dur} runde)` });
    }

    // GUIDED_MOTOR_DISABLE — guided + šansa onesposobljava motor (smanjuje speed i agility)
    if (spec.type === 'guided_motor_disable' && roll < spec.chance) {
      target.effects.push({ type: 'motor_disable', duration: spec.duration || 1 });
      battle.log.push({ round, type: 'effect', msg: `🎯🔧 Guided motor disable: ${target.name} usporjen (${spec.duration || 1} runde)!` });
    }

    // GUIDED_MODULE_DESTROY — guided + šansa uništava modul (trajno -10% DPS)
    if (spec.type === 'guided_module_destroy' && roll < spec.chance) {
      target.dps = Math.floor(target.dps * 0.9);
      battle.log.push({ round, type: 'effect', msg: `🎯💥 Guided modul destroy: ${target.name} -10% DPS trajno!` });
      if (spec.chance >= 18) {
        // Viši tier: dodatna area šteta
        const nearTargets = (attacker.side === 'player' ? battle.enemy : battle.player)
          .filter(e => e.alive && e.id !== target.id).slice(0, 1);
        nearTargets.forEach(t => {
          const splashDmg = Math.floor(attacker.dps * 0.3);
          t.hp = Math.max(0, t.hp - splashDmg);
          battle.log.push({ round, type: 'effect', msg: `💥 Splash šteta: ${t.name} -${splashDmg} HP` });
          if (t.hp <= 0) { t.alive = false; battle.log.push({ round, type: 'destroy', msg: `💀 ${t.name} UNIŠTEN!` }); }
        });
      }
    }

    // HIGH_DAMAGE — pasivni bonus štete (već dodan u performAttack ako je aktivan)
    // Ovdje: tier III high_damage dodaje burn
    if (spec.type === 'high_damage' && spec.bonus >= 35) {
      target.effects.push({ type: 'burn', duration: 1, dmgPerRound: 30 });
      battle.log.push({ round, type: 'effect', msg: `💥🔥 High Damage gorenje: ${target.name} -30 HP sledeću rundu` });
    }

    // MULTI_TARGET — napada više meta (FighterBay Light/Heavy)
    if (spec.type === 'multi_target') {
      const extraCount = (spec.targets || 1) - 1;
      if (extraCount > 0) {
        const extraTargets = (attacker.side === 'player' ? battle.enemy : battle.player)
          .filter(e => e.alive && e.id !== target.id).slice(0, extraCount);
        extraTargets.forEach(t => {
          let mDmg = attacker.dps;
          if (t.shield > 0) {
            const sa = Math.min(t.shield, mDmg); t.shield -= sa; mDmg -= sa;
          }
          t.hp = Math.max(0, t.hp - mDmg);
          battle.log.push({ round, type: 'effect', msg: `✈️ Multi napad: ${t.name} -${attacker.dps} štete` });
          if (t.hp <= 0) { t.alive = false; battle.log.push({ round, type: 'destroy', msg: `💀 ${t.name} UNIŠTEN!` }); }
        });
      }
    }

    // MULTI_MIXED — napada više meta s miješanom štetom (Elite Squadron)
    if (spec.type === 'multi_mixed') {
      const extraCount = (spec.targets || 2) - 1;
      const extraTargets = (attacker.side === 'player' ? battle.enemy : battle.player)
        .filter(e => e.alive && e.id !== target.id).slice(0, extraCount);
      extraTargets.forEach(t => {
        // Bira optimalnu štetu prema oklop tipu
        let mDmg = attacker.dps;
        if (t.shield > 0) {
          const sa = Math.min(t.shield, mDmg); t.shield -= sa; mDmg -= sa;
        }
        t.hp = Math.max(0, t.hp - mDmg);
        battle.log.push({ round, type: 'effect', msg: `✈️ Elite mixed napad: ${t.name} -${attacker.dps} štete` });
        if (t.hp <= 0) { t.alive = false; battle.log.push({ round, type: 'destroy', msg: `💀 ${t.name} UNIŠTEN!` }); }
      });
    }

    // AREA_MULTI — bombarder napada N random meta (Bomber Squadron)
    if (spec.type === 'area_multi') {
      const bombTargets = (attacker.side === 'player' ? battle.enemy : battle.player)
        .filter(e => e.alive && e.id !== target.id)
        .slice(0, spec.targets || 3);
      bombTargets.forEach(t => {
        let bDmg = Math.floor(attacker.dps * 0.7);
        if (t.shield > 0) {
          const sa = Math.min(t.shield, bDmg); t.shield -= sa; bDmg -= sa;
        }
        t.hp = Math.max(0, t.hp - bDmg);
        battle.log.push({ round, type: 'effect', msg: `✈️💣 Bombarder: ${t.name} -${bDmg} HP` });
        if (t.hp <= 0) {
          t.alive = false;
          battle.log.push({ round, type: 'destroy', msg: `💀 ${t.name} UNIŠTEN!` });
        }
      });
      // Bomber III može uništiti slabog neprijatelja direktno
      if (spec.targets >= 5 && target.hp < target.maxHp * 0.15) {
        target.alive = false; target.hp = 0;
        battle.log.push({ round, type: 'destroy', msg: `✈️💣 Bombarder uništio ${target.name} direktnim pogotkom!` });
      }
    }
  }
}

// ── PROCESIRAJ EFEKTE NA POČETKU POTEZA ──
// Vraća true ako je jedinica stunована (preskoči napad)
function processEffects(unit, battle) {
  if (!unit.effects || unit.effects.length === 0) return false;

  let isStunned = false;

  unit.effects = unit.effects.filter(eff => {
    if (eff.type === 'burn') {
      unit.hp = Math.max(0, unit.hp - eff.dmgPerRound);
      battle.log.push({ round: battle.round, type: 'effect', msg: `🔥 ${unit.name} gori: -${eff.dmgPerRound} HP` });
      if (unit.hp <= 0) {
        unit.alive = false;
        battle.log.push({ round: battle.round, type: 'destroy', msg: `💀 ${unit.name} UNIŠTEN od gorenja!` });
      }
      eff.duration--;
      return eff.duration > 0;
    }

    if (eff.type === 'shield_disable') {
      unit.shield = 0;
      eff.duration--;
      return eff.duration > 0;
    }

    if (eff.type === 'stun') {
      isStunned = true;
      battle.log.push({ round: battle.round, type: 'effect', msg: `⚡ ${unit.name} je stunovan — preskače napad!` });
      eff.duration--;
      return eff.duration > 0;
    }

    // ARMOR_MELT — privremeno snižava oklop (smanjuje efektivnu štetu koju prima)
    // Efekat se primjenjuje pasivno u performAttack — ovaj blok samo broji trajanje
    if (eff.type === 'armor_melt') {
      eff.duration--;
      return eff.duration > 0;
    }

    // WEAPON_DISABLE — brod ne može napadati
    if (eff.type === 'weapon_disable') {
      isStunned = true; // reuse stun logike — preskače napad
      battle.log.push({ round: battle.round, type: 'effect', msg: `🔧 ${unit.name} oružje onesposobljeno — preskače napad!` });
      eff.duration--;
      return eff.duration > 0;
    }

    // MOTOR_DISABLE — smanjuje speed i agility (primjenjuje se odmah, vraća se kad istekne)
    if (eff.type === 'motor_disable') {
      if (!eff.applied) {
        unit.speed   = Math.max(1, Math.floor(unit.speed   * 0.5));
        unit.agility = Math.max(0, Math.floor(unit.agility * 0.5));
        eff.applied  = true;
      }
      eff.duration--;
      if (eff.duration <= 0) {
        // Vrati originalne vrijednosti
        unit.speed   = Math.floor(unit.speed   * 2);
        unit.agility = Math.floor(unit.agility * 2);
        return false;
      }
      return true;
    }

    return true;
  });

  return isStunned;
}

// ── RARITY BLUEPRINTA ──
function getBlueprintRarity(itemId) {
  // Provjeri weapons, shields, engines, recon i special module (oni imaju rarity polje)
  const allArrays = [
    ...(typeof WEAPONS        !== 'undefined' ? WEAPONS        : []),
    ...(typeof SHIELDS        !== 'undefined' ? SHIELDS        : []),
    ...(typeof ENGINES        !== 'undefined' ? ENGINES        : []),
    ...(typeof RECON_MODULES  !== 'undefined' ? RECON_MODULES  : []),
    ...(typeof SPECIAL_MODULES !== 'undefined' ? SPECIAL_MODULES : []),
  ];
  const item = allArrays.find(x => x.id === itemId);
  if (item) return item.rarity || 'C';

  // Zatim provjeri brodove – koristi getShipRarity iz ships.js
  if (typeof getShipRarity === 'function') {
    return getShipRarity(itemId);
  }
  
  // Fallback – stara logika (za svaki slučaj ako getShipRarity ne postoji)
  if (itemId.endsWith('_III')) return 'E';
  if (itemId.endsWith('_II'))  return 'R';
  if (itemId.includes('special')) return 'L';
  return 'C';
}

// ── FRAGMENT COST PO RARITY ──
function getBpFragmentCost(rarity) {
  return BP_FRAGMENT_COST?.[rarity] || 25;
}

// ── DODAJ FRAGMENT ──
function addBlueprintFragment(itemId, count = 1, silent = false) {
  if (!blueprintFragments[itemId]) blueprintFragments[itemId] = 0;
  blueprintFragments[itemId] += count;

  const needed = getBpFragmentCost(getBlueprintRarity(itemId));
  const current = blueprintFragments[itemId];
  const name = getBpName(itemId);

  if (!silent) {
    toast(`🧩 +${count} fragment: ${name} (${current}/${needed})`, 'inf');
    addLog(`🧩 Fragment: ${name} (${current}/${needed})`);
  }

  // Auto-craft ako ima dovoljno
  if (current >= needed && !ownedBlueprints[itemId]) {
    craftBlueprint(itemId);
  }
}

// ── CRAFT BLUEPRINT IZ FRAGMENATA ──
function craftBlueprint(itemId) {
  const needed = getBpFragmentCost(getBlueprintRarity(itemId));
  if ((blueprintFragments[itemId] || 0) < needed) {
    toast('❌ Nedovoljno fragmenata!', 'err');
    return false;
  }
  blueprintFragments[itemId] -= needed;
  unlockBlueprint(itemId);
  toast(`✅ Blueprint craftovan: ${getBpName(itemId)}!`, 'ok');
  addLog(`✅ Blueprint craftovan iz fragmenata: ${getBpName(itemId)}`);
  saveGame();
  return true;
}

// ── GARANT FRAGMENT — po broju pokušaja ──
function getGuaranteedFragment(instance, prog) {
  const clearCount = prog?.clear_count || 0;
  // Garant fragment svakih X pokušaja bez blueprint dropa
  const guaranteeEvery = instance.difficulty <= 5  ? 5  :
                         instance.difficulty <= 10 ? 8  :
                         instance.difficulty <= 20 ? 10 :
                         instance.difficulty <= 30 ? 12 : 15;

  if (clearCount > 0 && clearCount % guaranteeEvery === 0) {
    // Daj fragment za random neposjedovani blueprint iz instance
    const allDrops = [
      ...(instance.drops?.guaranteed || []),
      ...(instance.drops?.chance || []).map(c => c.item),
    ];
    const missing = allDrops.filter(id => !ownedBlueprints[id]);
    if (missing.length > 0) {
      return missing[Math.floor(Math.random() * missing.length)];
    }
  }
  return null;
}

// ── IZRAČUNAJ NAGRADE ──
function calculateRewards(battle, instanceData, prog) {
  if (battle.status !== 'victory') return null;

  const instance = instanceData;

  // ── DIFFICULTY MODE ──
  const modeName = (typeof _instDifficultyMode !== 'undefined' ? _instDifficultyMode : 'easy');
  const MODE_XP_MULT = { easy: 1.0, normal: 3.0, nightmare: 10.0, hell: 30.0 };
  const xpMult = MODE_XP_MULT[modeName] || 1.0;

  // Koje rarity blueprinte/fragmente ovaj mod dozvoljava
  const MODE_ALLOWED_RARITY = {
    easy:      ['C'],
    normal:    ['C', 'R'],
    nightmare: ['C', 'R', 'E'],
    hell:      ['C', 'R', 'E', 'L'],
  };
  const allowedRarity = MODE_ALLOWED_RARITY[modeName] || ['C'];

  // Šansa za CIJELI blueprint po rarity i modu (0 = nikad)
  const MODE_BP_CHANCE = {
    easy:      { C: 0,   R: 0,   E: 0,   L: 0  }, // Easy — nikad cijeli BP, samo fragmenti
    normal:    { C: 20,  R: 8,   E: 0,   L: 0  },
    nightmare: { C: 35,  R: 18,  E: 6,   L: 0  },
    hell:      { C: 50,  R: 30,  E: 15,  L: 5  },
  };
  const bpChance = MODE_BP_CHANCE[modeName] || MODE_BP_CHANCE.easy;

  // Šansa za FRAGMENT po rarity i modu
  const MODE_FRAG_CHANCE = {
    easy:      { C: 60,  R: 0,   E: 0,   L: 0  },
    normal:    { C: 70,  R: 40,  E: 0,   L: 0  },
    nightmare: { C: 80,  R: 60,  E: 30,  L: 0  },
    hell:      { C: 90,  R: 75,  E: 50,  L: 20 },
  };
  const fragChance = MODE_FRAG_CHANCE[modeName] || MODE_FRAG_CHANCE.easy;

  const baseXp = instance.xp || instance.difficulty * 100;
  const rewards = {
    metal:      randomRange(instance.resources.metal[0],   instance.resources.metal[1]),
    crystal:    randomRange(instance.resources.crystal[0], instance.resources.crystal[1]),
    he3:        randomRange(instance.resources.he3[0],     instance.resources.he3[1]),
    blueprints: [],
    fragments:  [],
    xp:         Math.floor(baseXp * xpMult),
  };

  // Boss instance tipovi koriste novi garantovani drop sistem — skip stari
  const isBossInst = ['boss_rare','boss_epic','boss_legendary','boss_master','boss'].includes(instance.type);

  // Redoslijed modova za minMode provjeru
  const MODE_ORDER = ['easy', 'normal', 'nightmare', 'hell'];

  // Svi mogući blueprinti iz instance — filtriraj po allowed rarity i minMode za ovaj mod
  const chanceDrops = instance.drops?.chance || [];
  const allDrops = isBossInst ? [] : [
    ...(instance.drops?.guaranteed || []),
    ...chanceDrops
      .filter(c => !c.minMode || MODE_ORDER.indexOf(modeName) >= MODE_ORDER.indexOf(c.minMode))
      .map(c => c.item),
  ];

  // Artifakti iz chance arraya — odvojiti od blueprintova
  const artifactDrops = allDrops.filter(id => id.startsWith('art_'));
  const bpDrops = allDrops.filter(id => !id.startsWith('art_'));

  // Procesiraj artifakte — svaki baci kocku (60% šansa za fragment na easy+)
  const ART_FRAG_CHANCE = { easy: 60, normal: 70, nightmare: 80, hell: 90 };
  const artFragChance = ART_FRAG_CHANCE[modeName] || 60;
  if (!rewards.artifactFragments) rewards.artifactFragments = [];
  artifactDrops.forEach(id => {
    if (typeof ARTIFACTS_DATA !== 'undefined' && window.artifactState?.fragments) {
      const art = ARTIFACTS_DATA.find(a => a.id === id);
      if (art && (window.artifactState.fragments[id] || 0) >= art.fragments) return;
    }
    if (Math.random() * 100 < artFragChance) {
      rewards.artifactFragments.push(id);
    }
  });

  const available = bpDrops.filter(id => {
    if (ownedBlueprints[id]) return false;
    const rarity = getBlueprintRarity(id);
    return allowedRarity.includes(rarity);
  });

  if (available.length === 0) {
    rewards.allFound = true;
  } else {
    // Cijeli blueprint drop (Easy uvijek 0%)
    available.forEach(id => {
      const rarity = getBlueprintRarity(id);
      const chance = bpChance[rarity] || 0;
      if (chance > 0 && Math.random() * 100 < chance) {
        rewards.blueprints.push(id);
      }
    });

    // Fragment drop — za svaki dostupan BP baci kocku + pity (100 pokušaja)
    if (!window._dropPity) window._dropPity = {};
    const PITY_THRESHOLD = 100;
    available.forEach(id => {
      if (rewards.blueprints.includes(id)) return; // već dobio cijeli BP
      const rarity   = getBlueprintRarity(id);
      const chance   = fragChance[rarity] || 0;
      const pityKey  = instance.id + '_' + id;
      const pityCount = window._dropPity[pityKey] || 0;
      const pityed   = pityCount >= PITY_THRESHOLD;
      const dropped  = pityed || (chance > 0 && Math.random() * 100 < chance);
      if (dropped) {
        if (!rewards.fragments.some(f => f.itemId === id)) {
          rewards.fragments.push({ itemId: id, count: 1, ...(pityed ? { pity: true } : {}) });
        }
        window._dropPity[pityKey] = 0; // reset pity
      } else {
        window._dropPity[pityKey] = pityCount + 1; // inkrement pity
      }
    });

    // Garant fragment po broju pokušaja (svaki X run)
    const garantFragment = getGuaranteedFragment(instance, prog);
    if (garantFragment) {
      const rarity = getBlueprintRarity(garantFragment);
      if (allowedRarity.includes(rarity) && !rewards.fragments.some(f => f.itemId === garantFragment)) {
        rewards.fragments.push({ itemId: garantFragment, count: 1, garant: true });
      }
    }

    const remaining = available.filter(id => !rewards.blueprints.includes(id));
    if (remaining.length === 0) rewards.allFound = true;
  }

  // ── BOSS BONUS DROPOVI ──
  // R boss = 3 itema, E boss = 6, L boss = 10
  // Easy = samo fragmenti, Normal+ = puni unlock po raritetu
  const bossDropCount = {
    boss_rare:      3,
    boss_epic:      6,
    boss_legendary: 10,
    boss_master:    15,
    boss:           6,
  }[instance.type] || 0;

  if (bossDropCount > 0) {
    // Dozvoljeni rariteti po tipu bossa i modu — prati iste restrikcije kao opšti drop sistem
    const bossRarityPool = {
      boss_rare: {
        easy:      ['C'],
        normal:    ['C','R'],
        nightmare: ['C','R'],
        hell:      ['C','R','R','R'],
      },
      boss_epic: {
        easy:      ['C'],
        normal:    ['C','R'],
        nightmare: ['C','R','E'],
        hell:      ['C','R','E','E'],
      },
      boss_legendary: {
        easy:      ['C'],
        normal:    ['C','R'],
        nightmare: ['C','R','E'],
        hell:      ['C','R','E','L'],
      },
      boss_master: {
        easy:      ['C','R'],
        normal:    ['C','R','E'],
        nightmare: ['C','R','E','L'],
        hell:      ['C','R','E','L','L','L'],
      },
      boss: {
        easy:      ['C'],
        normal:    ['C','R'],
        nightmare: ['C','R','E'],
        hell:      ['C','R','E','L'],
      },
    };
    const allowedBossRarities = (bossRarityPool[instance.type] || {})[modeName] || ['C'];

    // Prikupi sve iteme
    let allItems = [];
    if (typeof WEAPONS         !== 'undefined') allItems.push(...WEAPONS.map(x => ({ id: x.id, rarity: x.rarity })));
    if (typeof SHIELDS         !== 'undefined') allItems.push(...SHIELDS.map(x => ({ id: x.id, rarity: x.rarity })));
    if (typeof ENGINES         !== 'undefined') allItems.push(...ENGINES.map(x => ({ id: x.id, rarity: x.rarity })));
    if (typeof RECON_MODULES   !== 'undefined') allItems.push(...RECON_MODULES.map(x => ({ id: x.id, rarity: x.rarity })));
    if (typeof SPECIAL_MODULES !== 'undefined') allItems.push(...SPECIAL_MODULES.map(x => ({ id: x.id, rarity: x.rarity })));

    // Weighted pool — isti weights kao u postojećem sistemu
    const rarityWeights = { C: 50, R: 30, E: 15, L: 5 };

    // Weighted pool — svaki UNIQUE item jednom, težina određuje vjerovatnost
    const bossPool = [];
    const seenIds  = new Set();
    allItems.forEach(item => {
      if (!item.id || seenIds.has(item.id)) return;
      if (ownedBlueprints[item.id]) return;
      if (!allowedBossRarities.includes(item.rarity)) return;
      seenIds.add(item.id);
      const w = rarityWeights[item.rarity] || 0;
      for (let i = 0; i < w; i++) bossPool.push(item.id);
    });

    // Dodaj instance-specific dropove u pool
    if (instance.drops?.chance) {
      instance.drops.chance.forEach(c => {
        if (!c.item || seenIds.has(c.item)) return;
        if (ownedBlueprints[c.item]) return;
        if (c.item.startsWith('art_') && typeof ARTIFACTS_DATA !== 'undefined' && window.artifactState?.fragments) {
          const art = ARTIFACTS_DATA.find(a => a.id === c.item);
          if (art && (window.artifactState.fragments[c.item] || 0) >= art.fragments) return;
        }
        if (c.minMode && MODE_ORDER.indexOf(modeName) < MODE_ORDER.indexOf(c.minMode)) return;
        seenIds.add(c.item);
        const rar = getBlueprintRarity(c.item);
        if (!allowedBossRarities.includes(rar)) return;
        const w = rarityWeights[rar] || 1;
        for (let i = 0; i < w; i++) bossPool.push(c.item);
      });
    }

    if (bossPool.length > 0) {
      // Odaberi bossDropCount UNIQUE itema (bez ponavljanja)
      const shuffled  = bossPool.slice().sort(() => Math.random() - 0.5);
      const uniqueIds = [...new Set(shuffled)];
      const bossDrops = uniqueIds.slice(0, bossDropCount);

      if (!rewards.bossDrops) rewards.bossDrops = [];
      rewards.bossDrops.push(...bossDrops);

      // Svaki drop — isti sistem kao opšti dropovi:
      // roll za puni blueprint (MODE_BP_CHANCE), ako ne — fragment (MODE_FRAG_CHANCE), ako ni to — fragment anyway
      bossDrops.forEach(id => {
        // Artifakti idu u artifact sistem, ne u blueprint sistem
        if (id.startsWith('art_')) {
          if (!rewards.artifactFragments) rewards.artifactFragments = [];
          if (!rewards.artifactFragments.includes(id)) rewards.artifactFragments.push(id);
          return;
        }
        const item   = allItems.find(x => x.id === id);
        const rar    = item?.rarity || 'C';
        const bpRoll = Math.random() * 100;

        if (bpRoll < (bpChance[rar] || 0)) {
          // Puni blueprint
          if (!rewards.blueprints.includes(id)) rewards.blueprints.push(id);
        } else {
          // Fragment
          const existing = rewards.fragments.find(f => f.itemId === id);
          if (existing) existing.count++;
          else rewards.fragments.push({ itemId: id, count: 1, boss: true });
        }
      });
    }
  }

  return rewards;
}

// ── PRIMIJENI NAGRADE ──
function applyRewards(rewards) {
  if (!rewards) return;

  R.metal   += rewards.metal;
  R.crystal += rewards.crystal;
  R.he3     += rewards.he3;
  R.score   += rewards.xp;

  addExp(rewards.xp);

  // Blueprinti
  rewards.blueprints.forEach(id => unlockBlueprint(id));

  // Fragmenti — boss dropovi tiho (prikazuju se u BOSS DROPS sekciji, ne kao toast)
  if (rewards.fragments && rewards.fragments.length > 0) {
    rewards.fragments.forEach(f => addBlueprintFragment(f.itemId, f.count, !!f.boss));
  }

  // Artifakt fragmenti iz instance chance arraya
  if (rewards.artifactFragments && rewards.artifactFragments.length > 0) {
    rewards.artifactFragments.forEach(id => {
      if (typeof addArtifactFragment === 'function') addArtifactFragment(id, 1);
    });
  }

  updateResUI();
  saveGame();
}

// ── GUBITCI IGRAČA ──
function calculatePlayerLosses(battle) {
  const losses = [];
  battle.player.forEach((unit, idx) => {
    if (!unit.alive) {
      losses.push({ slot: idx, name: unit.name, count: unit.count });
    } else if (unit.hp < unit.maxHp) {
      // Proporcionalni gubitci
      const pctLost  = 1 - (unit.hp / unit.maxHp);
      const shipsLost = Math.floor(unit.count * pctLost);
      if (shipsLost > 0) losses.push({ slot: idx, name: unit.name, count: shipsLost, partial: true });
    }
  });
  return losses;
}

function applyPlayerLosses(battle) {
  let anyLost = false;

  // Prikupljamo podatke o izgubljenim brodovima za fleet_recovery
  const recoveryData = []; // { design_id, count }

  battle.player.forEach(unit => {
    const fleetIdx = unit.fleetIdx;
    // Koristi direktnu slot referencu (za višestruke flote komandira) ili fallback na globalni fleet
    const slot = unit._slot || ((fleetIdx >= 0) ? fleet[fleetIdx] : null);
    if (!slot) return;

    if (!unit.alive) {
      // Zabilježi izgubljene brodove za fleet_recovery
      if (slot.design_id && unit.count > 0) {
        recoveryData.push({ design_id: slot.design_id, count: unit.count });
      }
      // Nulliraj u globalnom fleet-u ili direktno u slot reference-u commander flote
      if (unit._slot && unit._slot._ownerCmdId !== undefined && unit._slot._ownerIdx !== undefined) {
        const ownerFleet = getCmdFleet(unit._slot._ownerCmdId);
        if (ownerFleet) ownerFleet[unit._slot._ownerIdx] = null;
      } else if (fleetIdx >= 0) {
        fleet[fleetIdx] = null;
      }
      anyLost = true;
      addLog(`💀 ${unit.name} — svi brodovi uništeni u borbi.`);
    } else if (unit.hp < unit.maxHp) {
      const pctSurvived = unit.hp / unit.maxHp;
      const survived    = Math.max(1, Math.floor(slot.count * pctSurvived));
      const lost        = slot.count - survived;
      // Zabilježi parcijalne gubitke za fleet_recovery
      if (slot.design_id && lost > 0) {
        recoveryData.push({ design_id: slot.design_id, count: lost });
      }
      slot.count        = survived;
      if (lost > 0) { anyLost = true; addLog(`⚔️ ${unit.name} — izgubljeno ${lost} brodova.`); }
    }
  });

  // ── FLEET RECOVERY (Undead pasivna sposobnost) ──
  if (anyLost && recoveryData.length > 0) {
    // Nađi najveći fleet_recovery% među svim deployovanim komandirima
    let recoveryPct = 0;
    let recoveryCmd = null;
    const deployed = window._deployedCommanders || [];
    deployed.forEach(cmd => {
      if (!cmd) return;
      const passive = cmd.passive;
      if (passive && passive.fleet_recovery && passive.fleet_recovery > recoveryPct) {
        recoveryPct = passive.fleet_recovery;
        recoveryCmd = cmd;
      }
    });

    if (recoveryPct > 0 && recoveryCmd) {
      const totalRecovered = [];
      recoveryData.forEach(item => {
        const recoveredCount = Math.floor(item.count * (recoveryPct / 100));
        if (recoveredCount > 0) {
          // Dodaj u hangar
          const hEntry = hangar.find(h => h.design_id === item.design_id);
          if (hEntry) {
            hEntry.count += recoveredCount;
          } else {
            hangar.push({ design_id: item.design_id, count: recoveredCount });
          }
          totalRecovered.push({ design_id: item.design_id, count: recoveredCount });
        }
      });

      if (totalRecovered.length > 0) {
        const totalShips = totalRecovered.reduce((s, x) => s + x.count, 0);
        addLog(`☠️ ${recoveryCmd.name} (${recoveryPct}% Fleet Recovery) — ${totalShips} brodova vraćeno u hangar!`);
        window._lastFleetRecovery = { cmd: recoveryCmd.name, pct: recoveryPct, ships: totalShips };
      }
    }
  }

  // Savršena pobjeda — nema gubitaka
  if (battle.status === 'victory' && !anyLost) {
    window._flawlessWins    = (window._flawlessWins    || 0) + 1;
    window._instanceStreak  = (window._instanceStreak  || 0) + 1;
  } else {
    window._instanceStreak  = 0; // reset serije ako je bilo gubitaka
  }
}

// ── HELPER ──
function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ── RENDER BATTLE REZULTATA ──
function renderBattleResult(battle, rewards) {
  const isVictory = battle.status === 'victory';
  const isDraw    = battle.status === 'draw';
  const losses    = calculatePlayerLosses(battle);

  const statusColor = isVictory ? '#00ff88' : isDraw ? '#ffcc44' : '#ff3355';
  const statusIcon  = isVictory ? '🏆' : isDraw ? '⚖️' : '💀';
  const statusText  = isVictory ? 'POBJEDA' : isDraw ? 'IZJEDNAČENJE' : 'PORAZ';

  // Enemy komandiri (postavlja generateEnemies) — može biti više
  const eCmds = window._lastEnemyCommanders || (window._lastEnemyCommander ? [window._lastEnemyCommander] : []);
  const eCmdHtml = eCmds.length > 0 ? (() => {
    const rarColors = { C:'#ffdd00', R:'#4488ff', E:'#aa44ff', L:'#ff8800' };
    const bonuses   = window._lastEnemyCommander?.bonuses || { atk:0, hp:0, shield:0 };
    return `
    <div style="background:rgba(255,100,0,0.06);border:1px solid rgba(255,100,0,0.25);
      border-radius:6px;padding:8px 10px;margin-bottom:12px;font-size:0.65rem">
      <div style="color:#ff8844;font-weight:700;margin-bottom:5px">
        ⚔️ Neprijateljski Komandiri (${eCmds.length})
        <span style="font-size:0.58rem;opacity:0.7;margin-left:5px">Lv.${eCmds[0]?.level || '?'}</span>
        ${bonuses.atk > 0 || bonuses.hp > 0 ? `<span style="font-size:0.58rem;color:#ffaa44;margin-left:6px">+${bonuses.atk}% DPS · +${bonuses.hp}% HP</span>` : ''}
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:4px">
        ${eCmds.map(cmd => {
          const col = rarColors[cmd.rarity] || '#aaa';
          return `<span style="background:${col}15;border:1px solid ${col}44;border-radius:4px;
            padding:2px 7px;font-size:0.6rem;color:${col}">
            ${cmd.icon} ${cmd.name}
          </span>`;
        }).join('')}
      </div>
    </div>`;
  })() : '';

  // Artifact bonusi aktivni tokom borbe
  const _artB = typeof getArtifactBonuses === 'function' ? getArtifactBonuses() : null;
  const artBattleHtml = (() => {
    if (!_artB) return '';
    const parts = [];
    const totalAtk = (_artB.attack || 0) + (_artB.fleet || 0);
    const totalDef = (_artB.defense || 0) + (_artB.resist || 0);
    if (totalAtk)    parts.push(`⚔️ +${totalAtk}% DPS`);
    if (totalDef)    parts.push(`🛡️ +${totalDef}% Def`);
    if (_artB.crit)  parts.push(`💥 +${_artB.crit}% Krit`);
    if (_artB.hp)    parts.push(`❤️ +${_artB.hp}% HP`);
    const now = Math.floor(Date.now() / 1000);
    const surgeOn = (window._metalBoostEnd || 0) > now && (window._metalBoost || 1) > 1;
    if (surgeOn)     parts.push(`⚡ Surge ${window._metalBoost}× aktivan`);
    if (parts.length === 0) return '';
    return `
    <div style="background:rgba(255,204,68,0.05);border:1px solid rgba(255,204,68,0.2);
      border-radius:6px;padding:8px 10px;margin-bottom:12px;font-size:0.65rem">
      <div style="color:#ffcc44;font-weight:700;margin-bottom:6px">⚙️ Artifact Bonusi</div>
      <div style="display:flex;flex-wrap:wrap;gap:5px">
        ${parts.map(p => `<span style="background:rgba(255,204,68,0.1);border:1px solid rgba(255,204,68,0.3);
          border-radius:4px;padding:2px 8px;color:#ffcc44">${p}</span>`).join('')}
      </div>
    </div>`;
  })();

  const body = `
    <!-- Status -->
    <div style="text-align:center;margin-bottom:20px">
      <div style="font-size:2.5rem;margin-bottom:8px">${statusIcon}</div>
      <div style="font-family:'Orbitron',monospace;font-size:1.4rem;color:${statusColor};
        text-shadow:0 0 20px ${statusColor}44">${statusText}</div>
      <div style="font-size:0.72rem;color:#6a90b8;margin-top:4px">
        Završeno u ${battle.round} rundi
      </div>
    </div>

    ${artBattleHtml}
    ${eCmdHtml}

    <!-- Nagrade -->
    ${isVictory && rewards ? `
      <div style="background:rgba(0,255,136,0.05);border:1px solid rgba(0,255,136,0.2);
        border-radius:8px;padding:14px;margin-bottom:16px">
        <div style="font-size:0.72rem;color:#00ff88;font-weight:700;margin-bottom:10px">🎁 NAGRADE</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;text-align:center;margin-bottom:10px">
          <div><div style="font-size:0.62rem;color:#6a90b8">METAL</div>
            <div style="color:white;font-family:'Share Tech Mono',monospace">+${fmt(rewards.metal)}</div></div>
          <div><div style="font-size:0.62rem;color:#6a90b8">CRYSTAL</div>
            <div style="color:white;font-family:'Share Tech Mono',monospace">+${fmt(rewards.crystal)}</div></div>
          <div><div style="font-size:0.62rem;color:#6a90b8">HE3</div>
            <div style="color:white;font-family:'Share Tech Mono',monospace">+${fmt(rewards.he3)}</div></div>
        </div>
        ${rewards.bossDrops && rewards.bossDrops.length > 0 ? (() => {
          const rarColors = { C:'#ffdd00', R:'#4488ff', E:'#aa44ff', L:'#ffaa00' };
          const rarIcons  = { C:'⚪', R:'🔵', E:'🟣', L:'🌟' };
          // Grupiši po ID-u (može biti višestruki drop istog itema)
          const grouped = {};
          rewards.bossDrops.forEach(id => { grouped[id] = (grouped[id]||0) + 1; });
          return `
          <div style="background:rgba(255,170,0,0.08);border:1px solid rgba(255,170,0,0.35);
            border-radius:6px;padding:10px;margin-bottom:8px">
            <div style="font-size:0.65rem;color:#ffaa00;font-weight:700;margin-bottom:6px">
              🎰 BOSS DROPS (${rewards.bossDrops.length})
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:4px">
              ${Object.entries(grouped).map(([id, cnt]) => {
                const item = (() => {
                  if (typeof WEAPONS         !== 'undefined') { const f = WEAPONS.find(x=>x.id===id);         if(f) return f; }
                  if (typeof SHIELDS         !== 'undefined') { const f = SHIELDS.find(x=>x.id===id);         if(f) return f; }
                  if (typeof ENGINES         !== 'undefined') { const f = ENGINES.find(x=>x.id===id);         if(f) return f; }
                  if (typeof RECON_MODULES   !== 'undefined') { const f = RECON_MODULES.find(x=>x.id===id);   if(f) return f; }
                  if (typeof SPECIAL_MODULES !== 'undefined') { const f = SPECIAL_MODULES.find(x=>x.id===id); if(f) return f; }
                  return null;
                })();
                const rarity = item?.rarity || 'C';
                const name   = item?.name   || id;
                const col    = rarColors[rarity] || '#aaa';
                const icon   = rarIcons[rarity]  || '⚪';
                return `<span style="background:${col}18;border:1px solid ${col}55;
                  border-radius:4px;padding:3px 8px;font-size:0.62rem;color:${col}">
                  ${icon} ${name}${cnt > 1 ? ` ×${cnt}` : ''}
                </span>`;
              }).join('')}
            </div>
          </div>`;
        })() : ''}
        ${(rewards.blueprints||[]).filter(id => !(rewards.bossDrops||[]).includes(id)).length > 0 ? `
          <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:6px">BLUEPRINTI:</div>
          <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px">
            ${rewards.blueprints.filter(id => !(rewards.bossDrops||[]).includes(id)).map(id => `
              <span style="background:rgba(0,212,255,0.1);border:1px solid rgba(0,212,255,0.3);
                border-radius:4px;padding:2px 8px;font-size:0.65rem;color:#00d4ff">
                📋 ${getBpName(id)}
              </span>`).join('')}
          </div>` : ''}
        ${(rewards.fragments||[]).filter(f => !f.boss).length > 0 ? `
          <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:6px">FRAGMENTI:</div>
          <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px">
            ${rewards.fragments.filter(f => !f.boss).map(f => {
              const needed  = getBpFragmentCost(getBlueprintRarity(f.itemId));
              const current = (blueprintFragments[f.itemId] || 0);
              return `<span style="background:rgba(170,68,255,0.1);border:1px solid rgba(170,68,255,0.3);
                border-radius:4px;padding:2px 8px;font-size:0.65rem;color:#aa44ff">
                🧩 ${getBpName(f.itemId)} (${current}/${needed})${f.garant ? ' ⭐GARANT' : ''}
              </span>`;
            }).join('')}
          </div>` : ''}
        <div style="font-size:0.65rem;color:#ffcc44">⭐ +${rewards.xp} XP</div>
      </div>` : ''}

    <!-- Gubitci -->
    ${losses.length > 0 ? `
      <div style="background:rgba(255,51,85,0.05);border:1px solid rgba(255,51,85,0.2);
        border-radius:8px;padding:14px;margin-bottom:16px">
        <div style="font-size:0.72rem;color:#ff3355;font-weight:700;margin-bottom:8px">💀 GUBICI</div>
        ${losses.map(l => `
          <div style="font-size:0.72rem;color:#6a90b8;margin-bottom:4px">
            ${l.partial ? '⚠️' : '💀'} ${l.name}:
            <span style="color:white">-${fmt(l.count)} brodova</span>
          </div>`).join('')}
        ${window._lastFleetRecovery ? (() => {
          const fr = window._lastFleetRecovery;
          window._lastFleetRecovery = null;
          return `<div style="margin-top:10px;padding:8px 10px;background:rgba(136,51,255,0.12);
            border:1px solid rgba(136,51,255,0.4);border-radius:6px;font-size:0.7rem">
            <span style="color:#aa44ff;font-weight:700">☠️ Fleet Recovery</span>
            <span style="color:#cc88ff;margin-left:6px">${fr.cmd} (${fr.pct}%)</span>
            <span style="color:#ffffff;margin-left:6px">→ +${fmt(fr.ships)} brodova u hangaru!</span>
          </div>`;
        })() : ''}
      </div>` : '<div style="font-size:0.72rem;color:#00ff88;margin-bottom:16px">✅ Bez gubitaka!</div>'}

    <!-- Battle Log -->
    <div style="background:rgba(0,0,0,0.4);border-radius:8px;padding:12px;
      max-height:200px;overflow-y:auto;font-size:0.65rem;font-family:'Share Tech Mono',monospace">
      <div style="color:#6a90b8;margin-bottom:6px;font-size:0.6rem">BATTLE LOG:</div>
      ${battle.log.map(entry => {
        const color = entry.type === 'round'   ? '#00d4ff' :
                      entry.type === 'attack'  ? '#b0cce8' :
                      entry.type === 'destroy' ? '#ff3355' :
                      entry.type === 'effect'  ? '#ffcc44' :
                      entry.type === 'result'  ? '#00ff88' :
                      entry.type === 'miss'    ? '#6a90b8' : '#6a90b8';
        return `<div style="color:${color};margin-bottom:2px">${entry.msg}</div>`;
      }).join('')}
    </div>
  `;

  openModal(
    `${statusIcon} Rezultat borbe — ${battle.instance?.name || 'Instanca'}`,
    body,
    [{ label: 'Zatvori', fn: closeModal }]
  );
}
