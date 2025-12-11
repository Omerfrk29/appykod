'use client';

import Logo from './Logo';
import { useLanguage } from '@/contexts/LanguageContext';
import { Heart, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub', hoverBg: 'hover:bg-gray-800 hover:text-white' },
    { icon: Twitter, href: '#', label: 'Twitter', hoverBg: 'hover:bg-[#1DA1F2] hover:text-white' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', hoverBg: 'hover:bg-[#0A66C2] hover:text-white' },
  ];

  return (
    <footer className="bg-white dark:bg-gray-950 transition-colors duration-300 relative overflow-hidden">
      {/* Animated gradient divider at top */}
      <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden">
        <div
          className="h-full w-full bg-gradient-to-r from-primary via-info via-success via-warning to-danger animate-gradient-x"
          style={{ backgroundSize: '200% 100%' }}
        />
      </div>

      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-blob-1" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-info/5 rounded-full blur-3xl animate-blob-2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start space-y-3 animate-fade-in-up">
            <div className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
              <Logo />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs text-center md:text-left">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            {socialLinks.map((social, index) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className={`w-10 h-10 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${social.hoverBg}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-6 md:mt-8 pt-6 md:pt-8 relative animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          {/* Gradient border line */}
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-center md:text-left">
            <p className="text-sm text-gray-400 dark:text-gray-500 flex items-center gap-1 hover:scale-[1.02] transition-transform duration-200">
              &copy; {new Date().getFullYear()} Appykod. {t('footer.copyright')}
            </p>

            <p className="text-sm text-gray-400 dark:text-gray-500 flex items-center gap-1">
              Made with
              <Heart size={14} className="text-danger fill-danger animate-pulse" />
              in Turkey
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
