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

  const colors = [
    { bg: 'bg-primary', shadow: 'shadow-[0_10px_30px_rgba(94,111,234,0.4)]', light: 'bg-primary/15' },
    { bg: 'bg-info', shadow: 'shadow-[0_10px_30px_rgba(0,206,209,0.4)]', light: 'bg-info/15' },
    { bg: 'bg-success', shadow: 'shadow-[0_10px_30px_rgba(71,207,134,0.4)]', light: 'bg-success/15' },
    { bg: 'bg-warning', shadow: 'shadow-[0_10px_30px_rgba(251,107,78,0.4)]', light: 'bg-warning/15' },
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14 lg:mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-3 md:mb-4">
            {t('process.title')}
          </h2>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300 px-4">
            {t('process.subtitle')}
          </p>
        </div>

        <div className="relative" ref={containerRef}>
          {/* Animated Gradient Connection Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-1.5 -translate-y-1/2 z-0 overflow-hidden rounded-full">
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div
              className={`h-full rounded-full bg-gradient-to-r from-primary via-info via-success to-warning transition-all duration-[2000ms] ease-out ${
                isInView ? 'w-full' : 'w-0'
              }`}
            />
            {/* Pulse overlay */}
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer-hero"
              style={{ backgroundSize: '50% 100%' }}
            />
          </div>

          {/* Step dots on the line (Desktop) */}
          <div className="hidden lg:flex absolute top-1/2 left-[10%] right-[10%] -translate-y-1/2 z-10 justify-between">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full ${colors[index].bg} transition-all duration-500 ${
                  isInView ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                }`}
                style={{ transitionDelay: `${800 + index * 300}ms` }}
              >
                <div className={`w-full h-full rounded-full ${colors[index].bg} animate-ping`} style={{ animationDuration: '2s' }} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5 relative z-10 pt-6 lg:pt-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const colorScheme = colors[index];

              return (
                <div
                  key={step.id}
                  className={`transition-all duration-700 ${
                    isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                  }`}
                  style={{ transitionDelay: `${index * 200 + 300}ms` }}
                >
                  <div className="bg-white dark:bg-gray-800 p-4 md:p-5 lg:p-6 rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl border border-gray-100 dark:border-gray-700 text-center relative group overflow-hidden h-full hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300">
                    {/* Gradient Background on Hover */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${colorScheme.light}`} />

                    {/* Floating connector */}
                    <div
                      className={`absolute top-0 left-1/2 -translate-x-1/2 w-1 h-8 -mt-8 hidden lg:block ${colorScheme.bg} transition-all duration-500 ${
                        isInView ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
                      }`}
                      style={{ transitionDelay: `${index * 200 + 1000}ms`, transformOrigin: 'bottom' }}
                    />

                    {/* Icon */}
                    <div
                      className={`w-14 h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 mx-auto text-white rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4 lg:mb-5 relative z-10 ${colorScheme.bg} ${colorScheme.shadow} group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}
                    >
                      <div className="group-hover:animate-wiggle">
                        <Icon size={24} className="md:w-8 md:h-8 lg:w-9 lg:h-9" />
                      </div>
                      {/* Inner glow */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 to-transparent opacity-50" />
                    </div>

                    <h3 className="text-base md:text-lg lg:text-xl font-extrabold text-gray-900 dark:text-white mb-1 md:mb-2 relative z-10">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 relative z-10 text-xs md:text-sm leading-relaxed">
                      {step.description}
                    </p>

                    {/* Animated Step Number Badge */}
                    <div
                      className={`absolute top-2 right-2 md:top-3 md:right-3 lg:top-4 lg:right-4 text-4xl md:text-5xl lg:text-6xl font-black opacity-10 dark:opacity-5 group-hover:opacity-20 transition-opacity duration-300 ${colorScheme.bg.replace('bg-', 'text-')}`}
                    >
                      0{step.id}
                    </div>

                    {/* Bottom gradient line */}
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent ${colorScheme.bg.replace('bg-', 'via-')} to-transparent`}
                    />
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
