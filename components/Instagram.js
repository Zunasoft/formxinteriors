import "./Instagram.css";

export default function Instagram() {
  return (
    <section className="fx-instagram">
      <div className="ig-eyebrow"><span className="ig-mono">Instagram</span></div>
      <div className="ig-head">
        <h2>We post from site <em>every day</em>. Not just the finished shot.</h2>
        <div className="ig-stats">
          <a className="ig-card ig-cta ig-cta-btn" href="https://www.instagram.com/form_x_interiors?stkn=MTg5YWptY3YweDd2bQ==" rel="noopener" target="_blank">
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
          <img className="ig-shot" src="/vedios/1.png" alt="Pooja unit — marble backdrop, brass deity frames" />
          <div className="ig-grain"></div><div className="ig-vg"></div>
          <div className="ig-flag"><i></i><span>Today on site</span></div>
          <div className="ig-cap">
            <p>Pooja unit — marble backdrop, brass deity frames</p>
            <div className="ig-meta">Day 31 of 48 · posted this morning</div>
          </div>
        </a>

        <a className="ig-tile ig-p2" href="#">
          <img className="ig-shot" src="/vedios/2.png" alt="Olive kitchen — handleless shutters, integrated fridge" />
          <div className="ig-grain"></div><div className="ig-vg"></div>
          <span className="ig-no">02</span><span className="ig-kind ig-te">తెలుగు</span>
          <div className="ig-cap"><p>Olive kitchen — handleless shutters, integrated fridge</p><div className="ig-views">Material Lab · 48.2K likes</div></div>
        </a>

        <a className="ig-tile ig-p3" href="#">
          <img className="ig-shot" src="/vedios/3.png" alt="Master bedroom — fluted wardrobe wall, floating TV console" />
          <div className="ig-grain"></div><div className="ig-vg"></div>
          <span className="ig-no">03</span>
          <div className="ig-cap"><p>Master bedroom — fluted wardrobe wall, floating TV console</p><div className="ig-views">Bedroom reveal · 126K likes</div></div>
        </a>

        <div className="ig-card ig-p4">
          <div className="ig-lab">Delivered on promise</div>
          <div><div className="ig-num">100%</div><div className="ig-lab" style={{ marginTop: "6px" }}>Care+ · 48 hrs / 48 days</div></div>
        </div>

        <a className="ig-tile ig-p5" href="#">
          <img className="ig-shot" src="/vedios/4.png" alt="Living room — floor-to-ceiling display shelving" />
          <div className="ig-grain"></div><div className="ig-vg"></div>
          <span className="ig-no">04</span><span className="ig-kind ig-te">తెలుగు</span>
          <div className="ig-cap"><p>Living room — floor-to-ceiling display shelving</p><div className="ig-views">71.4K likes</div></div>
        </a>

        <a className="ig-tile ig-sq ig-p6" href="#">
          <img className="ig-shot" src="/vedios/5.png" alt="Foyer to living — round mirror console, backlit TV wall" />
          <div className="ig-grain"></div><div className="ig-vg"></div>
          <span className="ig-no">05</span>
          <div className="ig-cap"><p>Foyer to living — round mirror console, backlit TV wall</p></div>
        </a>

        <a className="ig-tile ig-sq ig-p7" href="#">
          <img className="ig-shot" src="/vedios/6.png" alt="Double-height living — sculptural pendant over dining" />
          <div className="ig-grain"></div><div className="ig-vg"></div>
          <span className="ig-no">06</span><span className="ig-kind ig-te">తెలుగు</span>
          <div className="ig-cap"><p>Double-height living — sculptural pendant over dining</p></div>
        </a>

        <a className="ig-tile ig-sq ig-p8" href="#">
          <img className="ig-shot" src="/vedios/7.png" alt="U-shaped kitchen — walnut cabinetry, marble backsplash" />
          <div className="ig-grain"></div><div className="ig-vg"></div>
          <span className="ig-no">07</span>
          <div className="ig-cap"><p>U-shaped kitchen — walnut cabinetry, marble backsplash</p></div>
        </a>
      </div>

      <div className="ig-foot">
        <span className="ig-strap">Designed by architects · Backed by <b>Care+</b> · Hyderabad</span>
        <span className="ig-mono">Updated daily from live sites</span>
      </div>
    </section>
  );
}
