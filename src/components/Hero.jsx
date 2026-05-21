import { useEffect, useMemo, useState } from 'react';
import AmbientBackground from './visual/AmbientBackground.jsx';

export default function Hero({ title, subtitle, image, children, compact = false }) {
  const images = useMemo(() => (Array.isArray(image) ? image : [image]), [image]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % images.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [images.length]);

  return (
    <section className={`relative flex items-end overflow-hidden bg-graphite text-white ${compact ? 'min-h-[440px]' : 'min-h-[620px] md:min-h-[700px]'}`}>
      {images.map((item, index) => (
        <img
          key={item}
          className={`absolute inset-0 h-full w-full scale-[1.02] object-cover transition-opacity duration-700 ${index === activeIndex ? 'opacity-100' : 'opacity-0'}`}
          src={item}
          alt=""
          aria-hidden="true"
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_18%,rgba(169,21,36,0.12),transparent_34%),linear-gradient(110deg,rgba(3,3,4,0.96),rgba(8,8,10,0.82)_54%,rgba(8,8,10,0.58))]" />
      <AmbientBackground variant="hero" />
      <div className="absolute inset-x-0 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-pravac/80 to-transparent" />
      <div className="container-shell relative z-10 pb-10 pt-32 md:pb-16">
        <div className="max-w-4xl">
          {subtitle && <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-red-200">{subtitle}</p>}
          <h1 className="max-w-5xl text-4xl font-black leading-[1.02] text-white drop-shadow-[0_16px_50px_rgba(0,0,0,0.55)] md:text-6xl lg:text-7xl">{title}</h1>
        </div>
        {children && <div className="hero-panel mt-8 max-w-5xl">{children}</div>}
        {images.length > 1 && (
          <div className="mt-7 flex gap-2">
            {images.map((item, index) => (
              <button
                key={item}
                className={`h-2.5 rounded-full transition-all ${index === activeIndex ? 'w-10 bg-pravac' : 'w-2.5 bg-white/50 hover:bg-white'}`}
                type="button"
                aria-label={`Slide ${index + 1}`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
