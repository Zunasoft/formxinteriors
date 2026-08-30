"use client";
import React, { useEffect } from 'react';
import './Projects.css';

export default function Projects() {
  useEffect(() => {
    
const P=[
 {n:'Kokapet duplex',loc:'Kokapet',type:'Apartment',tier:'Platinum',area:'3,400 sq ft',
  promised:48,actual:46,value:'₹34–39L',rooms:'4 BHK',year:'2026',frames:[]},
 {n:'Jubilee Hills flat',loc:'Jubilee Hills',type:'Apartment',tier:'Platinum',area:'1,850 sq ft',
  promised:48,actual:44,value:'₹18–22L',rooms:'3 BHK',year:'2026',frames:[]},
 {n:'Gachibowli office',loc:'Gachibowli',type:'Commercial',tier:'Gold',area:'2,200 sq ft',
  promised:48,actual:48,value:'₹21–24L',rooms:'40 desks',year:'2025',frames:[]},
 {n:'Narsingi villa',loc:'Narsingi',type:'Villa',tier:'Gold',area:'3,100 sq ft',
  promised:48,actual:47,value:'₹26–30L',rooms:'4 BHK',year:'2025',frames:[]},
 {n:'Banjara reception',loc:'Banjara Hills',type:'Commercial',tier:'Platinum',area:'240 sq ft',
  promised:30,actual:28,value:'₹6–7L',rooms:'Feature wall',year:'2025',frames:[]},
 {n:'Manikonda modulars',loc:'Manikonda',type:'Modular',tier:'Gold',area:'620 sq ft',
  promised:32,actual:31,value:'₹9–11L',rooms:'Kitchen + wardrobes',year:'2025',frames:[]},
 {n:'Tellapur villa',loc:'Tellapur',type:'Villa',tier:'Platinum',area:'4,200 sq ft',
  promised:48,actual:48,value:'₹42–48L',rooms:'5 BHK',year:'2025',frames:[]},
 {n:'Hitec City wardrobes',loc:'Hitec City',type:'Modular',tier:'Gold',area:'380 sq ft',
  promised:24,actual:23,value:'₹5–6L',rooms:'4 wardrobes',year:'2024',frames:[]}
];

const NF=5;
const TONE=['#1D2C34','#33454E','#7C6B57','#BFA57F','#E2D5BE'];
function frameHTML(p,i,n){
  if(p.frames&&p.frames[i])return '<img src="'+p.frames[i]+'" alt="">';
  const a=TONE[Math.min(4,Math.round(i/(n-1)*4))],b=TONE[Math.max(0,Math.round(i/(n-1)*4)-1)];
  return '<div style="width:100%;height:100%;background:linear-gradient(158deg,'+a+','+b+' 60%,#16242B)"></div>';
}

/* ---------- build the wall ---------- */
const wall=document.getElementById('wall');
let fType='all',fTier='all',PN=[],vis=[],active=0,hovered=-1;

function render(){
  wall.innerHTML='';PN=[];
  wall.parentElement.querySelectorAll('.empty').forEach(e=>e.remove());
  vis=P.map((p,i)=>({p,i})).filter(o=>
    (fType==='all'||o.p.type===fType)&&(fTier==='all'||o.p.tier===fTier));
  if(!vis.length){
    const d=document.createElement('div');d.className='empty';
    d.innerHTML='<span class="mono">No projects in this filter yet</span>';
    wall.parentElement.appendChild(d);sizeStage();return;
  }
  vis.forEach((o,vi)=>{
    const p=o.p,n=p.frames.length||NF,ok=p.actual<=p.promised;
    const el=document.createElement('article');
    el.className='pn';el.tabIndex=0;el.dataset.vi=vi;el.dataset.i=o.i;
    el.innerHTML=
      Array.from({length:n},(_,f)=>'<div class="fr'+(f===0?' on':'')+'">'+frameHTML(p,f,n)+'</div>').join('')+
      '<div class="veil"></div>'+
      '<div class="spine"><span class="n">'+String(o.i+1).padStart(2,'0')+'</span>'+
        '<span class="v">'+p.n+'</span><span class="ico"><i></i></span></div>'+
      '<div class="open">'+
        '<div class="orow"><span class="dayc">Day 1</span>'+
          '<span class="bd">'+(ok?p.actual+' / '+p.promised+' days':p.actual+' days')+'</span></div>'+
        '<div class="obot"><h3>'+p.n+'</h3>'+
          '<div class="osub">'+p.loc+' · '+p.tier+' · '+p.year+'</div>'+
          '<div class="ofacts"><i>'+p.rooms+'</i><i>'+p.area+'</i><i>'+p.value+'</i></div>'+
          '<button class="more" data-open="'+o.i+'"><span>→</span>Open the build log</button></div>'+
      '</div><span class="prog"></span>';
    wall.appendChild(el);
    PN.push({el,p,i:o.i,vi,frs:[...el.querySelectorAll('.fr')],
      day:el.querySelector('.dayc'),prog:el.querySelector('.prog'),raf:null});
  });
  PN.forEach(o=>{
    o.el.addEventListener('pointerenter',()=>{hovered=o.vi;setActive(o.vi)});
    o.el.addEventListener('pointerleave',()=>{hovered=-1});
    o.el.addEventListener('focus',()=>{hovered=o.vi;setActive(o.vi)});
    o.el.addEventListener('click',e=>{if(!e.target.closest('.more'))openOv(o.i)});
    o.el.addEventListener('keydown',e=>{if(e.key==='Enter')openOv(o.i)});
  });
  active=-1;setActive(0);sizeStage();
}
wall.addEventListener('click',e=>{const b=e.target.closest('.more');if(b)openOv(+b.dataset.open)});

/* one screen-height of scroll per project, so the last one releases the pin */
function sizeStage(){
  const n=Math.max(1,vis.length);
  const st=document.getElementById('stage');
  st.style.height=(100+n*40)+'svh';
}

function playBuild(o){
  cancelAnimationFrame(o.raf);
  const n=o.frs.length,t0=performance.now();
  (function step(t){
    const k=Math.min(1,(t-t0)/2400);
    const f=Math.min(n-1,Math.floor(k*n*0.999));
    o.frs.forEach((el,z)=>el.classList.toggle('on',z===f));
    o.day.textContent='Day '+Math.max(1,Math.round(k*o.p.actual));
    o.prog.style.width=(k*100)+'%';
    if(k<1)o.raf=requestAnimationFrame(step);
  })(t0);
}
function resetBuild(o){
  cancelAnimationFrame(o.raf);
  o.frs.forEach((el,z)=>el.classList.toggle('on',z===0));
  o.day.textContent='Day 1';o.prog.style.width=0;
}
function setActive(vi){
  if(vi===active||!PN.length)return;
  const prev=PN[active];if(prev)resetBuild(prev);
  active=vi;
  PN.forEach(o=>o.el.classList.toggle('on',o.vi===vi));
  const cur=PN[vi];
  if(cur){
    playBuild(cur);
    document.getElementById('counter').textContent=String(cur.i+1).padStart(2,'0')+' / '+String(P.length).padStart(2,'0');
  }
}

/* ---------- scroll drives left → right ---------- */
let prog=0;
function onScroll(){
  const st=document.getElementById('stage'),r=st.getBoundingClientRect();
  const total=st.offsetHeight-innerHeight;
  prog=Math.max(0,Math.min(1,total?(-r.top)/total:0));
  document.getElementById('pfill').style.width=(prog*100)+'%';
  if(hovered<0&&vis.length){
    const vi=Math.min(vis.length-1,Math.floor(prog*vis.length*0.9999));
    setActive(vi);
  }
}
addEventListener('scroll',onScroll,{passive:true});
addEventListener('resize',()=>{sizeStage();onScroll()});

/* ---------- cursor tilts the wall ---------- */
const ww=document.getElementById('wallwrap');
let tx=0,ty=0,cx=0,cy=0;
ww.addEventListener('pointermove',e=>{
  const r=ww.getBoundingClientRect();
  tx=((e.clientX-r.left)/r.width-.5);
  ty=((e.clientY-r.top)/r.height-.5);
});
ww.addEventListener('pointerleave',()=>{tx=0;ty=0});

/* ---------- ambient wave ---------- */
const wv1=document.getElementById('wv1'),wv2=document.getElementById('wv2');
let wt=0;
function wave(){
  wt+=.012;
  const pts=(amp,ph,off)=>{
    let d='M0 '+(140+off);
    for(let x=0;x<=1200;x+=40){
      const y=140+off+Math.sin(x*0.006+ph)*amp+Math.sin(x*0.013+ph*1.7)*amp*0.4;
      d+=' L'+x+' '+y.toFixed(1);
    }
    return d;
  };
  wv1.setAttribute('d',pts(26,wt,0));
  wv2.setAttribute('d',pts(18,wt*1.3+1.2,26));
  cx+=(tx-cx)*.07;cy+=(ty-cy)*.07;
  wall.style.transform='rotateY('+(cx*7).toFixed(2)+'deg) rotateX('+(-cy*4).toFixed(2)+'deg)';
  requestAnimationFrame(wave);
}

/* ---------- filters ---------- */
function group(id,fn){
  document.getElementById(id).addEventListener('click',e=>{
    const b=e.target.closest('.chip');if(!b)return;
    [...e.currentTarget.children].forEach(c=>c.setAttribute('aria-pressed','false'));
    b.setAttribute('aria-pressed','true');fn(b);render();
    scrollTo({top:document.getElementById('stage').offsetTop,behavior:'smooth'});
  });
}
group('ftype',b=>fType=b.dataset.f);
group('ftier',b=>fTier=b.dataset.t);

/* ---------- takeover ---------- */
const ov=document.getElementById('ov'),stageimg=document.getElementById('stageimg'),tline=document.getElementById('timeline');
let cur=0,pos=0,liveOv=false,autoR=null;
function buildOv(i){
  const p=P[i],n=p.frames.length||NF;
  stageimg.innerHTML=Array.from({length:n},(_,f)=>
    '<div class="fr'+(f===0?' on':'')+'">'+frameHTML(p,f,n)+'</div>').join('');
  document.getElementById('ot').textContent=p.n;
  document.getElementById('osub').textContent=p.loc+' · '+p.type+' · '+p.year;
  const ok=p.actual<=p.promised;
  document.getElementById('ospecs').innerHTML=
   '<div><span>Scope</span><b>'+p.rooms+'</b></div>'+
   '<div><span>Area</span><b>'+p.area+'</b></div>'+
   '<div><span>Tier</span><b>'+p.tier+'</b></div>'+
   '<div><span>Value</span><b>'+p.value+'</b></div>'+
   '<div><span>Promised</span><b>'+p.promised+' days</b></div>'+
   '<div class="'+(ok?'ok':'')+'"><span>Delivered</span><b>'+p.actual+' days</b></div>';
  document.getElementById('ticks').innerHTML='<span>Day 1</span><span>Day '+Math.round(p.actual/2)+'</span><span>Handover</span>';
}
function paintOv(){
  const p=P[cur],frs=[...stageimg.children],n=frs.length;
  const f=Math.min(n-1,Math.floor(pos*n*0.999));
  frs.forEach((el,z)=>el.classList.toggle('on',z===f));
  document.getElementById('tlfill').style.width=(pos*100)+'%';
  document.getElementById('knob').style.left=(pos*100)+'%';document.getElementById('dayb').style.left=(pos*100)+'%';
  document.getElementById('dayb').textContent='Day '+Math.max(1,Math.round(pos*p.actual));
}
function autoTo(to,ms){
  cancelAnimationFrame(autoR);
  const from=pos,t0=performance.now();
  (function s(t){const k=Math.min(1,(t-t0)/ms),e=1-Math.pow(1-k,3);
    pos=from+(to-from)*e;paintOv();if(k<1)autoR=requestAnimationFrame(s)})(t0);
}
function openOv(i){
  cur=i;liveOv=true;pos=0;buildOv(i);paintOv();
  ov.classList.add('on');document.body.style.overflow='hidden';
  ov.setAttribute('aria-hidden','false');
  ov.classList.add('wipe');ov.classList.remove('rev');
  setTimeout(()=>{ov.classList.remove('wipe');ov.classList.add('rev');
    setTimeout(()=>autoTo(1,2400),320)},440);
}
function closeOv(){
  liveOv=false;cancelAnimationFrame(autoR);
  ov.classList.remove('rev');ov.classList.add('wipe');
  setTimeout(()=>{ov.classList.remove('on','wipe');document.body.style.overflow='';
    ov.setAttribute('aria-hidden','true')},440);
}
function swap(i){
  cur=(i+P.length)%P.length;ov.classList.remove('rev');
  setTimeout(()=>{buildOv(cur);pos=0;paintOv();ov.classList.add('rev');
    setTimeout(()=>autoTo(1,2200),230)},210);
}
document.getElementById('close').addEventListener('click',closeOv);
document.getElementById('prev').addEventListener('click',()=>swap(cur-1));
document.getElementById('next').addEventListener('click',()=>swap(cur+1));
addEventListener('keydown',e=>{
  if(!liveOv)return;
  if(e.key==='Escape')closeOv();
  if(e.key==='ArrowRight')swap(cur+1);
  if(e.key==='ArrowLeft')swap(cur-1);
});
let drag=false;
function at(e){const r=tline.getBoundingClientRect();
  pos=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));paintOv()}
tline.addEventListener('pointerdown',e=>{cancelAnimationFrame(autoR);drag=true;
  tline.setPointerCapture(e.pointerId);at(e)});
tline.addEventListener('pointermove',e=>{if(drag)at(e)});
tline.addEventListener('pointerup',()=>drag=false);
tline.addEventListener('pointercancel',()=>drag=false);

/* ---------- go ---------- */
render();onScroll();wave();
(function(){
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting)return;io.disconnect();
    [[document.getElementById('t1'),P.length,''],[document.getElementById('t2'),100,'%'],[document.getElementById('t3'),100,'%']].forEach(([el,to,suf])=>{
      const t0=performance.now();
      (function s(t){const k=Math.min(1,(t-t0)/900),e2=1-Math.pow(1-k,3);
        el.textContent=Math.round(to*e2)+suf;if(k<1)requestAnimationFrame(s)})(t0);
    });
  }),{threshold:.4});
  io.observe(document.querySelector('.trust'));
})();

  }, []);

  return (
    <>
      

<div className="stage" id="stage">
  <div className="stick">
    <div className="wrap">
      <div className="eyebrow"><span className="mono">Projects</span></div>
      <h2>Eight delivered. Every one photographed daily.</h2>
      <div className="trust">
        <div><b id="t1">8</b><span>Projects delivered</span></div>
        <div><b id="t2">100%</b><span>Met the 48-day promise</span></div>
        <div><b id="t3">100%</b><span>Designed by architects</span></div>
        <div><b>4.9</b><span>Google rating · 37 reviews</span></div>
      </div>
      <div className="bar">
        <div className="chips" id="ftype">
          <button className="chip" aria-pressed="true" data-f="all">All</button>
          <button className="chip" data-f="Apartment">Apartment</button>
          <button className="chip" data-f="Villa">Villa</button>
          <button className="chip" data-f="Modular">Modular</button>
          <button className="chip" data-f="Commercial">Commercial</button>
        </div>
        <div className="chips" id="ftier">
          <button className="chip" aria-pressed="true" data-t="all">Both tiers</button>
          <button className="chip" data-t="Gold">Gold</button>
          <button className="chip" data-t="Platinum">Platinum</button>
        </div>
      </div>
    </div>

    <div className="wallwrap" id="wallwrap">
      <svg className="wave" viewBox="0 0 1200 220" preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id="wg" x1="0" x2="1"><stop offset="0" stopColor="#F26829" stopOpacity=".0"/>
          <stop offset=".5" stopColor="#F26829" stopOpacity=".22"/>
          <stop offset="1" stopColor="#F26829" stopOpacity="0"/></linearGradient></defs>
        <path id="wv1" fill="none" stroke="url(#wg)" strokeWidth="1.6" d=""/>
        <path id="wv2" fill="none" stroke="url(#wg)" strokeWidth="1" d="" opacity=".6"/>
      </svg>
      <div id="wall"></div>
    </div>

    <div className="wrap foot">
      <span className="mono" id="counter">01 / 14</span>
      <div className="pbar"><i id="pfill"></i></div>
      <span className="mono">Scroll · left to right</span>
    </div>
  </div>
</div>

<div id="ov" aria-hidden="true">
  <div className="obody">
    <div className="stageimg" id="stageimg"></div>
    <div className="vgrad"></div>
    <div className="otop">
      <div><h3 id="ot"></h3><div className="mono" id="osub" style={{marginTop: '9px'}}></div></div>
      <button className="xbtn" id="close" aria-label="Close">
        <svg viewBox="0 0 100 100"><path d="M24 24L76 76M76 24L24 76" stroke="#fff" strokeWidth="14"/></svg>
      </button>
    </div>
    <div className="arrows l"><button id="prev" aria-label="Previous">←</button></div>
    <div className="arrows r"><button id="next" aria-label="Next">→</button></div>
    <div className="obotbar">
      <div className="timeline" id="timeline">
        <div className="tl"><i id="tlfill"></i></div>
        <div className="knob" id="knob"></div>
        <div className="dayb" id="dayb">Day 1</div>
        <div className="ticks" id="ticks"></div>
      </div>
      <div className="ospecs" id="ospecs"></div>
    </div>
  </div>
  <div className="wedge"></div><div className="wedge b"></div>
</div>


    </>
  );
}
