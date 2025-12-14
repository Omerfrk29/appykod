'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { handleSmoothScroll } from '@/lib/utils';
import { analytics } from '@/lib/analytics';

export default function CTA() {
  const { t } = useLanguage();

  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in-up relative bg-gradient-to-r from-primary to-primary/80 dark:from-primary/90 dark:to-primary/70 rounded-3xl p-12 md:p-16 text-center shadow-2xl overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-50%] left-[-20%] w-[600px] h-[600px] rounded-full bg-white blur-[100px]" />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              {t('cta.title')}
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              {t('cta.subtitle')}
            </p>
            <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <Link
                href="#contact"
                onClick={(e) => {
                  handleSmoothScroll(e, '#contact');
                  analytics.ctaClick('contact-cta');
                }}
                className="relative inline-flex items-center justify-center px-10 py-4 bg-white text-primary font-bold text-lg rounded-full shadow-lg hover:shadow-2xl hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300 overflow-hidden group border-0 outline-none no-underline focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
              >
                {/* Animated Gradient Background */}
                <div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-success via-primary to-danger opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-x"
                  style={{ backgroundSize: '200% 200%' }}
                />
                <span className="relative z-10 flex items-center group-hover:text-white transition-colors duration-300">
                  {t('cta.button')} 
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
