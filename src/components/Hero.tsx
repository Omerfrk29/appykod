'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { useTheme } from 'next-themes';
import type { Container, Engine } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
import { useLanguage } from '@/contexts/LanguageContext';

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

// Floating Geometric Shapes
function FloatingShapes() {
  const shapes = [
    { type: 'circle', color: 'primary', size: 80, x: 10, y: 20, duration: 15 },
    { type: 'triangle', color: 'success', size: 60, x: 85, y: 15, duration: 18 },
    { type: 'square', color: 'danger', size: 70, x: 15, y: 70, duration: 20 },
    { type: 'circle', color: 'warning', size: 90, x: 80, y: 75, duration: 16 },
    { type: 'triangle', color: 'info', size: 50, x: 50, y: 10, duration: 22 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape, index) => {
        const colorMap: Record<string, string> = {
          primary: 'rgba(94, 111, 234, 0.2)',
          success: 'rgba(71, 207, 134, 0.2)',
          danger: 'rgba(255, 75, 123, 0.2)',
          warning: 'rgba(251, 107, 78, 0.2)',
          info: 'rgba(0, 206, 209, 0.2)',
        };
        return (
          <motion.div
            key={index}
            className="absolute opacity-20 dark:opacity-10 blur-xl"
            style={{
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              backgroundColor: colorMap[shape.color],
              clipPath: shape.type === 'triangle' 
                ? 'polygon(50% 0%, 0% 100%, 100% 100%)'
                : shape.type === 'square'
                ? 'none'
                : 'circle(50%)',
              borderRadius: shape.type === 'circle' ? '50%' : shape.type === 'square' ? '20%' : '0',
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, 30, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: shape.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 2,
            }}
          />
        );
      })}
    </div>
  );
}

export default function Hero() {
  const { t } = useLanguage();

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        const offset = 80; // Navbar yüksekliği için offset
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
    <section className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden pt-20">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6"
        >
          {t('hero.titlePrefix') && `${t('hero.titlePrefix')} `}
          <motion.span
            className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-info via-danger to-success"
            style={{
              backgroundSize: '200% 200%',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {t('hero.title')}
          </motion.span>
          {t('hero.titleSuffix') && ` ${t('hero.titleSuffix')}`}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300"
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              href="#contact"
              onClick={(e) => handleSmoothScroll(e, '#contact')}
              className="relative inline-flex items-center justify-center px-8 py-3 border-0 outline-none text-base font-medium rounded-full text-white bg-gradient-to-r from-primary via-info to-danger md:py-4 md:text-lg md:px-10 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group no-underline focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
              style={{
                backgroundSize: '200% 200%',
              }}
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-success via-primary to-warning opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  backgroundSize: '200% 200%',
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
              <span className="relative z-10 flex items-center">
                Start a Project <ArrowRight className="ml-2 -mr-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              href="#projects"
              onClick={(e) => handleSmoothScroll(e, '#projects')}
              className="relative inline-flex items-center justify-center px-8 py-3 border-2 border-primary/30 dark:border-primary/20 text-base font-medium rounded-full text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:border-primary md:py-4 md:text-lg md:px-10 shadow-md hover:shadow-xl transition-all duration-300 group"
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/10 via-info/10 to-danger/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
              <span className="relative z-10">{t('hero.ctaSecondary')}</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}