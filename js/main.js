// ============================================================
// HIVE GALAXY — js/main.js
// Inicijalizacija i game loop — zadnji fajl koji se učitava
// CSS stilovi su u css/ fajlovima
// ============================================================

// ── INICIJALIZACIJA ──
async function init() {
  // Cloud load ako je email igrač sa Supabase sesijom, inače localStorage
  const isCloudPlayer = !!(window._supaSession || window._hiveUser);
  const result = isCloudPlayer ? await loadGameCloud() : (loadGame() ? 'loaded' : 'new');
  window._gameLoaded = true;

  // Učitavanje nije uspjelo — ne pokreći igru sa praznim stanjem jer bi
  // auto-save prebrisao postojeći cloud save.
  if (result === 'error') {
    addLog('⛔ Učitavanje igre nije uspjelo. Snimanje je blokirano dok ne osvježiš stranicu.');
    toast('⛔ Učitavanje igre nije uspjelo — osvježi stranicu.', 'err');
    if (typeof openModal === 'function') {
      openModal('⛔ Greška pri učitavanju',
        '<p>Nismo mogli učitati tvoj save sa servera. Da tvoj napredak ne bi bio prebrisan, snimanje je onemogućeno.</p>' +
        '<p style="color:#6a90b8;font-size:0.75rem">Provjeri internet konekciju i osvježi stranicu.</p>',
        [{ label: '🔄 Osvježi', cls: 'btn-g', fn: () => location.reload() }]);
    }
    return;
  }

  const loaded = result === 'loaded';

  // Inicijalizacija energije na max ako je novi igrač
  if (!loaded) {
    R.energy = getEnergyMax();
    addLog('🚀 Dobrodošao, Admirale! Izgradi svoju bazu i osvoji galaksiju.');
    toast('🚀 HIVE GALAXY — Dobrodošao!', 'ok');
  } else {
    toast('💾 Igra učitana!', 'inf');
    addLog('💾 Igra učitana.');
  }

  // 100x instance → commander key retroactive migration
  if (loaded && typeof _migrateInstance100Keys === 'function') {
    _migrateInstance100Keys();
  }

  // Render language picker
  const lpc = document.getElementById('langPickerContainer');
  if (lpc && typeof renderLangPicker === 'function') lpc.innerHTML = renderLangPicker();

  updateResUI();
  renderBase();
  if (typeof generateDailyMissions  === 'function') generateDailyMissions();
  if (typeof generateWeeklyMissions === 'function') generateWeeklyMissions();

  // Game loop
  setInterval(tickProduction,  1000);
  setInterval(tickEnergy,      1000);
  setInterval(tickBuildQueue,  1000);
  setInterval(() => { if (typeof checkAchievements === 'function') checkAchievements(); }, 5000);
  setInterval(saveGame,      60000); // auto-save svaku minutu
  setInterval(checkBcmDailyReward, 60000); // BCM snapshot provjera svaku minutu
  checkBcmDailyReward(); // provjeri odmah na startu
  setInterval(() => { if (typeof tickArtifactSurge === 'function') tickArtifactSurge(); }, 60000); // surge check svakih 60s
  // Research timer refresh
  setInterval(() => {
    if (typeof isAnyResearchActive === 'function' && isAnyResearchActive()) {
      if (document.getElementById('panel-research')?.classList.contains('active')) {
        if (typeof renderResearch === 'function') renderResearch();
      }
    }
  }, 1000);
}

// ── NAV GRUPA TOGGLE ──
function toggleNavGroup(grpId) {
  const grp  = document.getElementById(grpId);
  const icon = document.getElementById('icon-' + grpId);
  if (!grp) return;
  const collapsed = grp.classList.toggle('collapsed');
  if (icon) icon.style.transform = collapsed ? 'rotate(-90deg)' : 'rotate(0deg)';
}

// Ako je aktivni panel u grupi koja je zatvorena — otvori je automatski
function ensureNavGroupVisible(panel) {
  const btn = document.querySelector(`.nav-btn[data-panel="${panel}"]`);
  if (!btn) return;
  const grp = btn.closest('.nav-group');
  if (grp && grp.classList.contains('collapsed')) {
    toggleNavGroup(grp.id);
  }
}

// ── BCM DAILY SNAPSHOT ──
function checkBcmDailyReward() {
  const now      = new Date();
  const todayKey = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
  const lastPaid = localStorage.getItem('bcm_last_paid');

  if (lastPaid === todayKey) return; // već isplaćeno danas
  const bcmAmount = R.bcm || 0;
  if (bcmAmount <= 0) return; // nema BCM tokena

  const bocryptoReward = bcmAmount * 100;
  R.bocrypto = (R.bocrypto || 0) + bocryptoReward;

  localStorage.setItem('bcm_last_paid', todayKey);

  toast('💰 BCM Dividenda! +' + fmt(bocryptoReward) + ' BoCrypto (' + bcmAmount + ' BCM × 100)', 'ok');
  addLog('💰 Dnevna BCM dividenda isplaćena: +' + fmt(bocryptoReward) + ' BoCrypto');
  updateResUI();
  saveGame();
}

// ── POKRETANJE ──
init();
