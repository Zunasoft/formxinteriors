"use client";

import { useEffect } from "react";
import initFormX from "@/lib/formx";
import Logo from "@/components/Logo";
import HowWeWork from "@/components/HowWeWork";
import Projects from "@/components/Projects";
import Estimator from "@/components/Estimator";
import Testimonials from "@/components/Testimonials";
import MoneyBreakdown from "@/components/MoneyBreakdown";
import Advantage from "@/components/Advantage";
import Contact from "@/components/Contact";
import FAQ from "@/components/FAQ";
import Guarantee from "@/components/Guarantee";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import CTAModal from "@/components/CTAModal";
import Work from "@/components/Work";

const X = (
  <svg viewBox="0 0 100 100">
    <path d="M23 23L77 77M77 23L23 77" stroke="#fff" strokeWidth="16" />
  </svg>
);

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
        <div className="lockup">
          <span className="word">form</span>
          <span className="sq introsq">
            <svg viewBox="0 0 100 100">
              <path d="M12 12L42 42M42 12L12 42" stroke="#fff" strokeWidth="10" />
            </svg>
          </span>
        </div>
        <span className="sub">Interiors</span>
      </div>

      {/* ---- scroll ring + menu ---- */}
      <svg id="ring" viewBox="0 0 68 68">
        <circle id="rc" cx="34" cy="34" r="31" />
      </svg>
      <button suppressHydrationWarning
        id="xbtn"
        className="sq"
        aria-label="Open menu"
        aria-expanded="false"
        data-cursor="menu"
      >
        {X}
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
        <a href="#process">
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

      {/* ---- projects wall ---- */}
      <Projects />

      <HowWeWork />

      {/* ---- estimator ---- */}
      <Estimator />

      {/* ---- three promises ---- */}
      <Advantage />

      {/* ---- cost anatomy ---- */}
      <MoneyBreakdown />

      {/* ---- work ---- */}
      <Work />





      {/* ---- Why Us (Four things) ---- */}
      <section className="stages wrap" id="process">
        <div className="stage-head">
          <div style={{ maxWidth: "600px" }}>
            <div className="eyebrow rv">
              <span className="mono">Why people pick us</span>
            </div>
            <h2 data-split>Four things nobody else in this city puts in writing.</h2>
          </div>
          <p className="lead">
            We are not the cheapest quote you will get. We are the one you can check,
            line by line, before you sign.
          </p>
        </div>
        <div className="grid4">
          <article className="cell rv">
            <span className="no">01</span>
            <h3>The drawing is yours</h3>
            <p>
              After the first site visit you get a measured drawing — dimensions, plug
              points, everything. Take it to any contractor in Hyderabad. No charge,
              no obligation, no watermark.
            </p>
          </article>
          <article className="cell rv">
            <span className="no">02</span>
            <h3>Materials named, not implied</h3>
            <p>
              “Premium ply” means nothing. Our quote says BWP 710 in wet zones, Merino
              1mm laminate, Hettich channels — brand, grade, thickness. Compare it
              against anyone.
            </p>
          </article>
          <article className="cell rv">
            <span className="no">03</span>
            <h3>A photo every Saturday</h3>
            <p>
              Dated site photos in your WhatsApp every week, whether you asked or not.
              Eight of our clients ran their build from another country on nothing
              else.
            </p>
          </article>
          <article className="cell rv">
            <span className="no">04</span>
            <h3>Our own carpenters</h3>
            <p>
              Paid per project, not per day, so nobody on site profits from a slow
              week. The handover date goes in the contract before we cut a single
              sheet.
            </p>
          </article>
        </div>
      </section>

      {/* ---- testimonials ---- */}
      <Testimonials />

      {/* ---- book a consultation ---- */}
      <Contact />

      {/* ---- faq ---- */}
      <FAQ />

      {/* ---- guarantee ---- */}
      <Guarantee />

      {/* ---- final CTA ---- */}
      <CTA />

      {/* ---- footer ---- */}
      <Footer />

      <CTAModal />
    </>
  );
}

