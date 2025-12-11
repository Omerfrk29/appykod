'use client';

import { Service } from '@/lib/db';
import { Code, Smartphone, Globe, Database } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRef } from 'react';

const iconMap: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  code: Code,
  smartphone: Smartphone,
  globe: Globe,
  database: Database,
};

// 3D Tilt Card Component
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

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
    <section id="services" className="py-12 md:py-16 lg:py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-3 md:mb-4">
            {t('services.title')}
          </h2>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300 px-4">
            {t('services.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" style={{ perspective: '1000px' }}>
          {displayServices.map((service, index) => {
            const Icon = iconMap[service.icon] || Code;
            const colorSchemes = [
              {
                borderGradient: 'linear-gradient(135deg, #5E6FEA, #00CED1, #FF4B7B)',
                iconBg: 'rgba(94, 111, 234, 0.15)',
                iconBgDark: 'rgba(94, 111, 234, 0.25)',
                iconColor: '#5E6FEA',
                glowColor: 'rgba(94, 111, 234, 0.3)',
                accentColor: '#00CED1',
              },
              {
                borderGradient: 'linear-gradient(135deg, #47CF86, #5E6FEA, #00CED1)',
                iconBg: 'rgba(71, 207, 134, 0.15)',
                iconBgDark: 'rgba(71, 207, 134, 0.25)',
                iconColor: '#47CF86',
                glowColor: 'rgba(71, 207, 134, 0.3)',
                accentColor: '#5E6FEA',
              },
              {
                borderGradient: 'linear-gradient(135deg, #FF4B7B, #FB6B4E, #5E6FEA)',
                iconBg: 'rgba(255, 75, 123, 0.15)',
                iconBgDark: 'rgba(255, 75, 123, 0.25)',
                iconColor: '#FF4B7B',
                glowColor: 'rgba(255, 75, 123, 0.3)',
                accentColor: '#FB6B4E',
              },
            ];
            const colorScheme = colorSchemes[index % colorSchemes.length];

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <TiltCard className="h-full">
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="relative group bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl p-5 md:p-6 lg:p-8 transition-all duration-500 overflow-hidden shadow-xl hover:shadow-2xl h-full border border-gray-100 dark:border-gray-700"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Animated Gradient Border Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: colorScheme.borderGradient,
                        backgroundSize: '200% 200%',
                        padding: '2px',
                      }}
                      animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    >
                      <div className="absolute inset-[2px] rounded-3xl bg-white dark:bg-gray-800" />
                    </motion.div>

                    {/* Inner card background */}
                    <div className="absolute inset-[1px] rounded-3xl bg-white dark:bg-gray-800" />

                    {/* Content with 3D transform */}
                    <div className="relative z-10" style={{ transform: 'translateZ(50px)' }}>
                      <motion.div
                        className="w-14 h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 relative overflow-hidden"
                        style={{
                          backgroundColor: colorScheme.iconBg,
                        }}
                        whileHover={{ scale: 1.15, rotate: 10 }}
                        animate={{
                          boxShadow: [
                            `0 0 0px ${colorScheme.iconColor}00`,
                            `0 0 30px ${colorScheme.iconColor}60`,
                            `0 0 0px ${colorScheme.iconColor}00`,
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
                        {/* Icon bounce animation */}
                        <motion.div
                          animate={{
                            y: [0, -3, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: index * 0.3,
                          }}
                        >
                          <Icon size={28} className="md:w-8 md:h-8 lg:w-9 lg:h-9" style={{ color: colorScheme.iconColor }} />
                        </motion.div>
                        {/* Shimmer effect on icon */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                          style={{ backgroundSize: '200% 100%' }}
                          animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
                        />
                      </motion.div>
                      <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white mb-2 md:mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 dark:group-hover:from-white dark:group-hover:to-gray-300 transition-all duration-300">
                        {service.title}
                      </h3>
                      <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                        {service.description}
                      </p>

                      {/* Learn more indicator */}
                      <motion.div
                        className="mt-4 md:mt-6 flex items-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ color: colorScheme.iconColor }}
                      >
                        <span>Daha Fazla</span>
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="ml-2"
                        >
                          →
                        </motion.span>
                      </motion.div>
                    </div>

                    {/* Floating accent shape */}
                    <motion.div
                      className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                      style={{ backgroundColor: colorScheme.accentColor }}
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />

                    {/* Glow Effect on Hover */}
                    <motion.div
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 -z-10"
                      style={{ backgroundColor: colorScheme.glowColor }}
                    />
                  </motion.div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
