'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowRight, Loader2, Package, ExternalLink } from 'lucide-react';
import { projectsApi } from '@/lib/api/client';
import type { Project, LocalizedText } from '@/lib/db';
import { useLanguage } from '@/contexts/LanguageContext';
import ScrollReveal, { StaggerContainer, StaggerItem } from './ScrollReveal';

function getLocalizedText(
  text: LocalizedText | string | undefined,
  lang: 'tr' | 'en'
): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  return text[lang] || text.tr || '';
}

function ProjectCard({
  project,
  index,
  language,
}: {
  project: Project;
  index: number;
  language: 'tr' | 'en';
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    setTransform({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative glass-layer-2 glass-border-gradient rounded-3xl overflow-hidden transition-all duration-500 hover-glow-gold"
      style={{
        transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        {project.imageUrl ? (
          <>
            <Image
              src={project.imageUrl}
              alt={getLocalizedText(project.title, language)}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            {/* Gradient Border Glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-gold-400 to-copper-400" />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full bg-bg-surface">
            <Package size={48} className="text-text-muted opacity-50" />
          </div>
        )}

        {/* Project Number Badge */}
        <div className="absolute top-4 left-4 px-3 py-1 glass-frosted rounded-full text-xs font-medium text-gold-400 border border-gold-400/10">
          #{String(index + 1).padStart(2, '0')}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 relative">
        {/* Title */}
        <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-gradient-gold transition-all">
          {getLocalizedText(project.title, language)}
        </h3>

        {/* Description */}
        <p className="text-body-sm text-text-muted mb-6 line-clamp-2">
          {getLocalizedText(project.description, language)}
        </p>

        {/* Link */}
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent-amber font-medium text-sm group/link hover:gap-3 transition-all"
          >
            <span>Projeyi Görüntüle</span>
            <ExternalLink size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
          </a>
        )}
      </div>

      {/* Hover Shine Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
      </div>
    </div>
  );
}

export default function Projects() {
  const { language } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await projectsApi.getAll();
        if (response.success && response.data) {
          setProjects(response.data);
        }
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <section id="projects" className="py-24 bg-bg-base relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-warm-glow opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(245,158,11,0.02)_1px,transparent_1px)] [background-size:40px_40px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-accent-amber/10 border border-accent-amber/20 rounded-full text-accent-amber text-sm font-medium mb-4">
            Projelerimiz
          </span>
          <h2 className="text-h2 font-bold text-text-primary mb-4">
            Başarı{' '}
            <span className="text-transparent bg-gradient-warm bg-clip-text">
              Hikayeleri
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-body-lg text-text-secondary">
            Müşterilerimiz için geliştirdiğimiz projelerden bazıları.
          </p>
        </ScrollReveal>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-accent-amber w-10 h-10" />
              <span className="text-text-muted text-sm">Projeler yükleniyor...</span>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 bg-bg-elevated/50 backdrop-blur-md rounded-3xl border border-white/5">
            <Package size={48} className="mx-auto text-text-muted mb-4 opacity-50" />
            <p className="text-text-secondary text-lg">Henüz bir proje eklenmedi.</p>
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={100}>
            {projects.map((project, index) => (
              <StaggerItem key={project.id} index={index}>
                <ProjectCard
                  project={project}
                  index={index}
                  language={language}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        {/* View All Link */}
        {projects.length > 0 && (
          <div className="text-center mt-12">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-amber font-medium transition-colors group"
            >
              <span>Tüm projelerimiz için iletişime geçin</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
