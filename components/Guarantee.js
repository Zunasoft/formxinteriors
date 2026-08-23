"use client";
import "./Guarantee.css";

export default function Guarantee() {
  return (
    <section className="fx-guarantee" aria-labelledby="fx-guarantee-title">
      <div className="fx-guarantee-wrap">
        <div className="fx-guarantee-eyebrow">
          <span>Our side of the deal</span>
        </div>
        <h2 id="fx-guarantee-title" className="fx-guarantee-title">
          Three promises, in the contract, not just on the website.
        </h2>

        <div className="fx-guarantee-grid">
          <div className="fx-guarantee-card">
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <h3>One year, no argument</h3>
            <p>
              Workmanship warranty on the whole project. If a shutter sags or a
              channel fails in the first year, we come and fix it — no inspection
              fee, no debate about whose fault it was.
            </p>
          </div>

          <div className="fx-guarantee-card">
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <h3>The quote is the bill</h3>
            <p>
              The signed number does not move unless you change the scope in
              writing. No “site conditions” surcharge in week nine.
            </p>
          </div>

          <div className="fx-guarantee-card">
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M3 3v18h18" />
              <path d="M7 15l4-5 3 3 5-7" />
            </svg>
            <h3>Snags close before the last payment</h3>
            <p>
              You hold the final instalment until your snag list is signed off.
              That is the whole incentive structure, and it is deliberate.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
