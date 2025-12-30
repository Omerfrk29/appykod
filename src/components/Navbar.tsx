'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { handleSmoothScroll, cn } from '@/lib/utils';
import { analytics } from '@/lib/analytics';
import { Button } from './Button';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', labelKey: 'nav.home' },
    { href: '#services', labelKey: 'nav.services' },
    { href: '#projects', labelKey: 'nav.projects' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          'fixed top-4 left-0 right-0 z-50 mx-auto max-w-5xl px-4 md:px-6 transition-all duration-300',
        )}
      >
        <div className={cn(
          "relative flex items-center justify-between rounded-full px-4 py-3 transition-all duration-300",
          scrolled || isOpen 
            ? "glass-nav bg-background/60 dark:bg-zinc-950/60 shadow-lg ring-1 ring-white/10" 
            : "bg-transparent"
        )}>
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl tracking-tighter"
            onClick={() => setIsOpen(false)}
          >
            <Logo />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-1 bg-secondary/50 rounded-full px-2 py-1 ring-1 ring-white/5">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    handleSmoothScroll(e, item.href);
                    analytics.navClick(item.labelKey);
                  }}
                  className="px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background/80 rounded-full transition-all duration-200"
                >
                  {t(item.labelKey)}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3 pl-2 border-l border-border/50">
              <LanguageToggle />
              <ThemeToggle />
              <Button 
                variant="primary" 
                size="sm"
                className="rounded-full px-6 shadow-glow"
                onClick={(e) => {
                  const anchor = document.createElement('a');
                  anchor.href = '#contact';
                  handleSmoothScroll(e as any, '#contact');
                  analytics.navClick('nav.contact');
                }}
              >
                {t('nav.contact')}
              </Button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full hover:bg-secondary/80 transition-colors"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-24 z-40 rounded-3xl border border-white/10 bg-background/95 p-6 shadow-2xl backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    handleSmoothScroll(e, item.href, 80, () => setIsOpen(false));
                    analytics.navClick(item.labelKey);
                  }}
                  className="flex items-center justify-between rounded-xl p-4 text-lg font-medium hover:bg-secondary/50 transition-colors"
                >
                  {t(item.labelKey)}
                  <ArrowIcon />
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-4">
                <div className="flex items-center justify-between px-4">
                  <span className="text-sm text-muted-foreground">Switch Language</span>
                  <LanguageToggle />
                </div>
                <Button 
                  className="w-full rounded-xl py-6 text-lg"
                  onClick={(e) => {
                     const anchor = document.createElement('a');
                     anchor.href = '#contact';
                     handleSmoothScroll(e as any, '#contact', 80, () => setIsOpen(false));
                     analytics.navClick('nav.contact');
                  }}
                >
                  {t('nav.contact')}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const ArrowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4 opacity-50"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);
