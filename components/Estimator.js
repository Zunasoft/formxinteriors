"use client";
import { useEffect } from "react";
import "./Estimator.css";

export default function Estimator() {
  useEffect(() => {
    const ITEMS = [
      { k: "kitchen",  n: "Modular kitchen",       t: 250, p: 350, on: true },
      { k: "wardrobe", n: "Wardrobes",              t: 300, p: 420, on: true },
      { k: "tv",       n: "TV + crockery unit",     t: 160, p: 220, on: true },
      { k: "ceiling",  n: "False ceiling",          t: 130, p: 170, on: true },
      { k: "paint",    n: "Painting",               t: 100, p: 120, on: true },
      { k: "elec",     n: "Electrical + lighting",  t: 160, p: 220, on: true },
    ];
    const TYPE = { apartment: 1, villa: 1.08, modular: 1, commercial: 1.15, showflat: 0.92 };
    const SPREAD = 0.06;

    const $ = (id) => document.getElementById(id);
    let type = "apartment", cfg = "3", area = 1750, unlocked = false;

    /* heading word reveal */
    const splitEl = document.querySelector(".est-section [data-split]");
    if (splitEl && !splitEl.dataset.done) {
      splitEl.dataset.done = "1";
      splitEl.innerHTML =
        '<span class="line">' +
        splitEl.innerHTML.replace(/(\S+)/g, '<span class="w">$1</span>') +
        "</span>";
      [...splitEl.querySelectorAll(".w")].forEach(
        (w, i) => (w.style.transitionDelay = i * 38 + "ms")
      );
      new IntersectionObserver(
        (es, o) =>
          es.forEach((e) => {
            if (e.isIntersecting) { e.target.classList.add("in"); o.unobserve(e.target); }
          }),
        { threshold: 0.2 }
      ).observe(splitEl);
    }

    /* scope toggles */
    const scopeEl = $("est-scope");
    if (scopeEl) {
      scopeEl.innerHTML = ITEMS.map(
        (i) =>
          `<button class="est-sw" data-k="${i.k}" aria-pressed="${i.on}"><i></i>${i.n}</button>`
      ).join("");
    }

    const inr = (n) =>
      n >= 1e7 ? "₹" + (n / 1e7).toFixed(2) + " Cr" : "₹" + (n / 1e5).toFixed(1) + " L";

    function totals() {
      const m = TYPE[type] || 1;
      let t = 0, p = 0;
      ITEMS.forEach((i) => { if (i.on) { t += i.t; p += i.p; } });
      return { rt: t * m, rp: p * m, t: t * m * area, p: p * m * area };
    }

    function write(fig, per, mid, rate, animate) {
      const show = (v) => inr(v * (1 - SPREAD)) + " – " + inr(v * (1 + SPREAD));
      if (animate) {
        const t0 = performance.now();
        (function s(x) {
          const k = Math.min(1, (x - t0) / 900),
            e = 1 - Math.pow(1 - k, 3);
          fig.textContent = show(mid * e);
          if (k < 1) requestAnimationFrame(s);
        })(t0);
      } else { fig.textContent = show(mid); }
      per.textContent = "₹" + Math.round(rate).toLocaleString("en-IN") + " / sq ft";
    }

    function paint(animate) {
      const v = totals();
      const ids = [
        [$("est-figT"), $("est-perT"), v.t, v.rt],
        [$("est-figP"), $("est-perP"), v.p, v.rp],
        [$("est-dFigT"), $("est-dPerT"), v.t, v.rt],
        [$("est-dFigP"), $("est-dPerP"), v.p, v.rp],
      ];
      ids.forEach(([fig, per, mid, rate]) => {
        if (fig && per) write(fig, per, mid, rate, animate);
      });
      const sn = $("est-scopeN");
      if (sn) sn.textContent = ITEMS.filter((i) => i.on).length + " selected";
    }

    function group(id, fn) {
      const el = $(id);
      if (!el) return;
      el.addEventListener("click", (e) => {
        const b = e.target.closest(".est-opt");
        if (!b || b.disabled) return;
        [...e.currentTarget.children].forEach((c) => c.setAttribute("aria-pressed", "false"));
        b.setAttribute("aria-pressed", "true");
        fn(b.dataset.v);
        paint(false);
      });
    }

    group("est-ptype", (v) => {
      type = v;
      const lock = v === "modular" || v === "commercial";
      const cfgField = $("est-cfgField");
      if (cfgField) cfgField.style.opacity = lock ? 0.45 : 1;
      const cfgEl = $("est-cfg");
      if (cfgEl) [...cfgEl.children].forEach((c) => (c.disabled = lock));
      ITEMS.forEach(
        (i) => (i.on = v === "modular" ? i.k === "kitchen" || i.k === "wardrobe" : true)
      );
      const scopeChildren = scopeEl ? [...scopeEl.children] : [];
      scopeChildren.forEach((b) =>
        b.setAttribute("aria-pressed", ITEMS.find((i) => i.k === b.dataset.k).on)
      );
    });

    group("est-cfg", (v) => { cfg = v; });

    if (scopeEl) {
      scopeEl.addEventListener("click", (e) => {
        const b = e.target.closest(".est-sw");
        if (!b) return;
        const it = ITEMS.find((i) => i.k === b.dataset.k);
        if (it.on && ITEMS.filter((i) => i.on).length === 1) return;
        it.on = !it.on;
        b.setAttribute("aria-pressed", it.on);
        paint(false);
      });
    }

    const areaEl = $("est-area");
    if (areaEl) {
      areaEl.addEventListener("input", (e) => {
        area = +e.target.value;
        const av = $("est-areaV");
        if (av) av.textContent = area.toLocaleString("en-IN");
        paint(false);
      });
    }

    /* dialog */
    function recap() {
      const label = { apartment: "Apartment", villa: "Villa", modular: "Modulars only", commercial: "Commercial", showflat: "Show flat" }[type];
      const bits = [label];
      if (type !== "modular" && type !== "commercial") bits.push(cfg + " BHK");
      bits.push(area.toLocaleString("en-IN") + " sq ft");
      ITEMS.filter((i) => i.on).forEach((i) => bits.push(i.n));
      const rc = $("est-recap");
      if (rc) rc.innerHTML = bits.map((b) => `<i>${b}</i>`).join("");
    }

    function openDlg() {
      recap(); paint(false);
      $("est-scrim")?.classList.add("on");
      $("est-dlg")?.classList.add("on");
      document.body.style.overflow = "hidden";
      if (unlocked) swapTo("result", false);
      else { swapTo("form", false); setTimeout(() => $("est-fname")?.focus(), 240); }
    }

    function closeDlg() {
      $("est-scrim")?.classList.remove("on");
      $("est-dlg")?.classList.remove("on");
      document.body.style.overflow = "";
      setTimeout(() => { const dlg = $("est-dlg"); if (dlg) dlg.style.height = ""; }, 380);
    }

    function swapTo(which, animate) {
      const dlg = $("est-dlg"), f = $("est-paneForm"), r = $("est-paneResult");
      const title = $("est-dtitle");
      if (!dlg || !f || !r) return;
      const from = dlg.offsetHeight;
      if (which === "result") {
        f.className = "est-pane est-pane--out";
        r.className = "est-pane est-pane--in";
        if (title) title.innerHTML = 'Your estimate, <em>unlocked</em>.';
      } else {
        r.className = "est-pane est-pane--out";
        f.className = "est-pane est-pane--in";
        if (title) title.innerHTML = 'Where should we send the <em>number</em>?';
      }
      if (!animate) return;
      const to = dlg.scrollHeight;
      dlg.style.height = from + "px";
      requestAnimationFrame(() => {
        dlg.style.height = to + "px";
        setTimeout(() => { dlg.style.height = ""; }, 460);
      });
    }

    $("est-calcBtn")?.addEventListener("click", openDlg);
    $("est-dclose")?.addEventListener("click", closeDlg);
    $("est-dDone")?.addEventListener("click", closeDlg);
    $("est-scrim")?.addEventListener("click", closeDlg);

    const phoneEl = $("est-fphone");
    if (phoneEl) phoneEl.addEventListener("input", (e) => (e.target.value = e.target.value.replace(/\D/g, "")));

    [$("est-exact"), $("est-dExact")].forEach((b) => {
      if (b) b.addEventListener("click", () => { closeDlg(); location.hash = "#book"; });
    });

    $("est-revealBtn")?.addEventListener("click", () => {
      const name = $("est-fname")?.value.trim() ?? "";
      const phone = $("est-fphone")?.value ?? "";
      const ok = name.length > 1 && phone.length === 10;
      $("est-err")?.classList.toggle("est-err--on", !ok);
      if (!ok) { name.length > 1 ? $("est-fphone")?.focus() : $("est-fname")?.focus(); return; }
      const v = totals();
      const lead = {
        name, phone, place: $("est-fplace")?.value.trim(),
        possession: $("est-fposs")?.value, start: $("est-fstart")?.value,
        type, config: cfg, area,
        scope: ITEMS.filter((i) => i.on).map((i) => i.n),
        titanium: Math.round(v.t), platinum: Math.round(v.p),
      };
      console.log("FORM X LEAD →", lead);
      unlocked = true;
      swapTo("result", true);
      paint(true);
      const cb = $("est-calcBtn");
      if (cb) cb.innerHTML = 'Recalculate <span>→</span>';
      $("est-result")?.classList.add("est-result--on");
    });

    const kbHandler = (e) => { if (e.key === "Escape") closeDlg(); };
    window.addEventListener("keydown", kbHandler);

    paint(false);
    return () => { window.removeEventListener("keydown", kbHandler); };
  }, []);

  return (
    <section className="est-section" id="estimate" aria-labelledby="est-heading">
      <div className="est-eyebrow"><span className="mono">Your quote</span></div>
      <h2 id="est-heading" data-split>Your number, before anyone calls you.</h2>
      <div className="mono est-sub">Pick the job. Move the slider. Then calculate.</div>

      <div className="est-reqs">

        {/* project type */}
        <div className="est-field">
          <div className="est-flabel"><span className="mono">Project type</span></div>
          <div className="est-opts" id="est-ptype">
            <button className="est-opt" aria-pressed="true" data-v="apartment">Apartment</button>
            <button className="est-opt" data-v="villa">Villa</button>
            <button className="est-opt" data-v="modular">Modulars only</button>
            <button className="est-opt" data-v="commercial">Commercial</button>
            <button className="est-opt" data-v="showflat">Show flat</button>
          </div>
        </div>

        {/* configuration + slider */}
        <div className="est-field" id="est-cfgField">
          <div className="est-flabel"><span className="mono">Configuration</span></div>
          <div className="est-cfgrow">
            <div className="est-opts" id="est-cfg">
              <button className="est-opt" data-v="2">2 BHK</button>
              <button className="est-opt" aria-pressed="true" data-v="3">3 BHK</button>
              <button className="est-opt" data-v="4">4 BHK</button>
            </div>
            <span className="est-big"><span id="est-areaV">1,750</span> sq ft</span>
          </div>
          <input type="range" id="est-area" min="700" max="4000" step="50" defaultValue="1750"
            aria-label="Carpet area in square feet" className="est-range" />
          <div className="est-ends"><span className="mono">700</span><span className="mono">4,000 sq ft</span></div>
        </div>

        {/* scope */}
        <div className="est-field">
          <div className="est-flabel">
            <span className="mono">Included</span>
            <span className="mono" id="est-scopeN">6 selected</span>
          </div>
          <div className="est-scope" id="est-scope"></div>
        </div>

        {/* CTA bar */}
        <div className="est-gobar">
          <button className="est-calc" id="est-calcBtn">Calculate my estimate <span>→</span></button>
          <span className="mono">Free · no obligation · you keep the drawing either way</span>
        </div>

        {/* persistent result strip */}
        <div className="est-result" id="est-result">
          <span className="mono">Indicative — exact after measurement</span>
          <div className="est-tiers">
            <div className="est-tier">
              <div className="est-tier-nm">Titanium</div>
              <div className="est-tier-brands">Indian brands</div>
              <div className="est-tier-fig" id="est-figT">—</div>
              <div className="est-tier-per" id="est-perT"></div>
              <ul>
                <li>BWP ply carcass</li><li>Merino laminate</li>
                <li>Hettich India hardware</li><li>Quartz counter</li>
              </ul>
            </div>
            <div className="est-tier est-tier--best">
              <div className="est-tier-nm">Platinum</div>
              <div className="est-tier-brands">Imported brands</div>
              <div className="est-tier-fig" id="est-figP">—</div>
              <div className="est-tier-per" id="est-perP"></div>
              <ul>
                <li>BWP ply carcass</li><li>Acrylic / PU shutters</li>
                <li>Imported soft-close hardware</li><li>Upgraded counters</li>
              </ul>
            </div>
          </div>
          <div className="est-badges">
            <i>10-year warranty</i><i>Fixed after sign-off</i><i>Line-by-line quote</i>
          </div>
          <div className="est-rfoot">
            <span className="mono">Priced on the sq ft in your agreement. Exact figure after measurement — and it does not move after that.</span>
            <button className="est-ghost" id="est-exact">Get the exact cost in 48 hours →</button>
          </div>
        </div>

      </div>

      {/* scrim + dialog */}
      <div className="est-scrim" id="est-scrim"></div>
      <div className="est-dlg" id="est-dlg" role="dialog" aria-modal="true" aria-labelledby="est-dtitle">
        <div className="est-dhead">
          <h3 id="est-dtitle">Where should we send the <em>number</em>?</h3>
          <button className="est-xbtn" id="est-dclose" aria-label="Close">
            <svg viewBox="0 0 100 100" width="13" height="13">
              <path d="M24 24L76 76M76 24L24 76" stroke="#F6F2EE" strokeWidth="14" />
            </svg>
          </button>
        </div>

        <div className="est-recap" id="est-recap"></div>

        {/* pane A — form */}
        <div className="est-pane est-pane--in" id="est-paneForm">
          <div style={{ marginTop: 16 }}>
            <div className="est-two">
              <label className="est-f">
                <span>Your name</span>
                <input type="text" id="est-fname" autoComplete="name" placeholder="Rajesh Kumar" />
              </label>
              <label className="est-f">
                <span>WhatsApp number</span>
                <input type="tel" id="est-fphone" autoComplete="tel" inputMode="numeric" maxLength={10} placeholder="98XXXXXXXX" />
              </label>
            </div>
            <div className="est-err" id="est-err">Please add your name and a 10-digit mobile number.</div>
            <label className="est-f">
              <span>Project, tower or area</span>
              <input type="text" id="est-fplace" placeholder="e.g. Kokapet, or your project name" />
            </label>
            <div className="est-two">
              <label className="est-f">
                <span>Possession</span>
                <select id="est-fposs">
                  <option>Already living in it</option>
                  <option defaultValue="">Handover soon</option>
                  <option>Under construction</option>
                </select>
              </label>
              <label className="est-f">
                <span>Start work</span>
                <select id="est-fstart">
                  <option>Immediately</option>
                  <option defaultValue="">After 1 month</option>
                  <option>After 3 months</option>
                  <option>After 6 months</option>
                </select>
              </label>
            </div>
            <button className="est-reveal" id="est-revealBtn">Reveal my estimate →</button>
            <div className="est-fine">We call once to confirm the scope. No drip campaign.</div>
          </div>
        </div>

        {/* pane B — numbers */}
        <div className="est-pane est-pane--out" id="est-paneResult">
          <div style={{ marginTop: 16 }}>
            <span className="mono">Indicative — exact after measurement</span>
            <div className="est-tiers">
              <div className="est-tier">
                <div className="est-tier-nm">Titanium</div>
                <div className="est-tier-brands">Indian brands</div>
                <div className="est-tier-fig" id="est-dFigT">—</div>
                <div className="est-tier-per" id="est-dPerT"></div>
                <ul>
                  <li>BWP ply carcass</li><li>Merino laminate</li>
                  <li>Hettich India hardware</li><li>Quartz counter</li>
                </ul>
              </div>
              <div className="est-tier est-tier--best">
                <div className="est-tier-nm">Platinum</div>
                <div className="est-tier-brands">Imported brands</div>
                <div className="est-tier-fig" id="est-dFigP">—</div>
                <div className="est-tier-per" id="est-dPerP"></div>
                <ul>
                  <li>BWP ply carcass</li><li>Acrylic / PU shutters</li>
                  <li>Imported soft-close hardware</li><li>Upgraded counters</li>
                </ul>
              </div>
            </div>
            <div className="est-badges">
              <i>10-year warranty</i><i>Fixed after sign-off</i><i>Line-by-line quote</i>
            </div>
            <div className="est-done">
              <button className="est-ghost" id="est-dExact">Get the exact cost in 48 hours →</button>
              <button className="est-ghost" id="est-dDone">Close</button>
            </div>
            <div className="est-fine">Your estimate stays on the page below for this visit.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
