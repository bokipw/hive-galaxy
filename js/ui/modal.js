// ============================================================
// HIVE GALAXY — js/ui/modal.js
// Modal helper funkcije — confirm, info, cost/reward helperi
// ============================================================

// ── CONFIRM DIJALOG ──
function confirmModal(title, body, onConfirm, confirmLabel = '✅ Potvrdi', confirmCls = 'btn-g') {
  openModal(title, body, [
    {
      label: confirmLabel,
      cls:   confirmCls,
      fn: () => {
        closeModal();
        if (typeof onConfirm === 'function') onConfirm();
      },
    },
    {
      label: '❌ Otkaži',
      cls:   '',
      fn:    closeModal,
    },
  ]);
}

// ── INFO MODAL ──
function infoModal(title, body) {
  openModal(title, body, []);
}

// ── COST HTML HELPER ──
function costHtml(cost) {
  const parts = [];
  if (cost.metal   > 0) parts.push(`🔩 ${fmt(cost.metal)} Metal`);
  if (cost.crystal > 0) parts.push(`💎 ${fmt(cost.crystal)} Crystal`);
  if (cost.he3     > 0) parts.push(`⛽ ${fmt(cost.he3)} He3`);
  if (cost.energy  > 0) parts.push(`⚡ ${cost.energy} Energija`);
  return `<div class="cost-block">${parts.map(p => `<div>${p}</div>`).join('')}</div>`;
}

// ── REWARD HTML HELPER ──
function rewardHtml(rewards) {
  if (!rewards) return '';
  const parts = [];
  if (rewards.metal   > 0) parts.push(`🔩 +${fmt(rewards.metal)}`);
  if (rewards.crystal > 0) parts.push(`💎 +${fmt(rewards.crystal)}`);
  if (rewards.he3     > 0) parts.push(`⛽ +${fmt(rewards.he3)}`);
  if (rewards.exp     > 0) parts.push(`⭐ +${fmt(rewards.exp)} XP`);
  if (rewards.score   > 0) parts.push(`🏆 +${fmt(rewards.score)}`);
  if (rewards.keys    > 0) parts.push(`🗝️ +${rewards.keys}`);
  return `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">
    ${parts.map(p => `<span style="background:rgba(0,255,136,0.08);border:1px solid rgba(0,255,136,0.2);
      border-radius:4px;padding:3px 10px;font-size:0.72rem;color:#00ff88">${p}</span>`).join('')}
  </div>`;
}

// ── FORMAT TIMER ──
function formatTimer(seconds) {
  if (seconds <= 0) return '0s';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}