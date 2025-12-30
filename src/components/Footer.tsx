'use client';

import { useState, useEffect } from 'react';
import Logo from './Logo';
import { useLanguage } from '@/contexts/LanguageContext';
import { Heart, Github, Twitter, Linkedin, Instagram } from 'lucide-react';
import { settingsApi } from '@/lib/api/client';
import type { SiteSettings } from '@/lib/db';
import { cn } from '@/lib/utils';

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

  // Build social links from settings
  const socialLinks = [];
  if (settings?.social?.github) {
    socialLinks.push({ icon: Github, href: settings.social.github, label: 'GitHub' });
  }
  if (settings?.social?.twitter) {
    socialLinks.push({ icon: Twitter, href: settings.social.twitter, label: 'Twitter' });
  }
  if (settings?.social?.linkedin) {
    socialLinks.push({ icon: Linkedin, href: settings.social.linkedin, label: 'LinkedIn' });
  }
  if (settings?.social?.instagram) {
    socialLinks.push({ icon: Instagram, href: settings.social.instagram, label: 'Instagram' });
  }

  return (
    <footer className="bg-muted/30 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <Logo />
            <p className="text-muted-foreground text-sm max-w-xs text-center md:text-left">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={cn(
                    "w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary"
                  )}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Appykod. {t('footer.copyright')}
          </p>

          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            {t('footer.madeWith')}
            <Heart size={14} className="text-red-500 fill-red-500" />
            {t('footer.inTurkey')}
          </p>
        </div>
      </div>
    </footer>
  );
}