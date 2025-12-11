'use client';

import { useLanguage } from '@/contexts/LanguageContext';

const technologies = [
  { name: 'React', color: '#61DAFB' },
  { name: 'Next.js', color: '#5E6FEA' },
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'Node.js', color: '#47CF86' },
  { name: 'Tailwind CSS', color: '#00CED1' },
  { name: 'PostgreSQL', color: '#336791' },
  { name: 'Framer Motion', color: '#FF4B7B' },
  { name: 'AWS', color: '#FB6B4E' },
  { name: 'Docker', color: '#2496ED' },
  { name: 'Prisma', color: '#5E6FEA' },
  { name: 'GraphQL', color: '#E535AB' },
  { name: 'Redis', color: '#DC382D' },
];

export default function TechStack() {
  const { t } = useLanguage();

  return (
    <section className="py-8 md:py-12 bg-white dark:bg-gray-950 border-y border-gray-100 dark:border-gray-800 overflow-hidden relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-gray-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-gray-950 to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 md:mb-8 text-center">
        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest animate-fade-in">
          {t('techstack.subtitle')}
        </p>
      </div>

      {/* First row - CSS animation */}
      <div className="relative flex overflow-x-hidden group/slider">
        <div className="flex space-x-10 md:space-x-16 whitespace-nowrap py-3 md:py-4 animate-marquee group-hover/slider:[animation-play-state:paused]">
          {[...technologies, ...technologies].map((tech, index) => (
            <span
              key={`${tech.name}-${index}`}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-300 dark:text-gray-700 cursor-default select-none transition-colors duration-300 hover:scale-105"
              style={{ 
                '--hover-color': tech.color,
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = tech.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '';
              }}
            >
              {tech.name}
            </span>
          ))}
        </div>
        {/* Duplicate for seamless loop */}
        <div className="flex space-x-10 md:space-x-16 whitespace-nowrap py-3 md:py-4 animate-marquee group-hover/slider:[animation-play-state:paused]" aria-hidden="true">
          {[...technologies, ...technologies].map((tech, index) => (
            <span
              key={`dup-${tech.name}-${index}`}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-300 dark:text-gray-700 cursor-default select-none transition-colors duration-300 hover:scale-105"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = tech.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '';
              }}
            >
              {tech.name}
            </span>
          ))}
        </div>
      </div>

      {/* Second row - reverse direction */}
      <div className="relative flex overflow-x-hidden mt-2 group/slider2">
        <div className="flex space-x-10 md:space-x-16 whitespace-nowrap py-3 md:py-4 animate-marquee-reverse group-hover/slider2:[animation-play-state:paused]">
          {[...technologies.slice().reverse(), ...technologies.slice().reverse()].map((tech, index) => (
            <span
              key={`reverse-${tech.name}-${index}`}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-300 dark:text-gray-700 cursor-default select-none transition-colors duration-300 hover:scale-105"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = tech.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '';
              }}
            >
              {tech.name}
            </span>
          ))}
        </div>
        {/* Duplicate for seamless loop */}
        <div className="flex space-x-10 md:space-x-16 whitespace-nowrap py-3 md:py-4 animate-marquee-reverse group-hover/slider2:[animation-play-state:paused]" aria-hidden="true">
          {[...technologies.slice().reverse(), ...technologies.slice().reverse()].map((tech, index) => (
            <span
              key={`dup-reverse-${tech.name}-${index}`}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-300 dark:text-gray-700 cursor-default select-none transition-colors duration-300 hover:scale-105"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = tech.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '';
              }}
            >
              {tech.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
