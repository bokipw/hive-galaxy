(function() {
  var hamburger, nav, overlay;

  function init() {
    hamburger = document.getElementById('hamburger');
    nav       = document.getElementById('nav');
    overlay   = document.getElementById('navOverlay');
    if (!hamburger || !nav || !overlay) return;

    var toggle = function(e) {
      e.stopPropagation();
      nav.classList.toggle('open');
      overlay.classList.toggle('open');
    };
    var close = function() {
      nav.classList.remove('open');
      overlay.classList.remove('open');
    };

    hamburger.addEventListener('click', toggle);
    hamburger.addEventListener('touchstart', function(e) { e.preventDefault(); toggle(e); }, { passive: false });
    overlay.addEventListener('click', close);
    overlay.addEventListener('touchstart', function(e) { e.preventDefault(); close(); }, { passive: false });

    // zatvori kad se klikne na nav-btn
    nav.querySelectorAll('.nav-btn').forEach(function(btn) {
      btn.addEventListener('click', close);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();