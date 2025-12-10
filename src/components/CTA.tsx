'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CTA() {
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
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-r from-primary to-primary/80 dark:from-primary/90 dark:to-primary/70 rounded-3xl p-12 md:p-16 text-center shadow-2xl overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute top-[-50%] left-[-20%] w-[600px] h-[600px] rounded-full bg-white blur-[100px]" />
          </div>

          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-5xl font-extrabold text-white mb-6"
            >
              {t('cta.title')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-white/90 mb-10 max-w-2xl mx-auto"
            >
              {t('cta.subtitle')}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
              <Link
                href="#contact"
                onClick={(e) => handleSmoothScroll(e, '#contact')}
                className="relative inline-flex items-center justify-center px-10 py-4 bg-white text-primary font-bold text-lg rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border-0 outline-none no-underline focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
              >
                {/* Animated Gradient Background */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-success via-primary to-danger opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
                <motion.span
                  className="relative z-10 flex items-center"
                  whileHover={{ x: 5 }}
                >
                  {t('cta.button')} <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </motion.span>
              </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
