// HERO: a ideia escrita na folha vira esboço e depois pele
(function(){
  const H=[
    ['miguel','São Miguel Arcanjo, força e proteção.','São Miguel · braço'],
    ['lola','A minha Lola, para sempre comigo.','Lola · antebraço'],
    ['senna','Ayrton Senna, o capacete e o carro.','Senna · perna'],
    ['leoa','Leoa com a cria. Força e legado.','Leoa e cria · braço'],
    ['catrina','Uma Catrina entre flores.','Catrina · braço'],
    ['lobo','O lobo defende o que ama.','Lobo · perna']];
  const f=document.getElementById('folha'),ide=document.getElementById('fIdeia'),esb=document.getElementById('fEsb'),pel=document.getElementById('fPele'),nom=document.getElementById('fNome');
  const src=(n,e)=>'assets/img/h/'+n+(e?'-e':'')+'.webp';
  H.forEach(([n])=>{[0,1].forEach(e=>{const i=new Image();i.src=src(n,e)})});
  const reduz=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let k=0,t=null;
  function mostra(i){const [n,txt,nm]=H[i];
    f.classList.remove('go','sai');ide.textContent=txt;nom.textContent=nm;esb.src=src(n,1);pel.src=src(n,0);
    void f.offsetWidth;
    const go=()=>f.classList.add('go');
    Promise.all([esb,pel].map(im=>im.decode?im.decode().catch(()=>{}):0)).then(go)}
  function ciclo(){f.classList.add('sai');setTimeout(()=>{k=(k+1)%H.length;mostra(k)},380)}
  function liga(){if(!t&&!reduz)t=setInterval(ciclo,5000)}
  function desliga(){clearInterval(t);t=null}
  mostra(0);
  if(reduz){f.classList.add('go');return}
  liga();
  new IntersectionObserver(e=>e[0].isIntersecting?liga():desliga()).observe(f);
  document.addEventListener('visibilitychange',()=>document.hidden?desliga():liga());
})();

// TRABALHOS
const P=window.PECAS,g=document.getElementById('grade'),MOSTRA=24;
const CAT={r:'Realismo',a:'Animais',l:'Lettering',f:'Fine line',c:'Cor'};
P.forEach(([f,t,n],i)=>{const a=n||CAT[t];const b=document.createElement('button');b.dataset.t=t;if(i>=MOSTRA)b.classList.add('oc');b.setAttribute('aria-label','Abrir '+a);b.dataset.cap=a;
  b.innerHTML=`<img src="assets/img/p/${f}.webp" alt="${a}, tatuagem de Artur Miguel" width="800" height="1000" decoding="async">`;g.appendChild(b)});
const mais=document.getElementById('mais');
mais.onclick=()=>{g.querySelectorAll('.oc').forEach(x=>x.classList.remove('oc'));mais.parentNode.remove()};
document.querySelectorAll('.filtros button').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('.filtros button').forEach(x=>x.classList.toggle('on',x===b));
  const f=b.dataset.f;if(f!=='todos'&&document.getElementById('mais'))mais.click();
  g.querySelectorAll('button').forEach(x=>x.hidden=f!=='todos'&&x.dataset.t!==f)});

// LIGHTBOX
const lb=document.getElementById('lb'),li=document.getElementById('lbImg'),lc=document.getElementById('lbCap');let cur=0;
const vis=()=>[...g.querySelectorAll('button:not([hidden]):not(.oc)')];
function abrir(i){const v=vis();cur=(i+v.length)%v.length;const im=v[cur].querySelector('img');li.src=im.src;li.alt=im.alt;lc.textContent=v[cur].dataset.cap;lb.hidden=false}
g.onclick=e=>{const b=e.target.closest('button');if(b)abrir(vis().indexOf(b))};
document.getElementById('lbX').onclick=()=>lb.hidden=true;
document.getElementById('lbP').onclick=()=>abrir(cur-1);
document.getElementById('lbS').onclick=()=>abrir(cur+1);
lb.onclick=e=>{if(e.target===lb)lb.hidden=true};
addEventListener('keydown',e=>{if(lb.hidden)return;if(e.key==='Escape')lb.hidden=true;if(e.key==='ArrowRight')abrir(cur+1);if(e.key==='ArrowLeft')abrir(cur-1)});

// MENU
const bu=document.getElementById('burger'),ga=document.getElementById('gaveta');
bu.onclick=()=>{const o=bu.getAttribute('aria-expanded')!=='true';bu.setAttribute('aria-expanded',o);ga.hidden=!o};
ga.onclick=e=>{if(e.target.closest('a')){ga.hidden=true;bu.setAttribute('aria-expanded',false)}};

// entradas suaves (só subida leve)
document.querySelectorAll('.lead,.pv-grid figure,.hm-grid figure,.ar-txt,.on-txt,.passos li,.orc').forEach(el=>el.classList.add('rv'));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));

// "Quero eternizar o meu" pré-escolhe Homenagem
document.querySelectorAll('[data-tipo]').forEach(a=>a.addEventListener('click',()=>{const r=document.querySelector(`#chips input[value="${a.dataset.tipo}"]`);if(r)r.checked=true}));

// ORÇAMENTO: monta a mensagem, copia e abre WhatsApp ou Direct
const WA='351960300746',IG='arturmigueltattoos';
let via='wa';document.querySelectorAll('.bts-f button').forEach(b=>b.addEventListener('click',()=>via=b.dataset.via));
document.getElementById('orc').onsubmit=async e=>{e.preventDefault();const d=new FormData(e.target);const nome=(d.get('nome')||'').trim();
  if(!nome){document.getElementById('erro').hidden=false;e.target.nome.focus();return}document.getElementById('erro').hidden=true;
  const m=`Olá Artur! Sou ${nome} e queria um orçamento.\n\nEstilo: ${d.get('tipo')}\nZona: ${d.get('zona')||'a definir'}\nTamanho: ${d.get('tam')}\nIdeia: ${d.get('ideia')||'explico na conversa'}`;
  try{await navigator.clipboard.writeText(m)}catch(_){}
  document.getElementById('ok').hidden=false;
  window.open(via==='wa'?`https://wa.me/${WA}?text=${encodeURIComponent(m)}`:`https://www.instagram.com/m/${IG}/`,'_blank','noopener')};
