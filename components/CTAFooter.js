"use client";
import "./CTAFooter.css";

export default function CTAFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <section className="fx-cta-page" id="final-cta">
      {/* FINAL CTA */}
      <div className="fx-cta-final">
        <h2>Book the visit.<br/>Keep the drawing.</h2>
        <p>Ninety minutes at your flat, a measured drawing within a week, an itemised quote within 48 hours of that. If you take all three somewhere else, that is a fair outcome for us too.</p>
        <div className="row">
          <a className="btn btn-p" href="#book-consultation">Book a free consultation →</a>
          <a className="btn btn-s" href="tel:+919000000000">Call +91 90000 00000</a>
        </div>
        <small>NO OBLIGATION · WE REPLY WITHIN 2 WORKING HOURS · SERVING ALL OF HYDERABAD</small>
      </div>

      {/* FOOTER */}
      <footer className="fx-footer">
        <div className="fgrid">
          <div>
            <div className="logo">form<span className="x">X</span></div>
            <p style={{ fontSize: "15px", lineHeight: "1.6", marginTop: "14px", maxWidth: "34ch" }}>
              Interior design and turnkey execution in Hyderabad. Measured drawings, named materials, a photo every Saturday.
            </p>
          </div>
          <div>
            <h4>Services</h4>
            <ul>
              <li><a href="#">Design</a></li>
              <li><a href="#">Build</a></li>
              <li><a href="#">Design + Build</a></li>
            </ul>
          </div>
          <div>
            <h4>Studio</h4>
            <ul>
              <li><a href="#work">Selected work</a></li>
              <li><a href="#process">Our process</a></li>
              <li><a href="#reviews">Reviews</a></li>
            </ul>
          </div>
          <div>
            <h4>Visit or call</h4>
            <ul>
              <li><a href="tel:+919000000000">+91 90000 00000</a></li>
              <li><a href="mailto:hello@formxinteriors.com">hello@formxinteriors.com</a></li>
              <li><a href="#">Studio address, Road No. 12</a></li>
            </ul>
          </div>
        </div>
        <div className="fbot">
          <div>© {currentYear} form X Interiors</div>
          <div>A Razo Lab practice</div>
        </div>
      </footer>
    </section>
  );
}
