"use client";
import "./FAQ.css";

export default function FAQ() {
  return (
    <section className="fx-faq-section" id="faq" aria-labelledby="fx-faq-title">
      <div className="fx-faq-wrap">
        <div className="fx-faq-eyebrow">
          <span className="mono">Before you ask</span>
        </div>
        <h2 id="fx-faq-title" className="fx-faq-title">
          The six questions every single client asks.
        </h2>

        <div className="fx-faq-container">
          <details className="fx-faq-q">
            <summary className="fx-faq-summary">
              What does a full home interior cost in Hyderabad?
            </summary>
            <div className="fx-faq-a">
              <p>
                Our completed projects run from ₹9L for a 2 BHK kitchen and wardrobes
                to ₹39L for a 4 BHK in Platinum specification. Roughly, Gold works out
                to ₹1,100 per sq ft of home area and Platinum to ₹1,500. The{" "}
                <a href="#pricing">cost breakdown above</a> shows where every rupee
                of that goes — and your quote will be itemised the same way.
              </p>
            </div>
          </details>

          <details className="fx-faq-q">
            <summary className="fx-faq-summary">
              Do I have to use your design team?
            </summary>
            <div className="fx-faq-a">
              <p>
                No. <a href="#services">Build</a> is a standalone service. If you
                already have an architect, we execute against their drawings and
                stay out of the design. Roughly one project in four reaches us this
                way, and we do not quietly try to redesign your home once we are on
                site.
              </p>
            </div>
          </details>

          <details className="fx-faq-q">
            <summary className="fx-faq-summary">
              Do I really keep the drawing if I do not sign?
            </summary>
            <div className="fx-faq-a">
              <p>
                Yes. The measured drawing from the first site visit is yours —
                dimensions, plug points, the lot. Take it to any contractor in the
                city. It costs us a morning, and we would rather earn the job on the
                quote than on holding your measurements hostage.
              </p>
            </div>
          </details>

          <details className="fx-faq-q">
            <summary className="fx-faq-summary">
              How long does a project take, and what if you are late?
            </summary>
            <div className="fx-faq-a">
              <p>
                Eight weeks for a 2 BHK kitchen and wardrobes, eleven to fourteen
                for a full home. The date is in the contract before we cut a sheet,
                and you get a dated photo every Saturday, so a slip is visible to
                you the week it happens rather than the month after.
              </p>
            </div>
          </details>

          <details className="fx-faq-q">
            <summary className="fx-faq-summary">
              What if I am not in Hyderabad during the build?
            </summary>
            <div className="fx-faq-a">
              <p>
                Common, and fine. Every decision can be made on WhatsApp against
                photos. One of our 2026 handovers was run from Dubai for eight of
                its eleven weeks — the client saw the flat finished before he saw it
                in person.
              </p>
            </div>
          </details>

          <details className="fx-faq-q">
            <summary className="fx-faq-summary">
              What is covered by the warranty, and what is not?
            </summary>
            <div className="fx-faq-a">
              <p>
                One year on our workmanship across the whole project, plus the
                manufacturer warranty on hardware — up to ten years on Blum and
                Hettich mechanisms. Not covered: water damage from civil leaks, and
                anything a third party modifies after handover. Civil work, painting
                and false ceiling are quoted separately from the numbers on this
                page.
              </p>
            </div>
          </details>
        </div>

        <p className="fx-faq-lead">
          Still unsure? Ask us on the consultation — it is free, and you leave
          with a drawing regardless.
        </p>
      </div>
    </section>
  );
}
