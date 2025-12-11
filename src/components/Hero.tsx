'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { useTheme } from 'next-themes';
import type { Container, Engine } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
import { useLanguage } from '@/contexts/LanguageContext';

// Sparkle Component for floating stars
function SparkleEffect() {
  const sparkles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 4,
    delay: Math.random() * 4,
    duration: Math.random() * 2 + 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: sparkle.duration,
            repeat: Infinity,
            delay: sparkle.delay,
            ease: 'easeInOut',
          }}
        >
          <Sparkles
            size={sparkle.size}
            className="text-accent-gold dark:text-accent-gold/80"
          />
        </motion.div>
      ))}
    </div>
  );
}

// Floating Particles Component
function FloatingParticles() {
  const { theme, resolvedTheme } = useTheme();
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = useCallback(async (_container: Container | undefined) => {
    // Parçacıklar yüklendi
  }, []);

  // Renk paleti - mevcut renkleri koruyoruz
  const colorMap = useMemo(() => {
    const isDark = resolvedTheme === 'dark' || theme === 'dark';
    const opacity = isDark ? 0.48 : 0.56;
    
    return [
      { value: `rgba(94, 111, 234, ${opacity})` },   // primary
      { value: `rgba(71, 207, 134, ${opacity})` },   // success
      { value: `rgba(255, 75, 123, ${opacity})` },   // danger
      { value: `rgba(251, 107, 78, ${opacity})` },  // warning
      { value: `rgba(0, 206, 209, ${opacity})` },   // info
    ];
  }, [theme, resolvedTheme]);

  // TSParticles konfigürasyonu
  const particlesOptions = useMemo(() => ({
    fullScreen: {
      enable: false,
    },
    background: {
      color: {
        value: 'transparent',
      },
    },
    fpsLimit: 60,
    particles: {
      number: {
        value: 40,
        density: {
          enable: true,
          valueArea: 800,
        },
      },
      color: {
        value: colorMap.map(c => c.value),
      },
      shape: {
        type: 'circle' as const,
      },
      opacity: {
        value: { min: 0.4, max: 0.8 },
        animation: {
          enable: true,
          speed: 0.3,
          sync: false,
          destroy: 'none' as const,
        },
      },
      size: {
        value: { min: 4, max: 12 },
        animation: {
          enable: true,
          speed: 1.5,
          sizeMin: 0.8,
          sync: false,
          destroy: 'none' as const,
        },
      },
      move: {
        enable: true,
        speed: 0.3,
        direction: 'top' as const,
        random: true,
        straight: false,
        outModes: {
          default: 'out' as const,
          top: 'out' as const,
          bottom: 'out' as const,
          left: 'out' as const,
          right: 'out' as const,
        },
        attract: {
          enable: false,
        },
        gravity: {
          enable: false,
        },
      },
      links: {
        enable: false,
      },
      interactivity: {
        detectsOn: 'canvas' as const,
        events: {
          onHover: {
            enable: true,
            mode: 'repulse' as const,
          },
          onClick: {
            enable: false,
          },
        },
        modes: {
          repulse: {
            distance: 150,
            duration: 0.4,
            factor: 100,
            speed: 1,
            maxSpeed: 50,
            easing: 'ease-out-quad' as const,
          },
          grab: {
            distance: 120,
            links: {
              opacity: 0,
            },
            particles: {
              opacity: 0.3,
              size: 1.5,
            },
          },
        },
      },
      retinaDetect: true,
    },
  }), [colorMap]);

  if (!init) {
    return <div className="absolute inset-0 overflow-hidden" />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={particlesOptions}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

// Floating Geometric Shapes with Morphing Effect
function FloatingShapes() {
  const shapes = [
    { type: 'circle', color: 'primary', size: 100, x: 10, y: 20, duration: 15 },
    { type: 'triangle', color: 'success', size: 80, x: 85, y: 15, duration: 18 },
    { type: 'square', color: 'danger', size: 90, x: 15, y: 70, duration: 20 },
    { type: 'circle', color: 'warning', size: 110, x: 80, y: 75, duration: 16 },
    { type: 'triangle', color: 'info', size: 70, x: 50, y: 10, duration: 22 },
    { type: 'hexagon', color: 'primary', size: 60, x: 30, y: 85, duration: 19 },
    { type: 'circle', color: 'info', size: 50, x: 70, y: 40, duration: 14 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape, index) => {
        const colorMap: Record<string, { bg: string; glow: string }> = {
          primary: { bg: 'rgba(94, 111, 234, 0.35)', glow: 'rgba(94, 111, 234, 0.5)' },
          success: { bg: 'rgba(71, 207, 134, 0.35)', glow: 'rgba(71, 207, 134, 0.5)' },
          danger: { bg: 'rgba(255, 75, 123, 0.35)', glow: 'rgba(255, 75, 123, 0.5)' },
          warning: { bg: 'rgba(251, 107, 78, 0.35)', glow: 'rgba(251, 107, 78, 0.5)' },
          info: { bg: 'rgba(0, 206, 209, 0.35)', glow: 'rgba(0, 206, 209, 0.5)' },
        };
        const colors = colorMap[shape.color];

        return (
          <motion.div
            key={index}
            className="absolute blur-2xl"
            style={{
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              backgroundColor: colors.bg,
              clipPath: shape.type === 'triangle'
                ? 'polygon(50% 0%, 0% 100%, 100% 100%)'
                : shape.type === 'square'
                ? 'none'
                : shape.type === 'hexagon'
                ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                : 'circle(50%)',
              borderRadius: shape.type === 'circle' ? '50%' : shape.type === 'square' ? '20%' : '0',
            }}
            animate={{
              y: [0, -60, 20, 0],
              x: [0, 40, -20, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.3, 0.9, 1],
              opacity: [0.3, 0.5, 0.3],
              boxShadow: [
                `0 0 20px ${colors.glow}`,
                `0 0 40px ${colors.glow}`,
                `0 0 20px ${colors.glow}`,
              ],
            }}
            transition={{
              duration: shape.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 1.5,
            }}
          />
        );
      })}
    </div>
  );
}

// Animated Letter Component for staggered text animation
function AnimatedText({ text, className }: { text: string; className?: string }) {
  const letters = text.split('');

  return (
    <span className={className}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: index * 0.03,
            ease: [0.6, -0.05, 0.01, 0.99],
          }}
          className="inline-block"
          style={{ whiteSpace: letter === ' ' ? 'pre' : 'normal' }}
        >
          {letter}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero() {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  // Magnetic button effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) * 0.15);
    mouseY.set((e.clientY - centerY) * 0.15);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <section className="relative w-full min-h-[65vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden pt-16 pb-8">
      {/* Background Blobs with Animation */}
      <div className="absolute inset-0 w-full h-full -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 dark:bg-primary/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -60, 0],
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
            delay: 2,
          }}
          className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-danger/20 dark:bg-danger/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 45, 0],
            x: [0, 50, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'linear',
            delay: 4,
          }}
          className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-success/20 dark:bg-success/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"
        />
        {/* Additional Colorful Blobs */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, -120, 0],
            x: [0, 70, 0],
            y: [0, -80, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'linear',
            delay: 1,
          }}
          className="absolute top-[50%] right-[10%] w-[350px] h-[350px] bg-warning/20 dark:bg-warning/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"
        />
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            rotate: [0, 180, 0],
            x: [0, -60, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
            delay: 3,
          }}
          className="absolute bottom-[20%] right-[20%] w-[450px] h-[450px] bg-info/20 dark:bg-info/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"
        />
        <motion.div
          animate={{
            scale: [1, 1.18, 1],
            rotate: [0, -90, 0],
            x: [0, 40, 0],
            y: [0, -60, 0],
          }}
          transition={{
            duration: 19,
            repeat: Infinity,
            ease: 'linear',
            delay: 5,
          }}
          className="absolute top-[30%] left-[50%] w-[300px] h-[300px] bg-primary/15 dark:bg-primary/8 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"
        />
      </div>

      {/* Floating Geometric Shapes */}
      <FloatingShapes />

      {/* Floating Particles */}
      <FloatingParticles />

      {/* Sparkle Effect */}
      <SparkleEffect />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter text-gray-900 dark:text-white mb-4 md:mb-6 leading-tight"
        >
          {t('hero.titlePrefix') && (
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t('hero.titlePrefix')}{' '}
            </motion.span>
          )}
          <motion.span
            className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary via-info via-danger via-warning to-success"
            style={{
              backgroundSize: '300% 300%',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '50% 100%', '100% 50%', '50% 0%', '0% 50%'],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
            whileHover={{
              scale: 1.02,
              textShadow: '0 0 40px rgba(94, 111, 234, 0.4)',
            }}
          >
            {t('hero.title')}
            {/* Shimmer overlay */}
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{ backgroundSize: '200% 100%' }}
              animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
            />
          </motion.span>
          {t('hero.titleSuffix') && (
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {' '}{t('hero.titleSuffix')}
            </motion.span>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          className="mt-4 md:mt-6 max-w-2xl lg:max-w-3xl mx-auto text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed px-4"
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
          className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
        >
          {/* Primary CTA with magnetic effect */}
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x, y }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              href="#contact"
              onClick={(e) => handleSmoothScroll(e, '#contact')}
              className="relative inline-flex items-center justify-center px-10 py-4 border-0 outline-none text-base font-bold rounded-full text-white bg-gradient-to-r from-primary via-info to-danger md:py-5 md:text-lg md:px-12 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group no-underline focus:outline-none focus:ring-4 focus:ring-primary/30"
              style={{
                backgroundSize: '200% 200%',
              }}
            >
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-success via-primary via-danger to-warning"
                style={{ backgroundSize: '300% 300%' }}
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                style={{ backgroundSize: '200% 100%' }}
                animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
              />
              {/* Glow ring on hover */}
              <motion.div
                className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary via-info to-danger opacity-0 group-hover:opacity-50 blur-lg transition-opacity duration-500"
              />
              <span className="relative z-10 flex items-center gap-2">
                {t('hero.ctaPrimary') || 'Start a Project'}
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </span>
            </Link>
          </motion.div>

          {/* Secondary CTA */}
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              href="#projects"
              onClick={(e) => handleSmoothScroll(e, '#projects')}
              className="relative inline-flex items-center justify-center px-10 py-4 border-2 border-transparent text-base font-bold rounded-full text-gray-700 dark:text-gray-200 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md md:py-5 md:text-lg md:px-12 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
            >
              {/* Animated border */}
              <motion.span
                className="absolute inset-0 rounded-full p-[2px]"
                style={{
                  background: 'linear-gradient(90deg, #5E6FEA, #00CED1, #FF4B7B, #FB6B4E, #47CF86, #5E6FEA)',
                  backgroundSize: '300% 100%',
                }}
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              >
                <span className="absolute inset-[2px] rounded-full bg-white dark:bg-gray-800" />
              </motion.span>
              {/* Hover glow */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/5 via-info/5 to-danger/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <span className="relative z-10">{t('hero.ctaSecondary')}</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator - hidden on mobile, smaller size */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1.5 }}
          className="hidden md:block absolute bottom-4 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border-2 border-gray-400 dark:border-gray-600 flex items-start justify-center p-1"
          >
            <motion.div
              animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-2 bg-gradient-to-b from-primary to-info rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}