export default function AmbientBackground({ variant = 'section', className = '' }) {
  return (
    <div className={`ambient-background ambient-background--${variant} ${className}`} aria-hidden="true">
      <span className="ambient-background__glow ambient-background__glow--primary" />
      <span className="ambient-background__glow ambient-background__glow--secondary" />
      <span className="ambient-background__glow ambient-background__glow--silver" />
      <span className="ambient-background__grid" />
      <span className="ambient-background__noise" />
      <span className="ambient-background__vignette" />
    </div>
  );
}
