'use strict';
(() => {
  const catalog = Array.isArray(window.CC_CATALOG) ? window.CC_CATALOG : [];
  const byId = new Map(catalog.map(item => [item.id, item]));
  const key = 'cc-consulta-v1';
  const norm = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const button = (text, cls = 'quiet-button') => {
    const node = el('button', cls, text); node.type = 'button'; return node;
  };
  const validIds = value => [...new Set(Array.isArray(value) ? value : [])].filter(id => typeof id === 'string' && byId.has(id)).slice(0, catalog.length);
  let selected = [];
  try { selected = validIds(JSON.parse(localStorage.getItem(key) || '[]')); } catch { /* La selección puede usarse sin almacenamiento. */ }
  const notice = el('div', 'cc-notice'); notice.setAttribute('role', 'status'); notice.setAttribute('aria-live', 'polite'); document.body.append(notice);
  let noticeTimer;
  function announce(message) { clearTimeout(noticeTimer); notice.textContent = message; notice.classList.add('visible'); noticeTimer = setTimeout(() => notice.classList.remove('visible'), 4000); }
  function persist() { try {localStorage.setItem(key, JSON.stringify(selected));} catch {announce('Tu selección está disponible en esta página. Usa Preparar consulta para continuar.');} }
  const bar = el('div', 'utility-bar container');
  const crumbs = el('nav', 'breadcrumbs'); crumbs.setAttribute('aria-label', 'Ruta de navegación');
  const home = el('a', '', 'Inicio'); home.href = 'index.html'; crumbs.append(home);
  if (document.body.dataset.page !== 'index') {
    const separator = el('span', 'breadcrumb-separator', '/'); separator.setAttribute('aria-hidden','true');
    const current = el('span', '', document.title.split('|')[0].trim()); current.setAttribute('aria-current','page'); crumbs.append(separator, current);
  } else home.setAttribute('aria-current', 'page');
  const openList = button('', 'consultation-trigger'); openList.setAttribute('aria-haspopup','dialog');
  bar.append(crumbs, openList); document.querySelector('main').prepend(bar);
  function dialog(title, extraClass = '') {
    const dlg = el('dialog', 'cc-dialog '+extraClass);
    const heading = el('h2', '', title); heading.id = 'dialog-'+(extraClass || 'consulta');
    dlg.setAttribute('aria-labelledby', heading.id);
    const header = el('div', 'dialog-header'); const close = button('Cerrar'); close.autofocus = true;
    close.addEventListener('click', () => dlg.close()); header.append(heading,close); dlg.append(header); document.body.append(dlg);
    dlg.addEventListener('click', event => {if(event.target===dlg){const r=dlg.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dlg.close();}});
    return dlg;
  }
  const listDialog = dialog('Mi consulta');
  const explanation = el('p', 'dialog-description', 'Reúne los productos y servicios que te interesan. La selección no representa una compra ni una reserva.');
  const list = el('ul', 'consultation-list');
  const empty = el('p', 'empty-state', 'Todavía no has añadido productos o servicios. Puedes hacerlo desde el catálogo o desde Servicios.');
  const footer = el('div', 'dialog-actions'); const go = el('a', 'button', 'Preparar consulta');
  const clear = button('Vaciar selección');
  footer.append(go,clear); listDialog.append(explanation,list,empty,footer);
  openList.addEventListener('click',()=>listDialog.showModal());
  clear.addEventListener('click',()=>{selected=[];persist();refresh();announce('Selección vaciada.');listDialog.querySelector('.dialog-header button').focus();});
  function refresh() {
    openList.textContent = 'Mi consulta ('+selected.length+')';
    openList.setAttribute('aria-label', 'Abrir mi consulta: '+selected.length+(selected.length===1?' elemento':' elementos'));
    list.replaceChildren();
    selected.forEach((id,index)=>{
      const item=byId.get(id); const row=el('li'); const copy=el('div'); copy.append(el('strong','',item.name),el('small','',item.kind));
      const remove=button('Quitar'); remove.setAttribute('aria-label','Quitar '+item.name);
      remove.addEventListener('click',()=>{selected=selected.filter(value=>value!==id);persist();refresh();announce(item.name+': eliminado de tu consulta.');const next=list.querySelectorAll('button');(next[Math.min(index,next.length-1)]||listDialog.querySelector('.dialog-header button')).focus();});
      row.append(copy,remove);list.append(row);
    });
    empty.hidden=selected.length>0;footer.hidden=!selected.length;
    go.href='contactos.html?consulta='+encodeURIComponent(selected.join(','));
    document.querySelectorAll('[data-add-item]').forEach(btn=>{const added=selected.includes(btn.dataset.addItem);btn.textContent=added?'Añadido a mi consulta':'Añadir a mi consulta';btn.setAttribute('aria-pressed',String(added));btn.setAttribute('aria-label',(added?'Quitar de mi consulta: ':'Añadir a mi consulta: ')+byId.get(btn.dataset.addItem).name);});
  }
  let zoom;
  document.querySelectorAll('[data-item]').forEach(card=>{
    const item=byId.get(card.dataset.item);if(!item)return;
    const add=button('Añadir a mi consulta','add-consultation');add.dataset.addItem=item.id;
    add.addEventListener('click',()=>{const exists=selected.includes(item.id);selected=exists?selected.filter(id=>id!==item.id):[...selected,item.id];persist();refresh();announce(item.name+(exists?': eliminado de tu consulta.':': añadido a tu consulta.'));});
    card.querySelector('.product-body,.card-body').append(add);
    const image=card.querySelector('.product-image');
    if(image){
      const enlarge=button('Ampliar imagen','enlarge-image');enlarge.setAttribute('aria-label','Ampliar imagen de '+item.name);enlarge.setAttribute('aria-haspopup','dialog');image.append(enlarge);
      enlarge.addEventListener('click',()=>{
        if(!zoom){zoom=dialog('Vista del producto','product-preview');zoom.append(el('img','preview-image'),el('p','preview-caption'));}
        const img=zoom.querySelector('img');img.src=item.image;img.alt=item.name;zoom.querySelector('.preview-caption').textContent=item.name;zoom.showModal();
      });
    }
  });
  refresh();
  window.addEventListener('storage',event=>{if(event.key===key){try{selected=validIds(JSON.parse(event.newValue||'[]'));refresh();}catch{/* Ignora datos inválidos de otras pestañas. */}}});
  const productCards=[...document.querySelectorAll('.product-card[data-item]')];
  if(productCards.length){
    const grid=productCards[0].parentElement;
    const tools=el('div','catalog-toolbar');const searchGroup=el('div','catalog-search');const searchLabel=el('label','','Buscar en este catálogo');searchLabel.htmlFor='filter-products';
    const search=el('input');search.type='search';search.id='filter-products';search.placeholder='Nombre o característica';search.autocomplete='off';
    searchGroup.append(searchLabel,search);
    const sortGroup=el('div','catalog-sort');const sortLabel=el('label','','Ordenar por');sortLabel.htmlFor='sort-products';const sort=el('select');sort.id='sort-products';
    [['original','Orden original'],['az','Nombre A–Z'],['price','Menor precio']].forEach(([value,text])=>{const option=el('option','',text);option.value=value;sort.append(option);});sortGroup.append(sortLabel,sort);
    const reset=button('Restablecer');const count=el('p','catalog-count');count.setAttribute('role','status');
    tools.append(searchGroup,sortGroup,reset,count);grid.before(tools);
    const noResults=el('div','catalog-no-results');noResults.hidden=true;noResults.append(el('h3','','No encontramos coincidencias'),el('p','','Prueba con otra palabra o restablece el catálogo.'));const resetEmpty=button('Ver todos los productos');noResults.append(resetEmpty);grid.after(noResults);
    function filter(){
      const terms=norm(search.value).split(/\s+/).filter(Boolean);
      const ordered=[...productCards];
      if(sort.value==='az')ordered.sort((a,b)=>byId.get(a.dataset.item).name.localeCompare(byId.get(b.dataset.item).name,'es'));
      if(sort.value==='price')ordered.sort((a,b)=>(byId.get(a.dataset.item).price??Infinity)-(byId.get(b.dataset.item).price??Infinity));
      let shown=0;
      ordered.forEach(card=>{const item=byId.get(card.dataset.item);card.hidden=!terms.every(term=>norm(item.name+' '+item.description).includes(term));if(!card.hidden)shown++;grid.append(card);});
      count.textContent=shown+' de '+productCards.length+' productos';noResults.hidden=shown>0;
    }
    function restore(){search.value='';sort.value='original';filter();search.focus();}
    search.addEventListener('input',filter);sort.addEventListener('change',filter);reset.addEventListener('click',restore);resetEmpty.addEventListener('click',restore);filter();
  }
  const form=document.querySelector('#contact-form');
  if(form){
    const ids=validIds((new URLSearchParams(location.search).get('consulta')||'').split(','));
    const message=form.querySelector('textarea');
    if(ids.length){message.value='Hola, quisiera información sobre:\n\n'+ids.map(id=>'- '+byId.get(id).name+' ('+byId.get(id).kind.toLowerCase()+')').join('\n')+'\n\nPor favor, confirmen disponibilidad y cotización. Gracias.';if(ids.every(id=>byId.get(id).kind==='Producto'))form.querySelector('select').value='Productos y accesorios';}
    const copy=button('Copiar mensaje','button button-outline');const status=el('p','contact-status');status.setAttribute('role','status');
    form.querySelector('button[type=submit]').after(copy,status);
    copy.addEventListener('click',async()=>{
      if(!form.reportValidity())return;
      const data=new FormData(form);const text='Nombre: '+data.get('name')+'\nCorreo: '+data.get('email')+'\nServicio de interés: '+data.get('service')+'\n\n'+data.get('message');
      try{await navigator.clipboard.writeText(text);status.textContent='Mensaje copiado. Puedes pegarlo en tu aplicación de correo.';}
      catch{let fallback=form.querySelector('.copy-fallback');if(!fallback){fallback=el('textarea','copy-fallback');fallback.readOnly=true;fallback.setAttribute('aria-label','Mensaje completo para copiar');form.append(fallback);}fallback.value=text;fallback.focus();fallback.select();status.textContent='Selecciona y copia el texto de abajo con Ctrl+C o con el menú de tu dispositivo.';}
    });
    form.addEventListener('submit',()=>{status.textContent='Se ha solicitado abrir tu aplicación de correo. Si no se abre, usa Copiar mensaje. El mensaje aún no se ha enviado.';});
  }
  const top=el('a','return-top','Subir');top.href='#arriba';top.setAttribute('aria-label','Volver al inicio de la página');top.hidden=true;document.body.append(top);
  let scheduled=false;window.addEventListener('scroll',()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{top.hidden=scrollY<650;scheduled=false;});},{passive:true});
})();
