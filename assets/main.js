// HERO: o estêncil aparece e a agulha enche a peça; 5 peças em ciclo (shader no PC, MP4 no toque)
(function(){
  const f=document.getElementById('folha'),cv=document.getElementById('sombra'),vd=document.getElementById('sombraV'),cap=document.getElementById('fCap');
  const PS=window.sombreadoPecas,C=window.sombreadoCiclo;
  const reduz=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const estatica=()=>{f.classList.add('estatica');cv.hidden=true;vd.hidden=true};
  let atual=-1;
  function mostra(e){f.classList.toggle('fim',e.fim);if(e.i!==atual){atual=e.i;cap.textContent=PS[e.i][1];f.setAttribute('aria-label',PS[e.i][1].split(' · ')[0]+' tatuado pelo Artur, do estêncil ao sombreado')}}
  if(reduz){estatica();return}
  const carrega=src=>new Promise((ok,er)=>{const i=new Image();i.decoding='async';i.onload=()=>ok(i);i.onerror=er;i.src=src});
  function shader(){
    const api=window.sombreadoHero&&window.sombreadoHero(cv);
    if(!api||!api.ok){estatica();return}
    vd.hidden=true;cv.hidden=false;
    const cargas=PS.map(([n],i)=>Promise.all([carrega('assets/hero/'+n+'.webp?v=3'),carrega('assets/hero/'+n+'-fluxo.webp?v=3')]).then(([a,b])=>api.carregar(i,a,b)));
    cargas[0].then(()=>{
      let T=0,ult=null,vis=true;
      new IntersectionObserver(es=>vis=es[0].isIntersecting).observe(f);
      function passo(ts){
        const dt=ult===null?0:Math.min((ts-ult)/1000,.1);ult=ts;
        if(vis&&!document.hidden){
          let e=window.sombreadoEm(T+dt);
          if(!api.pronta(e.i)){e=window.sombreadoEm(T);} else T+=dt;   /* espera a próxima peça carregar */
          api.quadro(e.t,e.i,e.al);mostra(e);
        }
        requestAnimationFrame(passo)}
      requestAnimationFrame(passo);
    }).catch(estatica);
  }
  if(matchMedia('(hover: none)').matches){
    cv.hidden=true;vd.hidden=false;vd.loop=true;vd.src='assets/hero/sombreado.mp4?v=3';
    vd.addEventListener('timeupdate',()=>mostra(window.sombreadoEm(vd.currentTime)));
    vd.addEventListener('error',shader,{once:true});
    const p=vd.play();if(p)p.catch(()=>{vd.hidden=true;shader()});
  }else shader();
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
