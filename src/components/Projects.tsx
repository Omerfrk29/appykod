'use client';

import { Project } from '@/lib/db';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Projects({ projects }: { projects: Project[] }) {
  const { t } = useLanguage();
  
  // Fallback data
  const displayProjects =
    projects.length > 0
      ? projects
      : [
          {
            id: '1',
            title: 'E-Commerce Platform',
            description:
              'A full-featured online store with payment integration.',
            imageUrl:
              'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80',
            link: '#',
          },
          {
            id: '2',
            title: 'Finance Dashboard',
            description:
              'Real-time analytics and reporting tool for fintech.',
            imageUrl:
              'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
            link: '#',
          },
          {
            id: '3',
            title: 'Social App',
            description:
              'Community platform with messaging and feed features.',
            imageUrl:
              'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
            link: '#',
          },
        ];

  return (
    <section id="projects" className="py-24 bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            {t('projects.title')}
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            {t('projects.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project, index) => {
            const gradients = [
              'linear-gradient(135deg, rgba(94, 111, 234, 0.8), rgba(0, 206, 209, 0.8))',
              'linear-gradient(135deg, rgba(71, 207, 134, 0.8), rgba(94, 111, 234, 0.8))',
              'linear-gradient(135deg, rgba(255, 75, 123, 0.8), rgba(251, 107, 78, 0.8))',
            ];
            const glowColors = [
              'rgba(94, 111, 234, 0.4)',
              'rgba(71, 207, 134, 0.4)',
              'rgba(255, 75, 123, 0.4)',
            ];
            const gradient = gradients[index % gradients.length];
            const glowColor = glowColors[index % glowColors.length];
            
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {/* Glow Effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-300 -z-10"
                  style={{ backgroundColor: glowColor }}
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                
                <div className="relative h-64 overflow-hidden">
                  {/* Parallax Image */}
                  <motion.div
                    className="absolute inset-0"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  
                  {/* Gradient Overlay */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: gradient }}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  />
                  
                  {/* Hover Content */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <motion.a
                      href={project.link}
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center px-6 py-3 border border-white/30 text-base font-medium rounded-full text-white bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all shadow-lg"
                    >
                      {t('projects.viewProject')} <ExternalLink size={18} className="ml-2" />
                    </motion.a>
                  </div>
                  
                  {/* Floating Badge */}
                  <motion.div
                    className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-xs font-bold text-primary shadow-lg"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    #{index + 1}
                  </motion.div>
                </div>
                
                <div className="p-8">
                  <motion.h3
                    className="text-2xl font-bold text-gray-900 dark:text-white mb-3"
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {project.title}
                  </motion.h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {project.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
