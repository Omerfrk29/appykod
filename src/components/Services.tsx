'use client';

import { Service } from '@/lib/db';
import { Code, Smartphone, Globe, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const iconMap: any = {
  code: Code,
  smartphone: Smartphone,
  globe: Globe,
  database: Database,
};

export default function Services({ services }: { services: Service[] }) {
  const { t } = useLanguage();
  
  // Fallback data if empty
  const displayServices =
    services.length > 0
      ? services
      : [
          {
            id: '1',
            title: 'Web Development',
            description:
              'Modern, responsive websites built with the latest technologies.',
            icon: 'globe',
          },
          {
            id: '2',
            title: 'Mobile Apps',
            description:
              'Native and cross-platform mobile applications for iOS and Android.',
            icon: 'smartphone',
          },
          {
            id: '3',
            title: 'Custom Software',
            description:
              'Tailored software solutions to meet your specific business needs.',
            icon: 'code',
          },
        ];

  return (
    <section id="services" className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            {t('services.title')}
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            {t('services.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayServices.map((service, index) => {
            const Icon = iconMap[service.icon] || Code;
            const colorSchemes = [
              { 
                borderGradient: 'linear-gradient(to right, #5E6FEA, #00CED1, #FF4B7B)',
                iconBg: 'rgba(94, 111, 234, 0.1)',
                iconBgDark: 'rgba(94, 111, 234, 0.2)',
                iconColor: '#5E6FEA',
                glowColor: 'rgba(94, 111, 234, 0.2)',
              },
              { 
                borderGradient: 'linear-gradient(to right, #47CF86, #5E6FEA, #00CED1)',
                iconBg: 'rgba(71, 207, 134, 0.1)',
                iconBgDark: 'rgba(71, 207, 134, 0.2)',
                iconColor: '#47CF86',
                glowColor: 'rgba(71, 207, 134, 0.2)',
              },
              { 
                borderGradient: 'linear-gradient(to right, #FF4B7B, #FB6B4E, #5E6FEA)',
                iconBg: 'rgba(255, 75, 123, 0.1)',
                iconBgDark: 'rgba(255, 75, 123, 0.2)',
                iconColor: '#FF4B7B',
                glowColor: 'rgba(255, 75, 123, 0.2)',
              },
            ];
            const colorScheme = colorSchemes[index % colorSchemes.length];
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative group bg-white dark:bg-gray-800 rounded-2xl p-8 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl"
              >
                {/* Gradient Border Effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"
                  style={{ background: colorScheme.borderGradient }}
                />
                <div className="absolute inset-[1px] rounded-2xl bg-white dark:bg-gray-800" />
                
                {/* Content */}
                <div className="relative z-10">
                  <motion.div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 relative"
                    style={{
                      backgroundColor: colorScheme.iconBg,
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    animate={{
                      boxShadow: [
                        `0 0 0px ${colorScheme.iconColor}40`,
                        `0 0 20px ${colorScheme.iconColor}80`,
                        `0 0 0px ${colorScheme.iconColor}40`,
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Icon size={32} style={{ color: colorScheme.iconColor }} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Glow Effect on Hover */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10"
                  style={{ backgroundColor: colorScheme.glowColor }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
