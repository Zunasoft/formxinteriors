"use client";
import Logo from "@/components/Logo";
import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fx-footer-section">
      <div className="fgrid">
        <div>
          <a className="logo" href="/" aria-label="form X Interiors — home">
            <Logo />
          </a>
          <p style={{ fontSize: "15px", lineHeight: "1.6", marginTop: "14px", maxWidth: "34ch" }}>
            Interior design and turnkey execution in Hyderabad. Measured drawings, named materials, a photo every Saturday.
          </p>
          <div className="social">
            <a href="https://www.instagram.com/form_x_interiors?igsh=MWYzcmIwb29xa2FkYw%3D%3D" rel="noopener me" target="_blank" aria-label="form X Interiors on Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/></svg>
            </a>
            <a href="https://wa.me/919951733955" rel="noopener" target="_blank" aria-label="Message us on WhatsApp">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 21l2.2-5.3A8.5 8.5 0 1 1 21 11.5z"/></svg>
            </a>
            <a href="mailto:CONNECT@FORMXINTERIORS.COM" aria-label="Email form X Interiors">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 6 10-6"/></svg>
            </a>
          </div>
        </div>
        <div>
          <h4>Services</h4>
          <ul>
            <li><a href="#">Design</a></li>
            <li><a href="#">Build</a></li>
            <li><a href="#">Design + Build</a></li>
            <li><a href="#estimate">Pricing breakdown</a></li>
          </ul>
        </div>
        <div>
          <h4>Studio</h4>
          <ul>
            <li><a href="#work">Selected work</a></li>
            <li><a href="#offers-cards">Our process</a></li>
            <li><a href="#book-consultation">Reviews</a></li>
          </ul>
        </div>
        <div>
          <h4>Visit or call</h4>
          <ul>
            <li><a href="tel:+919951733955">+91 99517 33955</a></li>
            <li><a href="mailto:CONNECT@FORMXINTERIORS.COM">CONNECT@FORMXINTERIORS.COM</a></li>
          </ul>
          <p style={{ fontSize: "15px", marginTop: "10px" }}>Studio address, Road No. 12<br/>Banjara Hills, Hyderabad 500034</p>
          <p className="mono" style={{ marginTop: "10px" }}>Mon–Sat · 10:00–19:00</p>
        </div>
      </div>
      <div className="fbot">
        <span>© {currentYear} FORM X INTERIORS</span>
        <span>·</span>
        <span>A RAZO LAB PRACTICE</span>
      </div>
    </footer>
  );
}
