"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { pad2, href, splitTitle } from "@/lib/projects";
import "./ProjectView.css";

/* One project, one screen — the "project view" design.
   Left: the render in a 12px frame. Each scroll notch moves to the next stop of the tour
   (overview, then the close-ups, each with its own frame), and the title rides from the
   bottom left to the top left as soon as scrolling starts. One more notch past the last stop
   brings up the brief. Right: the idea, the stops in step with the frames, the brief, the price CTA.
   Below: a thin spec row that ends with the previous and next project. */
export default function ProjectView({ p, prev, next }) {
  const root = useRef(null);
  const router = useRouter();
  const [lead, em] = splitTitle(p);
  const stops = p.tour.length; // the brief is one step past the last stop

  useEffect(() => {
    const el = root.current;
    const q = (s) => el.querySelector(s);
    const stage = q(".pv-stage"), title = q(".pv-title"), sub = q(".pv-sub"), prog = q(".pv-prog b");
    const copy = q(".pv-copy"), view = q(".pv-view"), inner = q(".pv-in"), tt = q(".pv-tt"), cnt = q(".pv-cnt");
    const lis = [...el.querySelectorAll(".pv-tour li")], brief = q(".pv-brief"), phs = [...el.querySelectorAll(".pv-ph")];
    const cl = q(".pv-cur"), dot = q(".pv-dot"), bub = q(".pv-bub"), bubt = q(".pv-bub b");
    const mq = (s) => window.matchMedia(s).matches;
    const reduce = mq("(prefers-reduced-motion: reduce)");
    const fine = mq("(hover: hover) and (pointer: fine)");
    el.classList.toggle("fine", fine);
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const off = [];
    const on = (t, e, f, o) => { t.addEventListener(e, f, o); off.push(() => t.removeEventListener(e, f, o)); };

    const last = stops;
    let target = 0, pos = 0, lastPos = -1, shown = -1, avail = 0, maxShift = 0, ys = [0], typer = 0, raf = 0, alive = true;

    // the idea types in once the page settles
    (function typeIdea() {
      const full = p.idea, t0 = performance.now() + (reduce ? 0 : 350);
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
      avail = Math.max(0, stage.clientHeight - title.offsetHeight - 2 * parseFloat(getComputedStyle(title).top));
      // room below the list, so every stop can ride up to the reading line and the words move with each notch
      const padB = Math.round(view.clientHeight * 0.84) + "px";
      if (inner.style.paddingBottom !== padB) inner.style.paddingBottom = padB;
      const anchor = view.clientHeight * 0.16;
      ys = [0];
      for (let i = 1; i < lis.length; i++) ys[i] = lis[i].offsetTop - anchor;
      ys[last] = brief.offsetTop - anchor;
      maxShift = Math.max(0, inner.offsetHeight - view.clientHeight);
      lastPos = -1;
    }

    const goTo = (k) => { target = clamp(k, 0, last); };
    const step = (dir) => goTo(Math.round(target) + dir);
    const go = (u) => router.push(u);

    // ---------- every frame ----------
    let px = 0, py = 0, inStage = false, bx = 0, by = 0, bubTxt = "";
    function loop() {
      pos += (target - pos) * (reduce ? 1 : 0.3);
      if (Math.abs(target - pos) < 0.002) pos = target;
      if (pos !== lastPos) {
        lastPos = pos;
        // the title rides from the bottom to the top as soon as scrolling starts
        const t = Math.min(1, pos);
        title.style.transform = "translate3d(0," + ((1 - t) * avail).toFixed(1) + "px,0) scale(" + (1 - 0.5 * t).toFixed(3) + ")";
        sub.style.opacity = String(1 - t);
        stage.style.setProperty("--t", t.toFixed(3));
        prog.style.transform = "scaleX(" + (pos / last).toFixed(4) + ")";
        // the words move in step with the frames
        const i0 = Math.floor(pos), i1 = Math.min(last, i0 + 1), f = pos - i0;
        const yy = ys[i0] + (ys[i1] - ys[i0]) * f;
        inner.style.transform = "translate3d(0," + (-clamp(yy, 0, maxShift)).toFixed(1) + "px,0)";
        const o = Math.round(pos);
        if (o !== shown) {
          shown = o;
          lis.forEach((li, i) => li.classList.toggle("on", i === o));
          brief.classList.toggle("on", o === last);
          const ph = Math.min(o, stops - 1);
          phs.forEach((im, i) => im.classList.toggle("on", i === ph));
          cnt.textContent = o < last ? pad2(o + 1) + " / " + pad2(stops) : "About";
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
      const txt = right ? (Math.round(target) < last ? "Next" : "Next project") : (Math.round(target) > 0 ? "Back" : "");
      if (txt !== bubTxt) { bubTxt = txt; bubt.textContent = txt; cl.classList.toggle("on", !!txt); }
    }
    on(stage, "pointerenter", (e) => {
      if (!fine || e.pointerType !== "mouse") return;
      inStage = true; px = e.clientX; py = e.clientY;
      const r = stage.getBoundingClientRect(); bx = px - r.left; by = py - r.top;
      cl.classList.add("show");
    });
    on(stage, "pointerleave", () => { inStage = false; cl.classList.remove("show"); });

    // ---------- input: one stop per notch, no lag ----------
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

    // a swipe anywhere (stage or text) steps, like a notch
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
    on(q(".pv-tour"), "click", (e) => { const li = e.target.closest("li"); if (li) goTo(+li.dataset.n); });

    on(document, "keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); step(1); }
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); step(-1); }
      else if (e.key === "Home") goTo(0);
      else if (e.key === "End") goTo(last);
      else if (e.key === "]") go(href(next));
      else if (e.key === "[") go(href(prev));
      else if (e.key === "Escape") q(".pv-xclose").click();
    });
    // back to wherever the visitor came from on this site; otherwise the link opens the projects on the home page
    on(q(".pv-xclose"), "click", (e) => {
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
  }, [p, prev, next, router, stops]);

  return (
    <div className="pv" ref={root}>
      <div className="pv-wrap">
        <div className="pv-main">
          <section className="pv-stage" aria-roledescription="carousel" aria-label={p.name + ", frames"}>
            {p.tour.map((t, k) => {
              const im = p.images[t.img];
              return (
                <img key={k} className={"pv-ph" + (k === 0 ? " on" : "")} src={im.src} srcSet={`${im.sm} 800w, ${im.src} 1600w`}
                  sizes="(max-width: 760px) 100vw, 72vw" width={im.w} height={im.h} alt={im.alt} draggable="false"
                  fetchPriority={k === 0 ? "high" : "auto"} decoding="async" />
              );
            })}
            <div className="pv-shade" />
            <div className="pv-title">
              <h1>{lead}<em>{em}</em>.<span className="pv-sub">{p.sub}</span></h1>
            </div>
            <div className="pv-prog" aria-hidden="true"><b /></div>
            <div className="pv-cur" aria-hidden="true"><div className="pv-bub"><b /></div><div className="pv-dot"><b /></div></div>
          </section>

          <aside className="pv-copy" aria-label="About the project">
            <div className="pv-lab">
              <b>The idea</b><span className="pv-cnt">01 / {pad2(stops)}</span>
              <a className="pv-xclose" href="/#work" aria-label="Close project">
                <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" aria-hidden="true"><path d="M2 2l14 14M16 2L2 16" /></svg>
              </a>
            </div>
            <div className="pv-view">
              <div className="pv-in">
                <p className="pv-idea">
                  <span className="pv-gh">{p.idea}</span>
                  <span className="pv-ty" aria-hidden="true"><span className="pv-tt" /><i className="pv-caret" /></span>
                </p>
                <ol className="pv-tour">
                  {p.tour.map((s, i) => (
                    <li key={i} data-n={i} className={i === 0 ? "on" : ""}>
                      <span className="pv-k">{pad2(i + 1)}</span>
                      <div><span className="pv-lb">{s.label}</span><strong>{s.line}</strong></div>
                    </li>
                  ))}
                </ol>
                <div className="pv-brief">
                  <span className="pv-lb">About the project</span>
                  <p>{p.brief}</p>
                </div>
              </div>
            </div>
            <a className="pv-cta" href="/#cost-calculator">Get a price for your space <span aria-hidden="true">→</span></a>
          </aside>
        </div>

        <dl className="pv-facts">
          <div className="pv-fact f-loc"><dt>Locality</dt><dd>{p.where}</dd></div>
          <div className="pv-fact f-space"><dt>Space</dt><dd>{p.space}</dd></div>
          <div className="pv-fact f-cat"><dt>Category</dt><dd>{p.cat}</dd></div>
          <div className="pv-fact f-frames"><dt>Frames</dt><dd>{p.images.length}</dd></div>
          <div className="pv-fact f-prev"><dt>Previous</dt><dd><Link href={href(prev)}>← {prev.name}</Link></dd></div>
          <div className="pv-fact f-next"><dt>Next project</dt><dd><Link href={href(next)}>{next.name} →</Link></dd></div>
        </dl>
      </div>
    </div>
  );
}
