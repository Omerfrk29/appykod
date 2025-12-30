'use client';

import { useLanguage } from '@/contexts/LanguageContext';

const technologies = [
  'React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS', 'PostgreSQL', 
  'Framer Motion', 'AWS', 'Docker', 'Prisma', 'GraphQL', 'Redis'
];

export default function TechStack() {
  const { t } = useLanguage();

  return (
    <section className="py-10 border-y border-white/5 bg-background overflow-hidden">
      <div className="relative flex w-full flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
        <div className="flex animate-marquee items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none">
           {technologies.map((tech, i) => (
              <span key={i} className="text-2xl font-bold text-muted-foreground/30 px-8 whitespace-nowrap uppercase tracking-widest font-display">
                 {tech}
              </span>
           ))}
        </div>
        <div className="flex absolute top-0 animate-marquee2 items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none ml-4" aria-hidden="true">
           {technologies.map((tech, i) => (
              <span key={`dup-${i}`} className="text-2xl font-bold text-muted-foreground/30 px-8 whitespace-nowrap uppercase tracking-widest font-display">
                 {tech}
              </span>
           ))}
        </div>
      </div>
    </section>
  );
}
