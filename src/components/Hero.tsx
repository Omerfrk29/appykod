'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { handleSmoothScroll } from '@/lib/utils';
import { useAnimationOnView } from '@/hooks/useAnimationOnView';
import { analytics } from '@/lib/analytics';

// Sparkle Component - Optimized
function SparkleEffect({ isPaused }: { isPaused: boolean }) {
  const sparkles = [
    { id: 0, x: 15, y: 25, size: 6, delay: 0, duration: 3 },
    { id: 1, x: 85, y: 18, size: 8, delay: 1.2, duration: 2.5 },
    { id: 2, x: 42, y: 72, size: 5, delay: 2.4, duration: 3.5 },
    { id: 3, x: 68, y: 45, size: 7, delay: 0.8, duration: 2.8 },
    { id: 4, x: 28, y: 88, size: 9, delay: 3.2, duration: 3.2 },
    { id: 5, x: 92, y: 62, size: 4, delay: 1.6, duration: 2.2 },
    { id: 6, x: 55, y: 12, size: 6, delay: 2.8, duration: 3.8 },
    { id: 7, x: 8, y: 55, size: 8, delay: 0.4, duration: 2.6 },
    { id: 8, x: 75, y: 82, size: 5, delay: 3.6, duration: 3.4 },
    { id: 9, x: 38, y: 35, size: 7, delay: 2, duration: 2.4 },
    { id: 10, x: 62, y: 92, size: 6, delay: 1, duration: 3 },
    { id: 11, x: 22, y: 48, size: 8, delay: 2.6, duration: 2.8 },
  ];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${isPaused ? 'animation-paused' : ''}`} style={{ contain: 'layout style' }}>
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute animate-sparkle"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            animationDuration: `${sparkle.duration}s`,
            animationDelay: `${sparkle.delay}s`,
          }}
        >
          <Sparkles
            size={sparkle.size}
            className="text-accent-gold dark:text-accent-gold/80"
          />
        </div>
      ))}
    </div>
  );
}

// CSS-based Floating Particles Component - Optimized
function FloatingParticles({ isPaused }: { isPaused: boolean }) {
  const particles = [
    { id: 1, color: 'primary', size: 8, x: 15, delay: 0, duration: 12 },
    { id: 2, color: 'primary', size: 6, x: 75, delay: 4, duration: 10 },
    { id: 3, color: 'success', size: 9, x: 45, delay: 2, duration: 16 },
    { id: 4, color: 'success', size: 6, x: 85, delay: 6, duration: 13 },
    { id: 5, color: 'danger', size: 7, x: 25, delay: 1, duration: 15 },
    { id: 6, color: 'danger', size: 8, x: 60, delay: 5, duration: 14 },
    { id: 7, color: 'warning', size: 6, x: 35, delay: 3, duration: 16 },
    { id: 8, color: 'info', size: 8, x: 90, delay: 7, duration: 12 },
  ];

  const colorClasses: Record<string, string> = {
    primary: 'bg-primary/40 dark:bg-primary/30',
    success: 'bg-success/40 dark:bg-success/30',
    danger: 'bg-danger/40 dark:bg-danger/30',
    warning: 'bg-warning/40 dark:bg-warning/30',
    info: 'bg-info/40 dark:bg-info/30',
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${isPaused ? 'animation-paused' : ''}`} style={{ contain: 'strict' }}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full animate-particle-float ${colorClasses[particle.color]}`}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            bottom: '-20px',
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

// Floating Geometric Shapes - Optimized (no blur, fewer shapes)
function FloatingShapes({ isPaused }: { isPaused: boolean }) {
  const shapes = [
    { type: 'circle', color: 'primary', size: 100, x: 10, y: 20, duration: 20, delay: 0 },
    { type: 'circle', color: 'success', size: 80, x: 85, y: 70, duration: 25, delay: 2 },
    { type: 'circle', color: 'info', size: 70, x: 50, y: 45, duration: 22, delay: 4 },
  ];

  const colorMap: Record<string, string> = {
    primary: 'bg-primary/25 dark:bg-primary/15',
    success: 'bg-success/25 dark:bg-success/15',
    danger: 'bg-danger/25 dark:bg-danger/15',
    warning: 'bg-warning/25 dark:bg-warning/15',
    info: 'bg-info/25 dark:bg-info/15',
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${isPaused ? 'animation-paused' : ''}`} style={{ contain: 'strict' }}>
      {shapes.map((shape, index) => (
        <div
          key={index}
          className={`absolute rounded-full animate-shape-float ${colorMap[shape.color]}`}
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            animationDuration: `${shape.duration}s`,
            animationDelay: `${shape.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// Gradient Orbs - Blur yerine radial-gradient ile performanslı
function GradientOrbs({ isPaused }: { isPaused: boolean }) {
  return (
    <div className={`absolute inset-0 w-full h-full -z-10 ${isPaused ? 'animation-paused' : ''}`} style={{ contain: 'strict' }}>
      {/* Primary Orb - Sol üst */}
      <div 
        className="absolute w-[600px] h-[600px] -top-[200px] -left-[200px] animate-orb-drift-1"
        style={{
          background: 'radial-gradient(circle, rgba(94,111,234,0.35) 0%, rgba(94,111,234,0.15) 35%, rgba(94,111,234,0.05) 55%, transparent 70%)',
        }}
      />
      {/* Cyan/Info Orb - Sağ üst */}
      <div 
        className="absolute w-[500px] h-[500px] -top-[100px] -right-[150px] animate-orb-drift-2"
        style={{
          background: 'radial-gradient(circle, rgba(0,206,209,0.3) 0%, rgba(0,206,209,0.12) 35%, rgba(0,206,209,0.04) 55%, transparent 70%)',
        }}
      />
      {/* Pink/Danger Orb - Sol alt */}
      <div 
        className="absolute w-[550px] h-[550px] -bottom-[200px] -left-[100px] animate-orb-drift-3"
        style={{
          background: 'radial-gradient(circle, rgba(255,75,123,0.28) 0%, rgba(255,75,123,0.1) 35%, rgba(255,75,123,0.03) 55%, transparent 70%)',
        }}
      />
      {/* Success Orb - Sağ alt */}
      <div 
        className="absolute w-[450px] h-[450px] -bottom-[150px] -right-[100px] animate-orb-drift-4"
        style={{
          background: 'radial-gradient(circle, rgba(71,207,134,0.25) 0%, rgba(71,207,134,0.08) 35%, rgba(71,207,134,0.02) 55%, transparent 70%)',
        }}
      />
      {/* Center accent orb */}
      <div 
        className="absolute w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orb-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(251,107,78,0.15) 0%, rgba(251,107,78,0.05) 40%, transparent 65%)',
        }}
      />
    </div>
  );
}

export default function Hero() {
  const { t } = useLanguage();
  const { ref, isVisible } = useAnimationOnView();
  const isPaused = !isVisible;

  return (
    <section ref={ref} className="relative w-full min-h-[65vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden pt-16 pb-8">
      {/* Gradient Orbs Background - Blur yok, GPU dostu */}
      <GradientOrbs isPaused={isPaused} />

      {/* Floating Geometric Shapes */}
      <FloatingShapes isPaused={isPaused} />

      {/* Floating Particles */}
      <FloatingParticles isPaused={isPaused} />

      {/* Sparkle Effect */}
      <SparkleEffect isPaused={isPaused} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h1 className="animate-fade-in-up text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter text-gray-900 dark:text-white mb-4 md:mb-6 leading-tight">
          {t('hero.titlePrefix') && (
            <span className="animate-fade-in-left animation-delay-200 inline-block">
              {t('hero.titlePrefix')}{' '}
            </span>
          )}
          <span className="relative inline-block hover:scale-[1.02] transition-transform duration-300">
            <span className="animate-gradient-text" style={{ marginLeft: '20px', marginRight: '0px' }}>
              {t('hero.title')}
            </span>
          </span>
          {t('hero.titleSuffix') && (
            <span className="animate-fade-in-right animation-delay-400 inline-block">
              {' '}{t('hero.titleSuffix')}
            </span>
          )}
        </h1>

        <p className="animate-fade-in-up animation-delay-300 mt-4 md:mt-6 max-w-2xl lg:max-w-3xl mx-auto text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed px-4">
          {t('hero.subtitle')}
        </p>

        <div className="animate-fade-in-up animation-delay-500 mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
          {/* Primary CTA - Pure CSS */}
          <div className="transform hover:scale-105 active:scale-95 transition-transform duration-200">
            <Link
              href="#contact"
              onClick={(e) => {
                handleSmoothScroll(e, '#contact');
                analytics.ctaClick('hero-primary');
              }}
              className="relative inline-flex items-center justify-center px-10 py-4 border-0 outline-none text-base font-bold rounded-full text-white md:py-5 md:text-lg md:px-12 shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden group no-underline focus:outline-none focus:ring-4 focus:ring-primary/30"
            >
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-success via-primary to-danger animate-gradient-x"
                style={{ backgroundSize: '200% 200%' }}
              />
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine-button" />
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_20px_rgba(94,111,234,0.4),0_0_40px_rgba(0,206,209,0.3)]" />
              <span className="relative z-10 flex items-center gap-2">
                {t('hero.ctaPrimary')}
                <span className="animate-arrow-bounce">
                  <ArrowRight className="w-5 h-5" />
                </span>
              </span>
            </Link>
          </div>

          {/* Secondary CTA - Pure CSS */}
          <div className="transform hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-transform duration-200">
            <Link
              href="#projects"
              onClick={(e) => {
                handleSmoothScroll(e, '#projects');
                analytics.ctaClick('hero-secondary');
              }}
              className="relative inline-flex items-center justify-center px-10 py-4 border-2 border-transparent text-base font-bold rounded-full text-gray-700 dark:text-gray-200 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md md:py-5 md:text-lg md:px-12 shadow-lg hover:shadow-xl transition-shadow duration-300 group overflow-hidden"
            >
              <span
                className="absolute inset-0 rounded-full p-[2px] animate-border-dance"
                style={{
                  background: 'linear-gradient(90deg, #5E6FEA, #00CED1, #FF4B7B, #FB6B4E, #47CF86, #5E6FEA)',
                  backgroundSize: '300% 100%',
                }}
              >
                <span className="absolute inset-[2px] rounded-full bg-white dark:bg-gray-800" />
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/5 via-info/5 to-danger/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">{t('hero.ctaSecondary')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator - Pure CSS */}
      <div className="hidden md:block absolute bottom-4 left-1/2 -translate-x-1/2 z-10 opacity-70">
        <div className="w-5 h-8 rounded-full border-2 border-gray-400 dark:border-gray-600 flex items-start justify-center p-1 animate-scroll-bounce">
          <div className="w-1 h-2 bg-gradient-to-b from-primary to-info rounded-full animate-scroll-dot" />
        </div>
      </div>
    </section>
  );
}
