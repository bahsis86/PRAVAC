import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const glowRef = useRef(null);
  const frameRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarsePointer = window.matchMedia('(pointer: coarse)');

    if (reducedMotion.matches || coarsePointer.matches) {
      glow.dataset.enabled = 'false';
      return undefined;
    }

    glow.dataset.enabled = 'true';

    const render = () => {
      const current = currentRef.current;
      const pointer = pointerRef.current;
      current.x += (pointer.x - current.x) * 0.16;
      current.y += (pointer.y - current.y) * 0.16;
      glow.style.setProperty('--mouse-x', `${current.x}px`);
      glow.style.setProperty('--mouse-y', `${current.y}px`);
      frameRef.current = window.requestAnimationFrame(render);
    };

    const onPointerMove = (event) => {
      if (event.pointerType === 'touch') return;
      pointerRef.current = { x: event.clientX, y: event.clientY };
      glow.dataset.visible = 'true';
    };

    const onPointerLeave = () => {
      glow.dataset.visible = 'false';
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);
    frameRef.current = window.requestAnimationFrame(render);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return <div ref={glowRef} className="cursor-glow" aria-hidden="true" />;
}
