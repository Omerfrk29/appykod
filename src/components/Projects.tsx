'use client';

import Link from 'next/link';
import { Project, LocalizedText } from '@/lib/db';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { analytics } from '@/lib/analytics';
import { useRef } from 'react';

function getLocalizedText(text: LocalizedText | string | undefined, lang: 'tr' | 'en'): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  return text[lang] || text.tr || '';
}

export default function Projects({ projects }: { projects: Project[] }) {
  const { t, language } = useLanguage();
  
  // Fallback data
  const displayProjects = projects.length > 0
      ? projects.map(p => ({
          ...p,
          displayTitle: getLocalizedText(p.title, language),
          displayDescription: getLocalizedText(p.description, language),
        }))
      : [
          {
            id: '1',
            displayTitle: 'Nebula Finance',
            displayDescription: 'Next-gen fintech dashboard with real-time crypto analytics.',
            imageUrl: 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=2532&auto=format&fit=crop', // Abstract dark tech
            link: '#',
            tags: ['React', 'D3.js', 'Web3'],
          },
          {
            id: '2',
            displayTitle: 'Aero Commerce',
            displayDescription: 'Headless e-commerce solution tailored for luxury brands.',
            imageUrl: 'https://images.unsplash.com/photo-1607799275518-d6c19011ea96?q=80&w=2670&auto=format&fit=crop', // Minimal product
            link: '#',
            tags: ['Next.js', 'Stripe', 'Tailwind'],
          },
        ];

  return (
    <section id="projects" className="py-24 bg-background border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
           <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                Selected Work
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl">
                 We build digital products that define brands. Here are some of our recent favorites.
              </p>
           </div>
           <Link 
             href="#" 
             className="hidden md:flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-secondary/5 hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all"
           >
              <ArrowUpRight size={20} />
           </Link>
        </div>

        <div className="space-y-16 md:space-y-32">
          {displayProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: any, index: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-16 items-center`}>
       {/* Image Area */}
       <div className="w-full md:w-3/5 group relative rounded-3xl overflow-hidden aspect-[16/10] bg-secondary/10">
          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-overlay" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={project.imageUrl} 
            alt={project.displayTitle} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale hover:grayscale-0"
          />
       </div>

       {/* Content Area */}
       <div className="w-full md:w-2/5 flex flex-col items-start justify-center">
          <div className="flex flex-wrap gap-2 mb-6">
             {project.tags?.map((tag: string) => (
                <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium border border-white/10 text-muted-foreground">
                   {tag}
                </span>
             )) || (
                <span className="px-3 py-1 rounded-full text-xs font-medium border border-white/10 text-muted-foreground">Development</span>
             )}
          </div>
          
          <h3 className="text-3xl md:text-4xl font-bold mb-4">{project.displayTitle}</h3>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
             {project.displayDescription}
          </p>

          <div className="flex gap-4">
             <Link 
                href={`/projects/${project.id}`}
                onClick={() => analytics.projectClick(project.id, project.displayTitle)}
                className="inline-flex items-center text-lg font-medium hover:text-primary transition-colors group"
             >
                View Case Study
                <ArrowUpRight className="ml-2 w-5 h-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
             </Link>
          </div>
       </div>
    </div>
  );
}
