import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

export function Reveal({ children, delay = 0, className = '', style }: { children: ReactNode; delay?: number; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-visible');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('is-visible');
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // SAFETY: CSS custom property keys are strings; the resulting object is a valid CSSProperties shape.
  const revealStyle = { ...style, ...(delay ? { ['--reveal-delay' as string]: `${delay}ms` } : {}) } as CSSProperties;
  return (
    <div ref={ref} className={`reveal ${className}`} style={revealStyle}>
      {children}
    </div>
  );
}
