"use client";
import { useState, useEffect, useRef } from "react";
import "./CTAModal.css";

const RATES = { titanium: 1650, platinum: 2450 };
const TYPE_SIZE = { '2 BHK': 1250, '3 BHK': 1750, '4 BHK': 2450, 'Villa': 4200, 'Office': 2000 };

export default function CTAModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [estimate, setEstimate] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Pane B inputs
  const [homeType, setHomeType] = useState("3 BHK");
  const [sqFt, setSqFt] = useState(1750);

  // Form inputs
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loc, setLoc] = useState("");

  // Validation dirty states
  const [badName, setBadName] = useState(false);
  const [badPhone, setBadPhone] = useState(false);
  const [badLoc, setBadLoc] = useState(false);

  const [sending, setSending] = useState(false);

  const nameInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const locInputRef = useRef(null);

  // Helper formatting functions
  const comma = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const lakh = (n) => "₹" + (n / 100000).toFixed(1) + " L";

  // Figure count-up animation for Pane A
  const [animatedRange, setAnimatedRange] = useState("—");
  
  useEffect(() => {
    if (isOpen && estimate && estimate.range) {
      const m = String(estimate.range).match(/([^\d]*)([\d.,]+)(.*)/);
      if (!m) {
        setAnimatedRange(estimate.range);
        return;
      }
      const prefix = m[1];
      const targetVal = parseFloat(m[2].replace(/,/g, ""));
      const suffix = m[3];
      const decimals = (m[2].split(".")[1] || "").length;

      let t0 = null;
      let animId;
      const step = (ts) => {
        if (!t0) t0 = ts;
        const progress = Math.min((ts - t0) / 850, 1);
        const currentVal = targetVal * (1 - Math.pow(1 - progress, 3));
        setAnimatedRange(prefix + currentVal.toFixed(decimals) + suffix);
        if (progress < 1) {
          animId = requestAnimationFrame(step);
        }
      };
      animId = requestAnimationFrame(step);
      return () => cancelAnimationFrame(animId);
    }
  }, [isOpen, estimate]);

  // Handle open/close globally via window.FXQuote
  useEffect(() => {
    window.FXQuote = {
      open: (data) => {
        setEstimate(data || null);
        setIsSubmitted(false);
        setIsOpen(true);
        setBadName(false);
        setBadPhone(false);
        setBadLoc(false);
        setSending(false);
        setTimeout(() => {
          if (nameInputRef.current) nameInputRef.current.focus();
        }, 80);
      },
      close: () => {
        setIsOpen(false);
      }
    };
    return () => {
      if (typeof window !== "undefined") {
        delete window.FXQuote;
      }
    };
  }, []);

  // Sync scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Validation functions
  const validateName = (val) => {
    const ok = val.trim().length > 1;
    setBadName(!ok);
    return ok;
  };

  const validatePhone = (val) => {
    const ok = /^[6-9]\d{9}$/.test(val.replace(/\D/g, ""));
    setBadPhone(!ok);
    return ok;
  };

  const validateLoc = (val) => {
    if (estimate) {
      setBadLoc(false);
      return true;
    }
    const ok = val.trim().length > 1;
    setBadLoc(!ok);
    return ok;
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        window.FXQuote.close();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isOffice = homeType === "Office";
  const rangeMin = lakh(sqFt * RATES.titanium);
  const rangeMax = lakh(sqFt * RATES.platinum);
  const liveRange = `${rangeMin} – ${rangeMax}`;

  const handleEditClick = () => {
    window.FXQuote.close();
    const c = document.getElementById("estimate");
    if (c) c.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isNValid = validateName(name);
    const isPValid = validatePhone(phone);
    const isLValid = validateLoc(loc);

    if (!isNValid || !isPValid || !isLValid) {
      if (!isNValid && nameInputRef.current) nameInputRef.current.focus();
      else if (!isPValid && phoneInputRef.current) phoneInputRef.current.focus();
      else if (!isLValid && locInputRef.current) locInputRef.current.focus();
      return;
    }

    setSending(true);

    const payload = {
      source: estimate ? "estimator" : "cta",
      name: name.trim(),
      phone: phone.replace(/\D/g, ""),
      location: loc.trim(),
      projectType: estimate ? estimate.type : homeType,
      size: estimate ? estimate.size : `${comma(sqFt)} sq ft`,
      spec: estimate ? estimate.spec : "",
      rangeShown: estimate ? estimate.range : (!isOffice ? liveRange : ""),
      ts: new Date().toISOString()
    };

    console.log("form X lead", payload);

    setTimeout(() => {
      setIsSubmitted(true);
      setSending(false);
    }, 600);
  };

  return (
    <div id="fxq" className="on" role="dialog" aria-modal="true" aria-labelledby="fxq-h">
      <div className="scrim" onClick={() => window.FXQuote.close()}></div>

      <div className="sheet">
        <button className="x" type="button" onClick={() => window.FXQuote.close()} aria-label="Close">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        {/* ---------------- LEFT : the flat ---------------- */}
        <div className="left">
          <span className="tick tl"></span><span className="tick br"></span>

          {/* Pane A: Estimate carried in */}
          <div className={`pane ${estimate ? "on" : ""}`}>
            <div className="lab"><span className="mono">YOUR ESTIMATE</span><span className="line"></span></div>
            <p className="fig">{animatedRange}</p>
            <div className="pills">
              {estimate && estimate.type && <span className="pill">{estimate.type}</span>}
              {estimate && estimate.size && <span className="pill">{estimate.size}</span>}
              {estimate && estimate.spec && <span className="pill">{estimate.spec}</span>}
            </div>
            <button className="edit" type="button" onClick={handleEditClick}>← Change the numbers</button>
            <p className="note">Indicative. The exact figure comes after we measure the flat — and it does not move after sign-off.</p>
          </div>

          {/* Pane B: No estimate carried in */}
          <div className={`pane ${!estimate ? "on" : ""}`}>
            <div className="lab"><span className="mono">YOUR PROJECT</span><span className="line"></span></div>

            <div className="field">
              <span className="flabel" id="lb-type">Home type</span>
              <div className="chips" role="group" aria-labelledby="lb-type">
                {['2 BHK', '3 BHK', '4 BHK', 'Villa', 'Office'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={homeType === t}
                    onClick={() => {
                      setHomeType(t);
                      if (TYPE_SIZE[t]) setSqFt(TYPE_SIZE[t]);
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <div className="sqhead">
                <label className="flabel" htmlFor="sq" style={{ margin: 0 }}>Size on your agreement</label>
                <span className="sqval">{comma(sqFt)} sq ft</span>
              </div>
              <input
                className="slider"
                id="sq"
                type="range"
                min="500"
                max="6000"
                step="25"
                value={sqFt}
                onChange={(e) => setSqFt(parseInt(e.target.value, 10))}
                aria-label="Size in square feet"
              />
              <div className="scale"><span>500</span><span>6,000 SQ FT</span></div>
            </div>

            <div id="live" className={!isOffice ? "on" : ""}>
              <div className="lab"><span className="mono">INDICATIVE RANGE</span><span className="line"></span></div>
              <p className="fig">{liveRange}</p>
              <p className="live-note">
                {homeType} · {comma(sqFt)} sq ft · Titanium to Platinum specification.
              </p>
            </div>

            <ul className="gets">
              <li><b></b><span><strong>A measured drawing</strong> — yours to keep either way.</span></li>
              <li><b></b><span><strong>An itemised cost</strong> — brands and grades named.</span></li>
              <li><b></b><span><strong>An honest answer on scope</strong> at the visit, not in week six.</span></li>
            </ul>
          </div>
        </div>

        {/* ---------------- RIGHT : you ---------------- */}
        <div className="right">
          {!isSubmitted ? (
            <div className="rbody">
              <div className="lab">
                <span className="mono">
                  {estimate ? "LAST STEP" : "ONE STEP"}
                </span>
                <span className="line"></span>
              </div>
              <h2 className="h" id="fxq-h">
                {estimate ? "Two things and we’re done." : "Ninety minutes. One drawing."}
              </h2>
              <p className="sub">
                {estimate 
                  ? "You’ve already told us about the flat. We won’t ask again." 
                  : "Set the flat on the left. Three details and a designer is at your door."
                }
              </p>

              <form onSubmit={handleSubmit} style={{ display: "contents" }}>
                <div>
                  <div className="grid2">
                    <div className={`f ${badName ? "bad" : ""}`}>
                      <label htmlFor="name">Your name <span className="req">*</span></label>
                      <input
                        type="text"
                        id="name"
                        ref={nameInputRef}
                        placeholder="Rajesh"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => validateName(name)}
                        required
                      />
                      <p className="err">Please tell us what to call you.</p>
                    </div>
                    <div className={`f ${badPhone ? "bad" : ""}`}>
                      <label htmlFor="phone">Mobile number <span className="req">*</span></label>
                      <input
                        type="tel"
                        id="phone"
                        ref={phoneInputRef}
                        placeholder="10 digits"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onBlur={() => validatePhone(phone)}
                        required
                      />
                      <p className="err">That doesn’t look like a 10-digit Indian mobile number.</p>
                      <p className="hint">One designer calls you once.</p>
                    </div>
                  </div>

                  <div className={`f ${badLoc ? "bad" : ""}`}>
                    <label htmlFor="loc">
                      Project or area{" "}
                      <span className={estimate ? "opt" : "req"}>
                        {estimate ? "(optional)" : "*"}
                      </span>
                    </label>
                    <input
                      type="text"
                      id="loc"
                      ref={locInputRef}
                      placeholder="My Home Avatar, Narsingi"
                      value={loc}
                      onChange={(e) => setLoc(e.target.value)}
                      onBlur={() => validateLoc(loc)}
                    />
                    <p className="err">An area name is enough for now.</p>
                  </div>
                </div>

                <div className="foot">
                  <button className="send" type="submit" disabled={sending}>
                    <span>
                      {sending
                        ? "Sending…"
                        : estimate
                          ? "Send me the exact cost"
                          : "Book my measurement visit"
                      }
                    </span>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                  </button>
                  <p className="assure">
                    {estimate 
                      ? "TAKES TEN SECONDS · ONE DESIGNER, NOT A CALL CENTRE" 
                      : "FREE, NO OBLIGATION · ONE DESIGNER, NOT A CALL CENTRE"
                    }
                  </p>
                </div>
              </form>
            </div>
          ) : (
            <div id="done" className="on" role="status" aria-live="polite" tabIndex="-1">
              <div className="lab"><span className="mono">CONFIRMED</span><span className="line"></span></div>
              <h2 className="h">{name.split(" ")[0]}, got it.</h2>
              <ul className="next">
                <li><b></b><div><strong>A designer calls you</strong><span>To fix a time for the measurement visit.</span><em>Within 2 working hours, Mon–Sat</em></div></li>
                <li><b></b><div><strong>We measure the flat</strong><span>Ninety minutes. The drawing is yours to keep either way.</span><em>Usually within 4 days</em></div></li>
                <li><b></b><div><strong>Your itemised cost</strong><span>Line by line, brands and grades named.</span><em>48 hours after the visit</em></div></li>
              </ul>
              <div className="foot">
                <button className="send" type="button" onClick={() => window.FXQuote.close()} style={{ background: "none", color: "var(--shell)", borderColor: "var(--rule-2)" }}>Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
