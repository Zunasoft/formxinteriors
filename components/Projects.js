"use client";
import { useEffect, useRef } from "react";
import { PROJECTS as P, ROWS, NOTES as N, word, pad2, href } from "@/lib/projects";
import "./Projects.css";

/* The project wall: two rows of renders, studio notes and a consultation box.
   The section pins while the page scrolls, and the scroll slides both rows right to left
   (the lower row trails a little). Click a project and both rows line up while it opens
   across them, with its idea typing in and a link to its own page.
   Used on the home page (#work) and as the /projects/ page (page). */

const ITEMS = [];
ROWS.forEach((row, r) => row.forEach((key) => {
  const m = /^(p|n|cta)(\d*)(?::(\d))?$/.exec(key);
  if (!m) return;
  const kind = m[1], k = m[2] === "" ? -1 : +m[2], w = m[3] ? +m[3] : 1;
  if ((kind === "p" && !P[k]) || (kind === "n" && !N[k])) return;
  ITEMS.push({ kind, k, row: r, w });
}));

const SIZES = "(max-width: 720px) 50vw, 34vw", SIZES_OPEN = "(max-width: 720px) 100vw, 67vw";

function Outline() {
  return <svg className="pg-ol" aria-hidden="true"><rect pathLength="1" rx="11" ry="11" /></svg>;
}

function ProjectTile({ i }) {
  const p = P[i], im = p.images[p.lead];
  return (
    <article className="pg-tile pg-proj" data-i={i}>
      <img src={im.sm} srcSet={`${im.sm} 800w, ${im.src} 1600w`} sizes={SIZES} width={im.w} height={im.h}
        alt={im.alt} loading="lazy" decoding="async" draggable="false" />
      <div className="pg-veil" /><span className="pg-sweep" /><Outline />
      <div className="pg-cap">
        <span className="pg-n">{p.num}</span>
        <h3>{p.name}</h3>
        <span className="pg-m">{p.loc} · {p.cat}</span>
      </div>
      <span className="pg-plus" aria-hidden="true" />
      <button suppressHydrationWarning className="pg-hit" type="button" aria-expanded="false" aria-label={"Open " + p.name} data-cursor="open" />
      <div className="pg-det">
        <div className="pg-orow">
          <span className="pg-dc">{p.num} / {pad2(P.length)}</span>
          <button suppressHydrationWarning className="pg-x" type="button" aria-label={"Close " + p.name} />
        </div>
        <div className="pg-obot">
          <div className="pg-osub">{p.where} · {p.cat}</div>
          <p className="pg-oname">{p.name}</p>
          <p className="pg-idea">
            <span className="pg-gh">{p.idea}</span>
            <span className="pg-ty" aria-hidden="true"><span className="pg-tt" /><i className="pg-caret" /></span>
          </p>
          <div className="pg-facts">{p.space.split(" · ").map((s) => <i key={s}>{s}</i>)}</div>
          <a className="pg-more" href={href(p)}><span aria-hidden="true">→</span>See the details</a>
        </div>
      </div>
      <span className="pg-prog" aria-hidden="true" />
    </article>
  );
}

const ART = {
  // section through a room: ambient downlight, a pendant over the table (task, in orange), a wall washer (accent)
  light: (
    <svg className="pg-art" viewBox="0 0 200 86" preserveAspectRatio="xMinYMid meet" aria-hidden="true">
      <path className="lnf soft" d="M2 6H198M2 84H198M198 6V84" />
      <path className="cone" d="M38 9L6 84H74L46 9Z" /><rect x="36" y="6" width="12" height="3" fill="currentColor" />
      <path className="lnf soft" d="M112 6V27" /><path className="cone acc" d="M106 33L92 62H132L118 33Z" /><path className="accf" d="M104 33H120L116 27H108Z" />
      <path className="lnf" d="M86 62H138M91 62V84M133 62V84" />
      <path className="cone" d="M172 9L198 30V64L180 9Z" /><rect x="170" y="6" width="12" height="3" fill="currentColor" />
    </svg>
  ),
  // plan of a wardrobe: 600 deep carcass, 500 hanger, shutters in orange
  robe: (
    <svg className="pg-art" viewBox="0 0 200 86" preserveAspectRatio="xMinYMid meet" aria-hidden="true">
      <path className="lnf soft" d="M14 12V72M10 12H18M10 72H18" /><text transform="translate(8 42) rotate(-90)" textAnchor="middle">600</text>
      <rect className="lnf" x="26" y="12" width="150" height="60" />
      <path className="lnf soft" d="M30 42H172" strokeDasharray="2 3" />
      <path className="lnf" d="M44 17V67M58 17V67M72 17V67M86 17V67M100 17V67M114 17V67M128 17V67" />
      <path className="lnf acc" d="M26 72H176" strokeWidth="2.5" />
      <path className="lnf soft" d="M188 17V67M184 17H192M184 67H192" /><text transform="translate(198 42) rotate(-90)" textAnchor="middle">500</text>
    </svg>
  ),
};

function NoteTile({ k }) {
  const d = N[k];
  return (
    <article className={"pg-tile pg-note n-" + d.kind}>
      <Outline />
      <div className="pg-nin">
        <span className="pg-nl">{d.label}</span>
        {d.art && ART[d.art]}
        {d.fig && <div className="pg-fig">{d.fig[0]}<em>{d.fig[1]}</em>{d.fig[2]}</div>}
        <div className="pg-nb">
          {d.title && <h3>{d.title}</h3>}
          {d.spec && <dl className="pg-spec">{d.spec.map(([t, v]) => <div key={t}><dt>{t}</dt><dd>{v}</dd></div>)}</dl>}
          {d.body && <p>{d.body}</p>}
        </div>
      </div>
    </article>
  );
}

function CtaTile({ book }) {
  return (
    <a className="pg-tile pg-ctile" href={book} data-cursor="book">
      <Outline />
      <span className="pg-in">
        <span className="pg-k">Your project</span>
        <strong>Yours could be project <em>{word(P.length + 1)}</em>.</strong>
        <span className="pg-cb">
          <span className="pg-go">Book a free site visit <span aria-hidden="true">→</span></span>
          <span className="pg-note2">No obligation · we reply within 2 working hours</span>
        </span>
      </span>
    </a>
  );
}

export default function Projects({ page = false }) {
  const root = useRef(null);
  const base = page ? "/" : "";
  const wn = word(P.length), Wn = wn.charAt(0).toUpperCase() + wn.slice(1);
  const Heading = page ? "h1" : "h2";

  useEffect(() => {
    const sec = root.current;
    const q = (s) => sec.querySelector(s);
    const stage = q(".pg-stage"), stick = q(".pg-stick"), rail = q(".pg-rail"), track = q(".pg-track");
    const rangeEl = q(".pg-range"), th = [...sec.querySelectorAll(".pg-line i")];
    const n = P.length;
    const mq = (s) => window.matchMedia(s).matches;
    const reduce = mq("(prefers-reduced-motion: reduce)");
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const off = [];
    const on = (t, e, f, o) => { t.addEventListener(e, f, o); off.push(() => t.removeEventListener(e, f, o)); };

    const items = [...track.children].map((el, i) => ({
      ...ITEMS[i], el, rect: el.querySelector(".pg-ol rect"), img: el.querySelector("img"),
      hit: el.querySelector(".pg-hit"), tt: el.querySelector(".pg-tt"), o: 0, pd: 0, pl: 0,
    }));
    const rowItems = [[], []], projItem = [];
    items.forEach((it, i) => { rowItems[it.row].push(i); if (it.kind === "p") projItem[it.k] = i; });

    // ---------- layout ----------
    const basePos = [];
    rowItems.forEach((list, r) => { let c = 0; list.forEach((i) => { basePos[i] = { c, r, w: items[i].w, h: 1 }; c += items[i].w; }); });

    // an open project takes two columns on both rows; every other box stays on its row, keeps its size and takes the first free place
    function pack(oi, A) {
      if (oi < 0) return basePos.slice();
      const pos = [], occ = [{}, {}];
      const free = (r, c, w) => { for (let a = 0; a < w; a++) if (occ[r][c + a]) return false; return true; };
      const put = (i, r, c, w, h) => { for (let a = 0; a < w; a++) for (let b = 0; b < h; b++) occ[r + b][c + a] = 1; pos[i] = { c, r, w, h }; };
      put(oi, 0, A, 2, 2);
      rowItems.forEach((list, r) => list.forEach((i) => {
        if (i === oi) return;
        for (let c = 0; c < 999; c++) if (free(r, c, items[i].w)) { put(i, r, c, items[i].w, 1); return; }
      }));
      return pos;
    }
    const rowEnd = (pos, r) => pos.reduce((e, p) => (p.r === r || (p.h === 2 && r === 1)) ? Math.max(e, p.c + p.w) : e, 0);

    let W = 0, H = 0, g = 12, X = 1, Y = 1, vis = 3, vw = 0, pos = basePos.slice();
    const maxS = [0, 0], maxB = [0, 0], T = [0, 0], S = [0, 0], V = [0, 0];
    let openI = -1, openedAt = 0, openP = 0, filter = "all", len = 0;

    function layout() {
      const oi = openI >= 0 ? projItem[openI] : -1;
      let A = 0;
      if (oi >= 0) {
        const minC = Math.ceil(Math.max(0, T[0]) / X - 0.02);
        A = Math.max(0, clamp(basePos[oi].c, minC, minC + vis - 2));
      }
      pos = pack(oi, A);
      items.forEach((it, i) => {
        const p = pos[i], w = p.w * X - g, h = p.h * Y - g;
        it.el.style.width = w + "px"; it.el.style.height = h + "px";
        it.el.style.transform = "translate3d(" + (p.c * X) + "px," + (p.r * Y) + "px,0)";
        it.rect.setAttribute("x", .75); it.rect.setAttribute("y", .75);
        it.rect.setAttribute("width", Math.max(0, w - 1.5)); it.rect.setAttribute("height", Math.max(0, h - 1.5));
        if (it.kind === "p") {
          const o = it.k === openI;
          it.el.classList.toggle("open", o);
          it.hit.setAttribute("aria-expanded", o ? "true" : "false");
          it.hit.setAttribute("aria-label", (o ? "Close " : "Open ") + P[it.k].name);
          it.hit.dataset.cursor = o ? "close" : "open";
          if (o) it.img.sizes = SIZES_OPEN;
        }
      });
      maxS[0] = Math.max(0, rowEnd(pos, 0) * X - g - vw);
      maxS[1] = Math.max(0, rowEnd(pos, 1) * X - g - vw);
      applyDim();
    }

    // the page scroll that drives the wall: progress 0 → 1 across the pinned stage
    function progress() {
      const total = stage.offsetHeight - stick.offsetHeight;
      return total > 0 ? clamp(-stage.getBoundingClientRect().top / total, 0, 1) : 0;
    }
    function scrollToProgress(p) {
      const total = stage.offsetHeight - stick.offsetHeight;
      window.scrollTo({ top: stage.getBoundingClientRect().top + scrollY + p * total, behavior: reduce ? "auto" : "smooth" });
    }

    function measure() {
      rail.classList.add("nt");
      const rr = rail.getBoundingClientRect();
      W = rr.width; H = rr.height - 16;
      const pad = parseFloat(getComputedStyle(track).left) || 16;
      g = W < 640 ? 8 : 12;
      vis = W < 720 ? 2 : 3;
      X = (W - 2 * pad + g) / vis; Y = (H + g) / 2; vw = W - 2 * pad;
      maxB[0] = Math.max(0, rowEnd(basePos, 0) * X - g - vw);
      maxB[1] = Math.max(0, rowEnd(basePos, 1) * X - g - vw);
      // one pixel of page scroll moves the wall about one pixel
      len = Math.round(Math.max(maxB[0], maxB[1]) * 1.1);
      stage.style.height = (stick.offsetHeight + len) + "px";
      layout();
      if (openI < 0) follow();
      for (let r = 0; r < 2; r++) { S[r] = T[r]; V[r] = 0; }
      requestAnimationFrame(() => requestAnimationFrame(() => rail.classList.remove("nt")));
    }
    function follow() { const p = progress(); T[0] = p * maxB[0]; T[1] = p * maxB[1]; }

    // ---------- open / close ----------
    let typer = 0;
    function setOpen(i) {
      if (i === openI) return;
      openI = i; openedAt = performance.now(); openP = progress();
      layout();
      items.forEach((it) => { if (it.kind === "p") { it.el.classList.remove("typed"); it.tt.textContent = ""; } });
      if (i < 0) { follow(); return; }
      const p = pos[projItem[i]], x0 = p.c * X, x1 = x0 + p.w * X - g;
      let t = T[0];
      if (x1 > t + vw) t = x1 - vw;
      if (x0 < t) t = x0;
      T[0] = T[1] = clamp(t, 0, Math.max(maxS[0], maxS[1]));
      typeIdea(i);
    }
    // the project's idea types in once the tile has grown
    function typeIdea(i) {
      const it = items[projItem[i]], full = P[i].idea, t0 = performance.now() + (reduce ? 0 : 560);
      let k = -1;
      cancelAnimationFrame(typer);
      if (reduce) { it.tt.textContent = full; it.el.classList.add("typed"); return; }
      (function step(now) {
        if (openI !== i) return;
        const want = now < t0 ? 0 : Math.min(full.length, Math.floor((now - t0) / 16));
        if (want !== k) { k = want; it.tt.textContent = full.slice(0, k); }
        if (k < full.length) typer = requestAnimationFrame(step); else it.el.classList.add("typed");
      })(performance.now());
    }

    // ---------- type chips: light up one kind of project ----------
    const chips = [...sec.querySelectorAll(".pg-chip")];
    function applyDim() {
      items.forEach((it) => {
        const lit = filter === "all" || (it.kind === "p" && (P[it.k].cat === filter || it.k === openI));
        it.el.classList.toggle("dim", !lit);
      });
    }
    function setFilter(f) {
      filter = f;
      chips.forEach((c) => { const o = c.dataset.f === f; c.classList.toggle("on", o); c.setAttribute("aria-pressed", o ? "true" : "false"); });
      if (openI >= 0 && f !== "all" && P[openI].cat !== f) setOpen(-1);
      applyDim();
      let first = -1;
      if (f !== "all") P.forEach((p, i) => { const it = projItem[i]; if (it !== undefined && p.cat === f && (first < 0 || basePos[it].c < basePos[first].c)) first = it; });
      const b = first < 0 ? null : basePos[first];
      scrollToProgress(b ? clamp((b.c * X) / (maxB[b.r] || 1), 0, 1) : progress());
    }
    chips.forEach((c) => on(c, "click", () => setFilter(c.dataset.f)));

    // ---------- motion ----------
    let raf = 0, visible = false;
    function frame() {
      raf = 0;
      for (let r = 0; r < 2; r++) {
        if (reduce) { S[r] = T[r]; V[r] = 0; continue; }
        // the lower row runs on a softer spring, so it trails the top one
        const k = r ? 0.07 : 0.11;
        V[r] += (T[r] - S[r]) * k; V[r] *= 0.64; S[r] += V[r];
        if (Math.abs(T[r] - S[r]) < 0.05 && Math.abs(V[r]) < 0.05) { S[r] = T[r]; V[r] = 0; }
      }
      track.style.transform = "translate3d(" + (-S[0]).toFixed(2) + "px,0,0)";
      const shift = S[0] - S[1];
      let lo = n, hi = -1;
      for (let i = 0; i < items.length; i++) {
        const it = items[i], p = pos[i], lower = p.r === 1 && p.h === 1, o = lower ? shift : 0, sr = lower ? S[1] : S[0];
        if (it.o !== o) { it.el.style.translate = o.toFixed(2) + "px 0"; it.o = o; }
        const w = p.w * X - g, x0 = p.c * X - sr;
        if (it.kind === "p") {
          // the render drifts inside its frame as the box crosses the screen
          const lim = Math.min(20, w * 0.035), tgt = (it.k === openI || reduce) ? 0 : clamp((vw / 2 - (x0 + w / 2)) * 0.035, -lim, lim);
          it.pd += (tgt - it.pd) * 0.2;
          if (Math.abs(it.pd - it.pl) > 0.05) { it.img.style.translate = it.pd.toFixed(2) + "px 0"; it.pl = it.pd; }
          if (x0 + w > 4 && x0 < vw - 4) { lo = Math.min(lo, it.k); hi = Math.max(hi, it.k); }
        }
      }
      if (hi >= 0) {
        const txt = (lo === hi ? pad2(lo + 1) : pad2(lo + 1) + "–" + pad2(hi + 1)) + " / " + pad2(n);
        if (rangeEl.textContent !== txt) rangeEl.textContent = txt;
      }
      for (let r = 0; r < 2; r++) {
        const total = maxS[r] + vw;
        th[r].style.left = (clamp(S[r] / total, 0, 1 - vw / total) * 100).toFixed(3) + "%";
        th[r].style.width = (vw / total * 100).toFixed(3) + "%";
      }
      if (visible) raf = requestAnimationFrame(frame);
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
      if (visible) boot();
    });
    io.observe(sec);
    off.push(() => { io.disconnect(); cancelAnimationFrame(raf); cancelAnimationFrame(typer); });

    on(window, "scroll", () => {
      if (openI >= 0) {
        // a real scroll (not the jitter of the click) closes the open project
        if (performance.now() - openedAt < 450 || Math.abs(progress() - openP) * len < 60) return;
        setOpen(-1);
      }
      follow();
    }, { passive: true });

    // a click opens or closes a project
    on(track, "click", (e) => {
      const b = e.target.closest(".pg-hit, .pg-x");
      if (!b) return;
      const i = +b.closest(".pg-tile").dataset.i;
      setOpen(i === openI ? -1 : i);
    });
    on(document, "keydown", (e) => { if (e.key === "Escape" && openI >= 0) setOpen(-1); });

    // keep a focused box in view by scrolling the page to it
    on(track, "focusin", (e) => {
      const el = e.target.closest(".pg-tile"), i = items.findIndex((it) => it.el === el);
      if (i < 0 || openI >= 0) return;
      const b = basePos[i], x0 = b.c * X, x1 = x0 + b.w * X - g;
      if (x0 < T[b.r] || x1 > T[b.r] + vw) scrollToProgress(clamp((x1 > T[b.r] + vw ? x1 - vw : x0) / (maxB[b.r] || 1), 0, 1));
    });
    on(rail, "scroll", () => { rail.scrollLeft = 0; rail.scrollTop = 0; });

    // ---------- opening sequence: outlines are drawn, then the contents wipe in ----------
    let booted = false;
    function boot() {
      if (booted) return;
      booted = true;
      if (reduce) { rail.classList.remove("boot"); return; }
      const seq = items.map((_, i) => i).sort((a, b) => (basePos[a].c * 2 + basePos[a].r) - (basePos[b].c * 2 + basePos[b].r));
      const timers = [];
      seq.forEach((i, k) => {
        const el = items[i].el, t = 140 + k * 60;
        timers.push(setTimeout(() => el.classList.add("drawn"), t));
        timers.push(setTimeout(() => el.classList.add("lit"), t + 380));
      });
      timers.push(setTimeout(() => rail.classList.remove("boot"), 140 + seq.length * 60 + 1500));
      off.push(() => timers.forEach(clearTimeout));
    }

    on(window, "resize", measure);
    const ro = new ResizeObserver(measure);
    ro.observe(rail);
    off.push(() => ro.disconnect());
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => root.current && measure());
    measure();

    return () => off.forEach((f) => f());
  }, []);

  return (
    <section className={"pg" + (page ? " pg-page" : "")} id="work" ref={root} aria-label="Projects">
      <div className="pg-stage">
        <div className="pg-stick">
          <header className="pg-top">
            <div className="pg-eye">
              {page ? <a href="/">form X Interiors</a> : <span>Hyderabad projects</span>}
              <i aria-hidden="true" />
              <span>{pad2(P.length)} projects</span>
            </div>
            <Heading className="pg-h">{Wn} projects, {wn} <em>ideas</em>.</Heading>
            <div className="pg-chips" role="group" aria-label="Highlight projects by type">
              {[["all", "All"], ["Villa", "Villa"], ["Apartment", "Apartment"], ["Commercial", "Office"]].map(([f, l]) => (
                <button suppressHydrationWarning key={f} className={"pg-chip" + (f === "all" ? " on" : "")} type="button"
                  data-f={f} aria-pressed={f === "all" ? "true" : "false"}>{l}</button>
              ))}
            </div>
            <a className="pg-cta" href={base + "#cost-calculator"}>
              <span className="long">Get a price for your space</span><span className="short">Get a price</span><span aria-hidden="true">→</span>
            </a>
          </header>

          <div className="pg-rail boot nt" aria-label="Project wall">
            <div className="pg-track">
              {ITEMS.map((it, i) => it.kind === "p" ? <ProjectTile key={i} i={it.k} />
                : it.kind === "n" ? <NoteTile key={i} k={it.k} /> : <CtaTile key={i} book={base + "#book-visit"} />)}
            </div>
          </div>

          <footer className="pg-foot">
            <b className="pg-range">01–05 / {pad2(P.length)}</b>
            <div className="pg-lines" aria-hidden="true"><div className="pg-line"><i className="on" /></div><div className="pg-line"><i /></div></div>
            <span className="pg-hint">Scroll · click a project to open it</span>
          </footer>
        </div>
      </div>
    </section>
  );
}
