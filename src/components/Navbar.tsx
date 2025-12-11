'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { handleSmoothScroll } from '@/lib/utils';

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
    { href: '#contact', labelKey: 'nav.contact' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/85 dark:bg-gray-950/85 backdrop-blur-xl shadow-2xl py-2'
          : 'bg-transparent py-4'
      }`}
    >
      {/* Animated gradient border at bottom when scrolled */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-info via-danger to-success origin-left transition-transform duration-500 ${
          scrolled ? 'scale-x-100' : 'scale-x-0'
        }`}
        style={{ backgroundSize: '200% 100%' }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="relative group animate-fade-in-left">
            <Link 
              href="/" 
              className="flex items-center space-x-2 hover:scale-105 active:scale-95 transition-transform duration-200"
            >
              <Logo />
            </Link>
            {/* Logo glow on hover */}
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-info/20 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((item, index) => (
              <div
                key={item.href}
                className="relative animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
              >
                <Link
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  className="relative text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-bold transition-colors duration-300 py-2 px-1 text-sm lg:text-base group"
                >
                  {t(item.labelKey)}
                  {/* Animated underline with gradient */}
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-info to-danger rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  {/* Hover glow effect */}
                  <span className="absolute inset-0 -z-10 bg-primary/5 dark:bg-primary/10 rounded-lg scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200" />
                </Link>
              </div>
            ))}
            <div 
              className="flex items-center gap-2 animate-fade-in-up"
              style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}
            >
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden space-x-4">
            <LanguageToggle />
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-primary focus:outline-none hover:scale-110 active:scale-90 transition-transform duration-200"
            >
              <div className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : 'rotate-0'}`}>
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pt-4 pb-6 space-y-2">
          {navLinks.map((item, index) => (
            <div
              key={item.href}
              className={`transform transition-all duration-300 ${
                isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
              }`}
              style={{ transitionDelay: isOpen ? `${index * 100}ms` : '0ms' }}
            >
              <Link
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href, 80, () => setIsOpen(false))}
                className="block px-4 py-3 rounded-xl text-base font-semibold text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-primary/10 hover:to-info/10 hover:text-primary transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10">{t(item.labelKey)}</span>
                {/* Mobile link gradient indicator */}
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-info rounded-r-full scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-top" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
