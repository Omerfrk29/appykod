'use client';

import { motion, useAnimationControls } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';

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
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimationControls();

  return (
    <section className="py-8 md:py-12 bg-white dark:bg-gray-950 border-y border-gray-100 dark:border-gray-800 overflow-hidden relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-gray-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-gray-950 to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 md:mb-8 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest"
        >
          {t('techstack.subtitle')}
        </motion.p>
      </div>

      <div
        className="relative flex overflow-x-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          className="flex space-x-10 md:space-x-16 whitespace-nowrap py-3 md:py-4"
          animate={{ x: [0, -1200] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: isHovered ? 60 : 25,
          }}
        >
          {[...technologies, ...technologies, ...technologies].map((tech, index) => {
            return (
              <motion.span
                key={`${tech.name}-${index}`}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-300 dark:text-gray-700 cursor-default relative select-none group"
                whileHover={{
                  scale: 1.25,
                  color: tech.color,
                  y: -5,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                style={{
                  textShadow: 'none',
                }}
              >
                <motion.span
                  className="relative z-10 transition-all duration-300"
                  whileHover={{
                    textShadow: `0 0 30px ${tech.color}60, 0 0 60px ${tech.color}30`,
                  }}
                >
                  {tech.name}
                </motion.span>
                {/* Underline on hover */}
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-full origin-left"
                  style={{ backgroundColor: tech.color }}
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileHover={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                {/* Glow dot */}
                <motion.span
                  className="absolute -top-2 -right-2 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100"
                  style={{ backgroundColor: tech.color, boxShadow: `0 0 10px ${tech.color}` }}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </motion.span>
            );
          })}
        </motion.div>
      </div>

      {/* Second row - reverse direction */}
      <div
        className="relative flex overflow-x-hidden mt-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          className="flex space-x-10 md:space-x-16 whitespace-nowrap py-3 md:py-4"
          animate={{ x: [-1200, 0] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: isHovered ? 60 : 25,
          }}
        >
          {[...technologies.slice().reverse(), ...technologies.slice().reverse(), ...technologies.slice().reverse()].map((tech, index) => {
            return (
              <motion.span
                key={`reverse-${tech.name}-${index}`}
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-300 dark:text-gray-700 cursor-default relative select-none"
                whileHover={{
                  scale: 1.2,
                  color: tech.color,
                  y: -3,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <motion.span
                  whileHover={{
                    textShadow: `0 0 20px ${tech.color}50`,
                  }}
                >
                  {tech.name}
                </motion.span>
              </motion.span>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
