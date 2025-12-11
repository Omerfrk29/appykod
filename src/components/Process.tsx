'use client';

import { motion, useInView } from 'framer-motion';
import { Search, PenTool, Code2, Rocket } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRef } from 'react';

const stepIcons = [Search, PenTool, Code2, Rocket];
const stepKeys = ['discovery', 'design', 'development', 'launch'];

export default function Process() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  const steps = stepKeys.map((key, index) => ({
    id: index + 1,
    title: t(`process.steps.${key}.title`),
    description: t(`process.steps.${key}.description`),
    icon: stepIcons[index],
  }));

  const colors = [
    { bg: '#5E6FEA', shadow: 'rgba(94, 111, 234, 0.4)', light: 'rgba(94, 111, 234, 0.15)' },
    { bg: '#00CED1', shadow: 'rgba(0, 206, 209, 0.4)', light: 'rgba(0, 206, 209, 0.15)' },
    { bg: '#47CF86', shadow: 'rgba(71, 207, 134, 0.4)', light: 'rgba(71, 207, 134, 0.15)' },
    { bg: '#FB6B4E', shadow: 'rgba(251, 107, 78, 0.4)', light: 'rgba(251, 107, 78, 0.15)' },
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14 lg:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-3 md:mb-4">
            {t('process.title')}
          </h2>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300 px-4">
            {t('process.subtitle')}
          </p>
        </motion.div>

        <div className="relative" ref={containerRef}>
          {/* Animated Gradient Connection Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-1.5 -translate-y-1/2 z-0 overflow-hidden rounded-full">
            {/* Background line */}
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full" />
            {/* Animated progress line */}
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #5E6FEA, #00CED1, #47CF86, #FB6B4E)',
                backgroundSize: '200% 100%',
              }}
              initial={{ width: '0%' }}
              animate={isInView ? { width: '100%' } : { width: '0%' }}
              transition={{ duration: 2, ease: 'easeOut', delay: 0.5 }}
            />
            {/* Pulse overlay */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                backgroundSize: '50% 100%',
              }}
              animate={{ backgroundPosition: ['-100% 0', '200% 0'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
            />
          </div>

          {/* Step dots on the line (Desktop) */}
          <div className="hidden lg:flex absolute top-1/2 left-[10%] right-[10%] -translate-y-1/2 z-10 justify-between">
            {steps.map((_, index) => (
              <motion.div
                key={index}
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: colors[index].bg }}
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.3 }}
              >
                <motion.div
                  className="w-full h-full rounded-full"
                  style={{ backgroundColor: colors[index].bg }}
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                />
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5 relative z-10 pt-6 lg:pt-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const colorScheme = colors[index % colors.length];

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="bg-white dark:bg-gray-800 p-4 md:p-5 lg:p-6 rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl border border-gray-100 dark:border-gray-700 text-center relative group overflow-hidden h-full"
                  >
                    {/* Gradient Background on Hover */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(135deg, ${colorScheme.light}, transparent)`,
                      }}
                    />

                    {/* Floating connector to icon */}
                    <motion.div
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-8 -mt-8 hidden lg:block"
                      style={{ backgroundColor: colorScheme.bg }}
                      initial={{ scaleY: 0, opacity: 0 }}
                      animate={isInView ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.2 + 1 }}
                    />

                    {/* Icon with enhanced animations */}
                    <motion.div
                      className="w-14 h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 mx-auto text-white rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4 lg:mb-5 text-xl md:text-2xl font-bold relative z-10"
                      style={{
                        backgroundColor: colorScheme.bg,
                      }}
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      animate={{
                        boxShadow: [
                          `0 10px 30px ${colorScheme.shadow}`,
                          `0 15px 50px ${colorScheme.shadow}`,
                          `0 10px 30px ${colorScheme.shadow}`,
                        ],
                      }}
                      transition={{
                        boxShadow: {
                          duration: 2.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        },
                      }}
                    >
                      {/* Icon with wiggle on hover */}
                      <motion.div
                        whileHover={{
                          rotate: [0, -10, 10, -10, 0],
                          transition: { duration: 0.5 },
                        }}
                      >
                        <Icon size={24} className="md:w-8 md:h-8 lg:w-9 lg:h-9" />
                      </motion.div>
                      {/* Inner glow */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          background: `radial-gradient(circle at center, rgba(255,255,255,0.3), transparent)`,
                        }}
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>

                    <h3 className="text-base md:text-lg lg:text-xl font-extrabold text-gray-900 dark:text-white mb-1 md:mb-2 relative z-10">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 relative z-10 text-xs md:text-sm leading-relaxed">
                      {step.description}
                    </p>

                    {/* Animated Step Number Badge */}
                    <motion.div
                      className="absolute top-2 right-2 md:top-3 md:right-3 lg:top-4 lg:right-4 text-4xl md:text-5xl lg:text-6xl font-black opacity-10 dark:opacity-5 group-hover:opacity-20 transition-opacity duration-300"
                      style={{ color: colorScheme.bg }}
                      animate={isInView ? {
                        scale: [0.8, 1, 0.8],
                        rotate: [0, 3, 0],
                      } : {}}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: index * 0.5,
                      }}
                    >
                      0{step.id}
                    </motion.div>

                    {/* Bottom gradient line */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${colorScheme.bg}, transparent)`,
                      }}
                    />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
