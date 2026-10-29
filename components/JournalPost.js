"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IMG, imgSrc, href, readMin, relatedHref } from "@/lib/journal";
import { pad2 } from "@/lib/projects";
import Art from "@/components/JournalArt";
import "./JournalPost.css";

/* One journal post, one screen — the "formx-journal-post" design, built like the project view.
   Left: one visual per section (a close-up of a render, a line drawing or a figure); each scroll notch moves to the next
   section, and the title rides from the bottom left to the top left as soon as scrolling starts. Right: the summary, then
   the sections in step with the visuals, then the price CTA. Below: topic, reading time, a related link, previous and next. */

// one layer per distinct visual; frames (the cover, then one per section) point at layers
function visuals(p) {
  const layers = [], keys = {};
  const frames = [p.cover, ...p.sections.map((s) => s.v)].map((v) => {
    const key = v.img ? "i:" + v.img : v.art ? "a:" + v.art : "f:" + v.fig;
    if (keys[key] === undefined) { keys[key] = layers.length; layers.push(v); }
    return { L: keys[key], x: v.x === undefined ? 0.5 : v.x, y: v.y === undefined ? 0.5 : v.y, z: v.z || 1 };
  });
  return { layers, frames };
}

export default function JournalPost({ p, prev, next }) {
  const root = useRef(null);
  const router = useRouter();
  const mins = readMin(p);
  const { layers: vis, frames } = visuals(p);
  const rel = p.related, relHref = relatedHref(rel);

  useEffect(() => {
    const el = root.current;
    const q = (s) => el.querySelector(s);
    const stage = q(".jp-stage"), title = q(".jp-title"), sub = q(".jp-sub"), prog = q(".jp-prog b");
    const copy = q(".jp-copy"), view = q(".jp-view"), inner = q(".jp-in"), tt = q(".jp-tt"), cnt = q(".jp-cnt");
    const lis = [...el.querySelectorAll(".jp-secs li")];
    const cl = q(".jp-cur"), dot = q(".jp-dot"), bub = q(".jp-bub"), bubt = q(".jp-bub b");
    const mq = (s) => window.matchMedia(s).matches;
    const reduce = mq("(prefers-reduced-motion: reduce)");
    const fine = mq("(hover: hover) and (pointer: fine)");
    el.classList.toggle("fine", fine);
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const off = [];
    const on = (t, e, f, o) => { t.addEventListener(e, f, o); off.push(() => t.removeEventListener(e, f, o)); };

    const layers = [...el.querySelectorAll(".jp-lay")].map((lay, i) => {
      const v = vis[i], [iw, ih] = v.img ? IMG[v.img] : [0, 0];
      return { el: lay, img: !!v.img, iw, ih, RW: 1, RH: 1, o: -1 };
    });
    const last = frames.length - 1;
    let target = 0, pos = 0, lastPos = -1, shown = -1, W = 1, H = 1, avail = 0, maxShift = 0, ys = [0], typer = 0, raf = 0, alive = true;

    // the summary types in once the page settles
    (function typeDek() {
      const full = p.dek, t0 = performance.now() + (reduce ? 0 : 250);
      let c = -1;
      if (reduce) { tt.textContent = full; copy.classList.add("typed"); return; }
      (function step(now) {
        if (!alive) return;
        const want = now < t0 ? 0 : Math.min(full.length, Math.floor((now - t0) / 16));
        if (want !== c) { c = want; tt.textContent = full.slice(0, c); }
        if (c < full.length) typer = requestAnimationFrame(step); else copy.classList.add("typed");
      })(performance.now());
    })();

    function measure() {
      W = stage.clientWidth; H = stage.clientHeight;
      layers.forEach((L) => {
        if (!L.img) return;
        const c = Math.max(W / L.iw, H / L.ih); L.RW = L.iw * c; L.RH = L.ih * c;
        L.el.style.width = L.RW + "px"; L.el.style.height = L.RH + "px";
      });
      avail = Math.max(0, H - title.offsetHeight - 2 * parseFloat(getComputedStyle(title).top));
      // room below the list, so every section can ride up to the reading line
      const padB = Math.round(view.clientHeight * 0.84) + "px";
      if (inner.style.paddingBottom !== padB) inner.style.paddingBottom = padB;
      const anchor = view.clientHeight * 0.14;
      ys = [0];
      for (let i = 0; i < lis.length; i++) ys[i + 1] = lis[i].offsetTop - anchor;
      maxShift = Math.max(0, inner.offsetHeight - view.clientHeight);
      lastPos = -1;
    }

    const goTo = (k) => { target = clamp(k, 0, last); };
    const step = (dir) => goTo(Math.round(target) + dir);
    const go = (u) => router.push(u);
    function camera(L, f) {
      const x = clamp(W / 2 - f.x * L.RW * f.z, W - L.RW * f.z, 0), y = clamp(H / 2 - f.y * L.RH * f.z, H - L.RH * f.z, 0);
      L.el.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0) scale(" + f.z.toFixed(4) + ")";
    }

    // ---------- every frame ----------
    let px = 0, py = 0, inStage = false, bx = 0, by = 0, bubTxt = "";
    function loop() {
      pos += (target - pos) * (reduce ? 1 : 0.3);
      if (Math.abs(target - pos) < 0.002) pos = target;
      if (pos !== lastPos) {
        lastPos = pos;
        const i0 = Math.floor(pos), i1 = Math.min(last, i0 + 1), f = pos - i0, A = frames[i0], B = frames[i1];
        const op = layers.map(() => 0);
        if (A.L === B.L) {
          // the same render: the camera glides between the two framings
          op[A.L] = 1;
          if (layers[A.L].img) camera(layers[A.L], { x: A.x + (B.x - A.x) * f, y: A.y + (B.y - A.y) * f, z: Math.exp(Math.log(A.z) + (Math.log(B.z) - Math.log(A.z)) * f) });
        } else {
          // a different visual: cross-fade, each held at its own framing
          op[A.L] = 1 - f; op[B.L] = f;
          if (layers[A.L].img) camera(layers[A.L], A);
          if (layers[B.L].img) camera(layers[B.L], B);
        }
        layers.forEach((L, i) => { if (L.o !== op[i]) { L.el.style.opacity = op[i].toFixed(3); L.o = op[i]; } });
        // the title rides from the bottom to the top as soon as scrolling starts
        const t = Math.min(1, pos);
        title.style.transform = "translate3d(0," + ((1 - t) * avail).toFixed(1) + "px,0) scale(" + (1 - 0.5 * t).toFixed(3) + ")";
        sub.style.opacity = String(1 - t);
        stage.style.setProperty("--t", t.toFixed(3));
        prog.style.transform = "scaleX(" + (last ? pos / last : 0).toFixed(4) + ")";
        // the words move in step with the visuals
        const yy = ys[i0] + ((ys[i1] === undefined ? ys[i0] : ys[i1]) - ys[i0]) * f;
        inner.style.transform = "translate3d(0," + (-clamp(yy, 0, maxShift)).toFixed(1) + "px,0)";
        const o = Math.round(pos);
        if (o !== shown) {
          shown = o;
          lis.forEach((li, i) => li.classList.toggle("on", i + 1 === o));
          cnt.textContent = pad2(o + 1) + " / " + pad2(last + 1);
        }
      }
      if (fine && inStage) cursorFrame();
      raf = requestAnimationFrame(loop);
    }

    // ---------- round cursor: the right half moves on, the left half goes back ----------
    function cursorFrame() {
      const r = stage.getBoundingClientRect(), lx = px - r.left, ly = py - r.top;
      dot.style.transform = "translate3d(" + lx.toFixed(1) + "px," + ly.toFixed(1) + "px,0)";
      if (reduce) { bx = lx; by = ly; } else { bx += (lx - bx) * 0.22; by += (ly - by) * 0.22; }
      bub.style.transform = "translate3d(" + bx.toFixed(1) + "px," + by.toFixed(1) + "px,0)";
      const right = lx >= r.width / 2;
      const txt = right ? (Math.round(target) < last ? "Next" : "Next post") : (Math.round(target) > 0 ? "Back" : "");
      if (txt !== bubTxt) { bubTxt = txt; bubt.textContent = txt; cl.classList.toggle("on", !!txt); }
    }
    on(stage, "pointerenter", (e) => {
      if (!fine || e.pointerType !== "mouse") return;
      inStage = true; px = e.clientX; py = e.clientY;
      const r = stage.getBoundingClientRect(); bx = px - r.left; by = py - r.top;
      cl.classList.add("show");
    });
    on(stage, "pointerleave", () => { inStage = false; cl.classList.remove("show"); });

    // ---------- input: one section per notch ----------
    let acc = 0, lastStep = 0;
    on(window, "wheel", (e) => {
      e.preventDefault();
      let d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (e.deltaMode === 1) d *= 32;
      if (acc && Math.sign(acc) !== Math.sign(d)) acc = 0;
      acc += d;
      const now = performance.now();
      if (Math.abs(acc) >= 24 && now - lastStep >= 110) { step(acc > 0 ? 1 : -1); acc = 0; lastStep = now; }
    }, { passive: false });
    // a swipe anywhere (visuals or text) steps, like a notch
    let drag = null, dragged = false;
    on(el, "pointerdown", (e) => { if (e.button === 0 && !e.target.closest("a, button")) { drag = { x: e.clientX, y: e.clientY }; dragged = false; } });
    on(window, "pointermove", (e) => {
      px = e.clientX; py = e.clientY;
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y, d = Math.abs(dx) >= Math.abs(dy) ? -dx : -dy;
      if (Math.abs(d) >= 60) { step(d > 0 ? 1 : -1); drag.x = e.clientX; drag.y = e.clientY; dragged = true; }
    });
    on(window, "pointerup", () => { drag = null; });
    on(window, "pointercancel", () => { drag = null; });
    on(stage, "click", (e) => {
      if (dragged) { dragged = false; return; }
      const r = stage.getBoundingClientRect();
      if (e.clientX - r.left >= r.width / 2) { if (Math.round(target) < last) step(1); else go(href(next)); }
      else step(-1);
    });
    on(q(".jp-secs"), "click", (e) => { const li = e.target.closest("li"); if (li) goTo(+li.dataset.n); });

    on(document, "keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); step(1); }
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); step(-1); }
      else if (e.key === "Home") goTo(0);
      else if (e.key === "End") goTo(last);
      else if (e.key === "]") go(href(next));
      else if (e.key === "[") go(href(prev));
      else if (e.key === "Escape") q(".jp-xclose").click();
    });
    // back to wherever the visitor came from on this site; otherwise the link opens the journal wall
    on(q(".jp-xclose"), "click", (e) => {
      let same = false;
      try { same = !!document.referrer && new URL(document.referrer).origin === location.origin; } catch (err) {}
      if (same && history.length > 1) { e.preventDefault(); router.back(); }
    });

    on(window, "resize", measure);
    const ro = new ResizeObserver(measure);
    ro.observe(stage); ro.observe(inner);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => alive && measure());
    measure();
    raf = requestAnimationFrame(loop);
    router.prefetch(href(next));

    return () => { alive = false; cancelAnimationFrame(raf); cancelAnimationFrame(typer); ro.disconnect(); off.forEach((f) => f()); };
  }, [p, prev, next, router]); // vis and frames are derived from p

  return (
    <div className="jp" ref={root}>
      <div className="jp-wrap">
        <div className="jp-main">
          <section className="jp-stage" aria-roledescription="carousel" aria-label={p.name + ", visuals"}>
            <div className="jp-layers">
              {vis.map((v, i) => v.img
                ? <img key={i} className="jp-lay" src={imgSrc(v.img)} width={IMG[v.img][0]} height={IMG[v.img][1]} alt="" draggable="false"
                    fetchPriority={i === 0 ? "high" : "auto"} decoding="async" />
                : v.art
                  ? <div key={i} className="jp-lay a"><Art name={v.art} cls="jp-art" /></div>
                  : <div key={i} className="jp-lay f" dangerouslySetInnerHTML={{ __html: v.fig }} />)}
            </div>
            <div className="jp-shade" />
            <div className="jp-title">
              <h1 dangerouslySetInnerHTML={{ __html: p.title }} />
              <div className="jp-sub">{p.cat} · {mins} min read</div>
            </div>
            <div className="jp-prog" aria-hidden="true"><b /></div>
            <div className="jp-cur" aria-hidden="true"><div className="jp-bub"><b /></div><div className="jp-dot"><b /></div></div>
          </section>

          <aside className="jp-copy" aria-label="The post">
            <div className="jp-lab">
              <b>The guide</b><span className="jp-cnt">01 / {pad2(frames.length)}</span>
              <a className="jp-xclose" href="/journal/" aria-label="Close post">
                <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" aria-hidden="true"><path d="M2 2l14 14M16 2L2 16" /></svg>
              </a>
            </div>
            <div className="jp-view">
              <div className="jp-in">
                <p className="jp-idea">
                  <span className="jp-gh">{p.dek}</span>
                  <span className="jp-ty" aria-hidden="true"><span className="jp-tt" /><i className="jp-caret" /></span>
                </p>
                <ol className="jp-secs">
                  {p.sections.map((s, i) => (
                    <li key={i} data-n={i + 1}>
                      <span className="jp-k">{pad2(i + 1)}</span>
                      <div><h2>{s.h}</h2><p>{s.p}</p></div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <a className="jp-cta" href="/#cost-calculator">Get a price for your space <span aria-hidden="true">→</span></a>
          </aside>
        </div>

        <dl className="jp-facts">
          <div className="jp-fact f-cat"><dt>Topic</dt><dd>{p.cat}</dd></div>
          <div className="jp-fact f-read"><dt>Reading time</dt><dd>{mins} min</dd></div>
          <div className="jp-fact f-rel"><dt>See it built</dt><dd><Link href={relHref}>{rel.name} →</Link></dd></div>
          <div className="jp-fact f-prev"><dt>Previous</dt><dd><Link href={href(prev)}>← {prev.name}</Link></dd></div>
          <div className="jp-fact f-next"><dt>Next post</dt><dd><Link href={href(next)}>{next.name} →</Link></dd></div>
        </dl>
      </div>
    </div>
  );
}
