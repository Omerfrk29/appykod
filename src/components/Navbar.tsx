'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight } from 'lucide-react';
import Logo from './Logo';
import { useLanguage } from '@/contexts/LanguageContext';
import { handleSmoothScroll } from '@/lib/utils';
import { analytics } from '@/lib/analytics';

interface NavbarProps {
  isHolidayTheme?: boolean;
}

export default function Navbar({ isHolidayTheme = false }: NavbarProps) {
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
    { href: '/', labelKey: 'nav.home', label: 'Home' },
    { href: '#services', labelKey: 'nav.services', label: 'IT Services' },
    { href: '#projects', labelKey: 'nav.projects', label: 'Projects' },
    { href: '#contact', labelKey: 'nav.contact', label: 'Contact' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0F1117]/95 backdrop-blur-lg shadow-lg shadow-black/10 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Logo />
          </Link>

          {/* Desktop Menu - Center */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  handleSmoothScroll(e, item.href);
                  analytics.navClick(item.labelKey);
                }}
                className="relative px-4 py-2 text-gray-300 hover:text-white font-medium text-sm transition-colors duration-200 group"
              >
                {t(item.labelKey)}
                {/* Orange underline on hover */}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-secondary group-hover:w-3/4 transition-all duration-300 rounded-full" />
              </Link>
            ))}
          </div>

          {/* Right Side - CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="#contact"
              onClick={(e) => {
                handleSmoothScroll(e, '#contact');
                analytics.ctaClick('navbar-free-estimate');
              }}
              className="group relative inline-flex items-center gap-2 bg-secondary hover:bg-secondary-dark text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 shadow-lg shadow-secondary/20 hover:shadow-secondary/40"
            >
              Free estimate
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-gray-300 transition-colors p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-[#0F1117]/98 backdrop-blur-lg border-t border-white/5 shadow-xl transition-all duration-300 ${
          isOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  handleSmoothScroll(e, item.href, 80, () => setIsOpen(false));
                  analytics.navClick(item.labelKey);
                }}
                className="text-gray-300 hover:text-white hover:bg-white/5 font-medium py-3 px-4 rounded-lg transition-all"
              >
                {t(item.labelKey)}
              </Link>
            ))}

            {/* Mobile CTA */}
            <div className="pt-4 mt-4 border-t border-white/10">
              <a
                href="#contact"
                onClick={(e) => {
                  handleSmoothScroll(e, '#contact', 80, () => setIsOpen(false));
                  analytics.ctaClick('navbar-mobile-free-estimate');
                }}
                className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-dark text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Free estimate
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
