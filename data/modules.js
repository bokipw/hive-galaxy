// ============================================================
// HIVE GALAXY — data/modules.js
// DEPRECATED — moduli su premješteni u:
//   data/recon.js   → Recon moduli (Samo Izviđači)
//   data/special.js → Special moduli (Fighter/Cruiser/Battleship/Carrier/Flagship)
// ============================================================

// Helper: pronađi bilo koji modul iz oba nova arraja
function getModuleById(id) {
  if (typeof RECON_MODULES !== 'undefined') {
    const r = RECON_MODULES.find(m => m.id === id);
    if (r) return r;
  }
  if (typeof SPECIAL_MODULES !== 'undefined') {
    const s = SPECIAL_MODULES.find(m => m.id === id);
    if (s) return s;
  }
  return null;
}

function canShipUseModule(shipClass, moduleId) {
  const mod = getModuleById(moduleId);
  if (!mod) return false;
  // Recon moduli — samo scout
  if (RECON_MODULES?.find(m => m.id === moduleId)) return shipClass === 'scout';
  // Special moduli — po shipClass polju (može biti string ili niz)
  if (mod.shipClass) {
    if (Array.isArray(mod.shipClass)) return mod.shipClass.includes(shipClass);
    return shipClass === mod.shipClass;
  }
  return false;
}

// Export
if (typeof module !== 'undefined') {
  module.exports = { getModuleById, canShipUseModule };
}
