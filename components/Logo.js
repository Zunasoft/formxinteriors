// Accurate "form X Interiors" lockup — stacked wordmark + tall orange square
// with a bold white X, matching formxinteriors updated.png.
export default function Logo({ className = "" }) {
  return (
    <span className={"logo " + className} aria-label="form X Interiors">
      <span className="logo-words" aria-hidden="true">
        <span className="logo-form">form</span>
        <span className="logo-int">Interiors</span>
      </span>
      <span className="logo-sq" aria-hidden="true">
        {/* square divided in 4 — the X sits in the top-left cell */}
        <svg viewBox="0 0 100 100">
          <path
            d="M 18 18 L 65 65 M 65 18 L 18 65"
            stroke="#fff"
            strokeWidth="11"
          />
        </svg>
      </span>
    </span>
  );
}
