"use client";

import { useEffect, useState } from "react";
import "./Instagram.css";

/* Post cards. Caption = "[Room] — [one detail] · [Locality]"; alt text =
   room + locality + Hyderabad. LOCALITY TO FILL per post — empty ones are left
   out of the caption rather than guessed.
   These are the fallback tiles; when /api/instagram answers, the latest posts
   from the account replace them (same slots, same order). */
const POSTS = [
  { room: "Pooja unit", detail: "marble backdrop", loc: "", img: "/vedios/1.png" },
  { room: "Olive kitchen", detail: "handleless shutters", loc: "", img: "/vedios/2.png", views: "Material Lab · 48.2K likes" },
  { room: "Master bedroom", detail: "fluted wardrobe wall", loc: "", img: "/vedios/3.png", views: "Bedroom reveal · 126K likes" },
  { room: "Luxury bedroom", detail: "marble & LED pendant", loc: "", img: "/vedios/8.png", views: "Villa reveal · 89.4K likes" },
  { room: "Living room", detail: "floor-to-ceiling display shelving", loc: "", img: "/vedios/4.png", views: "71.4K likes" },
  { room: "Foyer to living", detail: "round mirror console", loc: "", img: "/vedios/5.png" },
  { room: "Double-height living", detail: "sculptural pendant over dining", loc: "", img: "/vedios/6.png" },
  { room: "U-shaped kitchen", detail: "walnut cabinetry", loc: "", img: "/vedios/7.png" },
];
const cap = (p) => p.room + " — " + p.detail + (p.loc ? " · " + p.loc : "");
const alt = (p) => p.room + (p.loc ? " in " + p.loc : "") + ", Hyderabad — " + p.detail;

const PROFILE = "https://www.instagram.com/form_x_interiors/";
// grid slot for each post, in order (all 8 slots are posts)
const SLOTS = ["ig-big ig-today ig-p1", "ig-p2", "ig-p3", "ig-p4", "ig-p5", "ig-sq ig-p6", "ig-sq ig-p7", "ig-sq ig-p8"];
// the smaller square tiles have no room for a likes line
const SHOW_VIEWS = [false, true, true, true, true, false, false, false];

const fmt = (n) =>
  n == null ? null : n >= 1e6 ? (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M"
  : n >= 1e3 ? (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K" : String(n);

// first line of the caption, hashtags/mentions dropped, trimmed to fit a tile
const tidy = (s) => {
  const line = (s.split("\n").find((l) => l.trim()) || "").replace(/[#@]\S+/g, "").replace(/\s+/g, " ").trim();
  return line.length > 80 ? line.slice(0, 77).trimEnd() + "…" : line;
};

const ago = (iso) => {
  const h = Math.floor((Date.now() - new Date(iso)) / 36e5);
  if (h < 1) return "just now";
  if (h < 24) return h + (h === 1 ? " hour ago" : " hours ago");
  const d = Math.floor(h / 24);
  return d === 1 ? "yesterday" : d + " days ago";
};

const fromStatic = (p) => ({ href: "#", img: p.img, caption: cap(p), alt: alt(p), views: p.views, isVideo: false });
const fromLive = (p) => {
  const caption = tidy(p.caption) || "On site in Hyderabad";
  return {
    href: p.permalink, img: p.image, caption, alt: caption + " — Form X Interiors, Hyderabad",
    views: p.likes != null ? fmt(p.likes) + " likes" : null, isVideo: p.isVideo, timestamp: p.timestamp,
  };
};

const Play = () => (
  <span className="ig-play"><svg viewBox="0 0 10 10"><path d="M0 0l10 5-10 5z" /></svg></span>
);

export default function Instagram() {
  const [live, setLive] = useState(null);

  useEffect(() => {
    let off = false;
    fetch("/api/instagram")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (!off && d && d.posts && d.posts.length) setLive(d); })
      .catch(() => {});
    return () => { off = true; };
  }, []);

  const tiles = POSTS.map((p, i) => (live && live.posts[i] ? fromLive(live.posts[i]) : fromStatic(p)));
  const first = tiles[0];
  const fresh = first.timestamp && Date.now() - new Date(first.timestamp) < 864e5;
  const linkProps = (t) => (t.href === "#" ? { href: "#" } : { href: t.href, target: "_blank", rel: "noopener" });

  return (
    <section className="fx-instagram">
      <div className="ig-eyebrow"><span className="ig-mono">Instagram</span></div>
      <div className="ig-head">
        <h2>Our Hyderabad sites, <em>every day</em>. Not just the final shot.</h2>
        <div className="ig-stats">
          <a className="ig-card ig-cta ig-cta-btn" href={PROFILE} rel="noopener" target="_blank">
            <div className="ig-lab">Instagram</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "10px" }}>
              <span className="ig-at">@{live?.username || "form_x_interiors"}</span><span className="ig-arrow">→</span>
            </div>
          </a>
          {/* fallback counts until the live API answers */}
          <div className="ig-stat"><b>{fmt(live?.mediaCount) || "342"}</b><span>Posts</span></div>
          <div className="ig-stat"><b>{fmt(live?.followers) || "18.4K"}</b><span>Followers</span></div>
        </div>
      </div>

      <div className="ig-sheet">
        {tiles.map((t, i) => (
          <a key={i} className={"ig-tile " + SLOTS[i]} {...linkProps(t)}>
            <img className="ig-shot" src={t.img} alt={t.alt} loading={i ? "lazy" : undefined} />
            <div className="ig-grain"></div><div className="ig-vg"></div>
            {i === 0 ? (
              <div className="ig-flag"><i></i><span>{!t.timestamp || fresh ? "Today on site" : "Latest from site"}</span></div>
            ) : (
              <span className="ig-no">{String(i + 1).padStart(2, "0")}</span>
            )}
            {t.isVideo && <Play />}
            <div className="ig-cap">
              <p>{t.caption}</p>
              {i === 0 ? (
                <div className="ig-meta">{t.timestamp ? "Posted " + ago(t.timestamp) : "Day 31 of 48 · posted this morning"}</div>
              ) : (
                SHOW_VIEWS[i] && t.views && <div className="ig-views">{t.views}</div>
              )}
            </div>
          </a>
        ))}
      </div>

      <div className="ig-foot">
        <span className="ig-strap">Architects only · No sales team · Hyderabad</span>
        <span className="ig-mono">Updated daily from live sites</span>
      </div>
    </section>
  );
}
