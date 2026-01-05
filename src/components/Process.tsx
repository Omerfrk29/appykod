'use client';

import { Search, PenTool, Code2, Rocket } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useRef, useState } from 'react';

const stepIcons = [Search, PenTool, Code2, Rocket];
const stepKeys = ['discovery', 'design', 'development', 'launch'];

export default function Process() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const steps = stepKeys.map((key, index) => ({
    id: index + 1,
    title: t(`process.steps.${key}.title`),
    description: t(`process.steps.${key}.description`),
    icon: stepIcons[index],
  }));

  return (
    <section className="py-24 bg-obsidian-900 text-white overflow-hidden relative">
      {/* Background Elements - Gold/Copper tones */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gold-400/3 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-copper-400/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('process.title')}</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-400">
            {t('process.subtitle')}
          </p>
        </div>

        <div className="relative" ref={containerRef}>
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[40px] left-[10%] right-[10%] h-px bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-gold-400 via-copper-400 to-gold-300 transition-all duration-1000 ease-out"
              style={{ width: isInView ? '100%' : '0%' }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className={`relative group transition-all duration-700 ${
                    isInView
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-12'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="flex flex-col items-center text-center">
                    {/* Icon - Glass Effect */}
                    <div className="w-20 h-20 rounded-2xl glass-layer-2 flex items-center justify-center mb-8 relative group-hover:scale-110 transition-all duration-300 shadow-xl group-hover:shadow-glow-gold">
                      <Icon
                        size={32}
                        className="text-text-secondary group-hover:text-gold-400 transition-colors"
                      />
                      {/* Step number badge - Gold Gradient */}
                      <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-gold-400 to-copper-400 rounded-full flex items-center justify-center text-xs font-bold text-obsidian-950 shadow-glow-gold-sm">
                        {step.id}
                      </div>
                    </div>

                    {/* Content Card - Glass Effect */}
                    <div className="glass-layer-1 p-6 rounded-2xl hover:glass-layer-2 transition-all duration-300 w-full group-hover:shadow-glow-gold-sm">
                      <h3 className="text-xl font-bold mb-3 text-text-primary group-hover:text-gradient-gold transition-all">
                        {step.title}
                      </h3>
                      <p className="text-text-muted text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
