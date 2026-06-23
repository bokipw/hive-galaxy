// ============================================================
// HIVE GALAXY — js/i18n.js
// Internationalization system
// ============================================================

window._i18nLang = localStorage.getItem('hg_lang') || 'sr';
window._i18nData = {};

const _I18N_LANGS = {
  sr: { label: '🇷🇸 Srpski',    flag: '🇷🇸' },
  en: { label: '🇬🇧 English',   flag: '🇬🇧' },
  de: { label: '🇩🇪 Deutsch',   flag: '🇩🇪' },
  fr: { label: '🇫🇷 Français',  flag: '🇫🇷' },
  it: { label: '🇮🇹 Italiano',  flag: '🇮🇹' },
  pt: { label: '🇵🇹 Português', flag: '🇵🇹' },
  pl: { label: '🇵🇱 Polski',    flag: '🇵🇱' },
  ja: { label: '🇯🇵 日本語',    flag: '🇯🇵' },
};

async function loadLang(lang) {
  if (!_I18N_LANGS[lang]) lang = 'sr';
  try {
    const resp = await fetch(`lang/${lang}.json?v=${Date.now()}`);
    if (!resp.ok) throw new Error('lang not found');
    window._i18nData = await resp.json();
    window._i18nLang = lang;
    localStorage.setItem('hg_lang', lang);
    document.documentElement.lang = lang;
    _applyLangToDOM();
    return true;
  } catch(e) {
    console.warn('i18n: failed to load lang', lang, e);
    if (lang !== 'sr') return loadLang('sr');
    return false;
  }
}

// t('pvp.title') or t('pvp.attacking', {name: 'Player1'})
window.t = function(key, vars) {
  const parts = key.split('.');
  let val = window._i18nData;
  for (const p of parts) {
    if (val && typeof val === 'object') val = val[p];
    else { val = null; break; }
  }
  if (val === null || val === undefined) return key;
  if (typeof val !== 'string') return key;
  if (vars) {
    val = val.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : `{${k}}`));
  }
  return val;
};

// Apply data-i18n attributes in the DOM
function _applyLangToDOM() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (val !== key) {
      if (el.hasAttribute('data-i18n-attr')) {
        el.setAttribute(el.getAttribute('data-i18n-attr'), val);
      } else {
        el.textContent = val;
      }
    }
  });
  // Update language picker if present
  const picker = document.getElementById('langPickerBtn');
  if (picker) picker.textContent = (_I18N_LANGS[window._i18nLang]?.flag || '🌐') + ' ' + window._i18nLang.toUpperCase();
}

function setLang(lang) {
  loadLang(lang).then(() => {
    // Re-render active panel
    if (window._currentPanel && typeof showPanel === 'function') {
      showPanel(window._currentPanel);
    }
    // Update save button text
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn && saveBtn.textContent.trim() !== t('btn.saved')) {
      saveBtn.textContent = t('btn.save');
    }
  });
}

function renderLangPicker() {
  const opts = Object.entries(_I18N_LANGS).map(([code, info]) =>
    `<button onclick="setLang('${code}')" style="
      display:block; width:100%; text-align:left; padding:8px 14px;
      background:${code === window._i18nLang ? 'rgba(100,180,255,0.15)' : 'transparent'};
      border:none; color:#c8dff0; cursor:pointer; font-size:13px;
      border-radius:6px; margin:2px 0;
    " onmouseover="this.style.background='rgba(100,180,255,0.1)'" onmouseout="this.style.background='${code === window._i18nLang ? 'rgba(100,180,255,0.15)' : 'transparent'}'"
    >${info.label}</button>`
  ).join('');

  return `<div style="position:relative;display:inline-block;">
    <button id="langPickerBtn" onclick="toggleLangDropdown()" style="
      background:rgba(40,60,100,0.6); border:1px solid rgba(100,160,220,0.3);
      color:#c8dff0; padding:5px 10px; border-radius:6px; cursor:pointer;
      font-size:13px; display:flex; align-items:center; gap:6px;
    ">${_I18N_LANGS[window._i18nLang]?.flag || '🌐'} ${window._i18nLang.toUpperCase()} ▾</button>
    <div id="langDropdown" style="
      display:none; position:absolute; top:110%; right:0; z-index:9999;
      background:rgba(10,20,40,0.97); border:1px solid rgba(100,160,220,0.3);
      border-radius:8px; padding:6px; min-width:140px;
      box-shadow:0 4px 20px rgba(0,0,0,0.5);
    ">${opts}</div>
  </div>`;
}

window.toggleLangDropdown = function() {
  const dd = document.getElementById('langDropdown');
  if (dd) dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
};

// Close dropdown when clicking outside
document.addEventListener('click', e => {
  if (!e.target.closest('#langPickerBtn') && !e.target.closest('#langDropdown')) {
    const dd = document.getElementById('langDropdown');
    if (dd) dd.style.display = 'none';
  }
});

// ── Helperi za prevođenje podataka ──
// dn(dataItem) → translated name (ili fallback na dataItem.name)
window.dn = function(item) {
  if (!item) return '';
  if (item.nameKey) {
    const val = window.t(item.nameKey);
    if (val !== item.nameKey) return val;
  }
  return item.name || '';
};
// dd(dataItem) → translated desc (ili fallback na dataItem.desc)
window.dd = function(item) {
  if (!item) return '';
  if (item.descKey) {
    const val = window.t(item.descKey);
    if (val !== item.descKey) return val;
  }
  return item.desc || '';
};
// dl(milestone) → translated label
window.dl = function(m) {
  if (!m) return '';
  if (m.labelKey) {
    const val = window.t(m.labelKey);
    if (val !== m.labelKey) return val;
  }
  return m.label || '';
};
// db(milestone) → translated bonus
window.db = function(m) {
  if (!m) return '';
  if (m.bonusKey) {
    const val = window.t(m.bonusKey);
    if (val !== m.bonusKey) return val;
  }
  return m.bonus || '';
};

// Init on load
loadLang(window._i18nLang);
