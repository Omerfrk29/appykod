'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Lock, Eye, Database, Mail, FileText } from 'lucide-react';

export default function PrivacyContent() {
  const { t } = useLanguage();

  const sections = [
    {
      icon: Database,
      titleKey: 'privacy.sections.dataCollection.title',
      contentKey: 'privacy.sections.dataCollection.content',
    },
    {
      icon: Eye,
      titleKey: 'privacy.sections.dataUsage.title',
      contentKey: 'privacy.sections.dataUsage.content',
    },
    {
      icon: FileText,
      titleKey: 'privacy.sections.cookies.title',
      contentKey: 'privacy.sections.cookies.content',
    },
    {
      icon: Shield,
      titleKey: 'privacy.sections.thirdParty.title',
      contentKey: 'privacy.sections.thirdParty.content',
    },
    {
      icon: Lock,
      titleKey: 'privacy.sections.dataSecurity.title',
      contentKey: 'privacy.sections.dataSecurity.content',
    },
    {
      icon: Mail,
      titleKey: 'privacy.sections.userRights.title',
      contentKey: 'privacy.sections.userRights.content',
    },
  ];

  return (
    <section className="py-24 bg-bg-base relative overflow-hidden min-h-screen">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-warm-glow opacity-10" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(245,158,11,0.02)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-warm mb-6 shadow-glow-amber">
            <Shield className="text-white" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            {t('privacy.title')}
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {t('privacy.subtitle')}
          </p>
          <p className="text-text-muted text-sm mt-4">
            {t('privacy.lastUpdated')}: {new Date().toLocaleDateString('tr-TR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-glass-bg backdrop-blur-xl rounded-2xl p-8 border border-white/5 mb-12">
          <p className="text-text-secondary leading-relaxed whitespace-pre-line">
            {t('privacy.introduction')}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div
                key={index}
                className="bg-glass-bg backdrop-blur-xl rounded-2xl p-8 border border-white/5 hover:border-glass-border-hover transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-warm flex items-center justify-center flex-shrink-0 shadow-glow-amber">
                    <Icon className="text-white" size={22} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-text-primary mb-4">
                      {t(section.titleKey)}
                    </h2>
                    <div className="text-text-secondary leading-relaxed whitespace-pre-line">
                      {t(section.contentKey)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-warm-soft rounded-2xl p-8 border border-accent-amber/20">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            {t('privacy.contact.title')}
          </h2>
          <p className="text-text-secondary mb-4">
            {t('privacy.contact.content')}
          </p>
          <a
            href="mailto:appykod@gmail.com"
            className="inline-flex items-center gap-2 text-accent-amber hover:text-accent-amber/80 font-medium transition-colors"
          >
            <Mail size={18} />
            appykod@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
}

