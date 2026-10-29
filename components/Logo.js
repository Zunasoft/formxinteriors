export default function Logo({ className = "" }) {
  return (
    <img
      src="/logo.png"
      alt="form X Interiors"
      className={"logo-img " + className}
    />
  );
}
