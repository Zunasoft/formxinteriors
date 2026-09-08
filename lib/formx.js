// form X Interiors — all interactive behaviour, ported to run after React mount.
// Returns a cleanup function that stops every animation loop and listener.

export default function initFormX() {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer:fine)").matches;

  let stopped = false;
  const listeners = [];
  const observers = [];
  const on = (t, type, fn, opts) => {
    t.addEventListener(type, fn, opts);
    listeners.push([t, type, fn, opts]);
  };
  const $ = (id) => document.getElementById(id);

  /* ---- split headings into words ---- */
  document.querySelectorAll("[data-split]").forEach((el) => {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    const html = el.innerHTML;
    el.innerHTML =
      '<span class="line">' +
      html.replace(/(\S+)/g, '<span class="w">$1</span>') +
      "</span>";
    [...el.querySelectorAll(".w")].forEach(
      (w, i) => (w.style.transitionDelay = i * 38 + "ms")
    );
  });

  /* ---- cursor + magnetic ---- */
  if (fine) {
    const cur = $("cur"),
      lbl = cur.querySelector("b");
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0;
    document.body.classList.add("hidecur");
    on(window, "pointermove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
    });
    (function loop() {
      if (stopped) return;
      cx += (tx - cx) * 0.19;
      cy += (ty - cy) * 0.19;
      cur.style.transform =
        "translate(" +
        (cx - cur.offsetWidth / 2) +
        "px," +
        (cy - cur.offsetHeight / 2) +
        "px)";
      document.querySelectorAll(".mag").forEach((m) => {
        const r = m.getBoundingClientRect(),
          dx = tx - (r.left + r.width / 2),
          dy = ty - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy),
          k = d < 160 ? 1 - d / 160 : 0;
        m.style.transform =
          "translate(" + dx * k * 0.3 + "px," + dy * k * 0.3 + "px)";
      });
      requestAnimationFrame(loop);
    })();
    on(document, "pointerover", (e) => {
      const t = e.target.closest("[data-cursor]");
      if (t) {
        cur.classList.add("big");
        lbl.textContent = t.dataset.cursor;
      } else {
        cur.classList.remove("big");
        lbl.textContent = "";
      }
    });
  }

  /* ---- intro ---- */
  (function () {
    const intro = $("intro"),
      logo = intro.querySelector(".intro-logo"),
      btn = $("xbtn"),
      bar = document.querySelector(".brandbar");
    let killed = false;
    function finish() {
      if (killed) return;
      killed = true;
      btn.style.opacity = 1;
      bar.style.opacity = 1;
      intro.style.display = "none";
    }
    if (reduce) {
      finish();
      return;
    }
    const E = "cubic-bezier(.76,0,.24,1)";
    logo.animate(
      [
        { opacity: 0, transform: "translateY(24px) scale(.94)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 700, delay: 150, easing: E, fill: "both" }
    );
    const t1 = setTimeout(() => {
      if (killed) return;
      const a = logo.getBoundingClientRect(),
        b = btn.getBoundingClientRect(),
        s = (b.width * 1.6) / a.width;
      logo.animate(
        [
          { transform: "none", opacity: 1 },
          {
            transform: `translate(${b.left + b.width / 2 - (a.left + a.width / 2)}px,${
              b.top + b.height / 2 - (a.top + a.height / 2)
            }px) scale(${s})`,
            opacity: 0,
          },
        ],
        { duration: 780, easing: "cubic-bezier(.7,0,.15,1)", fill: "both" }
      );
      intro.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 520,
        delay: 420,
        easing: "ease",
        fill: "both",
      });
      setTimeout(finish, 900);
    }, 2000);
    on(window, "wheel", finish, { once: true, passive: true });
    on(window, "touchstart", finish, { once: true, passive: true });
    on(intro, "click", finish);
    listeners.push([{ removeEventListener() { clearTimeout(t1); } }, "", () => {}]);
  })();

  /* ---- menu ---- */
  (function () {
    const btn = $("xbtn"),
      menu = $("menu"),
      links = [...menu.querySelectorAll("a")];
    let open = false;
    function set(v) {
      open = v;
      btn.classList.toggle("on", v);
      menu.classList.toggle("on", v);
      btn.setAttribute("aria-expanded", v);
      menu.setAttribute("aria-hidden", !v);
      btn.dataset.cursor = v ? "close" : "menu";
      links.forEach((a, i) =>
        a.animate(
          [
            { opacity: 0, transform: "translateY(26px)" },
            { opacity: 1, transform: "none" },
          ],
          {
            duration: 520,
            delay: v ? 120 + i * 60 : 0,
            easing: "cubic-bezier(.2,.7,.3,1)",
            fill: "both",
          }
        )
      );
    }
    on(btn, "click", () => set(!open));
    links.forEach((a) => on(a, "click", () => set(false)));
    on(window, "keydown", (e) => {
      if (e.key === "Escape" && open) set(false);
    });
  })();

  /* =========================================================
     SCROLL-SCRUBBED FILM
     ========================================================= */
  const VIDEO_SRC = "/vedios/Trim_apartment_super_hd-Trim.mp4";
  (function () {
    const hero = $("vhero"),
      film = $("film"),
      sim = $("sim"),
      fill = $("sfill"),
      caps = [...document.querySelectorAll(".cap")],
      tag = document.querySelector(".tag");
    let p = 0,
      shown = 0,
      frames = [],
      FRAME_COUNT = 48,
      coarse = !matchMedia("(pointer:fine)").matches;

    // Scrubbing a live <video> element via currentTime on every scroll tick
    // is what causes the "stuck" look: MP4 seeks must decode forward from
    // the nearest keyframe, so on a fast scroll the seeks fall behind and
    // the frame appears frozen/jumpy. Instead, decode a fixed set of frames
    // to canvas once up front, then scrub by blitting the nearest cached
    // frame — no seeking happens during scroll at all.
    // Resolves true once the seek lands, or false if it errors/stalls — a
    // decoder can get stuck mid-seek (some environments hit a hard decode
    // error), and an unresolved promise here would hang extraction forever.
    function seekTo(t) {
      return new Promise((resolve) => {
        let done = false;
        const finish = (ok) => {
          if (done) return;
          done = true;
          film.removeEventListener("seeked", onSeeked);
          film.removeEventListener("error", onError);
          clearTimeout(timer);
          resolve(ok);
        };
        const onSeeked = () => finish(true);
        const onError = () => finish(false);
        const timer = setTimeout(() => finish(false), 2500);
        film.addEventListener("seeked", onSeeked);
        film.addEventListener("error", onError);
        try {
          film.currentTime = t;
        } catch (e) {
          finish(false);
        }
      });
    }
    async function extractFrames() {
      const dur = film.duration - 0.05;
      if (!(dur > 0)) return;
      const targetW = Math.min(1280, Math.round(sim.clientWidth * 1.5) || 1280);
      const aspect = (film.videoHeight || 9) / (film.videoWidth || 16);
      const targetH = Math.round(targetW * aspect);
      // Frames are pushed one at a time (not swapped in all at once) so the
      // real footage appears progressively as soon as the first few frames
      // decode, instead of the placeholder holding for the entire batch.
      for (let i = 0; i < FRAME_COUNT; i++) {
        if (stopped) return;
        const ok = await seekTo((i / (FRAME_COUNT - 1)) * dur);
        if (stopped) return;
        if (!ok) {
          // Decoding broke down partway through — bail out and keep the
          // procedural placeholder for the whole scrub rather than leaving
          // real footage for part of the range and a frozen frame for the
          // rest.
          frames.length = 0;
          return;
        }
        const c = document.createElement("canvas");
        c.width = targetW;
        c.height = targetH;
        c.getContext("2d").drawImage(film, 0, 0, targetW, targetH);
        frames.push(c);
      }
    }

    if (VIDEO_SRC) {
      film.src = VIDEO_SRC;
      if (coarse) {
        film.style.display = "block";
        sim.style.display = "none";
        film.loop = true;
        on(film, "loadedmetadata", () => film.play().catch(() => {}));
      } else {
        // Stays "visible" (opacity 0, not display:none) so it keeps
        // decoding frames for drawImage — some browsers stop decoding a
        // display:none video, which would freeze the extracted frames.
        film.style.opacity = "0";
        film.style.pointerEvents = "none";
        on(film, "loadedmetadata", extractFrames);
      }
    }

    const ctx = sim.getContext("2d");
    let W, H;
    function size() {
      const d = Math.min(devicePixelRatio || 1, 2);
      W = sim.clientWidth;
      H = sim.clientHeight;
      sim.width = W * d;
      sim.height = H * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
    }
    function room(k) {
      ctx.clearRect(0, 0, W, H);
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, "#22333B");
      g.addColorStop(0.55, "#16242B");
      g.addColorStop(1, "#0B1216");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      const vx = W * (0.46 + k * 0.1),
        vy = H * 0.52,
        depth = 18;
      ctx.lineWidth = 1;
      for (let i = 0; i < depth; i++) {
        const z = ((i + k * 4) % depth) / depth;
        const s = Math.pow(z, 1.7);
        const x = vx - (vx + W * 0.32) * s,
          y = vy - (vy + H * 0.28) * s,
          w2 = W * 1.64 * s,
          h2 = H * 1.56 * s;
        ctx.strokeStyle = "rgba(246,242,238," + (0.3 * (1 - z) * (1 - z) + 0.02) + ")";
        ctx.strokeRect(x, y, w2, h2);
        if (i % 4 === 0) {
          ctx.fillStyle = "rgba(242,104,41," + 0.16 * (1 - z) + ")";
          ctx.fillRect(x + w2 * 0.08, y + h2 * 0.62, w2 * 0.2, h2 * 0.26);
        }
      }
      ctx.fillStyle = "rgba(242,104,41," + (0.1 + k * 0.1) + ")";
      ctx.beginPath();
      ctx.arc(vx, vy, Math.max(W, H) * 0.06, 0, 7);
      ctx.fill();
    }
    let lastT = 0,
      raf = null,
      heroVisible = true;
    function scheduleFrame() {
      if (raf == null) raf = requestAnimationFrame(frame);
    }
    function frame(t) {
      raf = null;
      if (stopped) return;
      const dt = lastT ? Math.min(64, t - lastT) : 16;
      lastT = t;
      // Time-based (not per-frame) easing so the chase speed stays constant
      // regardless of display refresh rate — a fixed 0.12-per-frame factor
      // would scrub visibly faster on a 144Hz screen than on a 60Hz one.
      const ease = 1 - Math.exp(-dt / 110);
      shown += (p - shown) * ease;
      if (!coarse) {
        if (frames.length) {
          const idx = Math.min(
            frames.length - 1,
            Math.max(0, Math.round(shown * (FRAME_COUNT - 1)))
          );
          ctx.clearRect(0, 0, W, H);
          ctx.drawImage(frames[idx], 0, 0, W, H);
        } else {
          room(shown);
        }
      }
      fill.style.width = shown * 100 + "%";
      const i = Math.min(caps.length - 1, Math.floor(shown * caps.length * 0.999));
      caps.forEach((c, n) => c.classList.toggle("on", n === i));
      if (tag) tag.style.opacity = shown > 0.04 ? 0 : 0.9;
      // Keep chasing while the target hasn't been reached yet even if the
      // hero just left view (so it doesn't freeze mid-catch-up), but once
      // settled, stop entirely rather than burning a canvas redraw every
      // frame for a section that's off-screen — that stray main-thread work
      // is what was showing up as jank elsewhere on the page (e.g. while
      // scrolling the Projects wall further down).
      if (heroVisible || Math.abs(p - shown) > 0.001) scheduleFrame();
    }
    function onScroll() {
      const r = hero.getBoundingClientRect();
      const span = hero.offsetHeight - innerHeight;
      p = Math.max(0, Math.min(1, -r.top / span));
    }
    const heroIO = new IntersectionObserver(
      ([e]) => {
        heroVisible = e.isIntersecting;
        if (heroVisible) scheduleFrame();
      },
      { threshold: 0 }
    );
    heroIO.observe(hero);
    observers.push(heroIO);
    size();
    onScroll();
    scheduleFrame();
    on(window, "scroll", onScroll, { passive: true });
    on(window, "resize", () => {
      size();
      onScroll();
    });
  })();

  /* ---- marquee reacts to scroll ---- */
  (function () {
    const el = $("mqi");
    const wrap = el.parentElement;
    let off = 0,
      last = scrollY,
      extra = 0,
      hovering = false,
      hoverT = 0;
    if (wrap) {
      wrap.addEventListener("mouseenter", () => (hovering = true));
      wrap.addEventListener("mouseleave", () => (hovering = false));
    }
    (function loop() {
      if (stopped) return;
      const d = scrollY - last;
      last = scrollY;
      extra += (d * 0.6 - extra) * 0.1;
      hoverT += ((hovering ? 1 : 0) - hoverT) * 0.08;
      const mult = 1 - hoverT * 0.85;
      off -= (0.6 + extra) * mult;
      if (off < -el.scrollWidth / 2) off += el.scrollWidth / 2;
      if (off > 0) off -= el.scrollWidth / 2;
      el.style.transform = "translateX(" + off + "px)";
      requestAnimationFrame(loop);
    })();
  })();

  /* =========================================================
     EXECUTION TIERS
     ========================================================= */
  const TIERS = {
    base: {
      name: "Titanium",
      mult: 1,
      line: "Century / Greenply BWP · Merino & Greenlam laminate · Hettich India hardware",
      warranty: "1 year workmanship + brand warranty on hardware",
      cost: [31, 13, 17, 21, 6, 12],
      rows: {
        Carcass: [
          "Commercial / BWP ply, 18mm",
          "BWP ply, 18mm (Wet areas)",
          "Birch ply, 18mm",
        ],
        Shutters: [
          "Merino laminate, 1mm",
          "HDHMR / Egger surfaces",
          "Fenix or acrylic, PU option",
        ],
        "Edge banding": [
          "1mm PVC, machine pressed",
          "2mm ABS, laser edge",
          "2mm ABS, laser edge",
        ],
        "Hinges & channels": [
          "Hettich India, soft close",
          "Blum, lifetime-rated",
          "Häfele or Blum, lifetime-rated",
        ],
        "Storage systems": [
          "Standard shelves and rods",
          "Blum internal systems",
          "Kesseböhmer & Blum systems",
        ],
        "Kitchen counter": [
          "Indian granite or quartz",
          "Imported quartz",
          "Premium solid surface",
        ],
        "Sanitary & fittings": [
          "Jaquar or Cera",
          "Grohe or Hansgrohe",
          "Duravit or Kohler premium",
        ],
        Lighting: [
          "Indian LED profiles",
          "Track & profile lighting",
          "Tuneable white, smart lighting",
        ],
        Warranty: [
          "1 year workmanship",
          "5 year workmanship",
          "Lifetime brand warranty",
        ],
        "Typical timeline": [
          "8 to 10 weeks",
          "10 to 12 weeks",
          "12 to 14 weeks",
        ],
      },
    },
    adv: {
      name: "Platinum",
      mult: 1.62,
      line: "Egger & Fenix surfaces · Blum and Häfele hardware · Kesseböhmer internals",
      warranty: "5 year workmanship + full brand warranty passed through",
      cost: [24, 18, 26, 18, 5, 9],
    },
  };
  let TIER = "base";

  const UNITS = {
    t2: {
      label: "2 BHK · 1,120 sq ft",
      rooms: [
        { n: "Living + dining", s: "TV unit, crockery", x: 2, y: 2, w: 44, h: 32, a: 58, r: 1900 },
        { n: "Kitchen", s: "Modular kitchen", x: 48, y: 2, w: 30, h: 22, a: 80, r: 2100 },
        { n: "Utility", s: "Shelving", x: 80, y: 2, w: 18, h: 22, a: 26, r: 900 },
        { n: "Master bedroom", s: "Wardrobe, bed back", x: 48, y: 26, w: 50, h: 24, a: 140, r: 1750 },
        { n: "Bedroom 2", s: "Wardrobe, study", x: 2, y: 36, w: 32, h: 34, a: 112, r: 1600 },
        { n: "Pooja", s: "Pooja unit", x: 36, y: 52, w: 22, h: 18, a: 18, r: 2600 },
        { n: "Foyer", s: "Shoe rack, console", x: 60, y: 52, w: 16, h: 18, a: 22, r: 1700 },
        { n: "Balcony", s: "Deck, planters", x: 78, y: 52, w: 20, h: 18, a: 52, r: 700 },
      ],
    },
    t3: {
      label: "3 BHK · 1,650 sq ft",
      rooms: [
        { n: "Living + dining", s: "TV unit, crockery", x: 2, y: 2, w: 44, h: 30, a: 64, r: 1900 },
        { n: "Kitchen", s: "Modular kitchen", x: 48, y: 2, w: 28, h: 20, a: 92, r: 2100 },
        { n: "Utility", s: "Shelving", x: 78, y: 2, w: 20, h: 20, a: 30, r: 900 },
        { n: "Master bedroom", s: "Wardrobe, bed back, sides", x: 48, y: 24, w: 50, h: 22, a: 152, r: 1750 },
        { n: "Bedroom 2", s: "Wardrobe, study", x: 2, y: 34, w: 30, h: 36, a: 120, r: 1600 },
        { n: "Bedroom 3", s: "Wardrobe", x: 34, y: 48, w: 28, h: 22, a: 108, r: 1500 },
        { n: "Pooja", s: "Pooja unit", x: 34, y: 34, w: 12, h: 12, a: 20, r: 2600 },
        { n: "Foyer", s: "Shoe rack, console", x: 64, y: 48, w: 16, h: 22, a: 26, r: 1700 },
        { n: "Balcony", s: "Deck, planters", x: 82, y: 48, w: 16, h: 22, a: 58, r: 700 },
      ],
    },
    t4: {
      label: "4 BHK · 2,400 sq ft",
      rooms: [
        { n: "Living + dining", s: "TV unit, crockery, bar", x: 2, y: 2, w: 40, h: 22, a: 88, r: 2000 },
        { n: "Kitchen", s: "Modular kitchen", x: 44, y: 2, w: 26, h: 22, a: 110, r: 2100 },
        { n: "Utility", s: "Shelving", x: 72, y: 2, w: 26, h: 22, a: 34, r: 900 },
        { n: "Master suite", s: "Walk-in, bed back", x: 2, y: 26, w: 40, h: 22, a: 210, r: 1850 },
        { n: "Bedroom 2", s: "Wardrobe, study", x: 44, y: 26, w: 26, h: 22, a: 130, r: 1600 },
        { n: "Bedroom 3", s: "Wardrobe", x: 72, y: 26, w: 26, h: 22, a: 120, r: 1500 },
        { n: "Bedroom 4", s: "Wardrobe", x: 2, y: 50, w: 32, h: 20, a: 115, r: 1500 },
        { n: "Study", s: "Desk, shelving", x: 36, y: 50, w: 22, h: 20, a: 70, r: 1900 },
        { n: "Pooja", s: "Pooja unit", x: 60, y: 50, w: 16, h: 20, a: 24, r: 2600 },
        { n: "Balcony", s: "Deck, planters", x: 78, y: 50, w: 20, h: 20, a: 76, r: 700 },
      ],
    },
  };
  const PLANS = [
    { p: "Skyline Heights", u: ["t2", "t3"] },
    { p: "Riverstone Enclave", u: ["t3", "t4"] },
    { p: "Aurum Grand", u: ["t2", "t3", "t4"] },
  ];

  let QUOTE_TOTAL = 0;

  (function () {
    const sq = $("sqft"),
      sqv = $("sqftv"),
      tierBtns = $("est-tier") ? [...$("est-tier").querySelectorAll(".chip")] : [],
      scopeBtns = $("est-scope") ? [...$("est-scope").querySelectorAll(".chip")] : [],
      specBtns = $("est-spec-tier") ? [...$("est-spec-tier").querySelectorAll(".chip")] : [],
      specCarcass = $("spec-carcass"),
      specShutters = $("spec-shutters"),
      specHardware = $("spec-hardware"),
      specWarranty = $("spec-warranty"),
      specTimeline = $("spec-timeline"),
      fig = $("fig"),
      per = $("perft"),
      brandline = $("brandline");

    if (!sq) return;

    let tier = "base",
      scope = "full",
      specTier = "titanium",
      raf,
      shown = 0;

    const inr = (n) =>
      n >= 1e7
        ? "₹" + (n / 1e7).toFixed(2) + " Cr"
        : "₹" + (n / 1e5).toFixed(2) + " L";

    // Rate configurations based on finish and scope
    const RATES = {
      base: { full: 1450, kitchen: 900, single: 850, mult: 1, line: "Digital estimate based on BWP ply carcass, Merino laminates, Hettich India hardware. 1 year warranty." },
      adv: { full: 1650, kitchen: 1100, single: 950, mult: 1.62, line: "Digital estimate based on BWP ply carcass, HDHMR shutters, Egger surfaces, Blum hardware. 5 year warranty." },
      lux: { full: 2150, kitchen: 1450, single: 1250, mult: 2.1, line: "Digital estimate based on Birch ply, Fenix or acrylic finish, Hafele hardware, Kessebohmer internals. Lifetime warranty." }
    };

    function updateSpecs() {
      specBtns.forEach(b => b.setAttribute("aria-pressed", b.dataset.specT === specTier));
      
      const rows = TIERS.base.rows;
      let idx = 0;
      if (specTier === "titanium") {
        idx = tier === "base" ? 0 : tier === "adv" ? 1 : 2;
      } else {
        idx = tier === "base" ? 1 : 2;
      }

      if (specCarcass) specCarcass.textContent = rows["Carcass"][idx];
      if (specShutters) specShutters.textContent = rows["Shutters"][idx];
      if (specHardware) specHardware.textContent = rows["Hinges & channels"][idx];
      if (specWarranty) specWarranty.textContent = rows["Warranty"][idx];
      if (specTimeline) specTimeline.textContent = rows["Typical timeline"][idx];
    }

    function update() {
      // Update UI active states
      tierBtns.forEach(b => b.setAttribute("aria-pressed", b.dataset.t === tier));
      scopeBtns.forEach(b => b.setAttribute("aria-pressed", b.dataset.s === scope));

      const a = +sq.value;
      sqv.textContent = a.toLocaleString("en-IN");

      const rate = RATES[tier][scope];
      const tot = a * rate;
      QUOTE_TOTAL = tot;
      
      TIER = tier === "base" ? "base" : "adv"; // map for anatomy section
      document.dispatchEvent(new Event("tier"));

      if (brandline) {
        brandline.textContent = RATES[tier].line;
      }
      
      per.textContent = `at ₹${rate.toLocaleString("en-IN")} / sq ft`;

      updateSpecs();

      cancelAnimationFrame(raf);
      const t0 = performance.now(),
        s0 = shown;
      (function step(t) {
        const k = Math.min(1, (t - t0) / 320),
          e = 1 - Math.pow(1 - k, 3);
        shown = s0 + (tot - s0) * e;
        fig.textContent = inr(shown * 0.94) + " – " + inr(shown * 1.14);
        if (k < 1) raf = requestAnimationFrame(step);
        else document.dispatchEvent(new Event("quote"));
      })(t0);
    }

    sq.oninput = update;
    
    tierBtns.forEach(b => {
      b.onclick = () => { tier = b.dataset.t; update(); };
    });
    
    scopeBtns.forEach(b => {
      b.onclick = () => { scope = b.dataset.s; update(); };
    });

    specBtns.forEach(b => {
      b.onclick = () => { specTier = b.dataset.specT; updateSpecs(); };
    });

    update();
  })();

  /* =========================================================
     COST ANATOMY
     ========================================================= */
  const COST = [
    { k: "Plywood & carcass", v: 31, c: "#F26829", d: "BWP-grade ply for anything near water, MR ply elsewhere. This is the line most quotes cut to hit a low number, and it is the one that decides whether your wardrobe survives a decade." },
    { k: "Laminate & veneer", v: 13, c: "#C24A16", d: "Surface finish, edge banding and adhesive. Wide range here — a matte acrylic shutter and a basic laminate can differ threefold on the same carcass." },
    { k: "Hardware", v: 17, c: "#8C6A3F", d: "Hinges, channels, handles, lift-ups. Branded soft-close hardware carries its own warranty. Unbranded hardware is the single most common source of complaints after year two." },
    { k: "Labour & fabrication", v: 21, c: "#4E6570", d: "Our own carpentry team, not a subcontracted crew rotating between sites. Paid per project, not per day, so nobody benefits from stretching your timeline." },
    { k: "Transport & site", v: 6, c: "#6E7B80", d: "Packaging, hoisting, floor and lift protection, debris removal. Small line, and the one that decides whether your neighbours resent you for eight weeks." },
    { k: "Design, PM & overheads", v: 12, c: "#2B3D46", d: "Drawings, 3D views, procurement, site supervision, studio costs and our margin. This is what pays for the person answering your call on a Sunday." },
  ];
  (function () {
    const bar = $("bar"),
      leg = $("legend"),
      note = $("anote");
    if (!bar || !leg) return;
    let sel = 0;
    COST.forEach((s, i) => {
      const d = document.createElement("div");
      d.style.background = s.c;
      d.style.flex = s.v;
      d.dataset.cursor = s.k;
      d.innerHTML = "<span>" + s.v + "%</span>";
      d.onclick = () => pick(i);
      bar.appendChild(d);
      const b = document.createElement("button");
      b.innerHTML = '<i style="background:' + s.c + '"></i>' + s.k;
      b.onclick = () => pick(i);
      leg.appendChild(b);
    });
    function pick(i) {
      sel = i;
      [...bar.children].forEach((d, n) => {
        d.style.flex = COST[n].v * (n === i ? 2.1 : 1);
        d.classList.toggle("sel", n === i);
      });
      [...leg.children].forEach((b, n) => b.classList.toggle("sel", n === i));
      render();
    }
    function render() {
      const s = COST[sel];
      const amt = QUOTE_TOTAL
        ? " On the quote above, that is roughly ₹" +
          ((QUOTE_TOTAL * s.v) / 100 / 1e5).toFixed(2) +
          " L."
        : "";
      note.textContent = s.d + amt;
    }
    on(document, "quote", render);
    on(document, "tier", () => {
      const v = TIERS[TIER].cost;
      COST.forEach((c, i) => (c.v = v[i]));
      [...bar.children].forEach((d, n) => {
        d.style.flex = COST[n].v * (n === sel ? 2.1 : 1);
        d.querySelector("span").textContent = COST[n].v + "%";
      });
      render();
    });
    pick(0);
  })();
  /* =========================================================
     OFFERS TIMELINE
     ========================================================= */
  (function () {
    const offersContainer = $("svc-offers");
    if (!offersContainer) return;
    const offers = offersContainer.querySelectorAll(".offer");
    const pts = document.querySelectorAll("#svc-tl .pt");

    offers.forEach((offer) => {
      on(offer, "mouseenter", () => {
        // Clear active classes
        offers.forEach(o => o.classList.remove("active"));
        offer.classList.add("active");

        const start = +offer.dataset.start;
        const end = +offer.dataset.end;
        pts.forEach((pt) => {
          const step = +pt.dataset.step;
          pt.classList.toggle("on", step >= start && step <= end);
          pt.classList.toggle("fill-right", step >= start && step < end);
        });
      });
    });

    on(offersContainer, "mouseleave", () => {
      offers.forEach(o => o.classList.remove("active"));
      pts.forEach((pt) => {
        pt.classList.remove("on", "fill-right");
      });
    });
  })();

  /* =========================================================
     TIER SWITCH + COMPARISON TABLE
     ========================================================= */
  (function () {
    const t = $("tier");
    if (t) {
      on(t, "click", (e) => {
        const b = e.target.closest("button");
        if (!b) return;
        [...t.children].forEach((c) => c.setAttribute("aria-pressed", "false"));
        b.setAttribute("aria-pressed", "true");
        TIER = b.dataset.t;
        if (typeof billFn === "function") billFn();
        document.dispatchEvent(new Event("tier"));
      });
    }

    const tbl = $("cmptable");
    if (!tbl) return;
    const rows = TIERS.base.rows;
    tbl.innerHTML =
      '<div class="crow head"><span class="lab">Item</span>' +
      '<b>Base<br><span class="lab">Standard</span></b>' +
      '<b>Adv<br><span class="lab">Premium</span></b>' +
      '<b>Luxury<br><span class="lab">Imported</span></b></div>' +
      Object.entries(rows)
        .map(
          ([k, v]) =>
            '<div class="crow"><span class="lab">' +
            k +
            '</span><p class="base">' +
            v[0] +
            '</p><p class="adv">' +
            v[1] +
            '</p><p class="lux">' +
            v[2] +
            "</p></div>"
        )
        .join("");
  })();

  /* ---- card tilt + expand ---- */
  (function () {
    const proj = $("proj");
    if (!proj) return;
    document.querySelectorAll(".card").forEach((card) => {
      const slot = card.querySelector(".slot");
      if (!slot) return;
      if (fine) {
        on(card, "pointermove", (e) => {
          const r = slot.getBoundingClientRect();
          const rx = ((e.clientY - r.top) / r.height - 0.5) * -9,
            ry = ((e.clientX - r.left) / r.width - 0.5) * 9;
          slot.style.transform =
            "rotateX(" + rx + "deg) rotateY(" + ry + "deg) scale(1.02)";
        });
        on(card, "pointerleave", () => (slot.style.transform = ""));
      }
      function open() {
        const d = card.dataset;
        p("p-t", d.t);
        p("p-d", d.d);
        p("p-a", d.a);
        p("p-y", d.y);
        p("p-s", d.s);
        p("p-s2", d.s);
        proj.classList.add("on");
        proj.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      }
      on(card, "click", open);
      on(card, "keydown", (e) => {
        if (e.key === "Enter") open();
      });
    });
    function p(id, v) {
      $(id).textContent = v;
    }
    function close() {
      proj.classList.remove("on");
      proj.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
    on(proj.querySelector(".close"), "click", close);
    on(window, "keydown", (e) => {
      if (e.key === "Escape") close();
    });
  })();

  /* ---- drag timeline with snap ---- */
  dragCarousel($("track"), $("railfill"), { snapClick: true });

  /* =========================================================
     TESTIMONIALS
     ========================================================= */
  const T = [
    {
      q: "They gave us the measured drawing after the first visit and told us to take it anywhere we liked. Nobody else did that.",
      n: "Sridhar & Kavya", loc: "Kokapet", when: "Handover Mar 2026", img: "",
      d: { Project: "3 BHK, 1,650 sq ft", Tier: "Platinum", Scope: "Full home", Timeline: "11 weeks", Value: "₹18–22L" },
      p: "Kitchen, three wardrobes, TV unit, pooja unit and false ceiling. Imported hardware throughout.",
    },
    {
      q: "The Saturday photo update sounds like a small thing. It is not. We were in Dubai for eight of the eleven weeks.",
      n: "Imran Q.", loc: "Gachibowli", when: "Handover Jan 2026", img: "",
      d: { Project: "2 BHK, 1,120 sq ft", Tier: "Titanium", Scope: "Kitchen + wardrobes", Timeline: "8 weeks", Value: "₹9–11L" },
      p: "Client was overseas for most of the build. Every decision was made on WhatsApp with photos.",
    },
    {
      q: "We had three quotes. Theirs was not the cheapest. It was the only one that listed what the plywood actually was.",
      n: "Lakshmi N.", loc: "Jubilee Hills", when: "Handover Nov 2025", img: "",
      d: { Project: "4 BHK, 2,400 sq ft", Tier: "Platinum", Scope: "Full home", Timeline: "14 weeks", Value: "₹34–39L" },
      p: "Two rounds of layout changes before we cut a single sheet. Walk-in wardrobe took the longest.",
    },
    {
      q: "Our architect had already drawn everything. They just built it, properly, and did not try to redesign our house.",
      n: "Praveen R.", loc: "Narsingi", when: "Handover Sep 2025", img: "",
      d: { Project: "Villa, 3,100 sq ft", Tier: "Titanium", Scope: "Build only", Timeline: "12 weeks", Value: "₹26–30L" },
      p: "Execution against a third-party design. Site team worked directly to the architect's drawings.",
    },
    {
      q: "The reception wall gets photographed by everyone who walks in. Clients ask about it before they ask about us.",
      n: "Anitha M.", loc: "Banjara Hills", when: "Handover Aug 2025", img: "",
      d: { Project: "Office, 240 sq ft wall", Tier: "Fabrication", Scope: "Feature wall", Timeline: "5 weeks", Value: "₹6–7L" },
      p: "320 CNC-cut aluminium fins on a parametric curve. Designed, cut and installed in-house.",
    },
  ];
  (function () {
    const track = $("ttrack");
    if (!track) return;
    track.innerHTML = T.map(
      (t, i) => `
 <article class="t" data-i="${i}">
   <div class="shot">${
     t.img
       ? `<img src="${t.img}" alt="" style="width:100%;height:100%;object-fit:cover">`
       : ""
   }
     <span>Photo — ${t.loc}</span></div>
   <blockquote>${t.q}</blockquote>
   <div class="who">
     <div class="av">${t.n.trim()[0]}</div>
     <div><b>${t.n}</b><span class="mono">${t.loc} · ${t.when}</span></div>
   </div>
   <div class="facts">${Object.values(t.d)
     .slice(0, 3)
     .map((v) => `<span class="fact">${v}</span>`)
     .join("")}</div>
   <button class="more">See the project →</button>
   <div class="detail">
     ${Object.entries(t.d)
       .map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`)
       .join("")}
     <p>${t.p}</p>
   </div>
 </article>`
    ).join("");

    $("stars").innerHTML = Array(5)
      .fill(
        '<svg viewBox="0 0 24 24"><path d="M12 2l3 6.6 7 .7-5.2 4.8 1.5 7L12 17.6 5.7 21l1.5-7L2 9.3l7-.7z"/></svg>'
      )
      .join("");

    dragCarousel(track, $("trailfill"), { more: true });
  })();

  /* ---- shared drag carousel ---- */
  function dragCarousel(track, rail, opts = {}) {
    if (!track) return;
    const cards = [...track.children];
    if (!cards.length) return;
    let x = 0,
      min = 0,
      down = false,
      sx = 0,
      sp = 0,
      vel = 0,
      moved = 0;
    const step = () =>
      cards[0].offsetWidth + parseFloat(getComputedStyle(track).gap || 0);
    const clamp = () => (x = Math.max(min, Math.min(0, x)));
    function apply() {
      track.style.transform = "translate3d(" + x + "px,0,0)";
      const i = Math.max(0, Math.min(cards.length - 1, Math.round(-x / step())));
      if (rail) {
        rail.style.width = 100 / cards.length + "%";
        rail.style.transform = "translateX(" + i * 100 + "%)";
      }
      const mid = track.parentElement.clientWidth / 2;
      cards.forEach((c) => {
        const r = c.getBoundingClientRect(),
          off = Math.abs(r.left + r.width / 2 - mid);
        c.classList.toggle("dim", off > r.width * 1.1);
        c.classList.toggle("live", off <= r.width * 0.62);
      });
    }
    function snap() {
      const to = Math.max(min, Math.min(0, -Math.round(-x / step()) * step())),
        from = x,
        t0 = performance.now();
      (function s(t) {
        if (stopped) return;
        const k = Math.min(1, (t - t0) / 420),
          e = 1 - Math.pow(1 - k, 3);
        x = from + (to - from) * e;
        apply();
        if (k < 1) requestAnimationFrame(s);
      })(t0);
    }
    function glide() {
      if (down) return;
      vel *= 0.9;
      x += vel;
      clamp();
      apply();
      if (Math.abs(vel) > 1) requestAnimationFrame(glide);
      else snap();
    }
    function bounds() {
      min = Math.min(0, track.clientWidth - track.scrollWidth);
      clamp();
      apply();
    }
    on(track, "pointerdown", (e) => {
      down = true;
      moved = 0;
      track.classList.add("drag");
      sx = e.clientX;
      sp = x;
      vel = 0;
      track.setPointerCapture(e.pointerId);
    });
    on(track, "pointermove", (e) => {
      if (!down) return;
      const nx = sp + (e.clientX - sx);
      moved = Math.abs(e.clientX - sx);
      vel = nx - x;
      x = nx;
      clamp();
      apply();
    });
    const up = () => {
      if (!down) return;
      down = false;
      track.classList.remove("drag");
      glide();
    };
    on(track, "pointerup", up);
    on(track, "pointercancel", up);
    on(
      track,
      "wheel",
      (e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
          e.preventDefault();
          x -= e.deltaX;
          clamp();
          apply();
        }
      },
      { passive: false }
    );
    cards.forEach((c, i) => {
      if (opts.more) {
        const moreBtn = c.querySelector(".more");
        if (moreBtn)
          on(moreBtn, "click", (ev) => {
            ev.stopPropagation();
            if (moved > 6) return;
            const open = c.classList.toggle("open");
            moreBtn.textContent = open ? "Close ←" : "See the project →";
          });
      }
      on(c, "click", () => {
        if (moved > 6) return;
        x = Math.max(min, -i * step());
        apply();
      });
    });
    on(window, "resize", bounds);
    bounds();
    // in case fonts/layout settle after mount
    setTimeout(bounds, 60);
    setTimeout(bounds, 400);
  }

  /* =========================================================
     BOOK A CONSULTATION
     ========================================================= */
  (function () {
    const pick = {
      unit: "3 BHK",
      poss: "Handover soon",
      scope: "Full home",
      tier: "Titanium — Indian brands",
      budget: "₹10–18L",
      start: "After 1 month",
      mode: "Site visit",
      vastu: "No",
      who: "Me and spouse",
      src: "",
    };
    const scope = $("book");
    if (!scope) return;

    scope.querySelectorAll("[data-group]").forEach((g) => {
      on(g, "click", (e) => {
        const b = e.target.closest("button");
        if (!b) return;
        [...g.children].forEach((c) => c.setAttribute("aria-pressed", "false"));
        b.setAttribute("aria-pressed", "true");
        pick[g.dataset.group] = b.querySelector("b")
          ? b.querySelector("b").textContent
          : b.textContent;
      });
    });

    // restore the reference defaults for the two selects
    if ($("day")) $("day").value = "Saturday";
    if ($("time")) $("time").value = "11 am–1 pm";

    $("phone").addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/\D/g, "");
    });

    on($("up"), "click", () => $("file").click());
    on($("file"), "change", (e) => {
      if (e.target.files[0]) $("upl").textContent = "Attached — " + e.target.files[0].name;
    });

    on($("next1"), "click", () => {
      const ok = $("name").value.trim().length > 1 && $("phone").value.length === 10;
      $("e1").classList.toggle("on", !ok);
      if (!ok) return;
      $("step1").classList.add("hide");
      $("step2").classList.remove("hide");
      $("s2").classList.add("on");
      $("book").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    on($("back"), "click", () => {
      $("step2").classList.add("hide");
      $("step1").classList.remove("hide");
      $("s2").classList.remove("on");
      $("book").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    on($("submit"), "click", () => {
      const d = {
        Name: $("name").value.trim(),
        WhatsApp: $("phone").value,
        Property: $("place").value.trim() || "—",
        Unit: pick.unit,
        Possession: pick.poss,
        Scope: pick.scope,
        Tier: pick.tier,
        Budget: pick.budget,
        Start: pick.start,
        Mode: pick.mode,
        Slot: $("day").value + ", " + $("time").value,
        Vastu: pick.vastu,
        Deciding: pick.who,
        Notes: $("notes").value.trim() || "—",
      };
      $("thanks").textContent = "Thanks " + d.Name.split(" ")[0] + " — we've got it.";
      $("summary").innerHTML = Object.entries(d)
        .map(([k, v]) => "<p>" + k + " &nbsp;<b>" + v + "</b></p>")
        .join("");
      const msg = encodeURIComponent(
        "Consultation request — form X Interiors\n\n" +
          Object.entries(d)
            .map(([k, v]) => k + ": " + v)
            .join("\n")
      );
      $("wasend").href = "https://wa.me/919951733955?text=" + msg;
      $("step2").classList.add("hide");
      $("done").classList.add("on");
      $("s3").classList.add("on");
      $("book").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  })();

  /* ---- reveals ---- */
  (function () {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.18 }
    );
    observers.push(io);
    document.querySelectorAll(".rv,[data-split]").forEach((el, i) => {
      if (el.classList.contains("rv")) el.style.transitionDelay = ((i % 4) * 60) + "ms";
      io.observe(el);
    });
  })();

  /* ---- cleanup ---- */
  return function cleanup() {
    stopped = true;
    listeners.forEach(([t, type, fn, opts]) => {
      try {
        t.removeEventListener(type, fn, opts);
      } catch (e) {}
    });
    observers.forEach((o) => o.disconnect());
    document.body.classList.remove("hidecur");
    document.body.style.overflow = "";
  };
}
