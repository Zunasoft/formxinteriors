"use client";
import "./FAQ.css";

/* One source for the accordion AND the FAQPage schema, so the two always match
   word for word. Answers may contain [link text](#anchor) — rendered as links on
   the page, plain text in the schema. An entry without an answer is skipped in
   both until its copy arrives. Order: Q13 sits right after Q1. */
const FAQS = [
  {
    q: "How much do home interiors cost in Hyderabad?",
    // RATES TO CONFIRM: ₹1,100 / ₹1,500 and ₹19L / ₹26L are the calculator's current
    // figures (1,750 × rate). Update here once the final rates are signed off.
    a: "Gold works out to about ₹1,100 per sq ft of home area and Platinum about ₹1,500, so a 1,750 sq ft 3BHK is roughly ₹19L in Gold or ₹26L in Platinum. Design is free when we build. Civil, electrical and painting are separate lines in the same quote — we do them all.",
  },
  {
    q: "Is the design really free?",
    a: "Yes, when we build it. Design is step one of our turnkey process: an architect plans every room in 3D and prices it line by line. Build with us and you pay nothing for design. Walk away and you still keep the measured drawing.",
  },
  {
    q: "Can I hire you only to build?",
    a: "Yes. Build is a standalone service. If you already have an architect, we execute their drawings exactly, checked in our in-house software, and never quietly redesign your home on site.",
  },
  {
    q: "Do I keep the drawing if I don’t hire you?",
    a: "Yes. The measured drawing from the first visit — every dimension, electrical point and plumbing line — is yours. Take it to any contractor in Hyderabad. We’d rather win your project on the quote than by holding your measurements.",
  },
  {
    q: "How long do interiors take — and what if you’re late?",
    // TO CONFIRM: the 2–3 week design period, and any delay penalty (add it here if offered)
    a: "Design takes 2–3 weeks, depending on how fast you decide. From drawing sign-off, a standard 3BHK is handed over in 48 days; bigger homes get a date agreed upfront. The date is in your contract, and daily photos show any slip the week it happens.",
  },
  {
    q: "Can I get my interiors done while I’m abroad?",
    a: "Yes, it’s common for NRI owners. Every decision happens on WhatsApp and video calls, against 3D views and daily site photos — so you see your finished home before you fly in.",
  },
  {
    q: "What does the 10-year warranty cover?",
    // TO CONFIRM: 10 years on workmanship (the old text said 1 year)
    a: "10 years on our work across the whole project, plus the manufacturer’s warranty on hardware — up to 10 years on Blum and Hettich mechanisms. Not covered: water damage from civil leaks, or anything changed by someone else after handover.",
  },
  {
    q: "Which areas of Hyderabad do you work in?",
    a: "All of Hyderabad — from HITEC City, Gachibowli, Kondapur and the Financial District to Kokapet, Narsingi, Tellapur, Kollur, Miyapur, Kompally, Jubilee Hills and Banjara Hills. Our studio is in HITEC City, opposite Shilparamam.",
  },
  {
    q: "When should I start — before or after possession?",
    a: "About 6–8 weeks before you get your keys. We measure as soon as the builder allows access, finish the design while the flat is completed, and start work the week you take possession — less time paying EMI and rent together.",
  },
  {
    q: "Which materials and brands do you use?",
    a: "BWP (boiling-water-proof) plywood for every carcass, Merino laminates or acrylic/PU shutters, Hettich or imported soft-close hardware, and quartz countertops. Each item is named by brand and grade in your quote.",
  },
  {
    // TO CONFIRM: keep only if Vastu planning is offered
    q: "Do you design Vastu-aligned homes?",
    a: "Yes, if you’d like it. We plan the entrance, kitchen, pooja unit and bed positions with Vastu in mind from the first layout, so it’s never a last-minute change on site.",
  },
  {
    q: "How do I pick the best interior company in Hyderabad?",
    a: "Check four things before you sign: one company handles everything from civil work to handover; every material is named in the quote; the handover date is in the contract; and you deal with architects, not salespeople. Form X Interiors puts all four in writing.",
  },
  {
    q: "How do you make sure nothing goes wrong on site?",
    a: "Our in-house software, built by razo lab, computes every measurement, cut list and quantity from the architect’s drawing before anything is made — so mistakes are caught on screen, not on your site. Daily photos let you check the work yourself.",
  },
].filter((f) => f.a);

const LINK = /\[([^\]]+)\]\(([^)]+)\)/g;
const plain = (s) => s.replace(LINK, "$1");
function rich(s) {
  const out = [];
  let last = 0, m, k = 0;
  LINK.lastIndex = 0;
  while ((m = LINK.exec(s))) {
    out.push(s.slice(last, m.index), <a key={k++} href={m[2]}>{m[1]}</a>);
    last = m.index + m[0].length;
  }
  out.push(s.slice(last));
  return out;
}

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: plain(f.a) },
  })),
};

export default function FAQ() {
  return (
    <section className="fx-faq-section" id="faq" aria-labelledby="fx-faq-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <div className="fx-faq-wrap">
        <div className="fx-faq-eyebrow">
          <span className="mono">FAQ</span>
        </div>
        <h2 id="fx-faq-title" className="fx-faq-title">
          Hiring an interior company in Hyderabad?
        </h2>

        <div className="fx-faq-container">
          {/* two independent columns (first half left) so opening one answer
              never reshuffles questions between columns */}
          {[FAQS.slice(0, Math.ceil(FAQS.length / 2)), FAQS.slice(Math.ceil(FAQS.length / 2))].map((col, c) => (
            <div className="fx-faq-col" key={c}>
              {col.map((f) => (
                /* one open at a time: `name` does it natively in current browsers,
                   onToggle closes the others in older ones */
                <details
                  className="fx-faq-q"
                  key={f.q}
                  name="fx-faq"
                  onToggle={(e) => {
                    const d = e.currentTarget;
                    if (!d.open) return;
                    d.closest(".fx-faq-container")
                      .querySelectorAll("details[open]")
                      .forEach((o) => { if (o !== d) o.open = false; });
                  }}
                >
                  <summary className="fx-faq-summary">{f.q}</summary>
                  <div className="fx-faq-a">
                    <p>{rich(f.a)}</p>
                  </div>
                </details>
              ))}
            </div>
          ))}
        </div>

        <p className="fx-faq-lead">
          Still unsure? Ask the architect at your free visit — you keep the
          drawing either way.
        </p>
      </div>
    </section>
  );
}
