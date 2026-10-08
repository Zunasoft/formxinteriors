"use client";
import "./CTA.css";

export default function CTA() {
  return (
    <section className="fx-cta-section" id="final-cta">
      <div className="wrap">
        <h2>Visit&rsquo;s on us.<br/>Keep the drawing.</h2>
        <p>Getting your keys soon? 90 minutes with an architect at your home, a measured drawing in a week, an itemised quote 48 hours later. Take all three elsewhere if you like.</p>
        <div className="row">
          <a className="btn btn-p" href="#book-visit">
            Book my free site visit
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
          <a className="btn btn-s" href="tel:+919951733955">Call +91 99517 33955</a>
          <a className="btn btn-s" href="https://wa.me/919951733955" target="_blank" rel="noopener noreferrer">WhatsApp us</a>
        </div>
        <small>No sales team · Reply in 2 working hours · Studio in HITEC City</small>
      </div>
    </section>
  );
}
