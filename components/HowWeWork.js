"use client";
import { useEffect, useRef } from "react";
import "./HowWeWork.css";

export default function HowWeWork() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const section = root.querySelector('.part-2') || root;
    const rail    = root.querySelector('#fx-rail');
    const endDot  = root.querySelector('#fx-end');
    const hint    = root.querySelector('#fx-hint');
    const phases  = [...rail.querySelectorAll('.fx-phase')];
    const marks   = [...rail.querySelectorAll('.fx-mark-set')];
    // Scope .fx-card to THIS component only to avoid clashing with Advantage cards
    const cards   = [...root.querySelectorAll('.fx-card')];
    const hits    = [...root.querySelectorAll('.fx-hit')];

    const canHover = window.matchMedia('(hover: hover)').matches;
    const reduce   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wide     = window.matchMedia('(min-width: 1001px)');

    let active = -1, locked = null, ticking = false;

    if (hint && !canHover) hint.textContent = 'TAP A PHASE TO SEE WHAT IT COVERS';

    function paint(i) {
      if (i === active) return;
      active = i;
      phases.forEach((p, n) => p.setAttribute('data-on', n === i ? '1' : '0'));
      marks.forEach((m, n)  => m.setAttribute('data-on', n === i ? '1' : '0'));
      cards.forEach((c, n)  => c.setAttribute('data-on', n === i ? '1' : '0'));
      hits.forEach((h, n)   => h.setAttribute('aria-expanded', n === i ? 'true' : 'false'));
      if (endDot) endDot.setAttribute('data-on', i === 2 ? '1' : '0');
      if (rail)   rail.style.setProperty('--fx-i', i < 0 ? 0 : i);
    }

    function fromScroll() {
      if (locked !== null) return;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (wide.matches) {
        const r = section.getBoundingClientRect();
        let t = (vh * 0.78 - r.top) / (r.height * 0.82);
        t = t < 0 ? 0 : (t > 1 ? 1 : t);
        paint(Math.min(2, Math.floor(t * 3)));
      } else {
        let best = 0, min = Infinity;
        cards.forEach((c, n) => {
          const b = c.getBoundingClientRect();
          const d = Math.abs((b.top + b.height / 2) - vh * 0.45);
          if (d < min) { min = d; best = n; }
        });
        paint(best);
      }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => { fromScroll(); ticking = false; });
    }

    function bind(el, i) {
      if (canHover) el.addEventListener('mouseenter', () => { locked = i; paint(i); });
      el.addEventListener('focus', () => { locked = i; paint(i); });
      el.addEventListener('click', (e) => {
        e.preventDefault();
        locked = (locked === i && !canHover) ? null : i;
        paint(locked === null ? active : i);
        if (locked === null) fromScroll();
      });
    }
    phases.forEach((p, i) => bind(p, i));
    hits.forEach((h, i)   => bind(h, i));

    if (canHover) {
      section.addEventListener('mouseleave', () => { locked = null; fromScroll(); });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    setTimeout(fromScroll, 100);
    if (reduce) paint(0);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div ref={rootRef} className="fx-process-container">
      <section className="fx-process part-1" id="offers">
        <div className="fx-wrap">
          <div className="fx-eyebrow-row">
            <span className="fx-eyebrow">HOW WE WORK</span>
            <span className="fx-eyebrow-rule"></span>
          </div>

          <div className="fx-intro-content">
            <h2 className="fx-headline">
              <span>Three phases.</span>
              <span>You make the decisions in the first one.</span>
            </h2>

            <p className="fx-sub">
              Design, Build and Deliver are not three services to pick from. They are the three phases
              every Form X project runs through &mdash; same team, same drawings, from measurement to handover.
            </p>
          </div>
        </div>
      </section>

      <section className="fx-process part-2" id="offers-cards">
        <div className="fx-wrap">
          {/* rail */}
          <div className="fx-rail" id="fx-rail" style={{ "--fx-i": 0 }}>
            <div className="fx-phases">
              <button className="fx-phase" type="button" data-i="0">DESIGN</button>
              <button className="fx-phase" type="button" data-i="1">BUILD</button>
              <button className="fx-phase" type="button" data-i="2">DELIVER</button>
            </div>
            <div className="fx-line">
              <div className="fx-bar"></div>
              <span className="fx-end" id="fx-end"></span>
            </div>
            <div className="fx-marks">
              <ul className="fx-mark-set" data-i="0"><li>MEASURE</li><li>3D VIEWS</li><li>DRAWINGS</li></ul>
              <ul className="fx-mark-set" data-i="1"><li>PROCUREMENT</li><li>FABRICATION</li><li>SITE</li></ul>
              <ul className="fx-mark-set" data-i="2"><li>INSTALL</li><li>SNAG</li><li>HANDOVER</li></ul>
            </div>
          </div>

          {/* cards */}
          <div className="fx-cards" id="fx-cards">
            <article className="fx-card" data-i="0">
              <button className="fx-hit" type="button" aria-expanded="false" aria-controls="fx-more-1" aria-label="Design phase, show what it covers"></button>
              <span className="fx-idx">01</span>
              <span className="fx-kicker">WHERE EVERY DECISION GETS MADE</span>
              <h3 className="fx-title">DESIGN</h3>
              <p className="fx-lead">Every choice happens here &mdash; before anything is ordered or cut.</p>
              <span className="fx-cue"><i></i>WHAT THIS COVERS</span>
              <div className="fx-more" id="fx-more-1"><div>
                <ul className="fx-list">
                  <li>Site measurement and structure check</li>
                  <li>Layouts, elevations and 3D views of every room</li>
                  <li>Material and finish selection</li>
                  <li>Working drawings for site and factory</li>
                  <li>Line-by-line scope, item by item</li>
                </ul>
                <span className="fx-split">YOU CHOOSE. WE DRAW AND REVISE.</span>
                <div className="fx-gate">
                  <span className="fx-gate-label">PHASE ENDS WHEN</span>
                  <p className="fx-gate-text">You sign off the drawings. Scope is locked from here.</p>
                </div>
              </div></div>
            </article>

            <article className="fx-card" data-i="1">
              <button className="fx-hit" type="button" aria-expanded="false" aria-controls="fx-more-2" aria-label="Build phase, show what it covers"></button>
              <span className="fx-idx">02</span>
              <span className="fx-kicker">WHERE YOU STOP DECIDING AND START GETTING UPDATES</span>
              <h3 className="fx-title">BUILD</h3>
              <p className="fx-lead">Frozen drawings go to the factory and the site on the same day.</p>
              <span className="fx-cue"><i></i>WHAT THIS COVERS</span>
              <div className="fx-more" id="fx-more-2"><div>
                <ul className="fx-list">
                  <li>Procurement against the approved scope</li>
                  <li>In-house carpentry and modular fabrication</li>
                  <li>Civil, electrical, plumbing and false ceiling on site</li>
                  <li>Quality check before anything leaves the factory</li>
                  <li>Weekly photo updates from site</li>
                </ul>
                <span className="fx-split">YOU APPROVE. WE PROCURE AND EXECUTE.</span>
                <div className="fx-gate">
                  <span className="fx-gate-label">PHASE ENDS WHEN</span>
                  <p className="fx-gate-text">Every element is fabricated, delivered and checked against the drawing.</p>
                </div>
              </div></div>
            </article>

            <article className="fx-card" data-i="2">
              <button className="fx-hit" type="button" aria-expanded="false" aria-controls="fx-more-3" aria-label="Deliver phase, show what it covers"></button>
              <span className="fx-idx">03</span>
              <span className="fx-kicker">THE PART MOST CONTRACTORS LEAVE YOU TO CHASE</span>
              <h3 className="fx-title">DELIVER</h3>
              <p className="fx-lead">Installation, snagging, cleaning, keys.</p>
              <span className="fx-cue"><i></i>WHAT THIS COVERS</span>
              <div className="fx-more" id="fx-more-3"><div>
                <ul className="fx-list">
                  <li>Installation and finishing</li>
                  <li>Snag list &mdash; ours first, then yours</li>
                  <li>Deep clean and styling before you walk in</li>
                  <li>Handover file: warranties, manuals, as-built drawings</li>
                  <li>10-year warranty, with a named person to call</li>
                </ul>
                <span className="fx-split">WE FINISH. YOU INSPECT. THEN KEYS.</span>
                <div className="fx-gate">
                  <span className="fx-gate-label">PHASE ENDS WHEN</span>
                  <p className="fx-gate-text">You walk in, walk through and take the keys. Nothing pending.</p>
                </div>
              </div></div>
            </article>
          </div>

          <p className="fx-hint" id="fx-hint">HOVER A PHASE TO SEE WHAT IT COVERS</p>

          <div className="fx-foot">
            <div>
              <span className="fx-foot-label">START TO KEYS</span>
              <p className="fx-foot-line">
                One team from measurement to handover, backed by a 10-year warranty.
                Already have drawings? We can join you at Build.
              </p>
            </div>
            <div className="fx-actions">
              <a className="fx-btn fx-btn--solid" href="#estimate">GET MY 3D IN 48 HOURS</a>
              <a className="fx-btn fx-btn--ghost" href="#contact">TALK TO THE ARCHITECT</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
