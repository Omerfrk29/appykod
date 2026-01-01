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
    <section id="contact" className="py-24 bg-bg-base relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-warm-glow opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(245,158,11,0.02)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-accent-amber/10 border border-accent-amber/20 rounded-full text-accent-amber text-sm font-medium mb-4">
            {t('contact.badge')}
          </span>
          <h2 className="text-h2 font-bold text-text-primary mb-4">
            {t('contact.titleMain')}{' '}
            <span className="text-transparent bg-gradient-warm bg-clip-text">
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
                  <div className="group flex items-start gap-4 p-6 bg-glass-bg backdrop-blur-xl rounded-2xl border border-white/5 hover:border-glass-border-hover transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-gradient-warm flex items-center justify-center flex-shrink-0 shadow-glow-amber">
                      <Icon className="text-white" size={22} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-text-muted mb-1">
                        {label}
                      </h3>
                      <p className="text-text-primary font-medium group-hover:text-accent-amber transition-colors">
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

            {/* Additional CTA */}
            <div className="p-6 bg-gradient-warm-soft rounded-2xl border border-accent-amber/20">
              <h3 className="text-lg font-bold text-text-primary mb-2">
                {t('contact.guarantee.title')}
              </h3>
              <p className="text-text-secondary text-sm">
                {t('contact.guarantee.description')}
              </p>
            </div>
          </ScrollReveal>

          {/* Right Form */}
          <div
            ref={formRef}
            className={`bg-glass-bg backdrop-blur-xl rounded-3xl p-8 border border-white/5 shadow-glass-card transition-all duration-700 ${
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
                  className="w-full px-4 py-3.5 rounded-xl bg-bg-surface/50 border border-white/10 text-text-primary placeholder-text-muted focus:border-accent-amber focus:ring-2 focus:ring-accent-amber/20 focus:bg-bg-surface outline-none transition-all"
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
                  className="w-full px-4 py-3.5 rounded-xl bg-bg-surface/50 border border-white/10 text-text-primary placeholder-text-muted focus:border-accent-amber focus:ring-2 focus:ring-accent-amber/20 focus:bg-bg-surface outline-none transition-all"
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
                  className="w-full px-4 py-3.5 rounded-xl bg-bg-surface/50 border border-white/10 text-text-primary placeholder-text-muted focus:border-accent-amber focus:ring-2 focus:ring-accent-amber/20 focus:bg-bg-surface outline-none transition-all resize-none"
                  placeholder={t('contact.form.messagePlaceholder')}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="w-full py-4 bg-gradient-warm text-white font-bold rounded-xl transition-all hover:shadow-glow-amber hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
