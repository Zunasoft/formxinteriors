"use client";
import { useState } from "react";
import "./Contact.css";

export default function Contact() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loc, setLoc] = useState("");
  const [unitType, setUnitType] = useState("3 BHK");
  const [scope, setScope] = useState("Design + Build");
  
  const [errors, setErrors] = useState({ name: false, phone: false, loc: false });

  const validate = () => {
    const errs = {
      name: name.trim().length < 2,
      phone: !/^[6-9]\d{9}$/.test(phone.replace(/\D/g, "")),
      loc: loc.trim().length < 2
    };
    setErrors(errs);
    return !errs.name && !errs.phone && !errs.loc;
  };

  const handleNext = () => {
    if (validate()) {
      setStep(2);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDone(true);
  };

  if (done) {
    return (
      <section className="fx-contact" id="book-consultation">
        <div className="fx-main">
          <div id="done" className="on">
            <div className="tick">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2>Booked. Now here is exactly what happens.</h2>
            <p className="lead" id="donesum">
              {name.split(" ")[0] || "There"}, we have your details and will call you soon.
            </p>
            <ul className="tl" style={{ marginTop: "30px" }}>
              <li>
                <b className="dot"></b>
                <div>
                  <strong>A designer calls you</strong>
                  <span>To confirm the slot and ask two or three questions about the flat.</span>
                  <em>Within 2 working hours</em>
                </div>
              </li>
              <li>
                <b className="dot"></b>
                <div>
                  <strong>Site visit, ninety minutes</strong>
                  <span>We measure everything ourselves. Bring your questions and any drawings you already have.</span>
                  <em>Usually within 4 days</em>
                </div>
              </li>
              <li>
                <b className="dot"></b>
                <div>
                  <strong>Your measured drawing arrives</strong>
                  <span>Yours to keep and take anywhere, whether or not you work with us.</span>
                  <em>Within a week of the visit</em>
                </div>
              </li>
              <li>
                <b className="dot"></b>
                <div>
                  <strong>Itemised quote</strong>
                  <span>Line by line, brands and grades named, so you can compare it honestly against anyone else's.</span>
                  <em>48 hours after the drawing</em>
                </div>
              </li>
            </ul>
            <div className="rowb">
              <button className="btn btn-s" onClick={() => { setDone(false); setStep(1); }}>Back to start</button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="fx-contact" id="book-consultation">
      <div className="fx-main">
        <div>
          <span className="mono top-label">Start here</span>
          <h1>Book a <em>consultation.</em></h1>
          <p className="lead">Tell us where your home is. We'll bring the tape, the camera and the questions.</p>

          <div className="prog" aria-hidden="true">
            <div className="done"><i></i></div>
            <div className={step === 2 ? "done" : ""}><i></i></div>
          </div>
          
          <p className="stepn" id="stepn">
            {step === 1 ? "Step 1 of 2 · Takes under a minute" : "Step 2 of 2 · Scope and timing"}
          </p>

          <form id="form" noValidate onSubmit={handleSubmit}>
            {step === 1 && (
              <fieldset id="s1">
                <legend className="sr-only" style={{ position: "absolute", left: "-9999px" }}>About you and the home</legend>

                <div className="f">
                  <label id="lb-type">Unit type</label>
                  <div className="chips" role="group" aria-labelledby="lb-type">
                    {["2 BHK", "3 BHK", "4 BHK", "Villa", "Office"].map(u => (
                      <button type="button" key={u} aria-pressed={unitType === u} onClick={() => setUnitType(u)}>{u}</button>
                    ))}
                  </div>
                </div>

                <div className="f">
                  <label id="lb-poss">Possession</label>
                  <div className="chips" role="group" aria-labelledby="lb-poss">
                    <button type="button" aria-pressed="false">Already living in it</button>
                    <button type="button" aria-pressed="true">Handover soon</button>
                    <button type="button" aria-pressed="false">Under construction</button>
                  </div>
                </div>

                <div className={`f ${errors.name ? "bad" : ""}`}>
                  <label htmlFor="name">Your name <span className="req">*</span></label>
                  <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                  <p className="err">Please tell us what to call you.</p>
                </div>

                <div className={`f ${errors.phone ? "bad" : ""}`}>
                  <label htmlFor="phone">WhatsApp number <span className="req">*</span></label>
                  <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98XXXXXXXX" maxLength={10} required />
                  <p className="err">That does not look like a 10-digit Indian mobile number.</p>
                </div>

                <div className={`f ${errors.loc ? "bad" : ""}`}>
                  <label htmlFor="loc">Project, tower or area <span className="req">*</span></label>
                  <input type="text" id="loc" value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="e.g. Kokapet, or your project name" required />
                  <p className="err">An area name is enough for now.</p>
                </div>

                <div className="rowb">
                  <button className="btn btn-p" type="button" onClick={handleNext}>
                    Continue
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                  </button>
                  <span className="mono">5 fields. Nothing else required.</span>
                </div>
              </fieldset>
            )}

            {step === 2 && (
              <fieldset id="s2">
                <legend className="sr-only" style={{ position: "absolute", left: "-9999px" }}>Scope and timing</legend>

                <div className="f">
                  <label id="lb-scope">What do you need?</label>
                  <div className="chips" role="group" aria-labelledby="lb-scope">
                    {["Design + Build", "Build only", "Design only", "Not sure yet"].map(s => (
                      <button type="button" key={s} aria-pressed={scope === s} onClick={() => setScope(s)}>{s}</button>
                    ))}
                  </div>
                </div>

                <div className="f">
                  <label htmlFor="when">When would you like to start?</label>
                  <select id="when" name="when">
                    <option>As soon as possible</option>
                    <option>Within 1–3 months</option>
                    <option>3–6 months</option>
                    <option>Just planning for now</option>
                  </select>
                </div>

                <div className="f">
                  <label htmlFor="slot">Best time for the site visit</label>
                  <select id="slot" name="slot">
                    <option>Weekday morning</option>
                    <option>Weekday evening</option>
                    <option>Saturday morning</option>
                    <option>Saturday afternoon</option>
                  </select>
                </div>

                <div className="f">
                  <label htmlFor="msg">Anything we should know? <span style={{ textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                  <textarea id="msg" name="msg" placeholder="Existing architect's drawings, a budget you want to hold to, a room that worries you…"></textarea>
                </div>

                <div className="rowb">
                  <button className="btn btn-p" type="submit">Book my free consultation</button>
                  <button className="btn btn-s" type="button" onClick={() => setStep(1)}>Back</button>
                </div>
                <p className="assure">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>
                  We reply within 2 working hours, Mon–Sat. Your number goes to one designer, not a call centre.
                </p>
              </fieldset>
            )}
          </form>
        </div>

        <aside>
          <span className="mono top-label" style={{ color: "var(--fx-contact-orange)" }}>Consultation fee — to be confirmed</span>
          <h2>What you get</h2>
          <ul className="tl">
            <li><b className="dot"></b><div><strong>A measured drawing of your flat, yours to keep</strong></div></li>
            <li><b className="dot"></b><div><strong>Two layout directions, not one</strong></div></li>
            <li><b className="dot"></b><div><strong>An indicative cost, itemised by room</strong></div></li>
            <li><b className="dot"></b><div><strong>Straight answers on materials and timelines</strong></div></li>
          </ul>
          
          <div className="bwho">
            <b>An architect attends</b>
            <p>Every consultation is taken by a registered architect. We don't send a sales executive with a tablet.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
