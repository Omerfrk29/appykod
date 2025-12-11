'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('/');
  const { t } = useLanguage();

  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 100], [1, 0.98]);
  const navScale = useTransform(scrollY, [0, 100], [1, 0.995]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      setIsOpen(false);
    }
  };

  return (
    <motion.nav
      style={{ opacity: navOpacity, scale: navScale }}
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/85 dark:bg-gray-950/85 backdrop-blur-xl shadow-2xl py-2'
          : 'bg-transparent py-4'
      }`}
    >
      {/* Animated gradient border at bottom when scrolled */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: scrolled ? 1 : 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-info via-danger to-success origin-left"
        style={{ backgroundSize: '200% 100%' }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative group"
          >
            <Link href="/" className="flex items-center space-x-2">
              <Logo />
            </Link>
            {/* Logo glow on hover */}
            <motion.div
              className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-info/20 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10"
            />
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {[
              { href: '/', labelKey: 'nav.home' },
              { href: '#services', labelKey: 'nav.services' },
              { href: '#contact', labelKey: 'nav.contact' },
            ].map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative"
              >
                <Link
                  href={item.href}
                  onClick={(e) => {
                    handleSmoothScroll(e, item.href);
                    setActiveLink(item.href);
                  }}
                  className="relative text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-bold transition-colors duration-300 py-2 px-1 text-sm lg:text-base"
                >
                  {t(item.labelKey)}
                  {/* Animated underline with gradient */}
                  <motion.span
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-info to-danger rounded-full"
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileHover={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    style={{ originX: 0 }}
                  />
                  {/* Hover glow effect */}
                  <motion.span
                    className="absolute inset-0 -z-10 bg-primary/5 dark:bg-primary/10 rounded-lg opacity-0"
                    whileHover={{ opacity: 1, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  />
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="flex items-center gap-2"
            >
              <LanguageToggle />
              <ThemeToggle />
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden space-x-4">
            <LanguageToggle />
            <ThemeToggle />
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-primary focus:outline-none"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 shadow-xl"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              {[
                { href: '/', label: t('nav.home') },
                { href: '#services', label: t('nav.services') },
                { href: '#contact', label: t('nav.contact') },
              ].map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={(e) => {
                      if (item.href.startsWith('#')) {
                        handleSmoothScroll(e, item.href);
                      }
                      setIsOpen(false);
                    }}
                    className="block px-4 py-3 rounded-xl text-base font-semibold text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-primary/10 hover:to-info/10 hover:text-primary transition-all duration-300 relative overflow-hidden group"
                  >
                    <span className="relative z-10">{item.label}</span>
                    {/* Mobile link gradient indicator */}
                    <motion.span
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-info rounded-r-full opacity-0 group-hover:opacity-100"
                      initial={{ scaleY: 0 }}
                      whileHover={{ scaleY: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
