'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const technologies = [
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'Tailwind CSS',
  'PostgreSQL',
  'Framer Motion',
  'AWS',
  'Docker',
  'Prisma',
  'GraphQL',
  'Redis',
];

export default function TechStack() {
  const { t } = useLanguage();
  
  return (
    <section className="py-12 bg-white dark:bg-gray-950 border-y border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {t('techstack.subtitle')}
        </p>
      </div>
      
      <div className="relative flex overflow-x-hidden">
        <motion.div
          className="flex space-x-12 whitespace-nowrap py-4"
          animate={{ x: [0, -1000] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 30, // Slow continuous scroll
          }}
        >
          {/* Duplicate list to ensure seamless looping */}
          {[...technologies, ...technologies, ...technologies].map((tech, index) => {
            const colors = ['#5E6FEA', '#47CF86', '#FF4B7B', '#FB6B4E', '#00CED1'];
            const color = colors[index % colors.length];
            
            return (
              <motion.span
                key={`${tech}-${index}`}
                className="text-2xl md:text-3xl font-bold text-gray-300 dark:text-gray-700 hover:text-primary dark:hover:text-primary transition-colors cursor-default relative"
                whileHover={{ 
                  scale: 1.2,
                  color: color,
                  textShadow: `0 0 20px ${color}40`,
                }}
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  opacity: {
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: (index % 5) * 0.2,
                  },
                }}
              >
                {tech}
              </motion.span>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
