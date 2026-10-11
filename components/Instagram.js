import "./Instagram.css";

/* Post cards. Caption = "[Room] — [one detail] · [Locality]"; alt text =
   room + locality + Hyderabad. LOCALITY TO FILL per post — empty ones are left
   out of the caption rather than guessed. */
const POSTS = [
  { room: "Pooja unit", detail: "marble backdrop", loc: "" },
  { room: "Olive kitchen", detail: "handleless shutters", loc: "" },
  { room: "Master bedroom", detail: "fluted wardrobe wall", loc: "" },
  { room: "Living room", detail: "floor-to-ceiling display shelving", loc: "" },
  { room: "Foyer to living", detail: "round mirror console", loc: "" },
  { room: "Double-height living", detail: "sculptural pendant over dining", loc: "" },
  { room: "U-shaped kitchen", detail: "walnut cabinetry", loc: "" },
];
const cap = (p) => p.room + " — " + p.detail + (p.loc ? " · " + p.loc : "");
const alt = (p) => p.room + (p.loc ? " in " + p.loc : "") + ", Hyderabad — " + p.detail;

export default function Instagram() {
  return (
    <section className="fx-instagram">
      <div className="ig-eyebrow"><span className="ig-mono">Instagram</span></div>
      <div className="ig-head">
        <h2>Our Hyderabad sites, <em>every day</em>. Not just the final shot.</h2>
        <div className="ig-stats">
          <a className="ig-card ig-cta ig-cta-btn" href="https://www.instagram.com/form_x_interiors/" rel="noopener" target="_blank">
            <div className="ig-lab">Instagram</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "10px" }}>
              <span className="ig-at">@form_x_interiors</span><span className="ig-arrow">→</span>
            </div>
          </a>
          {/* TO UPDATE: placeholder counts — replace with the real numbers from the profile
              (true live counts need the Instagram Graph API on a business account) */}
          <div className="ig-stat"><b>342</b><span>Posts</span></div>
          <div className="ig-stat"><b>18.4K</b><span>Followers</span></div>
        </div>
      </div>

      <div className="ig-sheet">
        <a className="ig-tile ig-big ig-today ig-p1" href="#">
          <img className="ig-shot" src="/vedios/1.png" alt={alt(POSTS[0])} />
          <div className="ig-grain"></div><div className="ig-vg"></div>
          <div className="ig-flag"><i></i><span>Today on site</span></div>
          <div className="ig-cap">
            <p>{cap(POSTS[0])}</p>
            <div className="ig-meta">Day 31 of 48 · posted this morning</div>
          </div>
        </a>

        <a className="ig-tile ig-p2" href="#">
          <img className="ig-shot" src="/vedios/2.png" alt={alt(POSTS[1])} />
          <div className="ig-grain"></div><div className="ig-vg"></div>
          <span className="ig-no">02</span>
          <div className="ig-cap"><p>{cap(POSTS[1])}</p><div className="ig-views">Material Lab · 48.2K likes</div></div>
        </a>

        <a className="ig-tile ig-p3" href="#">
          <img className="ig-shot" src="/vedios/3.png" alt={alt(POSTS[2])} />
          <div className="ig-grain"></div><div className="ig-vg"></div>
          <span className="ig-no">03</span>
          <div className="ig-cap"><p>{cap(POSTS[2])}</p><div className="ig-views">Bedroom reveal · 126K likes</div></div>
        </a>

        <div className="ig-card ig-p4">
          <div className="ig-lab">Architect-designed</div>
          <div><div className="ig-num">100%</div><div className="ig-lab" style={{ marginTop: "6px" }}>Care+ · 48 hrs / 48 days</div></div>
        </div>

        <a className="ig-tile ig-p5" href="#">
          <img className="ig-shot" src="/vedios/4.png" alt={alt(POSTS[3])} />
          <div className="ig-grain"></div><div className="ig-vg"></div>
          <span className="ig-no">04</span>
          <div className="ig-cap"><p>{cap(POSTS[3])}</p><div className="ig-views">71.4K likes</div></div>
        </a>

        <a className="ig-tile ig-sq ig-p6" href="#">
          <img className="ig-shot" src="/vedios/5.png" alt={alt(POSTS[4])} />
          <div className="ig-grain"></div><div className="ig-vg"></div>
          <span className="ig-no">05</span>
          <div className="ig-cap"><p>{cap(POSTS[4])}</p></div>
        </a>

        <a className="ig-tile ig-sq ig-p7" href="#">
          <img className="ig-shot" src="/vedios/6.png" alt={alt(POSTS[5])} />
          <div className="ig-grain"></div><div className="ig-vg"></div>
          <span className="ig-no">06</span>
          <div className="ig-cap"><p>{cap(POSTS[5])}</p></div>
        </a>

        <a className="ig-tile ig-sq ig-p8" href="#">
          <img className="ig-shot" src="/vedios/7.png" alt={alt(POSTS[6])} />
          <div className="ig-grain"></div><div className="ig-vg"></div>
          <span className="ig-no">07</span>
          <div className="ig-cap"><p>{cap(POSTS[6])}</p></div>
        </a>
      </div>

      <div className="ig-foot">
        <span className="ig-strap">Architects only · No sales team · Hyderabad</span>
        <span className="ig-mono">Updated daily from live sites</span>
      </div>
    </section>
  );
}
