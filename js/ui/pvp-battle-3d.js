// ============================================================
// HIVE GALAXY — js/ui/pvp-battle-3d.js
// 3D PvP battle vizualizacija (Three.js r128)
//
// Glavni ulaz:  openPvpBattleVisual(myFleet, oppFleet, opp)
//
// KLJUČNO: WebGLRenderer je singleton — kreira se jednom i NIKAD se
// ne dispose-a. Canvas se samo premešta u novi container za svaku
// bitku. Sve ostalo (scena, kamera, controls, RAF petlja, tajmeri)
// se uredno gasi na zatvaranju da bitka radi i 2., 3., 10. put.
// ============================================================

// ── SINGLETON RENDERER (živi celu sesiju) ──
let _pvp3Renderer = null;

function _pvp3GetRenderer() {
  if (!_pvp3Renderer) {
    _pvp3Renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    _pvp3Renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    _pvp3Renderer.setClearColor(0x05070f, 1);
  }
  return _pvp3Renderer;
}

// ── PO-BITKA STANJE (resetuje se svaki put) ──
let _pvp3 = null;

// ── KONFIG ──
const PVP3_BASE_MS   = 700;   // ms po log unosu (na 1× brzini)
const PVP3_PROJ_MS   = 240;   // trajanje leta projektila
const PVP3_SHIP_GAP  = 7;     // razmak između brodova u koloni
const PVP3_ROW_GAP   = 5.5;   // razmak između redova
const PVP3_SIDE_X    = 26;    // X pozicija fronta (player -X, enemy +X)

// boje po klasi broda (prefiks ship_id-a pre "_")
const PVP3_CLASS = {
  fighter:    { color: 0x66ccff, size: 1.0, shape: 'cone' },
  scout:      { color: 0x8affc1, size: 0.8, shape: 'tetra' },
  cruiser:    { color: 0x9d8cff, size: 1.4, shape: 'box' },
  battleship: { color: 0xff8c5a, size: 2.0, shape: 'box' },
  carrier:    { color: 0xffd23a, size: 2.4, shape: 'cyl' },
  special:    { color: 0xff5ad2, size: 1.6, shape: 'octa' },
};

function _pvp3ClassOf(shipId) {
  const key = String(shipId || '').split('_')[0].toLowerCase();
  return PVP3_CLASS[key] || PVP3_CLASS.fighter;
}

function _pvp3Fmt(n) {
  if (typeof fmt === 'function') return fmt(n);
  return Math.floor(n).toLocaleString('en-US');
}

// ============================================================
// GLAVNA FUNKCIJA
// ============================================================
function openPvpBattleVisual(myFleet, oppFleet, opp) {
  if (typeof THREE === 'undefined') {
    console.error('[pvp3] THREE nije učitan');
    if (typeof toast === 'function') toast('⚠️ 3D engine (Three.js) nije učitan.', 'warn');
    return;
  }
  if (typeof simulatePvpBattle !== 'function') {
    console.error('[pvp3] simulatePvpBattle nije dostupna');
    if (typeof toast === 'function') toast('⚠️ simulatePvpBattle nije dostupna.', 'warn');
    return;
  }

  // ako je prethodna bitka iz nekog razloga ostala otvorena — počisti
  if (_pvp3) _pvp3Teardown();

  const result = simulatePvpBattle(myFleet, oppFleet) || { status: 'draw', round: 0, log: [] };

  _pvp3 = {
    opp:        opp || {},
    result,
    log:        Array.isArray(result.log) ? result.log : [],
    logIdx:     0,
    speed:      1,
    paused:     false,
    finished:   false,
    rafId:      null,
    playTimer:  null,
    ships:      {},   // id -> { mesh, hpBar, group, side, alive, hp, hpMax, shield, shieldMax }
    projectiles: [],  // aktivni projektili
    fx:         [],   // eksplozije / efekti
    scene:      null,
    camera:     null,
    controls:   null,
    clock:      new THREE.Clock(),
    onResize:   null,
  };

  _pvp3BuildModal();
  _pvp3InitScene(myFleet, oppFleet);
  _pvp3SpawnFleets(myFleet, oppFleet);
  _pvp3StartLoop();
  _pvp3ScheduleNext();
}

// ============================================================
// MODAL / DOM
// ============================================================
function _pvp3BuildModal() {
  const old = document.getElementById('pvpBattleModal');
  if (old) old.remove();

  const modal = document.createElement('div');
  modal.id = 'pvpBattleModal';
  modal.style.cssText =
    'position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;' +
    'background:radial-gradient(circle at 50% 35%,#0a1326 0%,#05070f 70%);' +
    "font-family:'Rajdhani','Segoe UI',sans-serif;color:#dCEcff;";

  const oppName = _pvp3.opp.name || 'Protivnik';
  const oppAv   = _pvp3.opp.avatar || '👾';
  const me      = (typeof window !== 'undefined' && window._hiveUser) ? window._hiveUser : 'Ti';

  modal.innerHTML = `
    <div id="pvp3Header" style="display:flex;align-items:center;gap:10px;padding:10px 16px;
         border-bottom:1px solid rgba(120,180,255,.15);background:rgba(8,14,28,.7);flex:0 0 auto;">
      <div style="font-family:'Orbitron',sans-serif;font-weight:900;font-size:1rem;letter-spacing:1px;color:#8fc6ff;">
        ⚔️ PvP BORBA</div>
      <div style="font-size:.8rem;color:#7fa6cc;">${me} <span style="color:#48648a;">vs</span> ${oppAv} ${oppName}</div>
      <div style="flex:1;"></div>
      <div id="pvp3Controls" style="display:flex;gap:6px;align-items:center;">
        <button data-act="pause" class="pvp3-btn">⏸ PAUZA</button>
        <button data-act="s1"    class="pvp3-btn pvp3-on">1×</button>
        <button data-act="s2"    class="pvp3-btn">2×</button>
        <button data-act="s5"    class="pvp3-btn">5×</button>
        <button data-act="skip"  class="pvp3-btn">⏭ SKIP</button>
        <button data-act="close" class="pvp3-btn pvp3-red">✖ ZATVORI</button>
      </div>
    </div>

    <div style="flex:1;display:flex;min-height:0;">
      <div id="pvp3Container" style="flex:1;position:relative;overflow:hidden;">
        <div id="pvp3Overlay" style="position:absolute;inset:0;pointer-events:none;z-index:5;"></div>
        <div id="pvp3EndCard" style="position:absolute;inset:0;display:none;z-index:8;
             align-items:center;justify-content:center;background:rgba(3,6,14,.55);"></div>
      </div>
      <div id="pvpBattleLog" style="width:230px;flex:0 0 auto;border-left:1px solid rgba(120,180,255,.15);
           background:rgba(6,11,22,.75);display:flex;flex-direction:column;">
        <div style="padding:8px 12px;font-size:.66rem;letter-spacing:1px;color:#5f86ad;
             border-bottom:1px solid rgba(120,180,255,.12);">COMBAT LOG // HIVE_NET</div>
        <div id="pvp3LogList" style="flex:1;overflow-y:auto;padding:8px 10px;font-size:.66rem;
             line-height:1.5;font-family:'Share Tech Mono',monospace;display:flex;flex-direction:column-reverse;"></div>
      </div>
    </div>`;

  if (!document.getElementById('pvp3Style')) {
    const st = document.createElement('style');
    st.id = 'pvp3Style';
    st.textContent =
      '.pvp3-btn{background:rgba(20,32,56,.9);color:#bcd6f5;border:1px solid rgba(120,180,255,.25);' +
      "border-radius:6px;padding:5px 10px;font-size:.72rem;font-family:'Rajdhani',sans-serif;" +
      'font-weight:700;cursor:pointer;letter-spacing:.5px;transition:all .12s;}' +
      '.pvp3-btn:hover{background:rgba(40,64,104,.95);color:#fff;}' +
      '.pvp3-btn.pvp3-on{background:#1f6fff;border-color:#4d9bff;color:#fff;}' +
      '.pvp3-btn.pvp3-red{border-color:rgba(255,90,90,.5);color:#ff9b9b;}' +
      '.pvp3-btn.pvp3-red:hover{background:rgba(120,30,30,.9);color:#fff;}' +
      '.pvp3-hpbar{position:absolute;transform:translate(-50%,-50%);width:46px;pointer-events:none;' +
      'font-family:"Share Tech Mono",monospace;}' +
      '.pvp3-hpbar .nm{font-size:8px;color:#cfe2ff;text-align:center;white-space:nowrap;' +
      'text-shadow:0 1px 2px #000;margin-bottom:1px;overflow:hidden;text-overflow:ellipsis;}' +
      '.pvp3-hpbar .track{height:4px;background:rgba(0,0,0,.6);border:1px solid rgba(0,0,0,.8);' +
      'border-radius:2px;overflow:hidden;}' +
      '.pvp3-hpbar .shd{height:3px;background:#36d6ff;margin-top:1px;border-radius:2px;' +
      'box-shadow:0 0 4px #36d6ff;}' +
      '.pvp3-hpfill{height:100%;background:linear-gradient(90deg,#00ff88,#7cff00);transition:width .15s;}';
    document.head.appendChild(st);
  }

  document.body.appendChild(modal);

  modal.querySelector('#pvp3Controls').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    _pvp3OnControl(b.getAttribute('data-act'));
  });
}

function _pvp3OnControl(act) {
  if (!_pvp3) return;
  const setSpeedBtn = (id) => {
    document.querySelectorAll('#pvp3Controls .pvp3-btn').forEach(x => {
      if (['s1','s2','s5'].includes(x.getAttribute('data-act'))) x.classList.remove('pvp3-on');
    });
    const el = document.querySelector(`#pvp3Controls [data-act="${id}"]`);
    if (el) el.classList.add('pvp3-on');
  };
  switch (act) {
    case 'pause': {
      _pvp3.paused = !_pvp3.paused;
      const pb = document.querySelector('#pvp3Controls [data-act="pause"]');
      if (pb) pb.textContent = _pvp3.paused ? '▶ NASTAVI' : '⏸ PAUZA';
      if (!_pvp3.paused) _pvp3ScheduleNext();
      break;
    }
    case 's1': _pvp3.speed = 1; setSpeedBtn('s1'); break;
    case 's2': _pvp3.speed = 2; setSpeedBtn('s2'); break;
    case 's5': _pvp3.speed = 5; setSpeedBtn('s5'); break;
    case 'skip': _pvp3SkipToEnd(); break;
    case 'close': _pvp3Close(); break;
  }
}

// ============================================================
// SCENA
// ============================================================
function _pvp3InitScene(myFleet, oppFleet) {
  const container = document.getElementById('pvp3Container');
  const renderer  = _pvp3GetRenderer();
  const w = container.clientWidth  || 800;
  const h = container.clientHeight || 600;

  renderer.setSize(w, h, false);
  renderer.domElement.style.display = 'block';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05070f, 0.012);

  const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 1000);
  camera.position.set(0, 34, 60);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.AmbientLight(0x4060a0, 0.9));
  const key = new THREE.DirectionalLight(0xbcd8ff, 1.1);
  key.position.set(20, 40, 30);
  scene.add(key);
  const rim = new THREE.PointLight(0x3366ff, 0.8, 300);
  rim.position.set(0, 10, -40);
  scene.add(rim);

  _pvp3AddStarfield(scene);
  _pvp3AddGrid(scene);

  let controls = null;
  if (typeof THREE.OrbitControls !== 'undefined') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 25;
    controls.maxDistance = 140;
    controls.maxPolarAngle = Math.PI * 0.85;
    controls.target.set(0, 0, 0);
  }

  _pvp3.scene    = scene;
  _pvp3.camera   = camera;
  _pvp3.controls = controls;

  _pvp3.onResize = () => {
    if (!_pvp3) return;
    const cw = container.clientWidth || 800, ch = container.clientHeight || 600;
    camera.aspect = cw / ch;
    camera.updateProjectionMatrix();
    renderer.setSize(cw, ch, false);
  };
  window.addEventListener('resize', _pvp3.onResize);
}

function _pvp3AddStarfield(scene) {
  const g = new THREE.BufferGeometry();
  const N = 900, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    pos[i*3]   = (Math.random() - 0.5) * 400;
    pos[i*3+1] = (Math.random() - 0.5) * 240;
    pos[i*3+2] = (Math.random() - 0.5) * 400 - 60;
  }
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const m = new THREE.PointsMaterial({ color: 0x9fc4ff, size: 0.7, sizeAttenuation: true, transparent: true, opacity: 0.8 });
  const pts = new THREE.Points(g, m);
  pts.userData.isStar = true;
  scene.add(pts);
}

function _pvp3AddGrid(scene) {
  const grid = new THREE.GridHelper(160, 32, 0x1f3a66, 0x12233f);
  grid.position.y = -8;
  if (grid.material) { grid.material.transparent = true; grid.material.opacity = 0.35; }
  scene.add(grid);
}

// ============================================================
// BRODOVI
// ============================================================
function _pvp3MakeShipMesh(cls, side) {
  const c = cls.color;
  let geo;
  switch (cls.shape) {
    case 'cone':  geo = new THREE.ConeGeometry(cls.size * 0.7, cls.size * 2, 5); break;
    case 'tetra': geo = new THREE.TetrahedronGeometry(cls.size); break;
    case 'box':   geo = new THREE.BoxGeometry(cls.size * 2, cls.size, cls.size * 1.2); break;
    case 'cyl':   geo = new THREE.CylinderGeometry(cls.size * 0.6, cls.size, cls.size * 2, 8); break;
    case 'octa':  geo = new THREE.OctahedronGeometry(cls.size); break;
    default:      geo = new THREE.ConeGeometry(cls.size * 0.7, cls.size * 2, 5);
  }
  const mat = new THREE.MeshStandardMaterial({
    color: c, emissive: c, emissiveIntensity: 0.35,
    metalness: 0.6, roughness: 0.35,
  });
  const mesh = new THREE.Mesh(geo, mat);

  if (cls.shape === 'cone' || cls.shape === 'cyl') {
    mesh.rotation.z = side === 'player' ? -Math.PI / 2 : Math.PI / 2;
  }

  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(cls.size * 1.6, 12, 12),
    new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.07 })
  );
  const group = new THREE.Group();
  group.add(mesh);
  group.add(halo);
  return group;
}

function _pvp3Layout(fleet, side) {
  const n = fleet.length;
  const perCol = Math.min(3, Math.max(1, Math.ceil(Math.sqrt(n))));
  const x = side === 'player' ? -PVP3_SIDE_X : PVP3_SIDE_X;
  const out = [];
  for (let i = 0; i < n; i++) {
    const col = Math.floor(i / perCol);
    const row = i % perCol;
    const rows = Math.min(perCol, n - col * perCol);
    const zCenter = (rows - 1) / 2;
    out.push({
      x: x + (side === 'player' ? -col * 6 : col * 6),
      y: 0,
      z: (row - zCenter) * PVP3_SHIP_GAP,
    });
  }
  return out;
}

function _pvp3SpawnFleets(myFleet, oppFleet) {
  const add = (fleet, side) => {
    const pos = _pvp3Layout(fleet, side);
    fleet.forEach((sh, i) => {
      const cls   = _pvp3ClassOf(sh.ship_id);
      const group = _pvp3MakeShipMesh(cls, side);
      group.position.set(pos[i].x, pos[i].y, pos[i].z);
      _pvp3.scene.add(group);

      const hpMax     = sh.maxHp ?? sh.hp ?? 1;
      const shieldMax = sh.maxShield ?? sh.shield ?? 0;
      const hpBar     = _pvp3MakeHpBar(sh.name || sh.id);

      _pvp3.ships[sh.id] = {
        group, side, alive: true,
        hp: sh.hp ?? hpMax, hpMax,
        shield: sh.shield ?? shieldMax, shieldMax,
        cls, baseColor: cls.color,
        hitT: 0,
        hpBar,
      };
      _pvp3UpdateHpBar(_pvp3.ships[sh.id]);
    });
  };
  add(myFleet, 'player');
  add(oppFleet, 'enemy');
}

function _pvp3MakeHpBar(name) {
  const ov = document.getElementById('pvp3Overlay');
  const el = document.createElement('div');
  el.className = 'pvp3-hpbar';
  el.innerHTML =
    `<div class="nm">${(name || '').slice(0, 14)}</div>` +
    `<div class="track"><div class="pvp3-hpfill"></div></div>` +
    `<div class="shd"></div>`;
  ov.appendChild(el);
  return el;
}

function _pvp3UpdateHpBar(s) {
  if (!s.hpBar) return;
  const hpPct  = Math.max(0, Math.min(1, s.hpMax ? s.hp / s.hpMax : 0));
  const shPct  = Math.max(0, Math.min(1, s.shieldMax ? s.shield / s.shieldMax : 0));
  const fill   = s.hpBar.querySelector('.pvp3-hpfill');
  const shd    = s.hpBar.querySelector('.shd');
  fill.style.width = (hpPct * 100) + '%';
  fill.style.background = hpPct > 0.5
    ? 'linear-gradient(90deg,#00ff88,#7cff00)'
    : hpPct > 0.25 ? 'linear-gradient(90deg,#ffcc44,#ff9a3c)'
                   : 'linear-gradient(90deg,#ff5a5a,#ff2a2a)';
  shd.style.width = (shPct * 100) + '%';
  shd.style.display = s.shieldMax ? 'block' : 'none';
}

// ============================================================
// RENDER PETLJA
// ============================================================
function _pvp3StartLoop() {
  const renderer = _pvp3GetRenderer();
  const tick = () => {
    if (!_pvp3) return;
    _pvp3.rafId = requestAnimationFrame(tick);
    const dt = Math.min(0.05, _pvp3.clock.getDelta());

    _pvp3StepProjectiles(dt);
    _pvp3StepFx(dt);
    _pvp3StepShips(dt);
    if (_pvp3.controls) _pvp3.controls.update();

    _pvp3.scene.children.forEach(ch => { if (ch.userData && ch.userData.isStar) ch.rotation.y += dt * 0.01; });

    renderer.render(_pvp3.scene, _pvp3.camera);
    _pvp3SyncHpBars();
  };
  _pvp3.rafId = requestAnimationFrame(tick);
}

function _pvp3SyncHpBars() {
  const container = document.getElementById('pvp3Container');
  if (!container) return;
  const w = container.clientWidth, h = container.clientHeight;
  const v = new THREE.Vector3();
  const writes = [];
  for (const id in _pvp3.ships) {
    const s = _pvp3.ships[id];
    if (!s.hpBar) continue;
    if (!s.alive) { writes.push({ el: s.hpBar, display: 'none' }); continue; }
    v.setFromMatrixPosition(s.group.matrixWorld);
    v.y += 3.2;
    v.project(_pvp3.camera);
    const x = (v.x * 0.5 + 0.5) * w;
    const y = (-v.y * 0.5 + 0.5) * h;
    if (v.z < 1 && x > -40 && x < w + 40) {
      writes.push({ el: s.hpBar, display: 'block', left: x + 'px', top: y + 'px' });
    } else {
      writes.push({ el: s.hpBar, display: 'none' });
    }
  }
  for (const ww of writes) {
    ww.el.style.display = ww.display;
    if (ww.left) { ww.el.style.left = ww.left; ww.el.style.top = ww.top; }
  }
}

function _pvp3StepShips(dt) {
  for (const id in _pvp3.ships) {
    const s = _pvp3.ships[id];
    if (!s.alive) continue;
    s.group.position.y = Math.sin((performance.now() / 900) + s.group.position.z) * 0.4;
    if (s.hitT > 0) {
      s.hitT -= dt;
      const mesh = s.group.children[0];
      if (mesh && mesh.material) {
        mesh.material.emissiveIntensity = 0.35 + Math.max(0, s.hitT) * 4;
      }
    }
  }
}

// ============================================================
// PROJEKTILI
// ============================================================
function _pvp3FireProjectile(fromId, toId, opts) {
  const a = _pvp3.ships[fromId], b = _pvp3.ships[toId];
  if (!a || !b) return;
  const color = opts && opts.miss ? 0x9fb4cc : (a.side === 'player' ? 0x66ddff : 0xff7a5a);
  const geo = new THREE.SphereGeometry(opts && opts.crit ? 0.9 : 0.55, 10, 10);
  const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95 });
  const m = new THREE.Mesh(geo, mat);

  const from = a.group.position.clone();
  const to   = b.group.position.clone();
  m.position.copy(from);
  _pvp3.scene.add(m);

  const trailMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5 });
  const trailGeo = new THREE.BufferGeometry().setFromPoints([from.clone(), from.clone()]);
  const trail = new THREE.Line(trailGeo, trailMat);
  _pvp3.scene.add(trail);

  _pvp3.projectiles.push({
    m, trail, from, to, t: 0,
    dur: PVP3_PROJ_MS / 1000,
    miss: !!(opts && opts.miss),
    crit: !!(opts && opts.crit),
    toId,
    onHit: opts && opts.onHit,
  });
}

function _pvp3StepProjectiles(dt) {
  for (let i = _pvp3.projectiles.length - 1; i >= 0; i--) {
    const p = _pvp3.projectiles[i];
    p.t += dt;
    const k = Math.min(1, p.t / p.dur);
    const cur = p.from.clone().lerp(p.to, k);
    cur.y += Math.sin(k * Math.PI) * 2;
    p.m.position.copy(cur);
    const tail = p.from.clone().lerp(p.to, Math.max(0, k - 0.12));
    p.trail.geometry.setFromPoints([tail, cur]);

    if (k >= 1) {
      _pvp3.scene.remove(p.m);
      _pvp3.scene.remove(p.trail);
      _pvp3DisposeObj(p.m); _pvp3DisposeObj(p.trail);
      _pvp3.projectiles.splice(i, 1);
      if (p.miss) {
        _pvp3SpawnMiss(p.to);
      } else {
        _pvp3SpawnImpact(p.to, p.crit);
        if (typeof p.onHit === 'function') p.onHit();
      }
    }
  }
}

// ============================================================
// EFEKTI
// ============================================================
function _pvp3SpawnImpact(pos, crit) {
  const color = crit ? 0xffd23a : 0xfff0c0;
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.2, 0.5, 20),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, side: THREE.DoubleSide })
  );
  ring.position.copy(pos);
  ring.lookAt(_pvp3.camera.position);
  _pvp3.scene.add(ring);
  _pvp3.fx.push({ obj: ring, t: 0, dur: crit ? 0.5 : 0.35, kind: 'ring', grow: crit ? 9 : 6 });
}

function _pvp3SpawnMiss(pos) {
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.15, 0.3, 16),
    new THREE.MeshBasicMaterial({ color: 0x9fb4cc, transparent: true, opacity: 0.6, side: THREE.DoubleSide })
  );
  ring.position.copy(pos);
  ring.lookAt(_pvp3.camera.position);
  _pvp3.scene.add(ring);
  _pvp3.fx.push({ obj: ring, t: 0, dur: 0.3, kind: 'ring', grow: 3 });
}

function _pvp3SpawnShieldPing(pos) {
  const s = new THREE.Mesh(
    new THREE.SphereGeometry(2.4, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0x36d6ff, transparent: true, opacity: 0.5, wireframe: true })
  );
  s.position.copy(pos);
  _pvp3.scene.add(s);
  _pvp3.fx.push({ obj: s, t: 0, dur: 0.6, kind: 'shield', grow: 2 });
}

function _pvp3SpawnExplosion(pos) {
  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(1, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xffb24a, transparent: true, opacity: 1 })
  );
  ball.position.copy(pos);
  _pvp3.scene.add(ball);
  _pvp3.fx.push({ obj: ball, t: 0, dur: 0.7, kind: 'ball', grow: 7 });

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.5, 1, 24),
    new THREE.MeshBasicMaterial({ color: 0xffe08a, transparent: true, opacity: 0.9, side: THREE.DoubleSide })
  );
  ring.position.copy(pos);
  ring.lookAt(_pvp3.camera.position);
  _pvp3.scene.add(ring);
  _pvp3.fx.push({ obj: ring, t: 0, dur: 0.6, kind: 'ring', grow: 14 });

  const N = 40;
  const g = new THREE.BufferGeometry();
  const p = new Float32Array(N * 3);
  const vel = [];
  for (let i = 0; i < N; i++) {
    p[i*3] = pos.x; p[i*3+1] = pos.y; p[i*3+2] = pos.z;
    vel.push(new THREE.Vector3(
      (Math.random()-0.5), (Math.random()-0.5), (Math.random()-0.5)
    ).normalize().multiplyScalar(8 + Math.random()*10));
  }
  g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  const mat = new THREE.PointsMaterial({ color: 0xffd27a, size: 0.6, transparent: true, opacity: 1 });
  const pts = new THREE.Points(g, mat);
  _pvp3.scene.add(pts);
  _pvp3.fx.push({ obj: pts, t: 0, dur: 0.9, kind: 'sparks', vel });
}

function _pvp3StepFx(dt) {
  for (let i = _pvp3.fx.length - 1; i >= 0; i--) {
    const f = _pvp3.fx[i];
    f.t += dt;
    const k = Math.min(1, f.t / f.dur);
    if (f.kind === 'ring') {
      const sc = 1 + k * f.grow;
      f.obj.scale.set(sc, sc, sc);
      f.obj.material.opacity = (1 - k) * 0.9;
    } else if (f.kind === 'ball') {
      const sc = 1 + k * f.grow;
      f.obj.scale.set(sc, sc, sc);
      f.obj.material.opacity = (1 - k);
      f.obj.material.color.setHSL(0.08 - k * 0.08, 1, 0.5 - k * 0.2);
    } else if (f.kind === 'shield') {
      const sc = 1 + k * 0.4;
      f.obj.scale.set(sc, sc, sc);
      f.obj.material.opacity = (1 - k) * 0.5;
    } else if (f.kind === 'shipfade') {
      const sc = Math.max(0.01, 1 - k);
      f.obj.scale.set(sc, sc, sc);
      f.obj.rotation.y += dt * 6;
      f.obj.traverse(ch => {
        if (ch.material) {
          ch.material.transparent = true;
          ch.material.opacity = (1 - k);
        }
      });
    } else if (f.kind === 'sparks') {
      const arr = f.obj.geometry.attributes.position.array;
      for (let j = 0; j < f.vel.length; j++) {
        arr[j*3]   += f.vel[j].x * dt;
        arr[j*3+1] += f.vel[j].y * dt;
        arr[j*3+2] += f.vel[j].z * dt;
      }
      f.obj.geometry.attributes.position.needsUpdate = true;
      f.obj.material.opacity = (1 - k);
    }
    if (k >= 1) {
      _pvp3.scene.remove(f.obj);
      if (f.kind === 'shipfade') f.obj.traverse(_pvp3DisposeObj);
      else _pvp3DisposeObj(f.obj);
      _pvp3.fx.splice(i, 1);
    }
  }
}

// ============================================================
// PLAYBACK LOGA
// ============================================================
function _pvp3ScheduleNext() {
  if (!_pvp3 || _pvp3.paused || _pvp3.finished) return;
  if (_pvp3.playTimer) { clearTimeout(_pvp3.playTimer); _pvp3.playTimer = null; }
  if (_pvp3.logIdx >= _pvp3.log.length) { _pvp3Finish(); return; }

  const entry = _pvp3.log[_pvp3.logIdx++];
  _pvp3ApplyEntry(entry);

  const delay = PVP3_BASE_MS / (_pvp3.speed || 1);
  _pvp3.playTimer = setTimeout(_pvp3ScheduleNext, delay);
}

function _pvp3ApplyEntry(entry, instant) {
  if (!entry) return;
  _pvp3PushLog(entry);

  switch (entry.type) {
    case 'attack': {
      const tgt = _pvp3.ships[entry.targetId];
      const apply = () => {
        if (!tgt) return;
        if (entry.hpAfter     != null) tgt.hp     = entry.hpAfter;
        if (entry.shieldAfter != null) tgt.shield = entry.shieldAfter;
        if (entry.hpMax       != null) tgt.hpMax     = entry.hpMax;
        if (entry.shieldMax   != null) tgt.shieldMax = entry.shieldMax;
        tgt.hitT = 0.12;
        _pvp3UpdateHpBar(tgt);
        if (entry.shieldDmg > 0 && tgt.alive) _pvp3SpawnShieldPing(tgt.group.position);
      };
      if (instant) { apply(); }
      else _pvp3FireProjectile(entry.attackerId, entry.targetId, { crit: entry.isCrit, onHit: apply });
      break;
    }
    case 'miss': {
      if (!instant) _pvp3FireProjectile(entry.attackerId, entry.targetId, { miss: true });
      break;
    }
    case 'destroy': {
      const s = _pvp3.ships[entry.targetId];
      if (s && s.alive) {
        s.alive = false;
        if (!instant) _pvp3SpawnExplosion(s.group.position);
        _pvp3FadeOutShip(s, instant);
        if (s.hpBar) s.hpBar.style.display = 'none';
      }
      break;
    }
    case 'effect': {
      const s = _pvp3.ships[entry.targetId];
      if (s && s.alive && !instant) _pvp3SpawnShieldPing(s.group.position);
      break;
    }
    case 'round':
    case 'info':
    default:
      break;
  }
}

function _pvp3FadeOutShip(s, instant) {
  if (instant) {
    _pvp3.scene.remove(s.group);
    s.group.traverse(_pvp3DisposeObj);
    s.group = new THREE.Group();
    return;
  }
  _pvp3.fx.push({ obj: s.group, t: 0, dur: 0.7, kind: 'shipfade' });
}

function _pvp3PushLog(entry) {
  const list = document.getElementById('pvp3LogList');
  if (list && entry.msg) {
    const colors = {
      round: '#36d6ff', attack: '#b0cce8', destroy: '#ff5a5a',
      effect: '#ffd23a', miss: '#7f97b3', info: '#8affc1', result: '#8affc1',
    };
    const d = document.createElement('div');
    d.style.color = colors[entry.type] || '#9fb4cc';
    d.style.marginBottom = '2px';
    d.textContent = entry.msg;
    list.appendChild(d);
  }
  if (typeof addPvpLog === 'function' && entry.msg && entry.type !== 'attack' && entry.type !== 'miss') {
    try { addPvpLog(entry.msg, entry.type); } catch (e) { console.error('[pvp3d] addPvpLog failed:', e); }
  }
}

// ============================================================
// SKIP / KRAJ
// ============================================================
function _pvp3SkipToEnd() {
  if (!_pvp3 || _pvp3.finished) return;
  if (_pvp3.playTimer) { clearTimeout(_pvp3.playTimer); _pvp3.playTimer = null; }
  while (_pvp3.logIdx < _pvp3.log.length) {
    _pvp3ApplyEntry(_pvp3.log[_pvp3.logIdx++], true);
  }
  _pvp3.projectiles.forEach(p => { _pvp3.scene.remove(p.m); _pvp3.scene.remove(p.trail); });
  _pvp3.projectiles = [];
  for (const id in _pvp3.ships) _pvp3UpdateHpBar(_pvp3.ships[id]);
  _pvp3Finish();
}

function _pvp3Finish() {
  if (!_pvp3 || _pvp3.finished) return;
  _pvp3.finished = true;
  if (_pvp3.playTimer) { clearTimeout(_pvp3.playTimer); _pvp3.playTimer = null; }

  const st = _pvp3.result.status;
  const isWin  = st === 'victory';
  const isDraw = st === 'draw';
  const color  = isWin ? '#00ff88' : isDraw ? '#ffd23a' : '#ff5a5a';
  const icon   = isWin ? '🏆' : isDraw ? '🤝' : '💀';
  const text   = isWin ? 'POBJEDA' : isDraw ? 'NERIJEŠENO' : 'PORAZ';
  const rating = (typeof pvp !== 'undefined' && pvp && pvp.rating != null) ? pvp.rating : null;

  const card = document.getElementById('pvp3EndCard');
  if (card) {
    card.style.display = 'flex';
    card.innerHTML =
      `<div style="text-align:center;pointer-events:auto;
            background:rgba(8,14,28,.92);border:1px solid ${color}55;border-radius:14px;
            padding:28px 40px;box-shadow:0 0 40px ${color}33;">
        <div style="font-size:3rem;margin-bottom:6px;">${icon}</div>
        <div style="font-family:'Orbitron',sans-serif;font-weight:900;font-size:1.6rem;
             letter-spacing:2px;color:${color};">${text}</div>
        <div style="font-size:.8rem;color:#7fa6cc;margin-top:6px;">
          ${_pvp3.result.round || 0} rundi${rating != null ? ` · rating ${rating}` : ''}</div>
        <button id="pvp3EndClose" class="pvp3-btn pvp3-red" style="margin-top:18px;padding:8px 22px;">✖ ZATVORI</button>
      </div>`;
    const cb = document.getElementById('pvp3EndClose');
    if (cb) cb.addEventListener('click', _pvp3Close);
  }

  window._pvpBattleResult = _pvp3.result;
  window._pvpBattleOpp    = _pvp3.opp;
  if (typeof finishPvpBattle === 'function') {
    try { finishPvpBattle(); }
    catch (e) {
      console.error('[pvp3d] finishPvpBattle failed:', e);
      if (typeof toast === 'function') toast('⚠️ Rezultat borbe nije upisan — osvježi stranicu.', 'err');
    }
  }
}

// ============================================================
// ZATVARANJE / CLEANUP  (renderer se NE dispose-a)
// ============================================================
function _pvp3Close() {
  _pvp3Teardown();
  if (typeof closePvpBattleModal === 'function') { try { closePvpBattleModal(); } catch (e) { console.error('[pvp3d] closePvpBattleModal failed:', e); } }
  if (typeof renderPvp === 'function') { try { renderPvp(); } catch (e) { console.error('[pvp3d] renderPvp failed:', e); } }
  else if (typeof renderPvP === 'function') { try { renderPvP(); } catch (e) { console.error('[pvp3d] renderPvP failed:', e); } }
}

function _pvp3Teardown() {
  if (!_pvp3) return;

  if (_pvp3.rafId) cancelAnimationFrame(_pvp3.rafId);
  if (_pvp3.playTimer) clearTimeout(_pvp3.playTimer);
  if (_pvp3.onResize) window.removeEventListener('resize', _pvp3.onResize);

  if (_pvp3.scene) {
    _pvp3.scene.traverse(_pvp3DisposeObj);
    while (_pvp3.scene.children.length) _pvp3.scene.remove(_pvp3.scene.children[0]);
  }
  if (_pvp3.controls && _pvp3.controls.dispose) _pvp3.controls.dispose();

  const r = _pvp3Renderer;
  if (r && r.domElement && r.domElement.parentNode) {
    r.domElement.parentNode.removeChild(r.domElement);
  }

  const modal = document.getElementById('pvpBattleModal');
  if (modal) modal.remove();

  _pvp3 = null;
}

function _pvp3DisposeObj(o) {
  if (!o) return;
  if (o.geometry && o.geometry.dispose) o.geometry.dispose();
  if (o.material) {
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    mats.forEach(m => {
      if (m.map && m.map.dispose) m.map.dispose();
      if (m.dispose) m.dispose();
    });
  }
}
