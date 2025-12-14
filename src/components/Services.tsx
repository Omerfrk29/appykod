'use client';

import Link from 'next/link';
import { Service, LocalizedText } from '@/lib/db';
import { Code, Smartphone, Globe, Database, Cloud, Shield, Zap, Layout, Server, Cpu, Wifi, Monitor } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { analytics } from '@/lib/analytics';

const iconMap: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties; className?: string }>> = {
  code: Code,
  smartphone: Smartphone,
  globe: Globe,
  database: Database,
  cloud: Cloud,
  shield: Shield,
  zap: Zap,
  layout: Layout,
  server: Server,
  cpu: Cpu,
  wifi: Wifi,
  monitor: Monitor,
};

// Helper to get localized text
function getLocalizedText(text: LocalizedText | string | undefined, lang: 'tr' | 'en'): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  return text[lang] || text.tr || '';
}

export default function Services({ services }: { services: Service[] }) {
  const { t, language } = useLanguage();
  
  // Servisleri çoklu dil formatında göster
  const displayServices = services.length > 0 ? services.map(service => ({
    ...service,
    displayTitle: getLocalizedText(service.title, language),
    displayDescription: getLocalizedText(service.description, language),
  })) : [
    { id: '1', displayTitle: 'Web Development', displayDescription: 'Modern, responsive websites built with the latest technologies.', icon: 'globe' },
    { id: '2', displayTitle: 'Mobile Apps', displayDescription: 'Native and cross-platform mobile applications for iOS and Android.', icon: 'smartphone' },
    { id: '3', displayTitle: 'Custom Software', displayDescription: 'Tailored software solutions to meet your specific business needs.', icon: 'code' },
  ];

  const colorSchemes = [
    { iconBg: 'bg-primary/15 dark:bg-primary/25', iconColor: 'text-primary', borderGradient: 'from-primary via-info to-danger', glowColor: 'group-hover:shadow-[0_0_50px_rgba(94,111,234,0.6),0_0_100px_rgba(94,111,234,0.3)]', accentColor: 'bg-info/20' },
    { iconBg: 'bg-success/15 dark:bg-success/25', iconColor: 'text-success', borderGradient: 'from-success via-primary to-info', glowColor: 'group-hover:shadow-[0_0_50px_rgba(71,207,134,0.6),0_0_100px_rgba(71,207,134,0.3)]', accentColor: 'bg-primary/20' },
    { iconBg: 'bg-danger/15 dark:bg-danger/25', iconColor: 'text-danger', borderGradient: 'from-danger via-warning to-primary', glowColor: 'group-hover:shadow-[0_0_50px_rgba(255,75,123,0.6),0_0_100px_rgba(255,75,123,0.3)]', accentColor: 'bg-warning/20' },
  ];

  return (
    <section id="services" className="py-12 md:py-16 lg:py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-3 md:mb-4">
            {t('services.title')}
          </h2>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300 px-4">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" style={{ perspective: '1000px' }}>
          {displayServices.map((service, index) => {
            const Icon = iconMap[service.icon || 'code'] || Code;
            const colorScheme = colorSchemes[index % colorSchemes.length];

            return (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                onClick={() => analytics.serviceClick(service.id, service.displayTitle)}
                className="animate-fade-in-up block"
                style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'backwards' }}
              >
                <div
                  className={`relative group bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl p-5 md:p-6 lg:p-8 transition-all duration-500 overflow-hidden shadow-xl hover:shadow-2xl h-full border border-gray-100 dark:border-gray-700 ${colorScheme.glowColor} cursor-pointer`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Animated Gradient Border Effect */}
                  <div
                    className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-[2px] bg-gradient-to-br ${colorScheme.borderGradient} animate-gradient-x`}
                    style={{ backgroundSize: '200% 200%' }}
                  >
                    <div className="absolute inset-[2px] rounded-3xl bg-white dark:bg-gray-800" />
                  </div>

                  {/* Inner card background */}
                  <div className="absolute inset-[1px] rounded-3xl bg-white dark:bg-gray-800" />

                  {/* Content */}
                  <div className="relative z-10">
                    <div
                      className={`w-14 h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 relative overflow-hidden ${colorScheme.iconBg} group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}
                    >
                      <Icon size={28} className={`md:w-8 md:h-8 lg:w-9 lg:h-9 ${colorScheme.iconColor}`} />
                      {/* Shimmer/Shine sweep effect - only on hover */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:animate-shine-sweep transition-opacity duration-300"
                        style={{ 
                          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 45%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.25) 55%, transparent 60%)',
                          backgroundSize: '250% 100%'
                        }}
                      />
                    </div>
                    <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white mb-2 md:mb-4 transition-all duration-300">
                      {service.displayTitle}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                      {service.displayDescription}
                    </p>

                    {/* Learn more indicator */}
                    <div className={`mt-4 md:mt-6 flex items-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${colorScheme.iconColor}`}>
                      <span>{t('services.learnMore')}</span>
                      <span className="ml-2 animate-arrow-bounce">→</span>
                    </div>
                  </div>

                  {/* Floating accent shape */}
                  <div
                    className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-20 group-hover:opacity-40 transition-all duration-500 group-hover:scale-125 ${colorScheme.accentColor}`}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
