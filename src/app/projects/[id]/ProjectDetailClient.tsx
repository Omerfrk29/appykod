'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Layers, Lightbulb, Target } from 'lucide-react';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Project, LocalizedText } from '@/lib/db';

function stableIndex(input: string, modulo: number): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return modulo === 0 ? 0 : hash % modulo;
}

// Helper to get localized text
function getLocalizedText(text: LocalizedText | string | undefined, lang: 'tr' | 'en'): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  return text[lang] || text.tr || '';
}

export default function ProjectDetailClient({ project }: { project: Project }) {
  const { t, language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Get localized content
  const projectTitle = getLocalizedText(project.title, language);
  const projectDescription = getLocalizedText(project.description, language);
  const projectFullDescription = getLocalizedText(project.fullDescription, language);
  const projectChallenges = getLocalizedText(project.challenges, language);
  const projectSolutions = getLocalizedText(project.solutions, language);

  const gradients = ['from-primary via-info to-success', 'from-success via-primary to-info', 'from-danger via-warning to-primary'];
  const gradient = gradients[stableIndex(project.id, gradients.length)] || gradients[0];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 bg-white dark:bg-gray-950">
        {/* Hero Section */}
        <section className="relative py-8 md:py-12 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-info/10 rounded-full blur-3xl animate-orb-drift-1" />
            <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-orb-drift-2" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <Link
                href="/#projects"
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors mb-8 group"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">{t('projectDetail.backToProjects')}</span>
              </Link>
            </motion.div>

            {/* Project Title */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-4">{projectTitle}</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl">{projectDescription}</p>
            </motion.div>

            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl mb-12 group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.imageUrl}
                alt={projectTitle}
                className="w-full h-[400px] md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

              {/* View Live Button */}
              {project.link && project.link !== '#' && (
                <motion.a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-6 right-6 inline-flex items-center gap-2 px-6 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full font-bold text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-lg"
                >
                  {t('projectDetail.viewLive')} <ExternalLink size={18} />
                </motion.a>
              )}
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Full Description */}
              {projectFullDescription && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                    <Layers className="text-primary" size={28} />
                    {t('projectDetail.about')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{projectFullDescription}</p>
                </motion.div>
              )}

              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-3xl p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('projectDetail.technologies')}</h2>
                  <div className="flex flex-wrap gap-3">
                    {project.technologies.map((tech, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                        className={`px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${gradient} text-white`}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Challenges and Solutions */}
            {(projectChallenges || projectSolutions) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                {/* Challenges */}
                {projectChallenges && (
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white dark:bg-gray-800 rounded-3xl p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <Target className="text-danger" size={28} />
                      {t('projectDetail.challenges')}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{projectChallenges}</p>
                  </motion.div>
                )}

                {/* Solutions */}
                {projectSolutions && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl p-8"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <Lightbulb className="text-success" size={28} />
                      {t('projectDetail.solutions')}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{projectSolutions}</p>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Gallery Section */}
        {project.gallery && project.gallery.length > 0 && (
          <section className="py-16 bg-white dark:bg-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                {t('projectDetail.gallery')}
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.gallery.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => setSelectedImage(image)}
                    className="relative aspect-video rounded-2xl overflow-hidden group cursor-pointer"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt={`${projectTitle} ${index + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white font-bold bg-black/50 px-4 py-2 rounded-full">{t('projectDetail.viewImage')}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Lightbox */}
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={selectedImage}
              alt="Gallery"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <button onClick={() => setSelectedImage(null)} className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('projectDetail.ctaTitle')}</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">{t('projectDetail.ctaSubtitle')}</p>
              <Link href="/#contact" className={`inline-flex items-center px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r ${gradient} hover:shadow-lg hover:scale-105 transition-all duration-300`}>
                {t('cta.button')}
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
