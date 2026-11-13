"use strict";
/* Navegación, búsqueda y asistente sencillo, sin servicios externos ni cuentas. */
document.documentElement.classList.add('js-ready');
const $ = (s,root=document)=>root.querySelector(s);
const $$ = (s,root=document)=>[...root.querySelectorAll(s)];
const header = $('#site-header');
const updateHeaderState = () => header?.classList.toggle('scrolled', window.scrollY > 16);
window.addEventListener('scroll', updateHeaderState, { passive: true });
updateHeaderState();

const hero = $('.hero');
const updateHeroMotion = () => {
  if (!hero) return;
  const shift = Math.min(window.scrollY * 0.18, 55);
  hero.style.setProperty('--hero-shift', `${shift}px`);
};
window.addEventListener('scroll', updateHeroMotion, { passive: true });
updateHeroMotion();

$('#year').textContent = new Date().getFullYear();
const menu=$('#menu-toggle'), nav=$('#main-nav');
menu?.addEventListener('click',()=>{let open=nav.classList.toggle('mobile-open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú')});
$$('.drop-toggle').forEach(b=>b.addEventListener('click',()=>{const parent=b.closest('.nav-dropdown'),open=parent.classList.toggle('open');b.setAttribute('aria-expanded',String(open))}));
$$('a',nav).forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('mobile-open');menu?.setAttribute('aria-expanded','false')}));
const items=[
 ['Inicio','index.html','Portada, calidad competitiva'],['Nosotros','nosotros.html','Empresa, quiénes somos'],['Misión y visión','mision-vision.html','Objetivos, valores, compromiso'],['Nuestros trabajadores','trabajadores.html','Equipo, gestor de proyectos'],['Servicios','servicios.html','Desarrollo software, web, soporte, redes'],['Productos','productos.html','Productos tecnológicos'],['Accesorios para computadoras','accesorios-computadoras.html','Mouse, teclado, parlantes, pad mouse'],['Accesorios tecnológicos modernos','accesorios-tecnologicos.html','Audífonos, visor VR, TWS'],['Repuestos para PC','repuestos-pc.html','Procesadores, teclados, desktops'],['Contactos','contactos.html','Correo, teléfono, Chaclacayo, Ate, Chosica']
];
const search=$('#search-overlay'),searchInput=$('#search-input'),results=$('#search-results');
const norm=s=>String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function drawResults(q){const filtered=items.filter(i=>norm(i.join(' ')).includes(norm(q))).slice(0,10);results.replaceChildren();if(!filtered.length){let p=document.createElement('p');p.textContent='No se encontraron páginas relacionadas.';results.append(p);return}filtered.forEach(([title,url,desc])=>{let a=document.createElement('a');a.href=url;let strong=document.createElement('strong');strong.textContent=title;a.append(strong);let small=document.createElement('span');small.textContent=` ${desc}`;a.append(small);results.append(a)})}
function openSearch(){search.hidden=false;drawResults('');searchInput.focus();document.body.style.overflow='hidden'}function closeSearch(){search.hidden=true;document.body.style.overflow='';}
$('.search-toggle')?.addEventListener('click',openSearch);$('#close-search')?.addEventListener('click',closeSearch);search?.addEventListener('click',e=>{if(e.target===search)closeSearch()});searchInput?.addEventListener('input',e=>drawResults(e.target.value));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeSearch();$('#chat-panel').hidden=true}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openSearch()}});
const observer='IntersectionObserver' in window?new IntersectionObserver((entries)=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');observer.unobserve(e.target)}}),{threshold:.09}):null;
$$('.scroll-reveal').forEach(el=>observer?observer.observe(el):el.classList.add('revealed'));
const contact=$('#contact-form');contact?.addEventListener('submit',e=>{e.preventDefault();if(!contact.reportValidity())return;const f=new FormData(contact);const body=`Nombre: ${f.get('name')}\nCorreo: ${f.get('email')}\nServicio de interés: ${f.get('service')}\n\nMensaje:\n${f.get('message')}`;const subj=`Consulta desde la web - ${f.get('service')}`;window.location.href=`mailto:soluciones.calidadcompetitiva@gmail.com?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`});
const chatPanel=$('#chat-panel'),chatForm=$('#chat-form'),chatInput=$('#chat-input'),messages=$('#chat-messages');let faq=window.CC_FAQS || [];
function setChatOpen(open){
  if (!chatPanel) return;
  if (open) {
    chatPanel.hidden = false;
    requestAnimationFrame(() => {
      chatPanel.classList.add('is-open');
      chatInput?.focus();
    });
    return;
  }
  chatPanel.classList.remove('is-open');
  window.setTimeout(() => {
    if (!chatPanel.classList.contains('is-open')) {
      chatPanel.hidden = true;
    }
  }, 220);
}
/* Datos incluidos para abrir index.html sin servidor ni conexión. */
$('#chat-launcher')?.addEventListener('click',()=>{if(chatPanel.hidden){setChatOpen(true);}else{setChatOpen(false);}});$('#chat-close')?.addEventListener('click',()=>setChatOpen(false));
function botReply(question){const q=norm(question).replace(/[^a-z0-9\s]/g,' ');let best=null,score=0;for(const entry of faq){const words=norm(entry.keywords).split(/\s+/).filter(w=>w.length>2);let n=0;for(const w of words){if(new RegExp('\\b'+w+'\\b').test(q))n+=1;}const s=n/Math.max(1,Math.sqrt(words.length));if(s>score){score=s;best=entry}}return score>=.27&&best?best.answer:'Puedo ayudarte con información sobre desarrollo de software, redes, mantenimiento, productos, horarios y contacto. Si necesitas una respuesta precisa, escribe a soluciones.calidadcompetitiva@gmail.com o llama al 927 511 640.'}
function appendBubble(text,who){const p=document.createElement('div');p.className='bubble '+who;p.textContent=text;messages.append(p);messages.scrollTop=messages.scrollHeight}
chatForm?.addEventListener('submit',e=>{e.preventDefault();let q=chatInput.value.trim();if(!q)return;appendBubble(q,'user');chatInput.value='';appendBubble(botReply(q),'bot')});
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const carousel = document.querySelector(".carousel-container");

  if (track && prevBtn && nextBtn) {
    const cards = [...track.children];
    if (!cards.length) return;

    let scrollAmount = 0;
    let autoPlayId = null;
    const gap = 24;

    const updateTransform = () => {
      const maxScroll = Math.max(track.scrollWidth - track.parentElement.offsetWidth, 0);
      scrollAmount = Math.min(Math.max(scrollAmount, 0), maxScroll);
      track.style.transform = `translateX(-${scrollAmount}px)`;
    };

    const goNext = () => {
      const card = cards[0];
      if (!card) return;
      const cardWidth = card.offsetWidth + gap;
      const maxScroll = Math.max(track.scrollWidth - track.parentElement.offsetWidth, 0);
      scrollAmount = maxScroll > 0 ? Math.min(scrollAmount + cardWidth * 2, maxScroll) : 0;
      updateTransform();
    };

    const goPrev = () => {
      const card = cards[0];
      if (!card) return;
      const cardWidth = card.offsetWidth + gap;
      scrollAmount = Math.max(scrollAmount - cardWidth * 2, 0);
      updateTransform();
    };

    const startAutoPlay = () => {
      clearInterval(autoPlayId);
      autoPlayId = setInterval(() => {
        const maxScroll = Math.max(track.scrollWidth - track.parentElement.offsetWidth, 0);
        if (maxScroll <= 0) return;
        if (scrollAmount >= maxScroll) {
          scrollAmount = 0;
        } else {
          scrollAmount = Math.min(scrollAmount + (cards[0].offsetWidth + gap) * 2, maxScroll);
        }
        updateTransform();
      }, 2600);
    };

    nextBtn.addEventListener("click", () => {
      goNext();
      startAutoPlay();
    });

    prevBtn.addEventListener("click", () => {
      goPrev();
      startAutoPlay();
    });

    carousel?.addEventListener("mouseenter", () => clearInterval(autoPlayId));
    carousel?.addEventListener("mouseleave", startAutoPlay);

    startAutoPlay();
    updateTransform();
  }
});