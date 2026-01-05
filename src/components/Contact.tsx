'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Send,
  CheckCircle,
  AlertCircle,
  Mail,
  Loader2,
  MapPin,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { analytics } from '@/lib/analytics';
import ScrollReveal from './ScrollReveal';

const contactInfoKeys = ['email', 'location', 'location2'];

export default function Contact() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [isInView, setIsInView] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true);
      },
      { threshold: 0.2 }
    );
    if (formRef.current) observer.observe(formRef.current);
    return () => observer.disconnect();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus('success');
        (e.target as HTMLFormElement).reset();
        analytics.contactFormSubmit(true);
      } else {
        setStatus('error');
        analytics.contactFormSubmit(false);
      }
    } catch {
      setStatus('error');
      analytics.contactFormSubmit(false);
    }
  }

  return (
    <section id="contact" className="py-24 bg-obsidian-900 relative overflow-hidden">
      {/* Background - Gold Radial */}
      <div className="absolute inset-0 bg-gradient-gold-radial opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(212,175,55,0.02)_1px,transparent_1px)] [background-size:32px_32px]" />
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-gold-400/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-copper-400/4 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 glass-layer-1 border border-gold-400/20 rounded-full text-gold-400 text-sm font-medium mb-4">
            {t('contact.badge')}
          </span>
          <h2 className="text-h2 font-bold text-text-primary mb-4">
            {t('contact.titleMain')}{' '}
            <span className="text-shimmer-gold">
              {t('contact.titleHighlight')}
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-body-lg text-text-secondary">
            {t('contact.subtitleText')}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Content - Contact Info */}
          <ScrollReveal direction="left" delay={100} className="space-y-8">
            {/* Info Cards */}
            <div className="space-y-4">
              {contactInfoKeys.map((key, index) => {
                const Icon = key === 'email' ? Mail : MapPin;
                const href = key === 'email' ? 'mailto:appykod@gmail.com' : null;
                const label = key === 'email'
                  ? t('contact.info.emailLabel')
                  : key === 'location'
                  ? t('contact.info.location')
                  : t('contact.info.location2Label');
                const value = key === 'email'
                  ? 'appykod@gmail.com'
                  : key === 'location'
                  ? t('contact.info.locationValue')
                  : t('contact.info.location2Value');
                const content = (
                  <div className="group flex items-start gap-4 p-6 glass-layer-2 rounded-2xl hover:shadow-glow-gold-sm transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-copper-400 flex items-center justify-center flex-shrink-0 shadow-glow-gold-sm">
                      <Icon className="text-obsidian-950" size={22} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-text-muted mb-1">
                        {label}
                      </h3>
                      <p className="text-text-primary font-medium group-hover:text-gold-400 transition-colors">
                        {value}
                      </p>
                    </div>
                  </div>
                );

                return href ? (
                  <a key={index} href={href}>
                    {content}
                  </a>
                ) : (
                  <div key={index}>{content}</div>
                );
              })}
            </div>

            {/* Additional CTA - Glass Inner Glow */}
            <div className="p-6 glass-layer-2 glass-inner-glow-gold rounded-2xl">
              <h3 className="text-lg font-bold text-text-primary mb-2">
                {t('contact.guarantee.title')}
              </h3>
              <p className="text-text-secondary text-sm">
                {t('contact.guarantee.description')}
              </p>
            </div>
          </ScrollReveal>

          {/* Right Form - Glass Effect */}
          <div
            ref={formRef}
            className={`glass-layer-3 glass-border-gradient rounded-3xl p-8 shadow-glass-xl transition-all duration-700 ${
              isInView
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-12'
            }`}
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Honeypot */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-text-secondary mb-2"
                >
                  {t('contact.form.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3.5 rounded-xl bg-obsidian-800/50 border border-white/10 text-text-primary placeholder-text-muted focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 focus:bg-obsidian-800 outline-none transition-all"
                  placeholder={t('contact.form.namePlaceholder')}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-text-secondary mb-2"
                >
                  {t('contact.form.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3.5 rounded-xl bg-obsidian-800/50 border border-white/10 text-text-primary placeholder-text-muted focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 focus:bg-obsidian-800 outline-none transition-all"
                  placeholder={t('contact.form.emailPlaceholder')}
                />
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-text-secondary mb-2"
                >
                  {t('contact.form.message')}
                </label>
                <textarea
                  id="content"
                  name="content"
                  required
                  rows={4}
                  className="w-full px-4 py-3.5 rounded-xl bg-obsidian-800/50 border border-white/10 text-text-primary placeholder-text-muted focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 focus:bg-obsidian-800 outline-none transition-all resize-none"
                  placeholder={t('contact.form.messagePlaceholder')}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="w-full py-4 bg-gradient-to-r from-gold-400 via-gold-300 to-copper-400 text-obsidian-950 font-bold rounded-xl transition-all hover:shadow-glow-gold hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === 'loading' && (
                  <Loader2 className="animate-spin" size={20} />
                )}
                {status === 'success' && <CheckCircle size={20} />}
                {status === 'error' && <AlertCircle size={20} />}
                {status === 'idle' && <Send size={20} />}

                {status === 'idle' && t('contact.form.send')}
                {status === 'loading' && t('contact.form.sending')}
                {status === 'success' && t('contact.form.success')}
                {status === 'error' && t('contact.form.error')}

                {status === 'idle' && (
                  <ArrowRight size={16} className="ml-1" />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
