/* Intro autónoma: el sitio existente permanece intacto. */
(() => {
  'use strict';
  const root = document.getElementById('cc-intro');
  if (!root) {document.documentElement.classList.remove('cc-intro-boot'); return;}
  const video = root.querySelector('#cc-intro-video');
  const audio = root.querySelector('#cc-intro-audio');
  const sound = root.querySelector('#cc-intro-sound');
  const skips = root.querySelectorAll('[data-cc-skip]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const CLIP_SECONDS = 5.04;
  const SIGNATURE_MS = 1900;
  const START_FALLBACK_MS = 5200;
  let epoch = performance.now();
  let finished = false;
  let inSignature = false;
  let wantsSound = false;
  let signatureTimer;
  let endTimer;
  let cleanupTimer;

  function setSoundLabel() {
    sound.textContent = wantsSound ? 'Silenciar' : 'Activar sonido';
    sound.setAttribute('aria-pressed', String(wantsSound));
  }
  function finish() {
    if (finished) return;
    finished = true;
    clearTimeout(signatureTimer); clearTimeout(endTimer);
    audio.pause(); video.pause();
    root.classList.add('cc-closing');
    cleanupTimer = setTimeout(() => {
      document.documentElement.classList.remove('cc-intro-boot');
      root.remove();
    }, 760);
  }
  function signature() {
    if (finished || inSignature) return;
    inSignature = true;
    clearTimeout(signatureTimer);
    root.classList.add('cc-signature-showing');
    endTimer = setTimeout(finish, SIGNATURE_MS);
  }
  function toggleSound() {
    if (finished) return;
    wantsSound = !wantsSound;
    setSoundLabel();
    if (!wantsSound) {audio.pause(); return;}
    // La música salta a la posición actual, para mantenerse sincronizada con el clip.
    try {audio.currentTime = Math.min(6.9, (performance.now()-epoch)/1000);} catch (_) {}
    audio.play().catch(() => {wantsSound = false; setSoundLabel();});
  }
  sound.addEventListener('click', toggleSound);
  skips.forEach(button => button.addEventListener('click', finish));
  root.addEventListener('keydown', event => {
    if (event.key === 'Escape') {event.preventDefault();finish();}
    if (event.key === 'Tab') {
      const last = [...skips][0];
      if (!event.shiftKey && document.activeElement === last) {event.preventDefault();sound.focus();}
      if (event.shiftKey && document.activeElement === sound) {event.preventDefault();last.focus();}
    }
  });
  video.addEventListener('ended', signature);
  video.addEventListener('error', () => {
    // En caso de falla, nunca dejar al visitante bloqueado.
    if (!inSignature) signature();
  });
  video.muted = true;
  audio.pause();
  setSoundLabel();
  root.classList.add('cc-running');
  if (reduced) {
    signature();
  } else {
    epoch = performance.now();
    const playback = video.play();
    if (playback && typeof playback.catch === 'function') playback.catch(() => {
      // Algunos navegadores permiten reproducir solo tras un clic.
      // Se mantiene la presentación y se garantiza su cierre.
    });
    signatureTimer = setTimeout(signature, START_FALLBACK_MS);
  }
  window.addEventListener('pagehide', () => {
    clearTimeout(cleanupTimer);
    audio.pause(); video.pause();
  }, {once:true});
})();
