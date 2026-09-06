"use client";
import { useEffect, useRef } from 'react';
import './Advantage.css';

export default function Advantage() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // We scope queries to the component root
    const q = (sel) => root.querySelector(sel);
    const qAll = (sel) => [...root.querySelectorAll(sel)];

    
/* ---- keep three squares and the CTA inside one screen ---- */
(function () {
  var cards = q('.fx-cards'), GAP = 12;
  function fit() {
    if (window.innerWidth <= 900) { root.style.removeProperty('--card'); return; }
    root.style.removeProperty('--card');
    var h = cards.clientHeight, w = cards.clientWidth;
    var size = Math.floor(Math.min(h, (w - GAP * 2) / 3));
    root.style.setProperty('--card', size + 'px');
  }
  window.addEventListener("resize", fit);
  window.addEventListener("orientationchange", fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  fit();
  requestAnimationFrame(fit);
})();

/* ---------- build the 3D plan ---------- */
(function () {
  var WALL_H = 30;
  /* walls: [x, y, length, 'x'|'y'] — gaps left where the doors are */
  var WALLS = [
    [12,12,296,'x'], [12,208,296,'x'], [12,12,196,'y'], [308,12,196,'y'],
    [188,12,56,'y'], [188,92,36,'y'],            /* partition, door gap between */
    [188,128,24,'x'], [252,128,56,'x']           /* kitchen wall, opening between */
  ];
  /* boxes: [x, y, w, d, h, round?] */
  var BOXES = [
    [28,44,18,72,14],  [66,66,34,26,7],   [172,52,10,58,13],
    [72,140,48,48,13,1],
    [90,120,11,11,9], [90,192,11,11,9], [52,158,11,11,9], [128,158,11,11,9],
    [210,26,66,78,11], [288,26,14,78,32],
    [196,140,106,12,17], [196,152,12,46,17]
  ];

  var model = q("#model");
  if (!model) return;
  var html = '', d = 0;

  WALLS.forEach(function (w, i) {
    var t = w[3] === 'x'
      ? 'rotateX(-90deg) scaleY(var(--g,0))'
      : 'rotateZ(90deg) rotateX(-90deg) scaleY(var(--g,0))';
    html += '<i class="wall" style="left:' + w[0] + 'px;top:' + w[1] + 'px;width:' + w[2] +
            'px;height:' + WALL_H + 'px;transform:' + t +
            ';transition-delay:' + (1.45 + i * .07).toFixed(2) + 's"></i>';
  });

  BOXES.forEach(function (b, i) {
    var x = b[0], y = b[1], w = b[2], dp = b[3], h = b[4], r = b[5] ? ' round' : '';
    var del = (2.1 + i * .08).toFixed(2) + 's';
    /* top */
    html += '<i class="face top' + r + '" style="left:' + x + 'px;top:' + y + 'px;width:' + w +
            'px;height:' + dp + 'px;transform:translateZ(var(--z' + i + ',0px));transition-delay:' + del + '"></i>';
    if (!b[5]) {
      /* right side */
      html += '<i class="face side" style="left:' + (x + w) + 'px;top:' + y + 'px;width:' + dp +
              'px;height:' + h + 'px;transform:rotateZ(90deg) rotateX(-90deg) scaleY(var(--g,0));transition-delay:' + del + '"></i>';
      /* front side */
      html += '<i class="face side" style="left:' + x + 'px;top:' + (y + dp) + 'px;width:' + w +
              'px;height:' + h + 'px;transform:rotateX(-90deg) scaleY(var(--g,0));transition-delay:' + del + '"></i>';
    }
  });
  model.innerHTML = html;

  /* raise the tops to their height once the card is live */
  var card = model.closest('.fx-card');
  var tops = [].slice.call(model.querySelectorAll('.face.top'));
  function raise(on) {
    tops.forEach(function (el, i) {
      el.style.transform = 'translateZ(' + (on ? BOXES[i][4] : 0) + 'px)';
    });
    model.style.setProperty('--g', on ? 1 : 0);
    [].slice.call(model.querySelectorAll('.wall')).forEach(function (el) {
      el.style.setProperty('--g', on ? 1 : 0);
    });
    model.querySelectorAll('.face.side').forEach(function (el) {
      el.style.setProperty('--g', on ? 1 : 0);
    });
  }
  raise(false);

  /* fit the model to the card, and let the cursor tilt it */
  var iso = q("#iso"), world = q("#world");
  function fitIso() {
    var r = iso.getBoundingClientRect();
    if (!r.width) return;
    world.style.setProperty('--s', Math.min(r.width / 344, r.height / 300).toFixed(3));
  }
  window.addEventListener("resize", fitIso);
  requestAnimationFrame(fitIso);

  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      world.style.setProperty('--dz', (((e.clientX - r.left) / r.width - .5) * 14).toFixed(1) + 'deg');
      world.style.setProperty('--dx', (((e.clientY - r.top) / r.height - .5) * -9).toFixed(1) + 'deg');
    });
    card.addEventListener('pointerleave', function () {
      world.style.setProperty('--dz', '0deg'); world.style.setProperty('--dx', '0deg');
    });
  }

  new IntersectionObserver(function (es, o) {
    es.forEach(function (e) { if (e.isIntersecting) { fitIso(); raise(true); o.disconnect(); } });
  }, { threshold: .3 }).observe(card);

  card.addEventListener('mouseenter', function () { raise(true); });
})();

(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cards  = [].slice.call(qAll('[data-anim]'));
  var track  = q("#fx-track");
  var flash  = q("#fx-flash");
  var count  = q("#fx-count");
  var days   = [].slice.call(qAll('.fx-day'));
  var timer  = null;

  function frame(i) {
    track.style.setProperty('--i', i);
    days.forEach(function (b) { b.setAttribute('aria-current', +b.dataset.s === i ? 'true' : 'false'); });
    count.textContent = days[i].dataset.d + ' / 48';
    flash.classList.remove('go');
    void flash.offsetWidth;                       // restart the shutter flash
    flash.classList.add('go');
  }

  function runReel() {
    clearInterval(timer);
    var i = 0; frame(0);
    timer = setInterval(function () {
      i++; frame(i);
      if (i >= 3) clearInterval(timer);           // rests on day 48, never loops
    }, 1000);
  }

  days.forEach(function (b) {
    b.addEventListener('click', function () { clearInterval(timer); frame(+b.dataset.s); });
  });

  function countUp(el) {
    var target = +el.dataset.count, start = null, dur = 1200;
    (function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }

  function play(card) {
    card.classList.remove('is-on');
    void card.offsetWidth;                        // replay the drafting sequence
    card.classList.add('is-on');
    [].slice.call(card.querySelectorAll('[data-count]')).forEach(function (n, i) {
      n.textContent = '0';
      setTimeout(function () { countUp(n); }, i * 180);
    });
    if (card.contains(track)) runReel();
  }

  if (reduce) {
    cards.forEach(function (c) {
      c.classList.add('is-on');
      [].slice.call(c.querySelectorAll('[data-count]')).forEach(function (n) { n.textContent = n.dataset.count; });
    });
    frame(3);
    return;
  }

  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { play(e.target); io.unobserve(e.target); } });
  }, { threshold: .3 });

  cards.forEach(function (c) {
    io.observe(c);
    var t = null;
    c.addEventListener('mouseenter', function () {
      clearTimeout(t); t = setTimeout(function () { play(c); }, 80);
    });
    c.addEventListener('focus', function () { play(c); });
  });
})();


  }, []);

  return (
    <div ref={rootRef} className="fx-advantage-wrapper">
      
<section className="fx-why" aria-labelledby="why-h2">
  <div className="fx-wrap">

    <div className="fx-head">
    <div className="fx-top"><span className="fx-eyebrow">WHY FORM X</span><span className="fx-rule"></span></div>
    <h2 className="fx-h2" id="why-h2"><span>Three promises.</span><span>Nothing <em>else</em> to read.</span></h2>
    </div>

    <div className="fx-cards">

      {/**/}
      <article className="fx-card" data-anim tabIndex="0">
        <div className="fx-tagrow"><span className="fx-num">01</span><span className="fx-kick">ARCHITECT-LED</span></div>
        <h3 className="fx-title">100% designed<br />by architects.</h3>
        <p className="fx-line">Walls, services and every piece of furniture planned before anything is cut.</p>

        <div className="fx-vis">
          <div className="iso" id="iso"><div className="sway"><div className="world" id="world"><div className="floor"><svg className="fx-plan" viewBox="0 0 320 232" aria-hidden={true}>
            <g className="grid">
              <line x1="12" y1="52" x2="308" y2="52"/><line x1="12" y1="92" x2="308" y2="92"/>
              <line x1="12" y1="132" x2="308" y2="132"/><line x1="12" y1="172" x2="308" y2="172"/>
              <line x1="52" y1="12" x2="52" y2="208"/><line x1="112" y1="12" x2="112" y2="208"/>
              <line x1="172" y1="12" x2="172" y2="208"/><line x1="232" y1="12" x2="232" y2="208"/>
              <line x1="272" y1="12" x2="272" y2="208"/>
            </g>

            <rect className="wall w1" x="12" y="12" width="296" height="196" style={{"--len":"990"}}/>
            <line className="wall w2" x1="188" y1="12" x2="188" y2="128" style={{"--len":"116"}}/>
            <line className="wall w3" x1="188" y1="128" x2="308" y2="128" style={{"--len":"120"}}/>
            <path className="wall w4" d="M188 92 A24 24 0 0 1 164 68" style={{"--len":"38"}}/>
            <path className="wall w4" d="M232 128 A20 20 0 0 0 212 148" style={{"--len":"32"}}/>

            <circle className="fx-pen" r="3.2" fill="#F26829"/>

            <g className="fur f1">
              <rect className="fill" x="28" y="44" width="18" height="72"/>
              <rect x="28" y="44" width="18" height="72"/><line x1="46" y1="52" x2="46" y2="108"/>
            </g>
            <g className="fur f2"><rect x="66" y="66" width="34" height="26"/></g>
            <g className="fur f3">
              <rect className="fill" x="172" y="52" width="10" height="58"/>
              <rect x="172" y="52" width="10" height="58"/>
            </g>
            <g className="fur f4">
              <circle cx="96" cy="164" r="24"/>
              <circle cx="96" cy="130" r="6"/><circle cx="96" cy="198" r="6"/>
              <circle cx="62" cy="164" r="6"/><circle cx="130" cy="164" r="6"/>
            </g>
            <g className="fur f5">
              <rect className="fill" x="210" y="26" width="66" height="78"/>
              <rect x="210" y="26" width="66" height="78"/>
              <line x1="210" y1="44" x2="276" y2="44"/>
              <rect x="288" y="26" width="14" height="78"/>
            </g>
            <g className="fur f6">
              <rect className="fill" x="196" y="140" width="106" height="12"/>
              <rect x="196" y="140" width="106" height="12"/>
              <rect x="196" y="140" width="12" height="58"/>
              <circle cx="248" cy="146" r="4"/>
            </g>

            <g fill="none">
              <g className="fx-cross c1"><line x1="27" y1="80" x2="47" y2="80"/><line x1="37" y1="70" x2="37" y2="90"/></g>
              <g className="fx-cross c2"><line x1="73" y1="79" x2="93" y2="79"/><line x1="83" y1="69" x2="83" y2="89"/></g>
              <g className="fx-cross c3"><line x1="167" y1="81" x2="187" y2="81"/><line x1="177" y1="71" x2="177" y2="91"/></g>
              <g className="fx-cross c4"><line x1="86" y1="164" x2="106" y2="164"/><line x1="96" y1="154" x2="96" y2="174"/></g>
              <g className="fx-cross c5"><line x1="233" y1="65" x2="253" y2="65"/><line x1="243" y1="55" x2="243" y2="75"/></g>
              <g className="fx-cross c6"><line x1="239" y1="146" x2="259" y2="146"/><line x1="249" y1="136" x2="249" y2="156"/></g>
            </g>

            <g className="dim" style={{"--len":"300"}}>
              <line x1="12" y1="220" x2="188" y2="220"/>
              <line x1="12" y1="216" x2="12" y2="224"/><line x1="188" y1="216" x2="188" y2="224"/>
            </g>
            <text className="lab" x="78" y="228">4.8 M</text>
            <text className="lab" x="60" y="30">LIVING</text>
            <text className="lab" x="222" y="30">BEDROOM</text>
            <text className="lab" x="216" y="192">KITCHEN</text>

            <rect className="fx-sweep" x="10" y="12" width="6" height="196" fill="#F26829" opacity=".5"/>
          </svg></div><div className="model" id="model"></div></div></div></div>
        </div>
      </article>

      {/**/}
      <article className="fx-card" data-anim tabIndex="0">
        <div className="fx-tagrow"><span className="fx-num">02</span><span className="fx-kick">THE 48 &amp; 48</span></div>
        <h3 className="fx-title">Two numbers<br />we hold to.</h3>
        <p className="fx-line">One for how fast we answer. One for how fast we finish.</p>

        <div className="fx-vis">
          <div className="fx-48">
            <div>
              <span className="fx-48-n" data-count="48">0</span>
              <p className="fx-48-lab">HOURS TO ACT</p>
              <p className="fx-48-sub">Any service call, any time after handover.</p>
            </div>
            <span className="fx-amp">&amp;</span>
            <div>
              <span className="fx-48-n" data-count="48">0</span>
              <p className="fx-48-lab">DAYS TO HANDOVER</p>
              <p className="fx-48-sub">From drawing sign-off. Standard 3BHK &mdash; bigger scope adds days, agreed before we start.</p>
            </div>
          </div>
          <div className="fx-bar"><i></i></div>
          <span className="fx-chip">10-YEAR WARRANTY, ONE NAME TO CALL</span>
        </div>
      </article>

      {/**/}
      <article className="fx-card" data-anim tabIndex="0">
        <div className="fx-tagrow"><span className="fx-num">03</span><span className="fx-kick">EVERY SINGLE DAY</span></div>
        <h3 className="fx-title">A photo from<br />your site. Daily.</h3>
        <p className="fx-line">From day one to handover. You never have to ask, and never have to drive down to check.</p>

        <div className="fx-vis">
          <div className="fx-film">
            <div className="fx-perf"></div>

            <div className="fx-window">
              <span className="fx-gate">SITE REEL</span>
              <span className="fx-count" id="fx-count">01 / 48</span>

              <div className="fx-track" id="fx-track" style={{"--i":"0"}}>

                {/**/}
                <figure className="fx-cell">
                  <svg className="fx-stage" viewBox="0 0 240 192" aria-hidden={true}>
                    <rect className="s" x="16" y="22" width="208" height="130"/>
                    <line className="s" x1="16" y1="152" x2="224" y2="152"/>
                    <rect className="s" x="150" y="46" width="56" height="52"/><line className="s" x1="178" y1="46" x2="178" y2="98"/>
                    <line className="s dash" x1="40" y1="152" x2="40" y2="22"/>
                    <line className="s dash" x1="16" y1="132" x2="224" y2="132"/>
                  </svg>
                </figure>

                {/**/}
                <figure className="fx-cell">
                  <svg className="fx-stage" viewBox="0 0 240 192" aria-hidden={true}>
                    <rect className="s" x="16" y="22" width="208" height="130"/>
                    <line className="s" x1="16" y1="152" x2="224" y2="152"/>
                    <rect className="s" x="150" y="46" width="56" height="52"/><line className="s" x1="178" y1="46" x2="178" y2="98"/>
                    <line className="o" x1="16" y1="44" x2="224" y2="44"/>
                    <line className="o dash" x1="60" y1="22" x2="60" y2="44"/>
                    <circle className="o" cx="66" cy="56" r="5"/><circle className="o" cx="104" cy="56" r="5"/>
                    <line className="o" x1="66" y1="44" x2="66" y2="51"/><line className="o" x1="104" y1="44" x2="104" y2="51"/>
                    <rect className="o" x="34" y="112" width="14" height="10"/>
                    <line className="o dash" x1="41" y1="112" x2="41" y2="44"/>
                  </svg>
                </figure>

                {/**/}
                <figure className="fx-cell">
                  <svg className="fx-stage" viewBox="0 0 240 192" aria-hidden={true}>
                    <rect className="s" x="16" y="22" width="208" height="130"/>
                    <line className="s" x1="16" y1="152" x2="224" y2="152"/>
                    <rect className="s" x="150" y="46" width="56" height="52"/><line className="s" x1="178" y1="46" x2="178" y2="98"/>
                    <line className="o" x1="16" y1="44" x2="224" y2="44"/>
                    <rect className="of" x="30" y="58" width="44" height="94"/>
                    <rect className="o"  x="30" y="58" width="44" height="94"/><line className="o" x1="52" y1="58" x2="52" y2="152"/>
                    <rect className="o" x="90" y="118" width="46" height="34"/><line className="o" x1="90" y1="134" x2="136" y2="134"/>
                  </svg>
                </figure>

                {/**/}
                <figure className="fx-cell">
                  <svg className="fx-stage" viewBox="0 0 240 192" aria-hidden={true}>
                    <rect className="s" x="16" y="22" width="208" height="130"/>
                    <line className="s" x1="16" y1="152" x2="224" y2="152"/>
                    <rect className="s" x="150" y="46" width="56" height="52"/><line className="s" x1="178" y1="46" x2="178" y2="98"/>
                    <line className="o" x1="16" y1="44" x2="224" y2="44"/>
                    <rect className="of" x="30" y="58" width="44" height="94"/>
                    <rect className="o"  x="30" y="58" width="44" height="94"/><line className="o" x1="52" y1="58" x2="52" y2="152"/>
                    <rect className="o" x="90" y="118" width="46" height="34"/>
                    <path className="o" d="M94 152v-16h52v16"/><rect className="of" x="94" y="126" width="52" height="10"/>
                    <circle className="o" cx="196" cy="124" r="9"/><line className="o" x1="196" y1="133" x2="196" y2="152"/>
                    <line className="o" x1="118" y1="44" x2="118" y2="60"/><path className="o" d="M109 60h18l-4 9h-10z"/>
                  </svg>
                </figure>

              </div>

              <div className="fx-grain"></div>
              <div className="fx-flash" id="fx-flash"></div>
            </div>

            <div className="fx-perf"></div>
          </div>

          <div className="fx-days" role="group" aria-label="Site progress by day">
            <button className="fx-day" type="button" data-s="0" data-d="01" aria-current={true}>DAY 01</button>
            <button className="fx-day" type="button" data-s="1" data-d="14" aria-current={false}>DAY 14</button>
            <button className="fx-day" type="button" data-s="2" data-d="31" aria-current={false}>DAY 31</button>
            <button className="fx-day" type="button" data-s="3" data-d="48" aria-current={false}>DAY 48</button>
          </div>
        </div>
      </article>

    </div>

    <div className="fx-cta-row">
      <a className="fx-cta" href="#quote">See your number</a>
      <a className="fx-cta2" href="#contact">TALK TO THE ARCHITECT</a>
    </div>

  </div>
</section>

    </div>
  );
}
