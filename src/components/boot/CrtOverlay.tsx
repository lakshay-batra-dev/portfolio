export function CrtOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-10" aria-hidden="true">
      <div className="crt-scan absolute inset-0" />
      <div className="crt-vignette absolute inset-0" />
    </div>
  );
}
