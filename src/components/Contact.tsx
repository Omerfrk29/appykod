'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, CheckCircle, AlertCircle, Mail, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);
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
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  const focusColors: Record<string, string> = {
    name: 'focus:border-primary focus:shadow-[0_0_0_4px_rgba(94,111,234,0.15),0_0_30px_rgba(94,111,234,0.1)]',
    email: 'focus:border-info focus:shadow-[0_0_0_4px_rgba(0,206,209,0.15),0_0_30px_rgba(0,206,209,0.1)]',
    content: 'focus:border-success focus:shadow-[0_0_0_4px_rgba(71,207,134,0.15),0_0_30px_rgba(71,207,134,0.1)]',
  };

  return (
    <section id="contact" className="py-12 md:py-16 lg:py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-blob-1" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-info/5 rounded-full blur-3xl animate-blob-2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
          <div className="animate-fade-in-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 md:mb-6">
              {t('contact.title')}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 md:mb-8 leading-relaxed">
              {t('contact.subtitle')}
            </p>
            
            {/* Contact Info Cards */}
            <div className="space-y-3 md:space-y-4">
              <a
                href="mailto:appykod@gmail.com"
                className="flex items-center gap-3 md:gap-4 p-4 md:p-5 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:scale-[1.02] hover:translate-x-2 transition-all duration-300 group relative overflow-hidden"
                style={{ animationDelay: '100ms' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-danger/5 to-warning/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-danger to-warning rounded-2xl flex items-center justify-center group-hover:-rotate-6 transition-transform duration-300 shadow-[0_0_20px_rgba(255,75,123,0.3)]">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="relative z-10">
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('contact.info.email')}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">appykod@gmail.com</p>
                </div>
                <span className="absolute right-5 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 animate-arrow-bounce transition-opacity duration-300">→</span>
              </a>
            </div>
          </div>

          <div
            ref={formRef}
            className={`bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl shadow-2xl p-5 md:p-6 lg:p-8 border border-gray-100 dark:border-gray-700 relative overflow-hidden transition-all duration-700 ${
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            {/* Decorative corner gradient */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/20 to-info/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-danger/20 to-warning/20 rounded-full blur-3xl" />

            <form className="space-y-4 md:space-y-5 relative z-10" onSubmit={handleSubmit}>
              {/* Honeypot (botlar doldurur) */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />
              {/* Name Field */}
              <div className={`transition-all duration-300 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '100ms' }}>
                <label
                  htmlFor="name"
                  className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${focusedField === 'name' ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                >
                  {t('contact.form.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder={t('contact.form.namePlaceholder')}
                  className={`w-full px-4 py-3 md:px-5 md:py-4 rounded-xl md:rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all duration-300 text-sm md:text-base ${focusColors.name}`}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>

              {/* Email Field */}
              <div className={`transition-all duration-300 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '200ms' }}>
                <label
                  htmlFor="email"
                  className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${focusedField === 'email' ? 'text-info' : 'text-gray-700 dark:text-gray-300'}`}
                >
                  {t('contact.form.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder={t('contact.form.emailPlaceholder')}
                  className={`w-full px-4 py-3 md:px-5 md:py-4 rounded-xl md:rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all duration-300 text-sm md:text-base ${focusColors.email}`}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>

              {/* Message Field */}
              <div className={`transition-all duration-300 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '300ms' }}>
                <label
                  htmlFor="content"
                  className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${focusedField === 'content' ? 'text-success' : 'text-gray-700 dark:text-gray-300'}`}
                >
                  {t('contact.form.message')}
                </label>
                <textarea
                  id="content"
                  name="content"
                  required
                  rows={5}
                  placeholder={t('contact.form.messagePlaceholder')}
                  className={`w-full px-4 py-3 md:px-5 md:py-4 rounded-xl md:rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all duration-300 resize-none text-sm md:text-base ${focusColors.content}`}
                  onFocus={() => setFocusedField('content')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>

              {/* Submit Button */}
              <div className={`transition-all duration-300 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '400ms' }}>
                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className={`relative w-full flex items-center justify-center px-6 py-4 md:px-8 md:py-5 text-base md:text-lg font-extrabold rounded-xl md:rounded-2xl text-white transition-all duration-500 overflow-hidden hover:scale-[1.02] hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed ${
                    status === 'success'
                      ? 'bg-success'
                      : status === 'error'
                      ? 'bg-danger'
                      : 'bg-gradient-to-r from-primary via-info to-danger'
                  }`}
                  style={status === 'idle' || status === 'loading' ? { backgroundSize: '200% 200%' } : {}}
                >
                  {/* Animated gradient background */}
                  {(status === 'idle' || status === 'loading') && (
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-primary via-info via-success to-danger animate-gradient-x"
                      style={{ backgroundSize: '300% 100%' }}
                    />
                  )}
                  {/* Shine effect */}
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine-button"
                    style={{ backgroundSize: '200% 100%' }}
                  />
                  {/* Glow */}
                  <div
                    className="absolute -inset-1 rounded-2xl opacity-50 blur-xl"
                    style={{
                      background: status === 'success'
                        ? 'rgba(71, 207, 134, 0.5)'
                        : status === 'error'
                        ? 'rgba(255, 75, 123, 0.5)'
                        : 'linear-gradient(90deg, rgba(94, 111, 234, 0.5), rgba(0, 206, 209, 0.5))',
                    }}
                  />
                  <span className="relative z-10 flex items-center gap-3">
                    {status === 'idle' && (
                      <>
                        {t('contact.form.send')}
                        <Send size={22} className="animate-arrow-bounce" />
                      </>
                    )}
                    {status === 'loading' && (
                      <>
                        {t('contact.form.sending')}
                        <Loader2 size={22} className="animate-spin" />
                      </>
                    )}
                    {status === 'success' && (
                      <>
                        {t('contact.form.success')}
                        <CheckCircle size={22} />
                      </>
                    )}
                    {status === 'error' && (
                      <>
                        {t('contact.form.error')}
                        <AlertCircle size={22} className="animate-wiggle" />
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
