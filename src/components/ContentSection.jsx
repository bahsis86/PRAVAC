import AmbientBackground from './visual/AmbientBackground.jsx';

export default function ContentSection({ eyebrow, title, children, image, reverse = false, muted = false }) {
  return (
    <section className={`relative overflow-hidden py-12 md:py-20 ${muted ? 'bg-[var(--pravac-surface-soft)]' : 'bg-white'}`}>
      {muted && <AmbientBackground variant="section" />}
      <div className={`container-shell grid items-center gap-10 lg:grid-cols-2 ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
        <div className="relative z-10">
          {eyebrow && <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-pravac">{eyebrow}</p>}
          <h2 className="text-3xl font-black leading-tight text-pravac-blue md:text-5xl">{title}</h2>
          <div className="mt-5 space-y-4 text-base leading-8 text-zinc-600">{children}</div>
        </div>
        {image && (
          <div className="relative z-10 overflow-hidden rounded-lg border border-white/10 shadow-soft">
            <img className="h-full min-h-[300px] w-full object-cover" src={image} alt="" />
          </div>
        )}
      </div>
    </section>
  );
}
