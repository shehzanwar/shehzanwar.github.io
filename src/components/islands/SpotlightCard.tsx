// src/components/islands/SpotlightCard.tsx
// M08 BOUNDARY: pointer coords via style.setProperty() only — no useState.
// passive: true listeners. Disabled under prefers-reduced-motion.
import { useEffect, useRef, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  class?: string;
}

export default function SpotlightCard({ children, class: className }: Props) {
  const ref            = useRef<HTMLDivElement>(null);
  const reducedMotion  = useRef(false);

  useEffect(() => {
    reducedMotion.current =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const el = ref.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      if (reducedMotion.current) return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      el.style.setProperty('--my', `${e.clientY - rect.top}px`);
    };

    const onLeave = () => {
      el.style.setProperty('--mx', '-9999px');
      el.style.setProperty('--my', '-9999px');
    };

    el.addEventListener('pointermove', onMove,  { passive: true });
    el.addEventListener('pointerleave', onLeave, { passive: true });

    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`spotlight-card${className ? ` ${className}` : ''}`}
      style={{ '--mx': '-9999px', '--my': '-9999px' } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
