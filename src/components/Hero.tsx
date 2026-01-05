'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { handleSmoothScroll } from '@/lib/utils';
import { analytics } from '@/lib/analytics';

// Dynamically import Three.js scene for better performance
const Hero3DScene = dynamic(() => import('./Hero3DScene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-gold-radial opacity-20" />
  ),
});

export default function Hero() {
  const { t } = useLanguage();
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  // Track scroll progress for parallax and fade effects
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-obsidian-950"
    >
      {/* 3D Scene Background */}
      <Hero3DScene scrollProgress={scrollProgress} />

      {/* Gradient Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-obsidian-950/30 to-obsidian-950/80 pointer-events-none" />

      {/* Ambient glow effects - Gold/Copper tones */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gold-400/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-copper-400/4 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-violet/3 rounded-full blur-[200px] pointer-events-none" />

      {/* Main Content - Centered */}
      <div
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        style={{
          opacity: 1 - scrollProgress * 1.5,
          transform: `translateY(${scrollProgress * 50}px)`,
        }}
      >
        {/* Badge - Glassmorphism Pro */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-layer-2 glass-border-gradient mb-8">
          <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse shadow-glow-gold-sm" />
          <span className="text-sm text-text-secondary">
            {t('hero.badge') || 'Modern Software Solutions'}
          </span>
        </div>

        {/* Main Heading - Gold Shimmer */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-display font-black text-text-primary leading-tight tracking-tight mb-6">
          {t('hero.title.line1') || 'Dijital Hayalleri'}
          <br />
          <span className="text-shimmer-gold">
            {t('hero.title.highlight') || 'Gerçeğe'}
          </span>{' '}
          {t('hero.title.line2') || 'Dönüştürüyoruz'}
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
          {t('hero.subtitle') ||
            'Web ve mobil uygulama geliştirmede uzman ekibimizle, işinizi bir sonraki seviyeye taşıyoruz.'}
        </p>

        {/* CTA Buttons - Gold Gradient */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="#contact"
            onClick={(e) => {
              handleSmoothScroll(e, '#contact');
              analytics.ctaClick('hero-contact');
            }}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-gold-400 via-gold-300 to-copper-400 text-obsidian-950 font-semibold rounded-xl hover:shadow-glow-gold-lg transition-all duration-300 group"
          >
            {t('hero.cta.primary') || 'İletişime Geçin'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="#projects"
            onClick={(e) => {
              handleSmoothScroll(e, '#projects');
              analytics.ctaClick('hero-projects');
            }}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 glass-layer-2 glass-border-gradient text-text-primary font-medium rounded-xl hover-glow-gold transition-all duration-300 group"
          >
            {t('hero.cta.secondary') || 'Projelerimiz'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Stats - Glass Cards with Gold Accent */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
          <div className="text-center p-4 glass-layer-1 rounded-2xl glass-border-gradient hover-glow-gold transition-all duration-300">
            <div className="text-2xl sm:text-3xl font-bold text-gradient-gold">50+</div>
            <div className="text-sm text-text-muted mt-1">
              {t('hero.stats.projects') || 'Proje'}
            </div>
          </div>
          <div className="text-center p-4 glass-layer-1 rounded-2xl glass-border-gradient hover-glow-gold transition-all duration-300">
            <div className="text-2xl sm:text-3xl font-bold text-gradient-gold">30+</div>
            <div className="text-sm text-text-muted mt-1">
              {t('hero.stats.clients') || 'Mutlu Müşteri'}
            </div>
          </div>
          <div className="text-center p-4 glass-layer-1 rounded-2xl glass-border-gradient hover-glow-gold transition-all duration-300">
            <div className="text-2xl sm:text-3xl font-bold text-gradient-gold">5+</div>
            <div className="text-sm text-text-muted mt-1">
              {t('hero.stats.years') || 'Yıl Deneyim'}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted transition-opacity duration-300"
        style={{ opacity: 1 - scrollProgress * 3 }}
      >
        <span className="text-xs uppercase tracking-widest">
          {t('hero.scroll') || 'Keşfedin'}
        </span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </div>
    </section>
  );
}
