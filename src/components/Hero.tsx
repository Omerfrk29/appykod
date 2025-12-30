'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { handleSmoothScroll } from '@/lib/utils';
import { analytics } from '@/lib/analytics';
import { Button } from './Button';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Hero() {
  const { t } = useLanguage();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  const words = t('hero.title').split(' ');

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background pt-20 md:pt-0">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 w-full h-full bg-noise z-[60]" />
      <div className="absolute inset-0 w-full h-full bg-background [background-image:radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
      
      {/* Parallax Background Text (Huge & Subtle) */}
      <motion.div style={{ y: y1 }} className="absolute top-[10%] -left-[10%] text-[20vw] font-black text-white/5 whitespace-nowrap select-none pointer-events-none z-0">
        CREATIVE
      </motion.div>
      <motion.div style={{ y: y2 }} className="absolute bottom-[10%] -right-[10%] text-[20vw] font-black text-white/5 whitespace-nowrap select-none pointer-events-none z-0">
        DIGITAL
      </motion.div>

      {/* Spotlight Effect */}
      <div className="pointer-events-none absolute -top-40 left-0 right-0 mx-auto h-[500px] w-full max-w-[1000px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent blur-[120px] opacity-50 animate-spotlight z-0" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 text-center">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto mb-8 flex w-fit items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md"
        >
          <Sparkles className="mr-2 h-4 w-4 text-yellow-200" />
          <span className="text-sm font-medium text-white/80 tracking-wide uppercase text-[10px] md:text-xs">
            Award Winning Agency
          </span>
        </motion.div>

        {/* Staggered Heading Animation */}
        <h1 className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white mb-6 leading-[0.9]">
          <div className="flex flex-wrap justify-center gap-x-4 md:gap-x-8">
             {t('hero.titlePrefix') && (
                <motion.span
                   initial={{ opacity: 0, y: 100, rotate: 10 }}
                   animate={{ opacity: 1, y: 0, rotate: 0 }}
                   transition={{ duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }}
                   className="inline-block"
                >
                   {t('hero.titlePrefix')}
                </motion.span>
             )}
             
             {words.map((word, i) => (
                <motion.span
                   key={i}
                   initial={{ opacity: 0, y: 100, rotate: 10 }}
                   animate={{ opacity: 1, y: 0, rotate: 0 }}
                   transition={{ duration: 0.8, delay: i * 0.1, ease: [0.2, 0.65, 0.3, 0.9] }}
                   className="inline-block bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-transparent"
                >
                   {word}
                </motion.span>
             ))}
          </div>
          <motion.div
             initial={{ opacity: 0, y: 50 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.4 }}
             className="text-4xl md:text-6xl font-light text-white/40 mt-2 italic font-serif"
          >
             {t('hero.titleSuffix')}
          </motion.div>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mx-auto mt-8 max-w-2xl text-lg text-white/60 sm:text-xl md:text-2xl leading-relaxed"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row"
        >
          <Button
            size="lg"
            className="text-lg px-10 py-7 bg-white text-black hover:bg-zinc-200"
            onClick={(e) => {
              const anchor = document.createElement('a');
              anchor.href = '#contact';
              handleSmoothScroll(e as any, '#contact');
              analytics.ctaClick('hero-primary');
            }}
          >
            <span className="relative z-10 flex items-center">
              {t('hero.ctaPrimary')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </span>
          </Button>

          <Button
            variant="ghost"
            size="lg"
            className="text-lg px-10 py-7 text-white/70 hover:text-white"
            onClick={(e) => {
               const anchor = document.createElement('a');
               anchor.href = '#projects';
               handleSmoothScroll(e as any, '#projects');
               analytics.ctaClick('hero-secondary');
            }}
          >
            {t('hero.ctaSecondary')}
          </Button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-widest text-white/30">Scroll</span>
        <div className="h-12 w-[1px] bg-gradient-to-b from-white/50 to-transparent" />
      </motion.div>
    </section>
  );
}