// ============================================================
// HIVE GALAXY — PRO V4 COMPLETE (zvezde + imena + baza centar)
// ============================================================

const PLANET_ICONS = {rocky:'🪨',crystal:'💎',gas:'💨',balanced:'🌍',barren:'🏜️',volcanic:'🌋',frozen:'❄️',nebula:'🌌'};
const FALLBACK = [
  {id:'xerath_iv',name:'Xerath IV',type:'rocky',distance:1},{id:'kelos_prime',name:'Kelos Prime',type:'crystal',distance:1},
  {id:'vorn_ii',name:'Vorn II',type:'gas',distance:2},{id:'draxis_vii',name:'Draxis VII',type:'balanced',distance:2},
  {id:'solenne_iii',name:'Solenne III',type:'barren',distance:2},{id:'tyrant_belt',name:'Tyrant Belt',type:'volcanic',distance:3},
  {id:'nova_kesh',name:'Nova Kesh',type:'frozen',distance:3},{id:'ashfall_v',name:'Ashfall V',type:'nebula',distance:3},
  {id:'cryonex_ii',name:'Cryonex II',type:'rocky',distance:3},{id:'vaelmor',name:'Vaelmor',type:'crystal',distance:4},
  {id:'dust_ring',name:'Dust Ring',type:'gas',distance:4},{id:'pyros_ix',name:'Pyros IX',type:'balanced',distance:4},
  {id:'aquillon',name:'Aquillon',type:'barren',distance:4},{id:'greystone_vi',name:'Greystone VI',type:'volcanic',distance:5},
  {id:'ember_prime',name:'Ember Prime',type:'frozen',distance:5},{id:'coldpeak',name:'Coldpeak',type:'nebula',distance:5},
  {id:'starfall_ii',name:'Starfall II',type:'rocky',distance:5},{id:'iridion_iv',name:'Iridion IV',type:'crystal',distance:6},
  {id:'halcyon_iii',name:'Halcyon III',type:'gas',distance:6},{id:'vexius',name:'Vexius',type:'balanced',distance:6},
];

window._galaxySelected = window._galaxySelected || {};
let _galaxyEngine = null;

function getThreatColor(t){ if(t<=2)return'#00ff88'; if(t<=4)return'#ffcc44'; if(t<=6)return'#ff8833'; if(t<=8)return'#ff4444'; return'#ff0044'; }

function renderGalaxy(){
  const el=document.getElementById('galaxyContent'); if(!el) return;
  const hq=buildings.hq?.level||1;
  el.innerHTML = `
    <div class="card" style="margin-bottom:12px">
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;text-align:center">
        <div><div style="font-size:0.6rem;color:#6a90b8">HQ</div><div style="font-size:1.1rem;color:#00d4ff;font-family:Orbitron">${hq}</div></div>
        <div><div style="font-size:0.6rem;color:#6a90b8">SEKTORA</div><div style="font-size:1.1rem;color:#00ff88;font-family:Orbitron">1/1</div></div>
        <div><div style="font-size:0.6rem;color:#6a90b8">KOLONIJA</div><div style="font-size:1.1rem;color:#aa44ff;font-family:Orbitron">${colonies.length}/${getMaxColonies()}</div></div>
        <div><div style="font-size:0.6rem;color:#6a90b8">FLOTA</div><div style="font-size:1.1rem;color:#ffcc44;font-family:Orbitron">${typeof getAllDeployedSlots==='function'?getAllDeployedSlots().length:fleet.filter(Boolean).length}</div></div>
      </div>
    </div>
    <div class="card" style="padding:0;overflow:hidden;position:relative;height:380px;background:#020408">
      <canvas id="galaxyCanvas" style="width:100%;height:100%;display:block;cursor:grab"></canvas>
    </div>
    <div id="galaxyDetails" style="margin-top:12px"></div>
  `;
  loadGalaxyPlayerBases().catch(()=>{}).finally(() => setTimeout(initGalaxyEngine, 30));
}

let _galaxyPlayerBases = [];

async function loadGalaxyPlayerBases() {
  if (!window._supa) return Promise.resolve();
  const myId = typeof _getSaveId === 'function' ? _getSaveId() : null;
  const { data } = await window._supa.from('pvp_snapshots')
    .select('id,username,rating,power,fleet,resources')
    .neq('id', myId || '')
    .order('rating', { ascending: false })
    .limit(25);
  _galaxyPlayerBases = (data || []).filter(p => p.fleet && p.fleet.length > 0);
}

function initGalaxyEngine(){
  const canvas=document.getElementById('galaxyCanvas'); if(!canvas) return;
  const ctx=canvas.getContext('2d'); const DPR=Math.min(devicePixelRatio||1,2);
  let W=canvas.clientWidth, H=canvas.clientHeight;
  const resize=()=>{W=canvas.clientWidth;H=canvas.clientHeight;canvas.width=W*DPR;canvas.height=H*DPR;ctx.setTransform(1,0,0,1,0,0);ctx.scale(DPR,DPR);};
  resize(); new ResizeObserver(resize).observe(canvas);

  const stars = Array(350).fill(0).map(()=>({
    x:Math.random(), y:Math.random(),
    r:Math.random()*1.3+0.3,
    b:Math.random()*6.28,
    s:0.015+Math.random()*0.025,
    c: Math.random()<0.7? '#a0e0ff' : (Math.random()<0.5? '#ffd4a0' : '#d4a0ff')
  }));

  const planets = (typeof generateAvailablePlanets==='function'?generateAvailablePlanets():FALLBACK);
  const systems=[];
  systems.push({id:'base',name:'Baza',icon:'⬢',type:'home',threat:0,sector:{name:'Home',color:'#00d4ff'},x:0,y:0,z:0,owner:'player',isBase:true});
  planets.slice(0,20).forEach((p,i)=>{
    const a=(i/20)*Math.PI*2, ring=Math.floor(i/5), r=160+ring*70;
    const x=Math.cos(a)*r, y=Math.sin(a)*r*0.6, z=(i%3-1)*35;
    const owned=colonies.some(c=>c.name===p.name);
    systems.push({...p, id:p.id, name:p.name, icon:PLANET_ICONS[p.type]||'🪐', type:p.type, threat:Math.min(10,(p.distance||1)+1), sector:{name:'Kolonije',color:'#aa44ff'}, x,y,z, owner:owned?'player':'neutral', isBase:false });
  });

  // Igrači — crvene baze u vanjskom prstenu
  _galaxyPlayerBases.forEach((p, i) => {
    const a = (i / Math.max(_galaxyPlayerBases.length, 1)) * Math.PI * 2;
    const r = 420 + (i % 3) * 60;
    const x = Math.cos(a) * r, y = Math.sin(a) * r * 0.6, z = (i % 5 - 2) * 40;
    systems.push({
      id: 'player_' + p.id, name: p.username, icon: '🔴', type: 'enemy',
      sector: { name: 'Neprijatelj', color: '#ff3355' },
      x, y, z, owner: 'enemy', isBase: false, isPlayerBase: true,
      pvpData: p,
    });
  });

  let rotX=-0.25, rotY=0.6, zoom=1, dragging=false, lx=0, ly=0, hover=null, t=0;
  const project=p=>{ const cy=Math.cos(rotY),sy=Math.sin(rotY); const x1=p.x*cy-p.z*sy, z1=p.x*sy+p.z*cy; const cx=Math.cos(rotX),sx=Math.sin(rotX); const y1=p.y*cx-z1*sx, z2=p.y*sx+z1*cx; const s=800/(800+z2)*zoom; return {x:W/2+x1*s,y:H/2+y1*s,z:z2,s}; };

  function draw(){
    t+=16; if(!dragging) rotY+=0.00035;
    ctx.fillStyle='#000308'; ctx.fillRect(0,0,W,H);
    const grad = ctx.createRadialGradient(W*0.3,H*0.7,0,W*0.3,H*0.7,W*0.8);
    grad.addColorStop(0,'rgba(0,80,120,0.15)'); grad.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=grad; ctx.fillRect(0,0,W,H);
    stars.forEach(st=>{
      st.b += st.s;
      const alpha = 0.3 + 0.7 * Math.abs(Math.sin(st.b));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = st.c;
      ctx.shadowColor = st.c;
      ctx.shadowBlur = st.r*3;
      ctx.beginPath();
      ctx.arc(st.x*W, st.y*H, st.r, 0, 7);
      ctx.fill();
    });
    ctx.globalAlpha=1; ctx.shadowBlur=0;
    const projs=systems.map(s=>({...s,p:project(s)})).sort((a,b)=>a.p.z-b.p.z);
    projs.forEach(s=>{
      const {x,y,z,s:sc}=s.p; if(z>480)return;
      const isEnemy = s.owner==='enemy';
      const ip=s.owner==='player';
      const col = isEnemy ? '#ff3355' : (ip?'#00e5ff':s.sector.color);
      const mult=s.isBase?1.6:1, r=(ip?5.5: isEnemy?5:3.8)*sc*mult;
      ctx.beginPath();ctx.arc(x,y,r+9,0,7);
      ctx.fillStyle=isEnemy?'rgba(255,51,85,0.12)':(ip?'rgba(0,229,255,0.12)':'rgba(255,255,255,0.04)');ctx.fill();
      ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=ip?22:(isEnemy?18:12);ctx.fill();ctx.shadowBlur=0;
      if(hover===s.id){ctx.beginPath();ctx.arc(x,y,r+6,0,7);ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();}
      ctx.font=`${Math.max(9,10*sc)}px Orbitron`;
      ctx.textAlign='center';
      ctx.fillStyle = hover===s.id? '#ffffff' : (ip? '#00e5ff' : isEnemy? '#ff8899' : '#6a90b8');
      ctx.shadowColor='rgba(0,0,0,0.9)'; ctx.shadowBlur=4;
      ctx.fillText(s.name, x, y + r + 14);
      ctx.shadowBlur=0;
    });
    requestAnimationFrame(draw);
  }
  draw();

  canvas.onmousedown=e=>{dragging=true;lx=e.clientX;ly=e.clientY;};
  addEventListener('mouseup',()=>dragging=false);
  addEventListener('mousemove',e=>{if(dragging){rotY+=(e.clientX-lx)*0.005;rotX+=(e.clientY-ly)*0.005;rotX=Math.max(-1.2,Math.min(1.2,rotX));lx=e.clientX;ly=e.clientY;return;} const r=canvas.getBoundingClientRect();const mx=e.clientX-r.left,my=e.clientY-r.top;hover=null;for(const s of systems){const p=project(s);if(Math.hypot(mx-p.x,my-p.y)<(s.isBase?22:15)*p.s){hover=s.id;break;}}});
  canvas.onwheel=e=>{e.preventDefault();zoom*=1-e.deltaY*0.001;zoom=Math.max(0.6,Math.min(2.3,zoom));};
  canvas.onclick=e=>{const r=canvas.getBoundingClientRect();const mx=e.clientX-r.left,my=e.clientY-r.top;let pick=null;for(const s of systems){const p=project(s);if(Math.hypot(mx-p.x,my-p.y)<(s.isBase?24:16)*p.s){pick=s;break;}}if(pick)updateGalaxyDetails(pick);};

  updateGalaxyDetails(systems[0]);
}

function updateGalaxyDetails(sys){
  const d = document.getElementById('galaxyDetails'); if(!d) return;

  // Tuđa baza — PvP napad
  if (sys.isPlayerBase && sys.pvpData) {
    const p = sys.pvpData;
    const res = p.resources || {};
    const pow = typeof calcFleetTotalPower === 'function' ? calcFleetTotalPower() : 0;
    d.innerHTML = `
    <div class="card" style="border-color:#ff335555">
      <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px">
        <div style="font-size:2.4rem">🔴</div>
        <div style="flex:1">
          <div style="font-weight:700;color:#ff3355;font-size:0.95rem">${p.username}</div>
          <div style="font-size:0.65rem;color:#6a90b8;margin-top:2px">⭐ Rating: ${p.rating || 1000} · 💪 Moć: ${fmt(p.power || 0)}</div>
        </div>
      </div>
      ${res.metal !== undefined ? `
      <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:10px;padding:8px;background:rgba(255,51,85,0.06);border-radius:6px;border:1px solid rgba(255,51,85,0.2)">
        <div style="color:#ff8899;margin-bottom:4px">📊 Procijenjeni resursi (plijen ~50k):</div>
        🔩 ${fmt(res.metal)} metala &nbsp; 💎 ${fmt(res.crystal)} kristala &nbsp; ⛽ ${fmt(res.he3)} He3
      </div>` : ''}
      <div style="font-size:0.68rem;color:#6a90b8;margin-bottom:12px;padding:6px 8px;background:rgba(255,51,85,0.06);border-radius:4px;border-left:2px solid #ff3355">
        ⚔️ Napad košta <b style="color:#fff">1000 ⚡ + 1000 BoCrypto</b><br>
        🏆 Pobjeda: <b style="color:#00ff99">50k svakog resursa + rating poeni</b>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn" style="flex:1;font-size:0.72rem;border-color:rgba(0,212,255,0.3);color:#00d4ff"
          onclick="galaxyEspionage('${p.id}')">🔍 Skeniraj</button>
        <button class="btn btn-danger" style="flex:1;font-size:0.72rem"
          onclick="galaxyAttackBase('${p.id}')">⚔️ NAPADNI</button>
      </div>
    </div>`;
    return;
  }

  const owned    = colonies.some(c => c.planetId === sys.id);
  const pow      = typeof calcFleetTotalPower === 'function' ? calcFleetTotalPower() : calcFleetStats(fleet.filter(Boolean)).power;
  const need     = sys.threat * 500;
  const jgLevel  = buildings.jump_gate?.level || 0;
  const inRange  = jgLevel >= (sys.distance || 1);
  const maxed    = colonies.length >= getMaxColonies();
  const pType    = (typeof PLANET_TYPES !== 'undefined' && PLANET_TYPES[sys.type]) || null;
  const typeInfo = pType ? `<span style="color:${pType.color}">${pType.icon} ${pType.name}</span>` : '';

  let btnLabel, btnClass, btnDisabled;
  if(sys.isBase){ btnLabel='🏠 MATIČNA BAZA'; btnClass=''; btnDisabled=true; }
  else if(owned){ btnLabel='✅ OSVOJENO'; btnClass=''; btnDisabled=true; }
  else if(!inRange){ btnLabel=`🔒 JG Lv.${sys.distance} potreban`; btnClass=''; btnDisabled=true; }
  else if(maxed){ btnLabel='🔒 Max kolonija dostignut'; btnClass=''; btnDisabled=true; }
  else { btnLabel='⚔️ NAPADNI & KOLONIZUJ'; btnClass='btn-g'; btnDisabled=false; }

  d.innerHTML=`
  <div class="card" style="border-color:${sys.sector.color}55">
    <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px">
      <div style="font-size:2.6rem">${sys.icon}</div>
      <div style="flex:1">
        <div style="font-weight:700;color:${sys.sector.color};font-size:0.95rem">${sys.name}</div>
        <div style="font-size:0.65rem;color:#6a90b8;margin-top:2px">
          ${typeInfo}${typeInfo?' · ':''}Threat ${sys.threat}/10 · Sistem ${sys.distance||0}
          ${sys.isBase?' · BAZA':''}
        </div>
      </div>
      ${owned?`<div style="font-size:0.65rem;color:#00ff88;font-weight:700">✅ TVOJE</div>`:''}
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;font-size:0.7rem">
      <div style="background:#0003;padding:8px;border-radius:6px;text-align:center">
        TVOJA SNAGA<br>
        <b style="color:${pow>=need?'#00ff88':'#ffaa00'}">${fmt(pow)}</b>
      </div>
      <div style="background:#0003;padding:8px;border-radius:6px;text-align:center">
        POTREBNO<br>
        <b style="color:${getThreatColor(sys.threat)}">${fmt(need)}</b>
      </div>
    </div>

    ${!sys.isBase && !owned && inRange && !maxed ? `
    <div style="font-size:0.6rem;color:#6a90b8;margin-bottom:10px;padding:6px 8px;
      background:rgba(0,255,136,0.06);border-radius:4px;border-left:2px solid #00ff88">
      ⚔️ <b style="color:#00ff88">Vojni put:</b> Pobijedi u bici → Besplatna kolonija<br>
      🕊️ <b style="color:#4488ff">Mirni put:</b> Idi na Kolonije → Istraži → Plati resurse
    </div>` : ''}

    <button class="btn ${btnClass}" style="width:100%;font-size:0.78rem"
      onclick="window.launchGalaxyMission('${sys.id}')" ${btnDisabled?'disabled':''}>
      ${btnLabel}
    </button>
  </div>`;
}

// ── PLANET DEFENDERS — skalabilni branitelji (20 planeta = 20 levela) ──
function getPlanetDefenders(planetIndex) {
  // Odredi difficulty mod po indeksu planete (0-19)
  // 0-4  = easy (dist 1),  5-9 = normal (dist 2),
  // 10-14 = nightmare (dist 3-4),  15-19 = hell (dist 5)
  const diffMap = [
    'easy','easy','easy','easy','easy',
    'normal','normal','normal','normal','normal',
    'nightmare','nightmare','nightmare','nightmare','nightmare',
    'hell','hell','hell','hell','hell',
  ];
  const modeName  = diffMap[planetIndex] || 'easy';
  const levelInMod = (planetIndex % 5) + 1; // 1-5 unutar svakog moda

  // Prikupi sve brodove
  let allShips = [];
  if (typeof SHIPS !== 'undefined') {
    Object.values(SHIPS).forEach(arr => { if (Array.isArray(arr)) allShips.push(...arr); });
  }
  if (allShips.length === 0) {
    // Fallback ako SHIPS nije učitan
    return [{ name:'Orbital Guard', count:10+planetIndex*5, hp:500+planetIndex*200,
      shield:100+planetIndex*50, dps:50+planetIndex*20, agility:10, speed:1, armor:'Light' }];
  }

  // Tier i rarity pool po modu
  const tierMap   = { easy:'I', normal:'II', nightmare:'III', hell:'III' };
  const rarityMap = {
    easy:['C'], normal:['C','R'], nightmare:['R','E'], hell:['E','L']
  };
  const tier      = tierMap[modeName];
  const rarities  = rarityMap[modeName];

  let pool = allShips.filter(s => s.id.endsWith('_'+tier) && rarities.includes(s.rarity));
  if (!pool.length) pool = allShips.filter(s => s.id.endsWith('_'+tier));
  if (!pool.length) pool = allShips;

  // Seeded RNG za deterministične grupacije
  let seed = planetIndex * 7919 + 42;
  const rng = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; };

  // Broj grupa: 1-3 easy, 3-5 normal, 5-7 nightmare, 7-9 hell (+levelInMod)
  const baseGroups = { easy:1, normal:3, nightmare:5, hell:7 }[modeName];
  const numGroups  = baseGroups + Math.floor(levelInMod * 0.4);

  // Skalabilni count i stats
  const countScale = { easy:1.0, normal:2.5, nightmare:5.0, hell:10.0 }[modeName];
  const statScale  = { easy:1.0, normal:2.2, nightmare:4.5, hell:9.0  }[modeName];
  const lvlMult    = 1.0 + (levelInMod - 1) * 0.25; // +25% po levelu unutar moda

  const classes = ['scout','fighter','cruiser','battleship','carrier'];
  const shuffled = [...classes].sort(() => rng() - 0.5);

  const groups = [];

  for (let i = 0; i < numGroups; i++) {
    const cls     = shuffled[i % shuffled.length];
    let   clsPool = pool.filter(s => s.id.startsWith(cls+'_'));
    if (!clsPool.length) clsPool = pool;
    const ship    = clsPool[Math.floor(rng() * clsPool.length)];
    if (!ship) continue;

    const count   = Math.max(1, Math.floor((5 + rng()*15) * countScale * lvlMult));
    const baseHp  = (ship.armor_val||100) + (ship.shield||0) + (ship.structure||0);
    const baseDps = (ship.armor_val||100) * 0.3 + (ship.shield||0) * 0.2;

    groups.push({
      name:    `${ship.name}`,
      count,
      hp:      Math.floor(baseHp  * statScale * lvlMult * count),
      shield:  Math.floor((ship.shield||0) * statScale * lvlMult * count),
      dps:     Math.floor(baseDps * statScale * lvlMult * count),
      agility: Math.min(80, (ship.agility||10) + planetIndex * 2),
      speed:   ship.movement || 1,
      armor:   ship.armor || 'Light',
      ship_id: ship.id,
    });
  }

  // Boss (commander) za planete 15-19 — više boss grupe
  if (planetIndex >= 15) {
    const bossCount = planetIndex - 13; // 2-6 boss grupa
    const bossPool  = allShips.filter(s => s.id.endsWith('_III') && ['E','L'].includes(s.rarity));
    const bp        = bossPool.length ? bossPool : pool;
    const cmdNames  = ['Admiral Xerath','Fleet Lord Kesh','Star Commander Vorn',
                       'Grand Admiral Raxis','Supreme Lord Nexar'];
    for (let b = 0; b < bossCount && b < cmdNames.length; b++) {
      const boss  = bp[Math.floor(rng() * bp.length)];
      const bCnt  = Math.max(1, Math.floor((3 + b) * lvlMult * 0.5));
      const bHp   = (boss?.armor_val||300) + (boss?.shield||0) + (boss?.structure||0);
      const bDps  = (boss?.armor_val||300) * 0.4;
      groups.push({
        name:    `${cmdNames[b]}`,
        count:   bCnt,
        hp:      Math.floor(bHp * statScale * lvlMult * bCnt * 2.5),
        shield:  Math.floor((boss?.shield||200) * statScale * lvlMult * bCnt * 2.5),
        dps:     Math.floor(bDps * statScale * lvlMult * bCnt * 2.5),
        agility: Math.min(85, 40 + planetIndex * 2 + b * 3),
        speed:   2,
        armor:   'Heavy',
        ship_id: boss?.id || null,
      });
    }
  }

  return groups;
}

if (!window._conqueredPlanets) window._conqueredPlanets = [];

window.launchGalaxyMission = function(sysId){
  if(sysId==='base') return;

  const planets = (typeof generateAvailablePlanets==='function' ? generateAvailablePlanets() : FALLBACK);
  const sys     = planets.find(p=>p.id===sysId);
  if(!sys){ toast('❌ Planeta nije pronađena!','err'); return; }

  // Provjeri kolonizovano
  if(colonies.some(c=>c.planetId===sys.id)){
    return toast('✅ Već kolonizovano!','warn');
  }

  // Provjeri Jump Gate domet
  const jgLevel = buildings.jump_gate?.level || 0;
  if(jgLevel < (sys.distance||1)){
    return toast(`❌ Jump Gate Lv.${sys.distance} potreban za ovaj sistem!`, 'err');
  }

  // Provjeri max kolonija
  if(colonies.length >= getMaxColonies()){
    return toast(`❌ Maksimum ${getMaxColonies()} kolonija! Unapredi Jump Gate.`, 'warn');
  }

  // Provjeri flotu
  const fleetSlots = typeof getAllDeployedSlots === 'function' ? getAllDeployedSlots() : fleet.filter(Boolean);
  if(fleetSlots.length === 0) return toast('❌ Prazna flota! Deploy komandira i rasporedi brodove.','err');

  // ── He3 potrošnja po misiji ──────────────────────────────
  // Svaki brod troši he3_cost svog motora (ili 0.005 fallback)
  let he3Needed = fleetSlots.reduce((sum, ship) => {
    let cost = 0.005; // fallback ako motor nema he3_cost
    if (ship && ship.engine) {
      const engDef = (typeof ENGINES !== 'undefined' ? ENGINES : [])
        .find(e => e.id === ship.engine);
      if (engDef && engDef.he3_cost != null) cost = engDef.he3_cost;
    }
    return sum + cost;
  }, 0);

  // Jump Gate popust — ako je flota na koloniji blizu mete
  const jumpMult = typeof getJumpGateHe3Mult === 'function'
    ? getJumpGateHe3Mult(sys.distance || 1) : 1.0;
  if (jumpMult < 1.0) {
    const saved = he3Needed * (1 - jumpMult);
    he3Needed  *= jumpMult;
    const discPct = Math.round((1 - jumpMult) * 100);
    toast(`🌀 Jump Gate aktivan! He3 -${discPct}% (ušteda: ${saved.toFixed(3)})`, 'inf');
    // Nakon skoka — flota se "potroši" (vraća na bazu), reset pozicije
    window._fleetPosition = null;
  }

  if (R.he3 < he3Needed) {
    toast(`⚠️ He3 kritično nizak! (${R.he3.toFixed(2)} / ${he3Needed.toFixed(3)})`, 'warn');
  }
  R.he3 = Math.max(0, R.he3 - he3Needed);
  if (typeof updateResUI === 'function') updateResUI();
  // ────────────────────────────────────────────────────────

  // Dohvati branitelje po indeksu planete (0-19)
  const planetIdx = parseInt((sys.id||'').replace('planet_','')) || 0;
  const enemies   = getPlanetDefenders(planetIdx);

  toast(`⚔️ Napad na ${sys.name}...`, 'inf');

  // Fiksne nagrade po sistemu (distanci) — jednom za svaki planet
  const PLANET_REWARDS = {
    1: { metal: 10000,  crystal: 10000,  he3: 10000,  instKeys: 10, cmdKeys: 1  },
    2: { metal: 20000,  crystal: 20000,  he3: 20000,  instKeys: 15, cmdKeys: 2  },
    3: { metal: 50000,  crystal: 50000,  he3: 50000,  instKeys: 20, cmdKeys: 5  },
    4: { metal: 100000, crystal: 100000, he3: 100000, instKeys: 50, cmdKeys: 10 },
    5: { metal: 500000, crystal: 500000, he3: 500000, instKeys: 100,cmdKeys: 50 },
  };

  const instData = {
    name:      sys.name,
    difficulty: planetIdx + 1,
    resources: { metal:[0,0], crystal:[0,0], he3:[0,0] },
    drops: { guaranteed:[], chance:[] },
    xp:    1000 * (sys.distance || 1),
  };

  setTimeout(() => {
    const battle = simulateBattle(fleetSlots, enemies, instData);
    let rewards  = null;

    if(battle.status === 'victory'){
      const alreadyConquered = window._conqueredPlanets.includes(sysId);

      // Nagrade samo prvi put
      if(!alreadyConquered){
        const rw = PLANET_REWARDS[sys.distance || 1] || PLANET_REWARDS[1];
        rewards = {
          metal:      rw.metal,
          crystal:    rw.crystal,
          he3:        rw.he3,
          instKeys:   rw.instKeys,
          cmdKeys:    rw.cmdKeys,
          xp:         instData.xp,
          blueprints: [],
          fragments:  [],
        };
        R.metal        += rewards.metal;
        R.crystal      += rewards.crystal;
        R.he3          += rewards.he3;
        R.instanceKeys  = (R.instanceKeys || 0) + rewards.instKeys;
        R.keys          = (R.keys || 0) + rewards.cmdKeys;
        if(typeof addExp === 'function') addExp(rewards.xp);
        window._conqueredPlanets.push(sysId);
        updateResUI();
      } else {
        toast(`⚔️ ${sys.name} ponovo pokoren — nagrade već pokupljene.`, 'warn');
      }

      applyPlayerLosses(battle);

      colonies.push({
        id:          `col_${Date.now()}`,
        planetId:    sys.id,
        name:        sys.name,
        type:        sys.type,
        level:       1,
        distance:    sys.distance || 1,
        slots:       sys.slots || 3,
        buildings:   {},
        defense:     0,
        colonizedAt: Date.now(),
      });
      sys.colonized = true;
      if (window._planetSpyData) delete window._planetSpyData[sysId];
      R.score += (planetIdx+1) * 100;
      saveGame();
      toast(`🪐 ${sys.name} kolonizovan!`, 'ok');
      addLog(`🪐 ${sys.name} ${alreadyConquered ? 'ponovo kolonizovan (bez nagrada)' : 'osvajan i kolonizovan'}.`);
      setTimeout(()=>{ renderGalaxy(); if(typeof renderColonies==='function') renderColonies(); }, 700);
    } else {
      applyPlayerLosses(battle);
      // ── FLEET RECOVERY STORY MISIJA ──
      triggerFleetRecoveryMission(sysId, sys, fleetSlots, battle);
    }

    if(typeof showBattleOutcome === 'function') showBattleOutcome(battle, rewards, true);
    updateResUI();
  }, 100);
};

// ── FLEET RECOVERY STORY MISIJA ──
function triggerFleetRecoveryMission(planetId, planet, fleetSlots, battle) {
  window._colonyFleetReward = window._colonyFleetReward || {};
  if (window._colonyFleetReward[planetId]) return;

  // Izračunaj craft cijenu izgubljenih brodova
  let totalMetal = 0, totalCrystal = 0, totalHe3 = 0;
  const lostIds = new Set();
  battle.log.forEach(entry => {
    if (entry.type === 'destroy' && entry.target && entry.target.startsWith('p_')) lostIds.add(entry.target);
  });
  lostIds.forEach(unitId => {
    const unit = battle.player.find(u => u.id === unitId);
    if (!unit) return;
    const ship = typeof getShipById === 'function' ? getShipById(unit.ship_id) : null;
    if (!ship) return;
    const cost = typeof getShipBuildCost === 'function' ? getShipBuildCost(ship) : null;
    if (!cost) return;
    const count = unit.count || 1;
    totalMetal   += cost.metal   * count;
    totalCrystal += cost.crystal * count;
    totalHe3     += cost.he3     * count;
  });

  if (totalMetal === 0 && totalCrystal === 0 && totalHe3 === 0) return;

  // ── PROVJERA: mora izgubiti min 30% flote (anti-exploit) ──
  const totalFleetCost   = { metal: 0, crystal: 0, he3: 0 };
  battle.player.forEach(unit => {
    const ship = typeof getShipById === 'function' ? getShipById(unit.ship_id) : null;
    if (!ship) return;
    const cost = typeof getShipBuildCost === 'function' ? getShipBuildCost(ship) : null;
    if (!cost) return;
    const count = unit.count || 1;
    totalFleetCost.metal   += cost.metal   * count;
    totalFleetCost.crystal += cost.crystal * count;
    totalFleetCost.he3     += cost.he3     * count;
  });
  const totalFleetValue = totalFleetCost.metal + totalFleetCost.crystal + totalFleetCost.he3;
  const totalLostValue  = totalMetal + totalCrystal + totalHe3;
  const lostPct = totalFleetValue > 0 ? totalLostValue / totalFleetValue : 0;

  // Manje od 30% gubitka = nema recovery misije
  if (lostPct < 0.30) {
    addLog(`⚠️ Gubitak flote premali za recovery misiju (${Math.floor(lostPct*100)}% < 30%)`);
    return;
  }

  // % povrata po distanci (1=100%, 2=80%, 3=60%, 4=40%, 5=20%)
  const RECOVERY_PCT = { 1: 1.0, 2: 0.8, 3: 0.6, 4: 0.4, 5: 0.2 };
  const pct = RECOVERY_PCT[planet.distance || 1] || 0.5;

  const recMetal   = Math.floor(totalMetal   * pct);
  const recCrystal = Math.floor(totalCrystal * pct);
  const recHe3     = Math.floor(totalHe3     * pct);

  // Narativi po distanci
  const NARRATIVES = {
    1: { title: 'Olupine na Pragu',          story: `Tvoja flota je potisnuta iznad ${planet.name}. Dok si se povlačio, salvageri su pokupili ostatke tvojih brodova i vratili resurse u bazu.` },
    2: { title: 'Bježanija kroz Asteroid Pojas', story: `Napad na ${planet.name} završio je povlačenjem. Piratski salvageri koji prate tvoje kretanje prodali su ti natrag ostatke flote.` },
    3: { title: 'Tajni Kontakt',              story: `${planet.name} je prestroga za sada. Nepoznati kontakt ponudio je razmjenu — ostatke tvojih brodova za buduću uslugu.` },
    4: { title: 'Crno Tržište Sektora 4',    story: `Poraz kod ${planet.name} bio je težak. Crno tržište Sektora 4 ima ostatke tvoje flote — kupio si ih natrag.` },
    5: { title: 'Legende ne Umiru Lako',     story: `${planet.name} je odbila svaku ofanzivu. Ipak, skupljači relikvija su ti vratili dio onoga što si izgubio.` },
  };
  const narr = NARRATIVES[planet.distance || 1] || NARRATIVES[1];
  const missionId = `fleet_recovery_${planetId}`;

  window._colonyFleetReward[planetId] = true;

  if (!window._dynamicStoryMissions) window._dynamicStoryMissions = [];
  window._dynamicStoryMissions.push({
    id:        missionId,
    chapter:   '⚠️ Bježanija',
    name:      narr.title,
    icon:      '🚑',
    desc:      narr.story,
    check:     () => true,
    reward:    { metal: recMetal, crystal: recCrystal, he3: recHe3 },
    _recovery: true,
    _pct:      Math.floor(pct * 100),
  });

  saveGame();
  toast(`🚑 Nova misija: "${narr.title}" — ${Math.floor(pct*100)}% flote povraćeno!`, 'warn');
  addLog(`🚑 Fleet recovery: ${planet.name} — +${fmt(recMetal)} Metal, +${fmt(recCrystal)} Crystal, +${fmt(recHe3)} He3`);
}

// ── GALAXY PVP — NAPAD NA TUĐU BAZU ──
function galaxyEspionage(playerId) {
  const p = _galaxyPlayerBases.find(b => b.id === playerId);
  if (!p) return;
  // Koristimo postojeći espionage sistem ako je dostupan
  if (typeof openSendDronesModal === 'function') {
    // Pronađi index u window._currentOpponents ako postoji
    const idx = (window._currentOpponents || []).findIndex(o => o.id === playerId);
    if (idx >= 0) { openSendDronesModal(idx); return; }
  }
  // Fallback — prikaži resurse direktno
  const res = p.resources || {};
  openModal('🔍 Skeniranje — ' + p.username,
    `<div style="font-size:0.8rem;color:#6a90b8;margin-bottom:12px">Rezultati izviđanja:</div>
    <div style="display:grid;gap:8px">
      <div style="padding:10px;background:rgba(0,0,0,0.3);border-radius:6px">⭐ Rating: <b style="color:#ffcc44">${p.rating || 1000}</b></div>
      <div style="padding:10px;background:rgba(0,0,0,0.3);border-radius:6px">💪 Moć flote: <b style="color:#00d4ff">${fmt(p.power || 0)}</b></div>
      ${res.metal !== undefined ? `
      <div style="padding:10px;background:rgba(0,0,0,0.3);border-radius:6px">
        🔩 Metal: <b>${fmt(res.metal)}</b> &nbsp; 💎 Kristal: <b>${fmt(res.crystal)}</b> &nbsp; ⛽ He3: <b>${fmt(res.he3)}</b>
      </div>` : '<div style="color:#6a90b8;font-size:0.72rem">Resursi nepoznati.</div>'}
    </div>`,
    [{ label: '⚔️ Napadni', cls: 'btn-danger', fn: () => { closeModal(); galaxyAttackBase(playerId); } },
     { label: 'Zatvori', cls: '', fn: closeModal }]
  );
}

function galaxyAttackBase(playerId) {
  const p = _galaxyPlayerBases.find(b => b.id === playerId);
  if (!p) return;

  const energyCost = 1000, bocCost = 1000;
  if (R.energy < energyCost) { toast('Nedovoljno energije! Treba ' + energyCost, 'warn'); return; }
  if ((R.bocrypto || 0) < bocCost) { toast('Nedovoljno BoCrypto! Treba ' + bocCost, 'warn'); return; }

  R.energy   -= energyCost;
  R.bocrypto  = (R.bocrypto || 0) - bocCost;

  const myFleet  = typeof buildPvpFleetLocal === 'function' ? buildPvpFleetLocal() : [];
  const oppFleet = typeof buildPvpFleetFromSnapshot === 'function' ? buildPvpFleetFromSnapshot(p.fleet) : [];

  if (!myFleet.length) { toast('Nemaš deployovanu flotu!', 'warn'); return; }
  if (!oppFleet.length) { toast('Protivnik nema flotu.', 'warn'); return; }

  toast('⚔️ Napadam bazu ' + p.username + '...', 'inf');

  const battle = typeof simulatePvpBattle === 'function' ? simulatePvpBattle(myFleet, oppFleet) : null;
  if (!battle) return;

  const isVictory = battle.status === 'victory';
  if (!pvp.log) pvp.log = [];

  // Manji rating change nego normalni PvP (K=16 umjesto 32)
  const myR = pvp.rating || 1000, oppR = p.rating || 1000;
  const expected = 1 / (1 + Math.pow(10, (oppR - myR) / 400));
  const ratingChange = Math.round(16 * ((isVictory ? 1 : 0) - expected));
  pvp.rating = Math.max(0, pvp.rating + ratingChange);

  if (isVictory) {
    pvp.wins = (pvp.wins || 0) + 1;
    R.metal   += 50000;
    R.crystal += 50000;
    R.he3     += 50000;
    toast(`🏆 Pobjeda nad ${p.username}! +50k resursa, ${ratingChange > 0 ? '+' : ''}${ratingChange} rating`, 'ok');
    addLog(`⚔️ Napad na bazu ${p.username} — POBJEDA! +50k resursa, ${ratingChange > 0 ? '+' : ''}${ratingChange} rating.`);
  } else {
    pvp.losses = (pvp.losses || 0) + 1;
    toast(`💀 Poraz od ${p.username}. ${ratingChange} rating.`, 'warn');
    addLog(`⚔️ Napad na bazu ${p.username} — PORAZ. ${ratingChange} rating.`);
  }

  pvp.log = pvp.log || [];
  pvp.log.unshift({ time: Date.now(), opponent: p.username, rating: p.rating, result: battle.status, rounds: battle.round, ratingChange, loot: isVictory ? { metal:50000, crystal:50000, he3:50000 } : {} });
  if (pvp.log.length > 20) pvp.log = pvp.log.slice(0, 20);

  if (typeof updateResUI === 'function') updateResUI();
  saveGame();

  if (typeof showBattleOutcome === 'function') showBattleOutcome(battle, isVictory ? { metal:50000, crystal:50000, he3:50000, xp:0 } : {}, false);
}
}