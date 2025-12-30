'use client';

import { useEffect, useState } from 'react';

const LIGHT_COLORS = [
  '#ff0000', // red
  '#00ff00', // green
  '#ffd700', // gold
  '#00bfff', // blue
  '#ff69b4', // pink
  '#ff8c00', // orange
];

interface Light {
  id: number;
  color: string;
  delay: number;
}

export default function HolidayLights() {
  const [lights, setLights] = useState<Light[]>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    // Generate lights
    const lightCount = Math.ceil(window.innerWidth / 40); // One light every 40px
    const generatedLights: Light[] = [];

    for (let i = 0; i < lightCount; i++) {
      generatedLights.push({
        id: i,
        color: LIGHT_COLORS[i % LIGHT_COLORS.length],
        delay: (i % 3) * 0.3, // Staggered animation
      });
    }

    setLights(generatedLights);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (prefersReducedMotion || lights.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none overflow-hidden">
      {/* Wire/Cable */}
      <div className="absolute top-3 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800" />

      {/* Lights */}
      <div className="flex justify-between px-2">
        {lights.map((light) => (
          <div
            key={light.id}
            className="relative"
            style={{
              animationDelay: `${light.delay}s`,
            }}
          >
            {/* Wire connector */}
            <div className="w-0.5 h-3 bg-gray-700 mx-auto" />

            {/* Light bulb */}
            <div
              className="w-3 h-4 rounded-full animate-lights-glow"
              style={{
                backgroundColor: light.color,
                boxShadow: `0 0 10px ${light.color}, 0 0 20px ${light.color}`,
                animationDelay: `${light.delay}s`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
