"use client";
import { useEffect, useRef } from "react";
import { POSTS, imgSrc, href, readMin } from "@/lib/journal";
import { PROJECTS, word, pad2 } from "@/lib/projects";
import Art from "@/components/JournalArt";
import "./Journal.css";

/* The journal wall — the /journal/ page, built like the project wall.
   Two rows of posts slide right to left; the row under the cursor runs fast, the other slow.
   Click a post and it opens across both rows with its summary, contents and a link to the full post. */

// The two rows, left to right. p = post (by its place in POSTS), cta = consultation box, proj = projects box; ":2" = two columns wide.
// The first screen is three posts on top, a wide one and one more below.
const ROWS = [
  ["p0", "p1", "p2", "p5", "p6", "cta"],
  ["p3:2", "p4", "p7", "proj:2"],
];
const SLOW = 0.42; // the row away from the cursor moves at this share of the speed

export const ITEMS = [];
ROWS.forEach((row, r) => row.forEach((key) => {
  const m = /^(p|cta|proj)(\d*)(?::(\d))?$/.exec(key);
  if (!m) return;
  const kind = m[1], k = m[2] === "" ? -1 : +m[2], w = m[3] ? +m[3] : 1;
  if (kind === "p" && !POSTS[k]) return;
  ITEMS.push({ kind, k, row: r, w });
}));

const TOPICS = ["Planning", "Materials", "Lighting", "Process"];
const html = (s) => ({ __html: s });
export const crop = (v) => ({ objectPosition: `${v.x * 100}% ${v.y * 100}%`, transformOrigin: `${v.x * 100}% ${v.y * 100}%`, scale: String(v.z) });

function Outline() {
  return <svg className="jr-ol" aria-hidden="true"><rect pathLength="1" rx="11" ry="11" /></svg>;
}

// also used by the home-page strip (components/JournalHome.js)
export function Face({ p, meta }) {
  if (p.tile === "photo") {
    return <div className="jr-face f-photo"><div className="jr-cap"><span className="jr-nl">{meta}</span><h2 dangerouslySetInnerHTML={html(p.title)} /></div></div>;
  }
  if (p.tile === "shell") {
    return (
      <div className="jr-face f-shell"><div className="jr-nin"><span className="jr-nl">{meta}</span><div className="jr-nb">
        <h2 dangerouslySetInnerHTML={html(p.title)} />
        <dl className="jr-spec">{p.spec.map(([t, v]) => <div key={t}><dt>{t}</dt><dd>{v}</dd></div>)}</dl>
      </div></div></div>
    );
  }
  return (
    <div className={"jr-face f-" + p.tile}><div className="jr-nin">
      <span className="jr-nl">{meta}</span>
      {p.tile === "draw" && <Art name={p.cover.art} cls="jr-art" />}
      {p.tile === "fig" && <div className="jr-fig" dangerouslySetInnerHTML={html(p.fig)} />}
      <div className="jr-nb"><h2 dangerouslySetInnerHTML={html(p.title)} /><p>{p.dek}</p></div>
    </div></div>
  );
}

export function PostTile({ i }) {
  const p = POSTS[i], meta = p.cat + " · " + readMin(p) + " min read";
  return (
    <article className="jr-tile jr-post" data-i={i}>
      {p.cover.img && <img src={imgSrc(p.cover.img)} alt="" draggable="false" decoding="async" style={crop(p.cover)} />}
      <div className="jr-veil" />
      {p.cover.art && <div className="jr-cov"><Art name={p.cover.art} cls="jr-art" /></div>}
      <span className="jr-sweep" /><Outline />
      <Face p={p} meta={meta} />
      <span className="jr-plus" aria-hidden="true" />
      <button suppressHydrationWarning className="jr-hit" type="button" aria-expanded="false" aria-label={"Open " + p.name} data-cursor="open" />
      <div className="jr-det">
        <div className="jr-orow">
          <span className="jr-dc">{meta}</span>
          <button suppressHydrationWarning className="jr-x" type="button" aria-label={"Close " + p.name} />
        </div>
        <div className="jr-obot">
          <h3 dangerouslySetInnerHTML={html(p.title)} />
          <p className="jr-idea">
            <span className="jr-gh">{p.dek}</span>
            <span className="jr-ty" aria-hidden="true"><span className="jr-tt" /><i className="jr-caret" /></span>
          </p>
          <div className="jr-facts">{p.sections.map((s) => <i key={s.h}>{s.h}</i>)}</div>
          <a className="jr-more" href={href(p)}><span aria-hidden="true">→</span>Read the post</a>
        </div>
      </div>
      <span className="jr-prog" aria-hidden="true" />
    </article>
  );
}

export function CtaTile() {
  return (
    <a className="jr-tile jr-ctile" href="/#book-visit">
      <Outline />
      <span className="jr-in"><span className="jr-k">Your home</span><strong>Ask before you <em>build</em>.</strong>
        <span className="jr-cb"><span className="jr-go">Book a free consultation <span aria-hidden="true">→</span></span>
          <span className="jr-note2">No obligation · we reply within 2 working hours</span></span></span>
    </a>
  );
}

export function ProjectsTile() {
  const wn = word(PROJECTS.length);
  return (
    <a className="jr-tile jr-ptile" href="/projects/">
      <img src={imgSrc("emerald")} alt="" draggable="false" decoding="async" style={{ objectPosition: "50% 45%" }} />
      <div className="jr-veil" /><Outline />
      <span className="jr-in"><span className="jr-k">Projects</span><span className="jr-cb">
        <strong>The notes, built: {wn} projects, {wn} <em>ideas</em>.</strong>
        <span className="jr-go">See the projects <span aria-hidden="true">→</span></span></span></span>
    </a>
  );
}

export default function Journal() {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    const q = (s) => el.querySelector(s);
    const rail = q(".jr-rail"), track = q(".jr-track"), rangeEl = q(".jr-range"), th = [...el.querySelectorAll(".jr-line i")];
    const cl = q(".jr-cur"), dot = q(".jr-dot"), bub = q(".jr-bub"), bubt = q(".jr-bub b");
    const n = POSTS.length;
    const mq = (s) => window.matchMedia(s).matches;
    const reduce = mq("(prefers-reduced-motion: reduce)");
    const fine = mq("(hover: hover) and (pointer: fine)");
    el.classList.toggle("fine", fine);
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const off = [];
    const on = (t, e, f, o) => { t.addEventListener(e, f, o); off.push(() => t.removeEventListener(e, f, o)); };

    const items = [...track.children].map((t, i) => ({
      ...ITEMS[i], el: t, rect: t.querySelector(".jr-ol rect"), img: t.querySelector(":scope > img"),
      hit: t.querySelector(".jr-hit"), tt: t.querySelector(".jr-tt"), o: 0, pd: 0, pl: 0,
    }));
    const rowItems = [[], []], postItem = [];
    items.forEach((it, i) => { rowItems[it.row].push(i); if (it.kind === "p") postItem[it.k] = i; });

    // ---------- layout ----------
    const base = [];
    rowItems.forEach((list, r) => { let c = 0; list.forEach((i) => { base[i] = { c, r, w: items[i].w, h: 1 }; c += items[i].w; }); });
    // an open post takes two columns on both rows; every other box stays on its row, keeps its size and takes the first free place
    function pack(oi, A) {
      if (oi < 0) return base.slice();
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

    let W = 0, H = 0, pad = 16, g = 12, X = 1, Y = 1, vis = 3, vw = 0, pos = base.slice(), railRect = rail.getBoundingClientRect();
    const maxS = [0, 0], T = [0, 0], S = [0, 0], V = [0, 0];
    let lastInput = 0, released = true, active = 0, openI = -1, openedAt = 0, filter = "all";

    function layout() {
      const oi = openI >= 0 ? postItem[openI] : -1;
      let A = 0;
      if (oi >= 0) {
        const minC = Math.ceil(Math.max(0, T[0]) / X - 0.02);
        A = Math.max(0, clamp(base[oi].c, minC, minC + vis - 2));
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
          it.hit.setAttribute("aria-label", (o ? "Close " : "Open ") + POSTS[it.k].name);
        }
      });
      maxS[0] = Math.max(0, rowEnd(pos, 0) * X - g - vw);
      maxS[1] = Math.max(0, rowEnd(pos, 1) * X - g - vw);
      applyDim();
    }

    function measure() {
      rail.classList.add("nt");
      railRect = rail.getBoundingClientRect();
      W = railRect.width; H = railRect.height - 16;
      pad = clamp(window.innerWidth * 0.034, 16, 56);
      g = W < 640 ? 8 : 12;
      vis = W < 720 ? 2 : 3;
      X = (W - 2 * pad + g) / vis; Y = (H + g) / 2; vw = W - 2 * pad;
      track.style.left = pad + "px";
      layout();
      for (let r = 0; r < 2; r++) { T[r] = openI >= 0 ? T[0] : clamp(T[r], 0, maxS[r]); S[r] = T[r]; V[r] = 0; }
      requestAnimationFrame(() => requestAnimationFrame(() => rail.classList.remove("nt")));
    }

    // ---------- open / close ----------
    let typer = 0;
    function setOpen(i) {
      if (i === openI) return;
      if (i >= 0) { const r = items[postItem[i]].row; T[0] = T[1] = clamp(T[r], 0, maxS[r]); }
      openI = i; openedAt = performance.now();
      layout();
      items.forEach((it) => { if (it.kind === "p") { it.el.classList.remove("typed"); it.tt.textContent = ""; } });
      if (i < 0) { T[0] = clamp(T[0], 0, maxS[0]); T[1] = clamp(T[1], 0, maxS[1]); return; }
      const p = pos[postItem[i]], x0 = p.c * X, x1 = x0 + p.w * X - g;
      let t = T[0];
      if (x1 > t + vw) t = x1 - vw;
      if (x0 < t) t = x0;
      T[0] = T[1] = clamp(t, 0, Math.max(maxS[0], maxS[1]));
      released = true;
      typeDek(i);
    }
    // the post's summary types in once the tile has grown
    function typeDek(i) {
      const it = items[postItem[i]], full = POSTS[i].dek, t0 = performance.now() + (reduce ? 0 : 560);
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
    function blip(x, y) {
      if (reduce) return;
      const b = document.createElement("i"); b.className = "jr-blip"; b.style.left = x + "px"; b.style.top = y + "px";
      el.appendChild(b); b.addEventListener("animationend", () => b.remove());
    }

    // ---------- topic chips ----------
    const chips = [...el.querySelectorAll(".jr-chip")];
    function applyDim() {
      items.forEach((it) => {
        const lit = filter === "all" || (it.kind === "p" && (POSTS[it.k].cat === filter || it.k === openI));
        it.el.classList.toggle("dim", !lit);
      });
    }
    function setFilter(f) {
      filter = f;
      chips.forEach((c) => { const o = c.dataset.f === f; c.classList.toggle("on", o); c.setAttribute("aria-pressed", o ? "true" : "false"); });
      if (openI >= 0 && f !== "all" && POSTS[openI].cat !== f) setOpen(-1);
      applyDim();
      if (f === "all") return;
      let first = -1;
      POSTS.forEach((p, i) => { const it = postItem[i]; if (it === undefined || p.cat !== f) return; if (first < 0 || pos[it].c < pos[first].c) first = it; });
      if (first < 0) return;
      const x0 = pos[first].c * X;
      T[0] = clamp(x0, 0, maxS[0]); T[1] = clamp(x0, 0, maxS[1]); released = true;
    }
    chips.forEach((c) => on(c, "click", () => setFilter(c.dataset.f)));

    // ---------- motion ----------
    let px = -1, py = -1, inRail = false, state = "-", bx = 0, by = 0, raf = 0;
    let dragging = false, drag = null, dragged = false;
    function setActive(a) { if (a === active) return; active = a; th[0].classList.toggle("on", a === 0); th[1].classList.toggle("on", a === 1); }
    const rowAt = (y) => (y - railRect.top) < railRect.height / 2 ? 0 : 1;

    function frame(now) {
      for (let r = 0; r < 2; r++) {
        if (reduce) { S[r] = T[r]; V[r] = 0; continue; }
        V[r] += (T[r] - S[r]) * 0.11; V[r] *= 0.64; S[r] += V[r];
        if (Math.abs(T[r] - S[r]) < 0.05 && Math.abs(V[r]) < 0.05) { S[r] = T[r]; V[r] = 0; }
      }
      if (!released && !dragging && now - lastInput > 140) { released = true; if (openI < 0) { T[0] = clamp(T[0], 0, maxS[0]); T[1] = clamp(T[1], 0, maxS[1]); } }
      track.style.transform = "translate3d(" + (-S[0]).toFixed(2) + "px,0,0)";
      const shift = S[0] - S[1];
      let lo = n, hi = -1;
      for (let i = 0; i < items.length; i++) {
        const it = items[i], p = pos[i], lower = p.r === 1 && p.h === 1, o = lower ? shift : 0, sr = lower ? S[1] : S[0];
        if (it.o !== o) { it.el.style.translate = o.toFixed(2) + "px 0"; it.o = o; }
        const w = p.w * X - g, x0 = p.c * X - sr;
        if (it.img) {
          // the render drifts inside its frame as the box crosses the screen
          const lim = Math.min(18, w * 0.03), tgt = ((it.kind === "p" && it.k === openI) || reduce) ? 0 : clamp((vw / 2 - (x0 + w / 2)) * 0.03, -lim, lim);
          it.pd += (tgt - it.pd) * 0.2;
          if (Math.abs(it.pd - it.pl) > 0.05) { it.img.style.translate = it.pd.toFixed(2) + "px 0"; it.pl = it.pd; }
        }
        if (it.kind === "p" && x0 + w > 4 && x0 < vw - 4) { lo = Math.min(lo, it.k); hi = Math.max(hi, it.k); }
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
      if (fine && inRail) cursor();
      raf = requestAnimationFrame(frame);
    }

    function cursor() {
      const lx = px - railRect.left, ly = py - railRect.top;
      dot.style.transform = "translate3d(" + lx.toFixed(1) + "px," + ly.toFixed(1) + "px,0)";
      if (reduce || state === "-") { bx = lx; by = ly; } else { bx += (lx - bx) * 0.22; by += (ly - by) * 0.22; }
      bub.style.transform = "translate3d(" + bx.toFixed(1) + "px," + by.toFixed(1) + "px,0)";
      const hit = document.elementFromPoint(px, py), t = hit && hit.closest ? hit.closest(".jr-tile") : null;
      let st = "";
      if (dragging) st = "s-drag";
      else if (t) {
        if (t.classList.contains("jr-ctile") || t.classList.contains("jr-ptile")) st = "s-cta";
        else if (t.classList.contains("open")) st = hit.closest(".jr-obot, .jr-x, a") ? "s-link" : "s-open";
        else st = "s-tile";
      }
      if (st !== state) {
        state = st; cl.className = "jr-cur show" + (st ? " " + st : "");
        bubt.textContent = st === "s-tile" ? "Open" : st === "s-open" ? "Close" : st === "s-cta" ? (t.classList.contains("jr-ptile") ? "See" : "Book") : "";
      }
      if (!dragging) setActive(rowAt(py));
    }

    // ---------- input: the row under the cursor (or under the finger) runs fast, the other runs slow ----------
    function userMove(d, row) {
      if (openI >= 0) { if (performance.now() - openedAt < 450) return; setOpen(-1); }
      const a = row === undefined ? active : row;
      for (let r = 0; r < 2; r++) T[r] = clamp(T[r] + d * (r === a ? 1 : SLOW), -X * 0.15, maxS[r] + X * 0.15);
      lastInput = performance.now(); released = false;
    }
    on(window, "wheel", (e) => {
      e.preventDefault();
      let d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (e.deltaMode === 1) d *= 32; else if (e.deltaMode === 2) d *= H;
      userMove(d * 1.15);
    }, { passive: false });
    on(rail, "pointerdown", (e) => {
      if (e.button !== 0 || e.target.closest(".jr-obot, .jr-x")) return;
      drag = { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, row: rowAt(e.clientY) };
      dragged = false; setActive(drag.row);
    });
    on(window, "pointermove", (e) => {
      px = e.clientX; py = e.clientY;
      if (fine && e.pointerType === "mouse") {
        const inside = px >= railRect.left && px <= railRect.right && py >= railRect.top && py <= railRect.bottom;
        if (inside !== inRail) { inRail = inside; if (!inside) { cl.className = "jr-cur"; state = "-"; } }
      }
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!dragged && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 6) { dragged = true; dragging = true; }
      if (dragged) userMove(Math.abs(dx) >= Math.abs(dy) ? -dx : -dy, drag.row);
      drag.x = e.clientX; drag.y = e.clientY;
    });
    const endDrag = () => { drag = null; if (dragging) { dragging = false; lastInput = performance.now(); } };
    on(window, "pointerup", endDrag);
    on(window, "pointercancel", endDrag);
    on(document, "mouseout", (e) => { if (!e.relatedTarget) { inRail = false; cl.className = "jr-cur"; state = "-"; } });

    on(track, "click", (e) => {
      if (dragged && e.detail > 0) { e.preventDefault(); e.stopPropagation(); dragged = false; return; }
      const b = e.target.closest(".jr-hit, .jr-x");
      if (!b) return;
      const i = +b.closest(".jr-tile").dataset.i;
      if (e.detail > 0) blip(e.clientX, e.clientY);
      setOpen(i === openI ? -1 : i);
    }, true);

    on(document, "keydown", (e) => {
      if (e.key === "Escape") { setOpen(-1); return; }
      const dir = (e.key === "ArrowRight" || e.key === "PageDown") ? 1 : (e.key === "ArrowLeft" || e.key === "PageUp") ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      if (openI >= 0) setOpen(-1);
      for (let r = 0; r < 2; r++) T[r] = clamp(T[r] + dir * X, 0, maxS[r]);
      released = true;
    });
    // keep a focused box in view
    on(track, "focusin", (e) => {
      const t = e.target.closest(".jr-tile"), i = items.findIndex((it) => it.el === t);
      if (i < 0) return;
      const p = pos[i]; if (p.h === 2) return;
      const r = p.r, x0 = p.c * X, x1 = x0 + p.w * X - g;
      if (x0 < T[r]) T[r] = x0; else if (x1 > T[r] + vw) T[r] = clamp(x1 - vw, 0, maxS[r]);
      released = true;
    });
    on(rail, "scroll", () => { rail.scrollLeft = 0; rail.scrollTop = 0; });

    // ---------- opening sequence: outlines are drawn, then the contents wipe in ----------
    const timers = [];
    (function boot() {
      // /journal/#<slug> opens that post once the wall is up
      const h = location.hash.slice(1), fromHash = POSTS.findIndex((p) => p.slug === h);
      if (reduce) { rail.classList.remove("boot"); if (fromHash >= 0) setOpen(fromHash); return; }
      const seq = items.map((_, i) => i).sort((a, b) => (base[a].c * 2 + base[a].r) - (base[b].c * 2 + base[b].r));
      seq.forEach((i, k) => {
        const t = items[i].el, at = 140 + k * 60;
        timers.push(setTimeout(() => t.classList.add("drawn"), at));
        timers.push(setTimeout(() => t.classList.add("lit"), at + 380));
      });
      timers.push(setTimeout(() => { rail.classList.remove("boot"); if (fromHash >= 0) setOpen(fromHash); }, 140 + seq.length * 60 + 1500));
    })();

    on(window, "resize", measure);
    const ro = new ResizeObserver(measure);
    ro.observe(rail);
    let alive = true;
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => alive && measure());
    measure();
    raf = requestAnimationFrame(frame);

    return () => { alive = false; cancelAnimationFrame(raf); cancelAnimationFrame(typer); timers.forEach(clearTimeout); ro.disconnect(); off.forEach((f) => f()); };
  }, []);

  return (
    <div className="jr" ref={root}>
      <header className="jr-top">
        <div className="jr-eye"><a href="/">form X Interiors</a><i aria-hidden="true" /><span>Journal</span></div>
        <h1 className="jr-h">Read before you <em>build</em>.</h1>
        <div className="jr-chips" role="group" aria-label="Highlight posts by topic">
          {[["all", "All"], ...TOPICS.map((t) => [t, t])].map(([f, l]) => (
            <button suppressHydrationWarning key={f} className={"jr-chip" + (f === "all" ? " on" : "")} type="button"
              data-f={f} aria-pressed={f === "all" ? "true" : "false"}>{l}</button>
          ))}
        </div>
        <a className="jr-cta" href="/#cost-calculator">
          <span className="long">Get a price for your space</span><span className="short">Get a price</span><span aria-hidden="true">→</span>
        </a>
      </header>

      <main className="jr-rail boot nt" aria-label="Journal wall">
        <div className="jr-track">
          {ITEMS.map((it, i) => it.kind === "p" ? <PostTile key={i} i={it.k} /> : it.kind === "cta" ? <CtaTile key={i} /> : <ProjectsTile key={i} />)}
        </div>
        <div className="jr-cur" aria-hidden="true">
          <div className="jr-bub"><b /></div>
          <div className="jr-dot"><b /></div>
        </div>
      </main>

      <footer className="jr-foot">
        <b className="jr-range">01–05 / {pad2(POSTS.length)}</b>
        <div className="jr-lines" aria-hidden="true"><div className="jr-line"><i className="on" /></div><div className="jr-line"><i /></div></div>
        <span className="jr-hint">Scroll · click a post to open it</span>
      </footer>
    </div>
  );
}
