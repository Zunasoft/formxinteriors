"use client";

import { useEffect } from "react";
import initFormX from "@/lib/formx";
import Logo from "@/components/Logo";
import HowWeWork from "@/components/HowWeWork";
import Estimator from "@/components/Estimator";
import Testimonials from "@/components/Testimonials";
import MoneyBreakdown from "@/components/MoneyBreakdown";
import Advantage from "@/components/Advantage";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Instagram from "@/components/Instagram";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import CTAModal from "@/components/CTAModal";

export default function Page() {
  useEffect(() => {
    const cleanup = initFormX();
    return cleanup;
  }, []);

  return (
    <>
      <div id="cur">
        <b></b>
      </div>

      {/* ---- intro logo animation ---- */}
      <div id="intro">
        <img src="/logo.png" alt="form X Interiors" className="intro-logo" />
      </div>

      {/* ---- menu ---- */}
      <button suppressHydrationWarning
        id="xbtn"
        aria-label="Open menu"
        aria-expanded="false"
        data-cursor="menu"
      >
        <img src="/logo-x-square.png" alt="" />
      </button>
      <nav id="menu" aria-hidden="true">
        <a href="#work">
          <span className="sw">
            <i>Projects</i>
            <i>Projects</i>
          </span>
        </a>
        <a href="#offers">
          <span className="sw">
            <i>Expertise</i>
            <i>Expertise</i>
          </span>
        </a>
        <a href="#estimate">
          <span className="sw">
            <i>Estimate</i>
            <i>Estimate</i>
          </span>
        </a>
        <a href="#offers-cards">
          <span className="sw">
            <i>Process</i>
            <i>Process</i>
          </span>
        </a>
        <a href="#book">
          <span className="sw">
            <i>Consultation</i>
            <i>Consultation</i>
          </span>
        </a>
        <a href="#faq">
          <span className="sw">
            <i>FAQ</i>
            <i>FAQ</i>
          </span>
        </a>
        <a href="#contact">
          <span className="sw">
            <i>Contact</i>
            <i>Contact</i>
          </span>
        </a>
        <div className="mono foot">Hyderabad · +91 00000 00000</div>
      </nav>

      {/* ---- scroll-scrubbed film hero ---- */}
      <header className="vhero" id="vhero">
        <div className="vstick">
          <canvas id="sim" aria-hidden="true"></canvas>
          <video
            id="film"
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            style={{ display: "none" }}
          ></video>
          <canvas id="slats" aria-hidden="true" data-cursor="move it"></canvas>
          <div className="vgrad"></div>
          <div className="brandbar">
            <Logo />
          </div>
          <div className="hero-in">
            <p className="mono" style={{ color: "#9FB0B6", marginBottom: "16px" }}>
              Hyderabad · Design &amp; turnkey execution
            </p>
            <div className="caps">
              <h1 className="cap on">
                Interiors priced
                <br />
                in the <em>open</em>.
              </h1>
              <h1 className="cap">
                Drawings, materials,
                <br />
                carpentry, <em>site</em>.
              </h1>
              <h1 className="cap">
                One team.
                <br />
                <em>One bill</em>.
              </h1>
            </div>
            <div className="hero-row">
              <p>
                A measured drawing after the first visit — yours to keep, even if you walk.
                Every board, laminate and hinge named in the quote.
                A dated photo of your site every Saturday until we hand over the keys.
              </p>
              <a className="btn mag" href="#estimate" data-cursor="price">
                Get a price for your space →
              </a>
            </div>
          </div>
          <div className="sind">
            <i id="sfill"></i>
          </div>
          <div className="tag mono">Scroll to play</div>

          {/* ---- marquee ---- */}
          <div className="mq">
            <div id="mqi">
              {Array.from({ length: 60 }).map((_, idx) => (
                <span key={idx}>{["DESIGN", "BUILD", "DELIVER"][idx % 3]}</span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <HowWeWork />

      {/* ---- estimator ---- */}
      <Estimator />

      {/* ---- three promises ---- */}
      <Advantage />

      {/* ---- projects wall ---- */}
      <Projects />

      {/* ---- cost anatomy ---- */}
      <MoneyBreakdown />

      {/* ---- testimonials ---- */}
      <Testimonials />

      {/* ---- book a consultation ---- */}
      <Contact />

      {/* ---- instagram ---- */}
      <Instagram />

      {/* ---- faq ---- */}
      <FAQ />

      {/* ---- final CTA ---- */}
      <CTA />

      {/* ---- footer ---- */}
      <Footer />

      <CTAModal />
    </>
  );
}

