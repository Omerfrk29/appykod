'use client';

import Link from 'next/link';
import { Service, LocalizedText } from '@/lib/db';
import { Code, Smartphone, Globe, ArrowUpRight, Sparkles, Layers, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { analytics } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  code: Code,
  smartphone: Smartphone,
  globe: Globe,
  layers: Layers,
  zap: Zap,
};

function getLocalizedText(text: LocalizedText | string | undefined, lang: 'tr' | 'en'): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  return text[lang] || text.tr || '';
}

export default function Services({ services }: { services: Service[] }) {
  const { t, language } = useLanguage();
  
  const displayServices = services.length > 0 ? services.map(service => ({
    ...service,
    displayTitle: getLocalizedText(service.title, language),
    displayDescription: getLocalizedText(service.description, language),
  })) : [
    { id: '1', displayTitle: 'Web Development', displayDescription: 'Modern, responsive websites built with the latest technologies.', icon: 'globe', className: 'md:col-span-2' },
    { id: '2', displayTitle: 'Mobile Apps', displayDescription: 'Native and cross-platform mobile applications.', icon: 'smartphone', className: 'md:col-span-1' },
    { id: '3', displayTitle: 'Custom Software', displayDescription: 'Tailored software solutions for business needs.', icon: 'code', className: 'md:col-span-1' },
    { id: '4', displayTitle: 'UI/UX Design', displayDescription: 'Intuitive and beautiful user interfaces.', icon: 'layers', className: 'md:col-span-2' },
  ];

  return (
    <section id="services" className="py-24 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-16 md:flex md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              {t('services.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('services.subtitle')}
            </p>
          </div>
          <div className="mt-6 md:mt-0">
             <Link href="#contact" className="text-sm font-semibold text-primary hover:underline inline-flex items-center">
                View all capabilities <ArrowUpRight className="ml-1 h-4 w-4" />
             </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[300px]">
          {displayServices.map((service, i) => {
            const Icon = iconMap[service.icon || 'code'] || Code;
            const isLarge = (service as any).className?.includes('col-span-2');
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "group relative overflow-hidden rounded-3xl border border-white/10 bg-secondary/5 dark:bg-zinc-900/50 hover:bg-secondary/10 transition-colors p-8 flex flex-col justify-between",
                  (service as any).className
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-background shadow-sm border border-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">{service.displayTitle}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.displayDescription}
                  </p>
                </div>

                <div className="relative z-10 flex items-center justify-between mt-6 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                  <span className="text-sm font-medium text-foreground">Explore</span>
                  <ArrowUpRight className="w-5 h-5 text-foreground" />
                </div>
                
                {/* Decorative Elements for Large Cards */}
                {isLarge && (
                   <div className="absolute right-0 bottom-0 w-64 h-64 bg-gradient-to-tl from-primary/10 to-transparent rounded-tl-[100px] -mr-10 -mb-10 pointer-events-none" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}