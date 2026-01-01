'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight } from 'lucide-react';
import Logo from './Logo';
import { useLanguage } from '@/contexts/LanguageContext';
import { handleSmoothScroll } from '@/lib/utils';
import { analytics } from '@/lib/analytics';
import { LanguageToggle } from './LanguageToggle';

interface NavbarProps {
  isHolidayTheme?: boolean;
}

export default function Navbar({ isHolidayTheme = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('/');
  const { t } = useLanguage();
  const pathname = usePathname();

  // Anasayfaya git veya en üste scroll yap
  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
      // Zaten anasayfadaysak, en üste scroll yap
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
    // Başka bir sayfadaysak, normal link davranışı devam edecek (Next.js router)
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Detect active section
      const sections = ['contact', 'projects', 'services'];
      let found = false;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(`#${id}`);
            found = true;
            break;
          }
        }
      }
      if (!found && window.scrollY < 100) {
        setActiveSection('/');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }

    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isOpen]);

  const navLinks = [
    { href: '/', labelKey: 'nav.home', label: 'Home' },
    { href: '#services', labelKey: 'nav.services', label: 'IT Services' },
    { href: '#projects', labelKey: 'nav.projects', label: 'Projects' },
    { href: '#contact', labelKey: 'nav.contact', label: 'Contact' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-bg-base/80 backdrop-blur-xl border-b border-glass-border py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            onClick={handleHomeClick}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Logo />
          </Link>

          {/* Desktop Menu - Center */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((item) => {
              const isActive = activeSection === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    if (item.href === '/') {
                      handleHomeClick(e);
                    } else {
                      handleSmoothScroll(e, item.href);
                    }
                    analytics.navClick(item.labelKey);
                  }}
                  className={`relative px-4 py-2 font-medium text-sm transition-colors duration-200 group ${
                    isActive ? 'text-accent-amber' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {t(item.labelKey)}
                  {/* Amber gradient underline */}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-warm rounded-full transition-all duration-300 ${
                      isActive ? 'w-3/4' : 'w-0 group-hover:w-3/4'
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Right Side - Language Toggle and CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageToggle />
            <a
              href="#contact"
              onClick={(e) => {
                handleSmoothScroll(e, '#contact');
                analytics.ctaClick('navbar-free-estimate');
              }}
              className="group relative inline-flex items-center gap-2 bg-gradient-warm hover:shadow-glow-amber text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-accent-amber/20"
            >
              {t('nav.freeEstimate')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-2">
            <LanguageToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-text-primary hover:text-accent-amber transition-colors p-2"
              aria-label={t('nav.toggleMenu')}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay - Fullscreen Glass */}
      <div
        className={`md:hidden fixed inset-0 top-0 z-40 bg-bg-base/98 backdrop-blur-xl transition-all duration-300 ${
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        style={{ height: '100dvh' }}
      >
        <div className="h-full flex flex-col justify-center items-center px-4 pt-[60px]">
          <div className="flex flex-col items-center space-y-6">
            {navLinks.map((item) => {
              const isActive = activeSection === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    if (item.href === '/') {
                      handleHomeClick(e);
                      setIsOpen(false);
                    } else {
                      handleSmoothScroll(e, item.href, 80, () => setIsOpen(false));
                    }
                    analytics.navClick(item.labelKey);
                  }}
                  className={`relative text-2xl font-bold transition-all ${
                    isActive
                      ? 'text-transparent bg-gradient-warm bg-clip-text'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {t(item.labelKey)}
                  {isActive && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-warm rounded-full" />
                  )}
                </Link>
              );
            })}

            {/* Mobile CTA */}
            <div className="pt-8 flex flex-col items-center gap-4">
              <LanguageToggle />
              <a
                href="#contact"
                onClick={(e) => {
                  handleSmoothScroll(e, '#contact', 80, () => setIsOpen(false));
                  analytics.ctaClick('navbar-mobile-free-estimate');
                }}
                className="inline-flex items-center justify-center gap-2 bg-gradient-warm text-white px-8 py-4 rounded-xl font-bold text-lg shadow-glow-amber transition-all hover:shadow-glow-amber-lg"
              >
                {t('nav.freeEstimate')}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
