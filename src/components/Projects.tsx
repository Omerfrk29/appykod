'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, Loader2, Package } from 'lucide-react';
import { projectsApi } from '@/lib/api/client';
import type { Project, LocalizedText } from '@/lib/db';
import { useLanguage } from '@/contexts/LanguageContext';

function getLocalizedText(
  text: LocalizedText | string | undefined,
  lang: 'tr' | 'en'
): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  return text[lang] || text.tr || '';
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
    <section id="projects" className="py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-16">
          <div className="w-1 h-8 bg-secondary rounded-full" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Our Projects
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-secondary w-10 h-10" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Henüz bir proje eklenmedi.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {projects.map((project, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={project.id}
                  className={`bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100 flex flex-col ${
                    isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } items-center gap-8 lg:gap-12 group hover:shadow-xl transition-all duration-300`}
                >
                  {/* Content */}
                  <div className="flex-1 space-y-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isEven ? 'bg-secondary' : 'bg-accent-purple'
                        }`}
                      >
                        <div className="w-3 h-3 bg-white rounded-full opacity-80" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {getLocalizedText(project.title, language)}
                      </h3>
                    </div>

                    <p className="text-gray-500 leading-relaxed text-lg">
                      {getLocalizedText(project.description, language)}
                    </p>

                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-secondary font-semibold hover:gap-3 transition-all group/link"
                      >
                        View Project
                        <ArrowRight
                          size={16}
                          className="group-hover/link:translate-x-1 transition-transform"
                        />
                      </a>
                    )}
                  </div>

                  {/* Image */}
                  <div className="flex-1 w-full overflow-hidden rounded-2xl bg-gray-50 min-h-[280px] relative">
                    {project.imageUrl ? (
                      <Image
                        src={project.imageUrl}
                        alt={getLocalizedText(project.title, language)}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full min-h-[280px] text-gray-300">
                        <Package size={48} className="opacity-50" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
