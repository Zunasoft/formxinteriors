"use client";
import { useEffect, useRef } from "react";
import { POSTS } from "@/lib/journal";
import { pad2 } from "@/lib/projects";
import { ITEMS, PostTile, CtaTile, ProjectsTile } from "@/components/Journal";
import "./Journal.css";
import "./JournalHome.css";

/* The journal wall on the home page (#blog), driven like the project wall: the section pins while the page
   scrolls, and the scroll slides both rows right to left (the lower row trails a little). Click a post and both
   rows line up while it opens across them, with its summary typing in and a link to the full post. */
export default function JournalHome() {
  const root = useRef(null);

  useEffect(() => {
    const sec = root.current;
    const q = (s) => sec.querySelector(s);
    const stage = q(".jr-stage"), stick = q(".jr-stick"), rail = q(".jr-rail"), track = q(".jr-track");
    const rangeEl = q(".jr-range"), th = [...sec.querySelectorAll(".jr-line i")];
    const n = POSTS.length;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const off = [];
    const on = (t, e, f, o) => { t.addEventListener(e, f, o); off.push(() => t.removeEventListener(e, f, o)); };

    const items = [...track.children].map((el, i) => ({
      ...ITEMS[i], el, rect: el.querySelector(".jr-ol rect"), img: el.querySelector(":scope > img"),
      hit: el.querySelector(".jr-hit"), tt: el.querySelector(".jr-tt"), o: 0, pd: 0, pl: 0,
    }));
    const rowItems = [[], []], postItem = [];
    items.forEach((it, i) => { rowItems[it.row].push(i); if (it.kind === "p") postItem[it.k] = i; });

    // ---------- layout ----------
    const basePos = [];
    rowItems.forEach((list, r) => { let c = 0; list.forEach((i) => { basePos[i] = { c, r, w: items[i].w, h: 1 }; c += items[i].w; }); });
    // an open post takes two columns on both rows; every other box stays on its row, keeps its size and takes the first free place
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
      const oi = openI >= 0 ? postItem[openI] : -1;
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
          it.hit.setAttribute("aria-label", (o ? "Close " : "Open ") + POSTS[it.k].name);
          it.hit.dataset.cursor = o ? "close" : "open";
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
      const pad = Math.max(16, Math.min(56, window.innerWidth * 0.034));
      track.style.left = pad + "px";
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
      const p = pos[postItem[i]], x0 = p.c * X, x1 = x0 + p.w * X - g;
      let t = T[0];
      if (x1 > t + vw) t = x1 - vw;
      if (x0 < t) t = x0;
      T[0] = T[1] = clamp(t, 0, Math.max(maxS[0], maxS[1]));
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

    // ---------- topic chips: light up one topic ----------
    const chips = [...sec.querySelectorAll(".jr-chip")];
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
      let first = -1;
      if (f !== "all") POSTS.forEach((p, i) => { const it = postItem[i]; if (it !== undefined && p.cat === f && (first < 0 || basePos[it].c < basePos[first].c)) first = it; });
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
        // a real scroll (not the jitter of the click) closes the open post
        if (performance.now() - openedAt < 450 || Math.abs(progress() - openP) * len < 60) return;
        setOpen(-1);
      }
      follow();
    }, { passive: true });

    // a click opens or closes a post
    on(track, "click", (e) => {
      const b = e.target.closest(".jr-hit, .jr-x");
      if (!b) return;
      const i = +b.closest(".jr-tile").dataset.i;
      setOpen(i === openI ? -1 : i);
    });
    on(document, "keydown", (e) => { if (e.key === "Escape" && openI >= 0) setOpen(-1); });

    // keep a focused box in view by scrolling the page to it
    on(track, "focusin", (e) => {
      const el = e.target.closest(".jr-tile"), i = items.findIndex((it) => it.el === el);
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
    <section className="jr jr-home" id="blog" ref={root} aria-label="Journal">
      <div className="jr-stage">
        <div className="jr-stick">
          <header className="jr-top">
            <div className="jr-eye"><a href="/journal/">Journal</a><i aria-hidden="true" /><span>{pad2(POSTS.length)} posts</span></div>
            <h2 className="jr-h">Read before you <em>build</em>.</h2>
            <div className="jr-chips" role="group" aria-label="Highlight posts by topic">
              {["all", "Planning", "Materials", "Lighting", "Process"].map((f) => (
                <button suppressHydrationWarning key={f} className={"jr-chip" + (f === "all" ? " on" : "")} type="button"
                  data-f={f} aria-pressed={f === "all" ? "true" : "false"}>{f === "all" ? "All" : f}</button>
              ))}
            </div>
            <a className="jr-cta" href="/journal/">
              <span className="long">Open the journal</span><span className="short">All posts</span><span aria-hidden="true">→</span>
            </a>
          </header>

          <div className="jr-rail boot nt" aria-label="Journal wall">
            <div className="jr-track">
              {ITEMS.map((it, i) => it.kind === "p" ? <PostTile key={i} i={it.k} /> : it.kind === "cta" ? <CtaTile key={i} /> : <ProjectsTile key={i} />)}
            </div>
          </div>

          <footer className="jr-foot">
            <b className="jr-range">01–05 / {pad2(POSTS.length)}</b>
            <div className="jr-lines" aria-hidden="true"><div className="jr-line"><i className="on" /></div><div className="jr-line"><i /></div></div>
            <span className="jr-hint">Scroll · click a post to open it</span>
          </footer>
        </div>
      </div>
    </section>
  );
}
