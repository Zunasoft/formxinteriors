"use client";
import "./CTA.css";

export default function CTA() {
  return (
    <section className="fx-cta-section" id="final-cta">
      <div className="wrap">
        <h2>Book the visit.<br/>Keep the drawing.</h2>
        <p>Ninety minutes at your flat, a measured drawing within a week, an itemised quote within 48 hours of that. If you take all three somewhere else, that is a fair outcome for us too.</p>
        <div className="row">
          <a className="btn btn-p" href="#book-consultation">
            Book a free consultation
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
          <a className="btn btn-s" href="tel:+919951733955">Call +91 99517 33955</a>
        </div>
        <small>No obligation · We reply within 2 working hours · Serving all of Hyderabad</small>
      </div>
    </section>
  );
}
