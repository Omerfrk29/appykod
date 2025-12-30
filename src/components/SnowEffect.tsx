'use client';

import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  x: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  drift: number;
}

export default function SnowEffect() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);
  const [isReduced, setIsReduced] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReduced(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsReduced(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    // Generate snowflakes only if not reduced motion
    if (!mediaQuery.matches) {
      const flakes: Snowflake[] = Array.from({ length: 25 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: 3 + Math.random() * 5,
        opacity: 0.3 + Math.random() * 0.4,
        duration: 10 + Math.random() * 10,
        delay: Math.random() * 10,
        drift: -20 + Math.random() * 40,
      }));
      setSnowflakes(flakes);
    }

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (isReduced || snowflakes.length === 0) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      aria-hidden="true"
      style={{ contain: 'strict' }}
    >
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute rounded-full bg-white animate-snowfall"
          style={{
            left: `${flake.x}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            animationDuration: `${flake.duration}s`,
            animationDelay: `${flake.delay}s`,
            '--snow-drift': `${flake.drift}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
