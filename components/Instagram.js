import "./Instagram.css";

export default function Instagram() {
  return (
    <section className="fx-instagram">
      <div className="ig-eyebrow"><span className="ig-mono">Instagram</span></div>
      <div className="ig-head">
        <h2>We post from site <em>every day</em>. Not just the finished shot.</h2>
        <div className="ig-stats">
          <a className="ig-card ig-cta ig-cta-btn" href="#">
            <div className="ig-lab">Instagram</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "10px" }}>
              <span className="ig-at">@formxinteriors</span><span className="ig-arrow">→</span>
            </div>
          </a>
          <div className="ig-stat"><b>342</b><span>Posts</span></div>
          <div className="ig-stat"><b>18.4K</b><span>Followers</span></div>
          <div className="ig-stat"><b>47</b><span>In Telugu</span></div>
        </div>
      </div>

      <div className="ig-sheet">
        <a className="ig-tile ig-big ig-today ig-p1" href="#">
          <div className="ig-shot" style={{ background: "linear-gradient(158deg,#7C6B57,#BFA57F 58%,#33454E)" }}></div>
          <div className="ig-grain"></div><div className="ig-vg"></div>
          <div className="ig-flag"><i></i><span>Today on site</span></div>
          <span className="ig-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></span>
          <div className="ig-cap">
            <p>Kokapet duplex — carpentry carcass up on the master wardrobe</p>
            <div className="ig-meta">Day 31 of 48 · posted this morning</div>
          </div>
        </a>

        <a className="ig-tile ig-p2" href="#">
          <div className="ig-shot" style={{ background: "linear-gradient(150deg,#33454E,#1D2C34 62%,#0E181D)" }}></div>
          <div className="ig-grain"></div><div className="ig-vg"></div>
          <span className="ig-no">02</span><span className="ig-kind ig-te">తెలుగు</span>
          <span className="ig-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></span>
          <div className="ig-cap"><p>Why we never use MDF in a kitchen</p><div className="ig-views">Material Lab · 48.2K views</div></div>
        </a>

        <a className="ig-tile ig-p3" href="#">
          <div className="ig-shot" style={{ background: "linear-gradient(150deg,#BFA57F,#7C6B57 58%,#22333B)" }}></div>
          <div className="ig-grain"></div><div className="ig-vg"></div>
          <span className="ig-no">03</span><span className="ig-kind">48/48</span>
          <span className="ig-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></span>
          <div className="ig-cap"><p>Day one to handover in 46 days</p><div className="ig-views">Timelapse · 126K views</div></div>
        </a>

        <div className="ig-card ig-p4">
          <div className="ig-lab">Delivered on promise</div>
          <div><div className="ig-num">100%</div><div className="ig-lab" style={{ marginTop: "6px" }}>Care+ · 48 hrs / 48 days</div></div>
        </div>

        <a className="ig-tile ig-p5" href="#">
          <div className="ig-shot" style={{ background: "linear-gradient(150deg,#E2D5BE,#BFA57F 60%,#33454E)" }}></div>
          <div className="ig-grain"></div><div className="ig-vg"></div>
          <span className="ig-no">04</span><span className="ig-kind ig-te">తెలుగు</span>
          <span className="ig-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></span>
          <div className="ig-cap"><p>What ₹1,650 a sq ft actually buys</p><div className="ig-views">Costing · 71.4K</div></div>
        </a>

        <a className="ig-tile ig-sq ig-p6" href="#">
          <div className="ig-shot" style={{ background: "linear-gradient(150deg,#33454E,#7C6B57 70%,#16242B)" }}></div>
          <div className="ig-grain"></div><div className="ig-vg"></div>
          <span className="ig-no">05</span>
          <span className="ig-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></span>
          <div className="ig-cap"><p>CNC cutting a parametric screen</p></div>
        </a>

        <a className="ig-tile ig-sq ig-p7" href="#">
          <div className="ig-shot" style={{ background: "linear-gradient(150deg,#1D2C34,#33454E 66%,#0E181D)" }}></div>
          <div className="ig-grain"></div><div className="ig-vg"></div>
          <span className="ig-no">06</span><span className="ig-kind ig-te">తెలుగు</span>
          <span className="ig-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></span>
          <div className="ig-cap"><p>The wardrobe joint nobody checks</p></div>
        </a>

        <a className="ig-tile ig-sq ig-p8" href="#">
          <div className="ig-shot" style={{ background: "linear-gradient(150deg,#BFA57F,#33454E 68%,#16242B)" }}></div>
          <div className="ig-grain"></div><div className="ig-vg"></div>
          <span className="ig-no">07</span>
          <span className="ig-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></span>
          <div className="ig-cap"><p>Blum vs Hettich, tested on site</p></div>
        </a>
      </div>

      <div className="ig-foot">
        <span className="ig-strap">Designed by architects · Backed by <b>Care+</b> · Hyderabad</span>
        <span className="ig-mono">Updated daily from live sites</span>
      </div>
    </section>
  );
}
