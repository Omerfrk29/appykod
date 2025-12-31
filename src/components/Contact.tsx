'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Send,
  CheckCircle,
  AlertCircle,
  Mail,
  Loader2,
  MapPin,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { analytics } from '@/lib/analytics';

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
    <section id="contact" className="py-24 bg-[#0F1117] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Content */}
          <div className="space-y-10">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {t('contact.title')}
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                {t('contact.subtitle')}
              </p>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/10 group-hover:border-secondary/20 transition-all">
                  <Mail className="text-secondary" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Email Us
                  </h3>
                  <a
                    href="mailto:appykod@gmail.com"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    appykod@gmail.com
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-purple/10 group-hover:border-accent-purple/20 transition-all">
                  <MapPin className="text-accent-purple" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Location
                  </h3>
                  <p className="text-gray-400">Izmir, Turkey</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div
            ref={formRef}
            className={`bg-[#1A1D26] rounded-3xl p-8 border border-white/5 shadow-2xl transition-all duration-700 ${
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
                  className="block text-sm font-medium text-gray-400 mb-2"
                >
                  {t('contact.form.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-secondary focus:bg-white/10 outline-none transition-all"
                  placeholder={t('contact.form.namePlaceholder')}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-400 mb-2"
                >
                  {t('contact.form.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-secondary focus:bg-white/10 outline-none transition-all"
                  placeholder={t('contact.form.emailPlaceholder')}
                />
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-400 mb-2"
                >
                  {t('contact.form.message')}
                </label>
                <textarea
                  id="content"
                  name="content"
                  required
                  rows={4}
                  className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-secondary focus:bg-white/10 outline-none transition-all resize-none"
                  placeholder={t('contact.form.messagePlaceholder')}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="w-full py-4 bg-secondary hover:bg-secondary-dark text-white font-bold rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-secondary/20"
              >
                {status === 'loading' && (
                  <Loader2 className="animate-spin" size={20} />
                )}
                {status === 'success' && <CheckCircle size={20} />}
                {status === 'error' && <AlertCircle size={20} />}

                {status === 'idle' && t('contact.form.send')}
                {status === 'loading' && t('contact.form.sending')}
                {status === 'success' && t('contact.form.success')}
                {status === 'error' && t('contact.form.error')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
