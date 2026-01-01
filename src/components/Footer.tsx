'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe, Twitter, Linkedin, Github, Instagram, ArrowRight } from 'lucide-react';
import { settingsApi } from '@/lib/api/client';
import { handleSmoothScroll } from '@/lib/utils';
import { analytics } from '@/lib/analytics';
import type { SiteSettings } from '@/lib/db';
import Logo from './Logo';
import ScrollReveal from './ScrollReveal';

const footerLinks = [
  { href: '#services', labelKey: 'footer.links.services' },
  { href: '#projects', labelKey: 'footer.links.projects' },
  { href: '#contact', labelKey: 'footer.links.contact' },
];

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
  instagram: Instagram,
};

export default function Footer() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await settingsApi.get();
        if (response.success && response.data) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
    loadSettings();
  }, []);

  return (
    <footer className="bg-bg-base relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-warm-glow opacity-10" />

      {/* CTA Section */}
      <div className="py-24 border-b border-white/5 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* CTA Glass Card */}
          <ScrollReveal>
          <div className="relative p-12 bg-glass-bg backdrop-blur-xl rounded-3xl border border-accent-amber/20 shadow-glass-card text-center">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-warm opacity-5 rounded-3xl" />
            <div className="absolute -inset-px bg-gradient-warm opacity-20 rounded-3xl blur-xl" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4 leading-tight">
                {t('footer.cta.title')}{' '}
                <span className="text-transparent bg-gradient-warm bg-clip-text">
                  {t('footer.cta.titleHighlight')}
                </span>
              </h2>
              <p className="text-text-secondary mb-8 text-lg max-w-xl mx-auto">
                {t('footer.cta.subtitle')}
              </p>
              <a
                href="#contact"
                onClick={(e) => {
                  handleSmoothScroll(e, '#contact');
                  analytics.ctaClick('footer-start-project');
                }}
                className="inline-flex items-center gap-2 bg-gradient-warm text-white px-10 py-4 rounded-xl font-bold text-lg shadow-glow-amber hover:shadow-glow-amber-lg transition-all duration-300 hover:scale-[1.02] group"
              >
                {t('footer.cta.button')}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Logo */}
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Logo />
            </Link>

            {/* Links */}
            <nav className="flex flex-wrap items-center justify-center gap-6">
              {footerLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  className="text-text-secondary hover:text-accent-amber font-medium text-sm transition-colors"
                >
                  {t(link.labelKey)}
                </a>
              ))}
            </nav>

            {/* Social Icons - From Admin Panel */}
            {settings?.social && Object.keys(settings.social).length > 0 && (
              <div className="flex items-center gap-3">
                {Object.entries(settings.social)
                  .filter(([_, url]) => url && (url as string).trim() !== '')
                  .map(([key, url]) => {
                    const Icon = iconMap[key] || Globe;
                    const label = key.charAt(0).toUpperCase() + key.slice(1);
                    return (
                      <a
                        key={key}
                        href={url as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full border border-white/10 hover:border-accent-amber/30 flex items-center justify-center text-text-muted hover:text-accent-amber transition-all hover:bg-accent-amber/10"
                        aria-label={label}
                      >
                        <Icon size={18} />
                      </a>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center">
            <p className="text-text-muted text-sm">
              {t('footer.copyrightText').replace('{year}', new Date().getFullYear().toString())}
            </p>
            <p className="text-text-muted text-sm">
              {t('footer.madeWithText')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
