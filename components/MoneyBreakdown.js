"use client";
import { useEffect, useRef } from "react";
import "./MoneyBreakdown.css";

export default function MoneyBreakdown() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const $ = sel => root.querySelector('[data-mid="'+sel+'"]');

    /* ================== DATA ================== */
    var LINES = [
      ['Plywood & carcass',               28, 26, '#F26829',
       'BWP ply in wet zones, MR ply elsewhere, HDHMR shutters. This is the line most quotes cut to reach a low number, and the one that decides whether the wardrobe survives a decade.'],
      ['Surface & edge banding',           13, 18, '#C4501E',
       'Laminate, acrylic or PU on the face, and the edge band that holds it there. Edge banding is where a cheap job shows first, usually within two monsoons.'],
      ['Hardware',                         11, 15, '#B08B4F',
       'Hinges, channels, lift-ups, handles. Hardware is the only part of a wardrobe you touch every single day, and the only part with a moving-part failure rate.'],
      ['Counters, glass, mirror',           4,  6, '#8C8A5E',
       'Kitchen counter, dresser mirrors, glass shutters and back-painted panels. Small share, long lead time, and the item most often forgotten in a rushed quote.'],
      ['Carpentry & site labour',          20, 17, '#5E7681',
       'The people who cut, assemble, install and finish. Priced against the drawing, not against the day, which is why the number does not move when the job runs long.'],
      ['Transport, hoisting, protection',   5,  4, '#7C929B',
       'Factory to flat, up the lift or up the stairs, and the floor protection that keeps your new vitrified tile intact while we work over it.'],
      ['Design & drawings',                 4,  4, '#4A6270',
       'Measurement, layouts, elevations, 3D views and the working drawings the factory cuts from. Every one of them signed by an architect.'],
      ['Project management',                4,  4, '#3C5261',
       'One person owning your dates, your material approvals and your snag list. Not a shared queue and not a call centre.'],
      ['Studio & overheads',               11,  6, '#2C3E4A',
       'Rent, salaries, software, the factory and the warranty reserve. Every firm has this line. Most do not print it.']
    ];
    var BASE = { gold: 1979000, platinum: 2940000 };
    var MIN_OPEN = 15;
    var OPEN_X   = 1.35;
    /* ============================================ */

    var bar = $('bar'), legend = $('legend'), note = $('note');
    if (!bar || !legend || !note) return;

    var tier = 'gold', active = 0, grown = false;

    function pct(i) { return tier === 'gold' ? LINES[i][1] : LINES[i][2]; }
    function money(i) { return '\u20B9' + (BASE[tier] * pct(i) / 100 / 100000).toFixed(2) + 'L'; }
    function isDark(hex) {
      var c = hex.substring(1);
      return (parseInt(c.substr(0,2),16)*299 + parseInt(c.substr(2,2),16)*587
            + parseInt(c.substr(4,2),16)*114) / 1000 < 140;
    }

    bar.innerHTML = LINES.map(function (L, i) {
      return '<button class="seg' + (isDark(L[3]) ? ' dark' : '') + '" type="button" data-i="' + i +
             '" style="background:' + L[3] + '" aria-label="' + L[0] + '"><b>0%</b></button>';
    }).join('');
    legend.innerHTML = LINES.map(function (L, i) {
      return '<button class="lg" type="button" data-i="' + i + '">' +
             '<i style="background:' + L[3] + '"></i>' + L[0] + '</button>';
    }).join('');

    var segs = [].slice.call(bar.children), lgs = [].slice.call(legend.children);

    function countTo(el, to, dur) {
      var from = parseFloat(el.textContent) || 0, t0 = null;
      (function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))) + '%';
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    }

    function widths(openI) {
      if (!grown) return;
      var w = LINES.map(function (_, i) { return pct(i); });
      if (openI != null) {
        var open = Math.max(w[openI] * OPEN_X, MIN_OPEN);
        var share = (100 - open) / (100 - w[openI]);
        w = w.map(function (v, i) { return i === openI ? open : v * share; });
      }
      segs.forEach(function (s, i) {
        s.style.flexBasis = w[i] + '%';
        s.classList.toggle('wide', w[i] >= 6);
      });
    }

    function layout(animate) {
      segs.forEach(function (s, i) {
        var v = pct(i);
        if (!grown) { s.style.flexBasis = '0%'; s.querySelector('b').textContent = '0%'; return; }
        if (animate) countTo(s.querySelector('b'), v, 700);
        else s.querySelector('b').textContent = v + '%';
      });
      widths(null);
    }

    function fill(i) {
      note.classList.remove('in');
      setTimeout(function () {
        $('note-h').textContent = LINES[i][0] + ' \u00B7 ' + pct(i) + '% \u00B7 ' + money(i);
        $('note-p').textContent = LINES[i][4] + ' On the worked example above, that is ' + money(i) + '.';
        note.classList.add('in');
      }, 160);
    }

    function mark(i) {
      active = i;
      bar.classList.add('hot'); legend.classList.add('hot');
      segs.forEach(function (s, n) { s.classList.toggle('on', n === i); });
      lgs.forEach(function (l, n) { l.classList.toggle('on', n === i); });
      widths(i);
      fill(i);
    }
    function relax() {
      bar.classList.remove('hot'); legend.classList.remove('hot');
      segs.forEach(function (s, n) { s.classList.toggle('on', n === active); });
      lgs.forEach(function (l, n) { l.classList.toggle('on', n === active); });
      widths(null);
    }

    [bar, legend].forEach(function (host) {
      host.addEventListener('pointerover', function (e) {
        var b = e.target.closest('[data-i]'); if (b) mark(+b.dataset.i);
      });
      host.addEventListener('focusin', function (e) {
        var b = e.target.closest('[data-i]'); if (b) mark(+b.dataset.i);
      });
      host.addEventListener('pointerleave', relax);
      host.addEventListener('focusout', function (e) {
        if (!host.contains(e.relatedTarget)) relax();
      });
    });

    /* tier toggle */
    var tierEl = $('tier');
    if (tierEl) {
      tierEl.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b || tier === b.dataset.t) return;
        tier = b.dataset.t;
        tierEl.classList.toggle('p', tier === 'platinum');
        [].slice.call(tierEl.querySelectorAll('button')).forEach(function (o) {
          o.setAttribute('aria-pressed', o.dataset.t === tier ? 'true' : 'false');
        });
        bar.classList.remove('sweep'); void bar.offsetWidth; bar.classList.add('sweep');
        layout(true); fill(active);
      });
    }

    /* grow on scroll-in */
    function grow() {
      grown = true;
      segs.forEach(function (s, i) {
        setTimeout(function () {
          s.style.flexBasis = pct(i) + '%';
          s.classList.toggle('wide', pct(i) >= 6);
          countTo(s.querySelector('b'), pct(i), 650);
        }, i * 70);
      });
    }
    var obs = new IntersectionObserver(function (es, o) {
      es.forEach(function (e) { if (e.isIntersecting) { grow(); o.disconnect(); } });
    }, { threshold: .35 });
    obs.observe(bar);

    layout(false);
    mark(0); relax();

    return () => { obs.disconnect(); };
  }, []);

  return (
    <div className="fx-money" ref={rootRef}>
      <div className="eyebrow"><span className="mono">Where your money goes</span></div>
      <h2>Every rupee, accounted for.</h2>

      <div className="row">
        <p className="sub">Most quotes in this city are a single number. Here is ours, opened up &mdash;
           for a full-home turnkey job in Hyderabad.</p>
        <div className="tier" data-mid="tier" role="group" aria-label="Specification tier">
          <span className="pill" aria-hidden="true"></span>
          <button type="button" data-t="gold" aria-pressed="true">Gold</button>
          <button type="button" data-t="platinum" aria-pressed="false">Platinum</button>
        </div>
      </div>

      <div className="bar" data-mid="bar" role="group" aria-label="Cost breakdown"></div>
      <div className="legend" data-mid="legend"></div>

      <div className="note in" data-mid="note">
        <p className="note-h fade" data-mid="note-h"></p>
        <p className="fade" data-mid="note-p"></p>
      </div>
    </div>
  );
}
