"use client";
import { useEffect, useRef, useState } from "react";
import "./Contact.css";

const UNITS = ["2 BHK", "3 BHK", "4 BHK", "Villa", "Office"];
const POSSESSIONS = ["Already living in it", "Handover soon", "Under construction"];
const SCOPES = ["Modular kitchen", "Wardrobes", "Living + dining", "False ceiling", "Pooja unit", "Full home"];
const STAGES = [
  { when: "Within 2 hrs", what: "We call you", note: "To confirm the slot. A Hyderabad number, not a call centre." },
  { when: "Day 2–3", what: "The visit", note: "An architect attends. We measure every room and photograph it." },
  { when: "Day 5–6", what: "Your drawing", note: "A measured floor plan sent to you. Yours whether you hire us or not." },
  { when: "Within 48 hrs of that", what: "Layouts and quote", note: "Two layout options, itemised line by line. Two rounds of changes included." }
];

export default function Contact() {
  const [unit, setUnit] = useState("3 BHK");
  const [poss, setPoss] = useState("Handover soon");
  const [scope, setScope] = useState(SCOPES.slice(0, 4));
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [place, setPlace] = useState("");
  const [errA, setErrA] = useState(false);
  const [errB, setErrB] = useState(false);
  const [booked, setBooked] = useState(null);

  const tlRef = useRef(null);
  const fillRef = useRef(null);
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const placeRef = useRef(null);

  const stage = booked ? 1 : 0;

  useEffect(() => {
    const items = tlRef.current?.querySelectorAll("li");
    if (!items?.length || !fillRef.current) return;
    const last = items[Math.max(0, stage - 1)];
    const h = stage ? last.offsetTop + 12 - items[0].offsetTop : 0;
    fillRef.current.style.height = Math.max(0, h) + "px";
  }, [stage]);

  const toggleScope = (s) => {
    setScope((cur) => (cur.includes(s) ? (cur.length === 1 ? cur : cur.filter((x) => x !== s)) : [...cur, s]));
  };

  const submit = () => {
    const okA = name.trim().length > 1 && phone.length === 10;
    const okB = place.trim().length > 1;
    setErrA(!okA);
    setErrB(!okB);
    if (!okA) { (name.trim().length < 2 ? nameRef : phoneRef).current?.focus(); return; }
    if (!okB) { placeRef.current?.focus(); return; }
    setBooked({ name: name.trim(), phone, place: place.trim(), unit, possession: poss, scope });
  };

  return (
    <section className="fx-contact" id="book-consultation">
      <div className="ct-eyebrow"><span className="ct-mono">Start here</span></div>
      <h2 data-split>Book the visit. Keep the drawing.</h2>

      <div className="ct-cols">
        {/* ============ left: the form ============ */}
        <div className="ct-left">
          <div className={`ct-pane${booked ? " ct-out" : ""}`}>
            <div>
              <div className="ct-glab"><span className="ct-mono">Unit type</span></div>
              <div className="ct-opts">
                {UNITS.map((u) => (
                  <button suppressHydrationWarning type="button" key={u} className="ct-opt"
                    aria-pressed={unit === u} data-cursor="pick" onClick={() => setUnit(u)}>{u}</button>
                ))}
              </div>
            </div>

            <div>
              <div className="ct-glab"><span className="ct-mono">Possession</span></div>
              <div className="ct-opts">
                {POSSESSIONS.map((p) => (
                  <button suppressHydrationWarning type="button" key={p} className="ct-opt"
                    aria-pressed={poss === p} data-cursor="pick" onClick={() => setPoss(p)}>{p}</button>
                ))}
              </div>
            </div>

            <div>
              <div className="ct-glab">
                <span className="ct-mono">What needs doing</span>
                <span className="ct-mono">{scope.length} selected</span>
              </div>
              <div className="ct-opts">
                {SCOPES.map((s) => (
                  <button suppressHydrationWarning type="button" key={s} className="ct-opt"
                    aria-pressed={scope.includes(s)} data-cursor="toggle" onClick={() => toggleScope(s)}>{s}</button>
                ))}
              </div>
            </div>

            <div className="ct-two">
              <label className="ct-f"><span>Your name <i>*</i></span>
                <input suppressHydrationWarning type="text" ref={nameRef} autoComplete="name" placeholder="Rajesh Kumar"
                  value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label className="ct-f"><span>WhatsApp number <i>*</i></span>
                <input suppressHydrationWarning type="tel" ref={phoneRef} autoComplete="tel" inputMode="numeric" maxLength={10}
                  placeholder="98XXXXXXXX" value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} />
              </label>
            </div>
            <div className={`ct-err${errA ? " on" : ""}`}>Add your name and a 10-digit mobile number.</div>

            <label className="ct-f"><span>Project, tower or area <i>*</i></span>
              <input suppressHydrationWarning type="text" ref={placeRef} placeholder="e.g. Kokapet, or your project name"
                value={place} onChange={(e) => setPlace(e.target.value)} />
            </label>
            <div className={`ct-err${errB ? " on" : ""}`}>An area name is enough for now.</div>

            <div className="ct-gorow">
              <button suppressHydrationWarning type="button" className="ct-btn mag" data-cursor="book" onClick={submit}>
                Book the visit <span>→</span>
              </button>
              <span className="ct-mono">The slot and the rest we settle on the call</span>
            </div>
          </div>

          <div className={`ct-pane ct-done${booked ? "" : " ct-out"}`}>
            <h3>
              {booked ? `Booked, ${booked.name.split(" ")[0]}. We call to ` : "Booked. We'll call to "}
              <em>confirm the slot</em>.
            </h3>
            <div className="ct-recap">
              {booked && [booked.unit, booked.possession, booked.place, ...booked.scope].map((b) => <i key={b}>{b}</i>)}
            </div>
            <div className="ct-gorow">
              <span className="ct-mono">We reply within 2 working hours</span>
            </div>
          </div>
        </div>

        {/* ============ right ============ */}
        <aside className="ct-side">
          <div className="ct-fee"><i></i><b>Free — and you keep the drawing either way</b></div>

          <div className="ct-sbox">
            <h3>What you get</h3>
            <ul className="ct-gets">
              <li>A measured drawing of your flat, yours to keep</li>
              <li>Two layout directions, not one</li>
              <li>An indicative cost, itemised by room</li>
              <li>Straight answers on materials and timelines</li>
            </ul>
          </div>

          <div className="ct-sbox ct-tlbox">
            <h3>What happens next</h3>
            <ul className="ct-tl" ref={tlRef}>
              <span className="ct-fillline" ref={fillRef}></span>
              {STAGES.map((s, i) => (
                <li key={s.what} data-cursor="stage"
                  className={`${i < stage ? "lit" : ""} ${i === stage - 1 ? "now" : ""}`.trim()}>
                  <div className="ct-when">{s.when}</div>
                  <div className="ct-what">{s.what}</div>
                  <p>{s.note}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="ct-sbox">
            <div className="ct-arch">
              <span className="ct-ic">X</span>
              <div>
                <b>An architect attends</b>
                <p>Every consultation is taken by a registered architect. We don't send a sales executive with a tablet.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
