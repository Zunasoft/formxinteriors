"use client";
import React, { useState, useRef } from "react";
import "./Work.css";

const PROJECTS = [
  {
    id: 1,
    category: "full",
    tag: "Kokapet · Mar 2026",
    title: "3 BHK, Kokapet",
    desc: "Kitchen, three wardrobes, TV unit, pooja unit and false ceiling. Imported hardware throughout.",
    area: "1,650 sq ft",
    tier: "Platinum",
    price: "₹18–22L",
    timeline: "11 weeks",
    scope: "Design + Build",
    plateClass: "p1"
  },
  {
    id: 2,
    category: "kitchen",
    tag: "Gachibowli · Jan 2026",
    title: "2 BHK, Gachibowli",
    desc: "Run entirely from Dubai. Kitchen and wardrobes, every decision made on WhatsApp against photos.",
    area: "1,120 sq ft",
    tier: "Gold",
    price: "₹9–11L",
    timeline: "8 weeks",
    scope: "Design + Build",
    plateClass: "p2"
  },
  {
    id: 3,
    category: "full",
    tag: "Jubilee Hills · Nov 2025",
    title: "4 BHK, Jubilee Hills",
    desc: "Two rounds of layout changes before a single sheet was cut. The walk-in wardrobe took the longest.",
    area: "2,400 sq ft",
    tier: "Platinum",
    price: "₹34–39L",
    timeline: "14 weeks",
    scope: "Design + Build",
    plateClass: "p3"
  },
  {
    id: 4,
    category: "build",
    tag: "Narsingi · Sep 2025",
    title: "Villa, Narsingi",
    desc: "Execution against a third-party design. Our site team worked directly to the architect's drawings.",
    area: "3,100 sq ft",
    tier: "Gold",
    price: "₹26–30L",
    timeline: "12 weeks",
    scope: "Build only",
    plateClass: "p4"
  },
  {
    id: 5,
    category: "commercial",
    tag: "Banjara Hills · Aug 2025",
    title: "Office reception wall",
    desc: "320 CNC-cut aluminium fins on a parametric curve. Designed, cut and installed in-house.",
    area: "240 sq ft",
    tier: "Fabrication",
    price: "₹6–7L",
    timeline: "5 weeks",
    scope: "Feature wall",
    plateClass: "p2"
  },
  {
    id: 6,
    category: "kitchen",
    tag: "Manikonda · Jun 2025",
    title: "Kitchen only, Manikonda",
    desc: "Tall unit, breakfast counter and a full Blum internal system in a nine-foot galley.",
    area: "190 sq ft",
    tier: "Platinum",
    price: "₹5–6L",
    timeline: "4 weeks",
    scope: "Design + Build",
    plateClass: "p3"
  }
];

export default function Work() {
  const [filter, setFilter] = useState("all");
  const [sliderPos, setSliderPos] = useState(50);
  const baRef = useRef(null);

  const filteredProjects = PROJECTS.filter(
    (p) => filter === "all" || p.category === filter
  );

  const handlePointerMove = (e) => {
    if (!baRef.current) return;
    const rect = baRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  };

  const handlePointerDown = (e) => {
    if (baRef.current && baRef.current.setPointerCapture) {
      baRef.current.setPointerCapture(e.pointerId);
    }
    handlePointerMove(e);
  };

  return (
    <>
      {/* ---- Selected projects ---- */}
      <section className="wrap fx-work-section" id="work" aria-labelledby="fx-work-title">
        <div className="fx-work-head rv">
          <div>
            <div className="eyebrow">
              <span className="mono">Selected work</span>
            </div>
            <h2 id="fx-work-title">Fourteen homes. Every budget printed.</h2>
          </div>
          <p className="fx-work-lead">
            Filter by what you are actually planning. Each card carries the real scope,
            the real timeline and the real spend.
          </p>
        </div>

        <div className="fx-work-filters" role="group" aria-label="Filter projects">
          <button
            type="button"
            aria-pressed={filter === "all"}
            onClick={() => setFilter("all")}
          >
            All 6 shown
          </button>
          <button
            type="button"
            aria-pressed={filter === "full"}
            onClick={() => setFilter("full")}
          >
            Full home
          </button>
          <button
            type="button"
            aria-pressed={filter === "kitchen"}
            onClick={() => setFilter("kitchen")}
          >
            Kitchen
          </button>
          <button
            type="button"
            aria-pressed={filter === "build"}
            onClick={() => setFilter("build")}
          >
            Build only
          </button>
          <button
            type="button"
            aria-pressed={filter === "commercial"}
            onClick={() => setFilter("commercial")}
          >
            Commercial
          </button>
        </div>

        <div className="fx-work-pgrid">
          {filteredProjects.map((p) => (
            <article key={p.id} className="fx-work-proj">
              <div className={`fx-work-plate ${p.plateClass}`}>
                <span className="fx-work-tag">{p.tag}</span>
              </div>
              <div className="fx-work-meta">
                <h3>{p.title}</h3>
                <p className="fx-work-desc">{p.desc}</p>
                <div className="fx-work-row">
                  <span>{p.area} · {p.tier}</span>
                  <b>{p.price}</b>
                </div>
                <div className="fx-work-row no-border">
                  <span>{p.timeline}</span>
                  <span>{p.scope}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---- Before / After Comparison ---- */}
      <section className="wrap fx-ba-section" id="comparison" aria-labelledby="fx-ba-title">
        <div className="fx-ba-head rv">
          <div className="eyebrow">
            <span className="mono" id="fx-ba-title">Bare flat to handover — Kokapet, 3 BHK</span>
          </div>
        </div>
        <div
          className="fx-work-ba"
          ref={baRef}
          onPointerDown={handlePointerDown}
          onPointerMove={(e) => {
            if (e.buttons === 1) {
              handlePointerMove(e);
            }
          }}
          role="slider"
          aria-label="Before and after comparison"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={Math.round(sliderPos)}
          tabIndex="0"
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              setSliderPos((prev) => Math.max(0, prev - 4));
              e.preventDefault();
            }
            if (e.key === "ArrowRight") {
              setSliderPos((prev) => Math.min(100, prev + 4));
              e.preventDefault();
            }
            if (e.key === "Home") {
              setSliderPos(0);
              e.preventDefault();
            }
            if (e.key === "End") {
              setSliderPos(100);
              e.preventDefault();
            }
          }}
        >
          <div className="fx-work-lay fx-work-before"></div>
          <div
            className="fx-work-lay fx-work-after"
            style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
          ></div>
          <span className="fx-work-ba-lbl fx-work-ba-l">Before · Day 0</span>
          <span className="fx-work-ba-lbl fx-work-ba-r">After · Week 11</span>
          <div
            className="fx-work-ba-handle"
            style={{ left: `${sliderPos}%` }}
          ></div>
        </div>
      </section>
    </>
  );
}
