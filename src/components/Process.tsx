'use client';

import { motion } from 'framer-motion';
import { Search, PenTool, Code2, Rocket } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const stepIcons = [Search, PenTool, Code2, Rocket];
const stepKeys = ['discovery', 'design', 'development', 'launch'];

export default function Process() {
  const { t } = useLanguage();
  
  const steps = stepKeys.map((key, index) => ({
    id: index + 1,
    title: t(`process.steps.${key}.title`),
    description: t(`process.steps.${key}.description`),
    icon: stepIcons[index],
  }));

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            {t('process.title')}
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            {t('process.subtitle')}
          </p>
        </motion.div>

        <div className="relative">
          {/* Animated Gradient Connection Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 z-0 overflow-hidden rounded-full">
            <motion.div
              className="h-full w-full"
              style={{
                background: 'linear-gradient(to right, #5E6FEA, #00CED1, #47CF86, #FB6B4E, #FF4B7B, #5E6FEA)',
                backgroundSize: '200% 100%',
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const colors = [
                { bg: '#5E6FEA', shadow: 'rgba(94, 111, 234, 0.4)' },
                { bg: '#00CED1', shadow: 'rgba(0, 206, 209, 0.4)' },
                { bg: '#47CF86', shadow: 'rgba(71, 207, 134, 0.4)' },
                { bg: '#FB6B4E', shadow: 'rgba(251, 107, 78, 0.4)' },
              ];
              const colorScheme = colors[index % colors.length];
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 text-center relative group overflow-hidden"
                >
                  {/* Gradient Background on Hover */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${colorScheme.bg}, ${colors[(index + 1) % colors.length].bg})`,
                    }}
                  />
                  
                  <motion.div
                    className="w-16 h-16 mx-auto text-white rounded-full flex items-center justify-center mb-6 text-2xl font-bold relative z-10"
                    style={{
                      backgroundColor: colorScheme.bg,
                    }}
                    whileHover={{ scale: 1.15, rotate: 360 }}
                    animate={{
                      boxShadow: [
                        `0 10px 30px ${colorScheme.shadow}`,
                        `0 10px 40px ${colorScheme.shadow}80`,
                        `0 10px 30px ${colorScheme.shadow}`,
                      ],
                    }}
                    transition={{
                      boxShadow: {
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      },
                      rotate: {
                        duration: 0.5,
                      },
                    }}
                  >
                    <Icon size={32} />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 relative z-10">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 relative z-10">
                    {step.description}
                  </p>
                  
                  {/* Animated Step Number Badge */}
                  <motion.div
                    className="absolute top-4 right-4 text-6xl font-black text-gray-100 dark:text-gray-700 -z-10 opacity-50 group-hover:opacity-100 transition-opacity"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: index * 0.5,
                    }}
                  >
                    0{step.id}
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
