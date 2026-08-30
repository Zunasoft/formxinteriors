"use client";
import { useEffect } from "react";
import "./Testimonials.css";

export default function Testimonials() {
  useEffect(() => {
    const T = [
      { n: 'Sridhar & Kavya', loc: 'Kokapet', when: 'Mar 2026', wk: 11,
        q: "They gave us the measured drawing after the first visit and told us to take it anywhere we liked.",
        d: { Project: '3 BHK', Area: '1,650 sq ft', Tier: 'Platinum', Timeline: '11 weeks', Value: '₹18–22L' },
        spots: [[34, 44, 'Blum soft-close · 5 yr'], [57, 66, 'BWP ply carcass, 18mm'], [80, 32, 'Egger shutters, 2mm ABS edge']] },
      { n: 'Imran Q.', loc: 'Gachibowli', when: 'Jan 2026', wk: 8,
        q: "The Saturday photo update sounds like a small thing. It is not. We were in Dubai for eight of the eleven weeks.",
        d: { Project: '2 BHK', Area: '1,120 sq ft', Tier: 'Gold', Timeline: '8 weeks', Value: '₹9–11L' },
        spots: [[36, 46, 'Hettich India soft-close'], [62, 64, 'Greenply BWP, wet zones'], [78, 36, 'Merino laminate, 1mm PVC']] },
      { n: 'Lakshmi N.', loc: 'Jubilee Hills', when: 'Nov 2025', wk: 14,
        q: "Theirs was not the cheapest. It was the only quote that listed what the plywood actually was.",
        d: { Project: '4 BHK', Area: '2,400 sq ft', Tier: 'Platinum', Timeline: '14 weeks', Value: '₹34–39L' },
        spots: [[32, 42, 'Kesseböhmer internals'], [55, 68, 'Century BWP, 710 grade'], [83, 30, 'Fenix matte, fingerprint-proof']] },
      { n: 'Praveen R.', loc: 'Narsingi', when: 'Sep 2025', wk: 12,
        q: "Our architect had already drawn everything. They built it properly and did not try to redesign our house.",
        d: { Project: 'Villa', Area: '3,100 sq ft', Tier: 'Gold', Timeline: '12 weeks', Value: '₹26–30L' },
        spots: [[38, 48, 'Built to third-party drawings'], [60, 66, 'In-house carpentry team'], [80, 34, 'Site supervision, daily']] },
      { n: 'Anitha M.', loc: 'Banjara Hills', when: 'Aug 2025', wk: 5,
        q: "The reception wall gets photographed by everyone who walks in.",
        d: { Project: 'Office', Area: '240 sq ft wall', Tier: 'Fabrication', Timeline: '5 weeks', Value: '₹6–7L' },
        spots: [[40, 40, '320 CNC-cut aluminium fins'], [62, 58, 'Parametric model, in-house'], [82, 30, 'Powder-coat, 60 micron']] },
      { n: 'Ramesh K.', loc: 'Manikonda', when: 'Jun 2025', wk: 4,
        q: "Nine feet of galley kitchen and they still fit a breakfast counter. I did not think that was possible.",
        d: { Project: 'Kitchen only', Area: '190 sq ft', Tier: 'Platinum', Timeline: '4 weeks', Value: '₹5–6L' },
        spots: [[36, 46, 'Blum tandem box, soft-close'], [60, 60, 'Century BWP, 18mm'], [80, 34, 'Egger laminate, 1mm ABS']] },
      { n: 'Divya S.', loc: 'Tellapur', when: 'May 2025', wk: 16,
        q: "Five bedrooms, one crew, one timeline. Nothing got subcontracted out and forgotten.",
        d: { Project: '5 BHK', Area: '4,200 sq ft', Tier: 'Platinum', Timeline: '16 weeks', Value: '₹42–48L' },
        spots: [[34, 44, 'Kesseböhmer pull-outs'], [58, 66, 'Greenply BWP carcass'], [80, 32, 'Fenix matte shutters']] }
    ];
    const STAGE = [
      { at: 8, l: 'Bare shell' }, { at: 26, l: 'Flooring & paint' }, { at: 48, l: 'Carpentry' },
      { at: 70, l: 'Furniture' }, { at: 88, l: 'Styling & handover' }
    ];
    const $ = (id) => document.getElementById(id);
    const root = document.querySelector('.fx-testimonials');
    $('tstars').innerHTML = Array(5).fill(
      '<svg viewBox="0 0 24 24"><path d="M12 2l3 6.6 7 .7-5.2 4.8 1.5 7L12 17.6 5.7 21l1.5-7L2 9.3l7-.7z"/></svg>').join('');

    /* ---------- three lines, one reaction ---------- */
    const rowsEl = $('trows'), det = $('tdet');
    const RUNS = [...rowsEl.querySelectorAll('.run')];
    const CONF = [{ dir: -1, sp: .46 }, { dir: 1, sp: .30 }, { dir: -1, sp: .62 }];
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    function card(t, i) {
      return '<button class="item" type="button" data-i="' + i + '">' +
        '<span class="idx">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<span class="nm">' + t.n + '</span>' +
        '<span class="loc">' + t.loc + '</span>' +
        '<span class="go">Walk in →</span></button>';
    }
    RUNS.forEach((run, r) => {
      const rot = T.slice(r * 2 % T.length).concat(T.slice(0, r * 2 % T.length));
      const idx = rot.map((t) => T.indexOf(t));
      const html = rot.map((t, k) => card(t, idx[k])).join('');
      run.innerHTML = html + html + html;
      run.dataset.sp = CONF[r].sp; run.dataset.dir = CONF[r].dir;
    });

    const state = RUNS.map((run, r) => ({
      run, x: CONF[r].dir < 0 ? 0 : -run.scrollWidth / 3,
      third: 0, sp: CONF[r].sp, tgt: CONF[r].sp, dir: CONF[r].dir
    }));
    function measure() {
      state.forEach((s) => {
        s.third = s.run.scrollWidth / 3;
        if (s.third) s.x = ((s.x % s.third) + s.third) % s.third - s.third;
      });
    }
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    measure();

    if (!reduce) {
      (function tick() {
        state.forEach((s) => {
          s.sp += (s.tgt - s.sp) * .07;
          s.x += s.sp * s.dir;
          if (s.third) {
            if (s.x <= -s.third) s.x += s.third;
            if (s.x >= 0) s.x -= s.third;
          }
          s.run.style.transform = 'translate3d(' + s.x.toFixed(2) + 'px,0,0)';
        });
        requestAnimationFrame(tick);
      })();
    }

    /* ---------- hover on one name, everything answers ---------- */
    let active = null;
    const items = () => [...rowsEl.querySelectorAll('.item')];

    function fillCard(i) {
      const t = T[i];
      $('tcq').innerHTML = t.q.split(' ').map((w) => '<span class="w">' + w + '</span>').join(' ');
      [...$('tcq').querySelectorAll('.w')].forEach((w, n) => w.style.transitionDelay = (60 + n * 22) + 'ms');
      $('tcwho').textContent = t.n;
      $('tcmeta').textContent = t.loc + ' · handover ' + t.when;
      $('tcspecs').innerHTML = Object.entries(t.d).map(([k, v]) =>
        '<div><span>' + k + '</span><b>' + v + '</b></div>').join('');
    }

    function react(i) {
      if (i === active) return;
      active = i;
      rowsEl.classList.add('hot'); root.classList.add('hot');
      det.classList.remove('on');
      items().forEach((el) => el.classList.toggle('match', +el.dataset.i === i));
      state.forEach((s) => s.tgt = .05);
      fillCard(i);
      requestAnimationFrame(() => det.classList.add('on'));
    }
    function relax() {
      active = null;
      rowsEl.classList.remove('hot'); root.classList.remove('hot');
      det.classList.remove('on');
      items().forEach((el) => el.classList.remove('match'));
      state.forEach((s, r) => s.tgt = CONF[r].sp);
    }

    rowsEl.addEventListener('pointerover', (e) => {
      const it = e.target.closest('.item'); if (it) react(+it.dataset.i);
    });
    rowsEl.addEventListener('focusin', (e) => {
      const it = e.target.closest('.item'); if (it) react(+it.dataset.i);
    });
    rowsEl.addEventListener('pointerleave', relax);
    rowsEl.addEventListener('focusout', (e) => {
      if (!rowsEl.contains(e.relatedTarget)) relax();
    });
    rowsEl.addEventListener('click', (e) => {
      const it = e.target.closest('.item'); if (it) open(+it.dataset.i);
    });

    /* ---------- rooms ---------- */
    const NS = 'http://www.w3.org/2000/svg';
    function el(par, t, a) {
      const e = document.createElementNS(NS, t);
      for (const k in a) e.setAttribute(k, a[k]);
      par.appendChild(e); return e;
    }

    function bare(svg) {
      svg.innerHTML = '';
      el(svg, 'polygon', { points: '0,0 1200,0 820,220 380,220', fill: '#546C77' });
      el(svg, 'polygon', { points: '0,800 1200,800 820,560 380,560', fill: '#3A4E58' });
      el(svg, 'polygon', { points: '0,0 380,220 380,560 0,800', fill: '#3D525C' });
      el(svg, 'polygon', { points: '1200,0 820,220 820,560 1200,800', fill: '#3D525C' });
      el(svg, 'polygon', { points: '380,220 820,220 820,560 380,560', fill: '#48606B' });
      for (let i = 1; i < 8; i++) {
        const t = i / 8;
        el(svg, 'line', { x1: 1200 * t, y1: 800, x2: 380 + 440 * t, y2: 560, stroke: '#33454F', 'stroke-width': 2, opacity: .55 });
      }
      el(svg, 'rect', { x: 600, y: 280, width: 180, height: 200, fill: '#7E97A2' });
      el(svg, 'rect', { x: 596, y: 276, width: 190, height: 8, fill: '#3D525C' });
      el(svg, 'rect', { x: 430, y: 470, width: 22, height: 16, fill: '#2C3E48' });
      el(svg, 'path', { d: 'M452 486 q40 34 86 10', stroke: '#2C3E48', 'stroke-width': 3, fill: 'none' });
      el(svg, 'rect', { x: 880, y: 468, width: 96, height: 92, fill: '#33454F' });
      el(svg, 'rect', { x: 884, y: 462, width: 88, height: 8, fill: '#2C3E48' });
      for (let i = 0; i < 4; i++)
        el(svg, 'line', { x1: 150 + i * 16, y1: 800 - i * 12, x2: 236 + i * 16, y2: 556 + i * 5, stroke: '#445A64', 'stroke-width': 7 });
    }

    function finished(svg) {
      svg.innerHTML = '';
      const g1 = el(svg, 'g', { 'data-s': '1' }), g2 = el(svg, 'g', { 'data-s': '2' }),
        g3 = el(svg, 'g', { 'data-s': '3' }), g4 = el(svg, 'g', { 'data-s': '4' });
      el(g1, 'polygon', { points: '0,0 1200,0 820,220 380,220', fill: '#EFE9DF' });
      el(g1, 'polygon', { points: '0,800 1200,800 820,560 380,560', fill: '#D0AE84' });
      el(g1, 'polygon', { points: '0,0 380,220 380,560 0,800', fill: '#D6CCBD' });
      el(g1, 'polygon', { points: '1200,0 820,220 820,560 1200,800', fill: '#D6CCBD' });
      el(g1, 'polygon', { points: '380,220 820,220 820,560 380,560', fill: '#E4DCD0' });
      for (let i = 1; i < 8; i++) {
        const t = i / 8;
        el(g1, 'line', { x1: 1200 * t, y1: 800, x2: 380 + 440 * t, y2: 560, stroke: '#C09B6E', 'stroke-width': 2, opacity: .7 });
      }
      el(g1, 'rect', { x: 600, y: 280, width: 180, height: 200, fill: '#FFF4E2' });
      for (let i = 0; i < 14; i++) el(g1, 'rect', { x: 602, y: 284 + i * 14, width: 176, height: 5, fill: '#E8DDC9', opacity: .85 });
      el(g1, 'rect', { x: 596, y: 276, width: 190, height: 8, fill: '#CDBFA9' });
      el(g2, 'rect', { x: 396, y: 294, width: 16, height: 262, fill: '#CDBFA9' });
      el(g2, 'rect', { x: 404, y: 330, width: 6, height: 124, fill: '#22333B' });
      el(g2, 'rect', { x: 836, y: 246, width: 126, height: 16, fill: '#CDBFA9' });
      el(g2, 'rect', { x: 836, y: 380, width: 126, height: 16, fill: '#CDBFA9' });
      el(g2, 'rect', { x: 410, y: 236, width: 380, height: 6, fill: '#EFE9DF' });
      el(g2, 'rect', { x: 412, y: 242, width: 376, height: 5, fill: '#FFE6BC', opacity: .85 });
      el(g2, 'rect', { x: 1020, y: 300, width: 150, height: 260, fill: '#C6B49A' });
      for (let i = 0; i < 3; i++) el(g2, 'rect', { x: 1026, y: 308 + i * 86, width: 138, height: 78, fill: '#D8C8B0' });
      el(g3, 'ellipse', { cx: 660, cy: 692, rx: 342, ry: 86, fill: '#C8A97F', opacity: .92 });
      el(g3, 'polygon', { points: '430,640 900,640 880,702 450,702', fill: '#DED5C7' });
      el(g3, 'polygon', { points: '430,560 900,560 900,640 430,640', fill: '#E8E1D5' });
      el(g3, 'polygon', { points: '444,498 886,498 886,566 444,566', fill: '#D6CCBD' });
      el(g3, 'rect', { x: 560, y: 648, width: 200, height: 14, fill: '#B98F5E' });
      el(g3, 'rect', { x: 578, y: 662, width: 10, height: 36, fill: '#A57E4F' });
      el(g3, 'rect', { x: 732, y: 662, width: 10, height: 36, fill: '#A57E4F' });
      el(g3, 'rect', { x: 1004, y: 456, width: 8, height: 152, fill: '#B9BEC0' });
      el(g4, 'rect', { x: 520, y: 518, width: 68, height: 42, fill: '#F26829' });
      el(g4, 'rect', { x: 742, y: 518, width: 68, height: 42, fill: '#F26829' });
      el(g4, 'rect', { x: 606, y: 632, width: 46, height: 16, fill: '#22333B' });
      el(g4, 'rect', { x: 612, y: 626, width: 38, height: 8, fill: '#F26829' });
      el(g4, 'rect', { x: 852, y: 216, width: 24, height: 30, fill: '#F26829' });
      el(g4, 'rect', { x: 888, y: 222, width: 18, height: 24, fill: '#5E8F63' });
      el(g4, 'rect', { x: 868, y: 346, width: 20, height: 34, fill: '#5E8F63' });
      el(g4, 'rect', { x: 246, y: 296, width: 30, height: 40, fill: '#F26829' });
      el(g4, 'circle', { cx: 1008, cy: 428, r: 28, fill: '#FFE6BC' });
      el(g4, 'rect', { x: 1040, y: 600, width: 60, height: 70, fill: '#5E8F63' });
    }
    bare($('tbefore')); finished($('tafter'));
    const layers = [...$('tafter').querySelectorAll('g')];

    /* ---------- takeover ---------- */
    const over = $('tover'), scene = $('tscene'), after = $('tafter'), seam = $('tseam');
    let cur = 0, split = 0, openState = false, autoR = null;

    function paint() {
      after.style.clipPath = 'inset(0 ' + (100 - split) + '% 0 0)';
      seam.style.left = split + '%'; $('tgrip').style.left = split + '%';
      layers.forEach((g, n) => {
        const on = split >= STAGE[n + 1].at - 14;
        g.style.opacity = on ? 1 : 0;
      });
      let s = 0; for (let i = 0; i < STAGE.length; i++) if (split >= STAGE[i].at) s = i;
      const wk = Math.round((split / 100) * (T[cur].wk || 11));
      $('tgtag').textContent = 'Week ' + wk + ' · ' + STAGE[s].l;
      $('ttagL').style.opacity = split < 14 ? 0 : .7;
      $('ttagR').style.opacity = split > 86 ? 0 : .7;
      const show = split > 78;
      [...$('tspots').children].forEach((sp) => sp.classList.toggle('show', show));
    }
    function autoTo(to, ms) {
      cancelAnimationFrame(autoR);
      const from = split, t0 = performance.now();
      (function step(t) {
        const k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3);
        split = from + (to - from) * e; paint();
        if (k < 1) autoR = requestAnimationFrame(step);
      })(t0);
    }
    function fill(i) {
      const t = T[i];
      $('toquote').innerHTML = t.q.split(' ').map((w) => '<span class="w">' + w + '</span>').join(' ');
      [...$('toquote').querySelectorAll('.w')].forEach((w, n) => w.style.transitionDelay = (160 + n * 26) + 'ms');
      $('twho').textContent = t.n; $('twhometa').textContent = t.loc + ' · handover ' + t.when;
      $('tspecs').innerHTML = Object.entries(t.d).map(([k, v]) =>
        '<div><span>' + k + '</span><b>' + v + '</b></div>').join('');
      $('tspots').innerHTML = t.spots.map(([px, py, lbl]) =>
        '<span class="spot' + (px > 68 ? ' flip' : '') + '" style="left:' + px + '%;top:' + py + '%">' +
        '<i></i><em>' + lbl + '</em></span>').join('');
      [...$('tnav').children].forEach((b, n) => b.classList.toggle('on', n === i));
    }
    $('tnav').innerHTML = T.map((_, i) => '<button data-i="' + i + '" aria-label="Client ' + (i + 1) + '"></button>').join('');
    $('tnav').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) swap(+b.dataset.i); });

    function open(i) {
      cur = i; openState = true; split = 0; paint();
      over.classList.add('on'); document.body.style.overflow = 'hidden';
      over.setAttribute('aria-hidden', 'false');
      over.classList.add('wipe'); over.classList.remove('reveal');
      setTimeout(() => {
        fill(cur); over.classList.remove('wipe'); over.classList.add('reveal');
        setTimeout(() => autoTo(64, 1250), 380);
      }, 460);
    }
    function close() {
      openState = false; cancelAnimationFrame(autoR);
      over.classList.remove('reveal'); over.classList.add('wipe');
      setTimeout(() => {
        over.classList.remove('on', 'wipe'); document.body.style.overflow = '';
        over.setAttribute('aria-hidden', 'true');
      }, 460);
    }
    function swap(i) {
      if (i === cur) return;
      cur = (i + T.length) % T.length;
      over.classList.remove('reveal');
      setTimeout(() => {
        fill(cur); split = 0; paint(); over.classList.add('reveal');
        setTimeout(() => autoTo(64, 1100), 260);
      }, 230);
    }
    $('tclose').addEventListener('click', close);
    $('tprev').addEventListener('click', () => swap(cur - 1));
    $('tnext').addEventListener('click', () => swap(cur + 1));
    const onKeydown = (e) => {
      if (!openState) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight' && !e.shiftKey) swap(cur + 1);
      if (e.key === 'ArrowLeft' && !e.shiftKey) swap(cur - 1);
      if (e.shiftKey && e.key === 'ArrowRight') { split = Math.min(100, split + 6); paint(); }
      if (e.shiftKey && e.key === 'ArrowLeft') { split = Math.max(0, split - 6); paint(); }
    };
    window.addEventListener('keydown', onKeydown);

    let drag = false;
    function at(e) {
      const r = scene.getBoundingClientRect();
      split = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)); paint();
    }
    scene.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.spot')) return;
      cancelAnimationFrame(autoR); drag = true; scene.setPointerCapture(e.pointerId); at(e);
    });
    scene.addEventListener('pointermove', (e) => { if (drag) at(e); });
    scene.addEventListener('pointerup', () => drag = false);
    scene.addEventListener('pointercancel', () => drag = false);
    paint();
  }, []);

  return (
    <div className="fx-testimonials">
      <div className="wrap head">
        <div>
          <div className="eyebrow"><span className="mono">Clients</span></div>
          <h2>Fourteen homes, and the people who live in them.</h2>
        </div>
        <div className="rating">
          <div className="stars" id="tstars"></div>
          <b>4.9</b><span className="mono">37 Google reviews</span>
        </div>
      </div>

      <div className="rows" id="trows">
        <div className="mq"><div className="run" data-r="0"></div></div>
        <div className="mq"><div className="run" data-r="1"></div></div>
        <div className="mq"><div className="run" data-r="2"></div></div>
      </div>

      <div className="wrap det" id="tdet">
        <div className="idle">
          <span className="mono">Glide across any name — all three lines answer, and the job opens below.</span>
          <span className="mono">Click to walk the build, bare shell to handover</span>
        </div>
        <div className="card" id="tcard">
          <div className="cleft">
            <blockquote className="cq" id="tcq"></blockquote>
            <div className="cwho"><i></i><b id="tcwho"></b><span className="mono" id="tcmeta"></span></div>
          </div>
          <div className="cspecs" id="tcspecs"></div>
        </div>
      </div>

      <div className="wrap hintline">
        <span className="mono">Pick a name — then drag the seam to run their build from bare shell to handover.</span>
        <span className="mono">Every quote is attached to a real job</span>
      </div>

      <div id="tover" aria-hidden="true">
        <div className="sheetwrap">
          <div className="scene" id="tscene">
            <svg id="tbefore" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice"></svg>
            <svg id="tafter" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice"></svg>
            <div className="grad"></div>
            <div id="tspots"></div>
            <div className="seam" id="tseam"></div>
            <div className="grip" id="tgrip">
              <span className="knob"><svg viewBox="0 0 24 24"><path d="M9 6L4 12l5 6M15 6l5 6-5 6" fill="none" stroke="#fff" strokeWidth="2.2" /></svg></span>
              <span className="tag" id="tgtag">Week 0 · Bare shell</span>
            </div>
            <span className="tagL mono" id="ttagL">Day one</span>
            <span className="tagR mono" id="ttagR">Handover</span>
          </div>

          <div className="otop">
            <blockquote className="oquote" id="toquote"></blockquote>
            <button className="xbtn" id="tclose" aria-label="Close">
              <svg viewBox="0 0 100 100"><path d="M24 24L76 76M76 24L24 76" stroke="#fff" strokeWidth="14" /></svg>
            </button>
          </div>

          <div className="arrows l"><button id="tprev" aria-label="Previous">←</button></div>
          <div className="arrows r"><button id="tnext" aria-label="Next">→</button></div>

          <div className="obot">
            <div className="who"><i></i><b id="twho"></b><span className="mono" id="twhometa"></span></div>
            <div className="specs" id="tspecs"></div>
          </div>
          <div className="nav" id="tnav"></div>
        </div>
        <div className="wedge"></div><div className="wedge b"></div>
      </div>
    </div>
  );
}
