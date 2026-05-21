import AmbientBackground from './AmbientBackground.jsx';

export default function PremiumSection({ as: Component = 'section', children, className = '', innerClassName = '', muted = false, fx = false, ...props }) {
  return (
    <Component className={`premium-section ${muted ? 'premium-section--muted' : ''} ${className}`} {...props}>
      {fx && <AmbientBackground variant="section" />}
      <div className={`container-shell relative z-10 ${innerClassName}`}>
        {children}
      </div>
    </Component>
  );
}
