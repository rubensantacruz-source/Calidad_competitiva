'use strict';
(() => {
  const menuButton = document.querySelector('#menu-toggle');
  const navigation = document.querySelector('#main-nav');
  const searchOverlay = document.querySelector('#search-overlay');
  const searchButton = document.querySelector('.search-toggle');
  const chatButton = document.querySelector('#chat-launcher');
  const chat = document.querySelector('#chat-panel');
  searchButton?.setAttribute('aria-controls', 'search-overlay');
  chatButton?.setAttribute('aria-controls', 'chat-panel');
  menuButton?.setAttribute('aria-controls', 'main-nav');
  const closeNavigation = () => {
    navigation?.classList.remove('mobile-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Abrir menú');
    document.querySelectorAll('.nav-dropdown.open').forEach(item => {
      item.classList.remove('open');
      item.querySelector('button')?.setAttribute('aria-expanded', 'false');
    });
  };
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeNavigation();
  });
  document.querySelectorAll('#main-nav a').forEach(a => a.addEventListener('click', closeNavigation));
  document.querySelectorAll('.drop-toggle').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.drop-toggle').forEach(other => {
      if (other === button) return;
      other.closest('.nav-dropdown').classList.remove('open');
      other.setAttribute('aria-expanded', 'false');
    });
  }));
  document.querySelector('#close-search')?.addEventListener('click', () => searchButton.focus());
  document.querySelector('#chat-close')?.addEventListener('click', () => chatButton.focus());
  new MutationObserver(() => {
    chatButton?.setAttribute('aria-expanded', String(!chat.hidden));
  }).observe(chat, { attributes: true, attributeFilter: ['hidden'] });
  chatButton?.setAttribute('aria-expanded', 'false');
 document.addEventListener('keydown', event => {
   if (event.key === 'Escape') {
     if (event.target.closest('.search-panel')) searchButton.focus();
     else if (event.target.closest('.chat-panel')) chatButton.focus();
     else if (navigation?.classList.contains('mobile-open')) menuButton.focus();
     closeNavigation();
   }
   if (event.key !== 'Tab' || searchOverlay.hidden) return;
   const controls = [...searchOverlay.querySelectorAll('a[href],button,input')].filter(el => !el.disabled && el.getClientRects().length);
   const first = controls[0], last = controls[controls.length - 1];
   if (event.shiftKey && document.activeElement === first) {event.preventDefault();last.focus();}
   if (!event.shiftKey && document.activeElement === last) {event.preventDefault();first.focus();}
 });
})();