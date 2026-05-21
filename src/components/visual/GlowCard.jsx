export default function GlowCard({ as: Component = 'article', interactive = false, className = '', children, ...props }) {
  return (
    <Component className={`glow-card ${interactive ? 'glow-card--interactive' : 'glow-card--static'} ${className}`} {...props}>
      {children}
    </Component>
  );
}
