'use client';

import { useState, useRef } from 'react';
import { Send, CheckCircle, AlertCircle, Phone, Mail, Loader2 } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(formRef, { once: true, margin: '-100px' });

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

  return (
    <section id="contact" className="py-12 md:py-16 lg:py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-info/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 md:mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {t('contact.title')}
            </motion.h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 md:mb-8 leading-relaxed">
              {t('contact.subtitle')}
            </p>
            {/* Contact Info Cards */}
            <div className="space-y-3 md:space-y-4">
              <motion.a
                href="tel:+905326102957"
                className="flex items-center gap-3 md:gap-4 p-4 md:p-5 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02, x: 8 }}
              >
                {/* Hover gradient overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/5 to-info/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                <motion.div
                  className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-primary to-info rounded-2xl flex items-center justify-center relative"
                  whileHover={{ rotate: 10 }}
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(94, 111, 234, 0)',
                      '0 0 20px 5px rgba(94, 111, 234, 0.3)',
                      '0 0 0 0 rgba(94, 111, 234, 0)',
                    ],
                  }}
                  transition={{
                    boxShadow: { duration: 2, repeat: Infinity },
                  }}
                >
                  <Phone className="w-6 h-6 text-white" />
                </motion.div>
                <div className="relative z-10">
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('contact.info.phone')}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">+90 (532) 610 2957</p>
                </div>
                {/* Arrow indicator */}
                <motion.span
                  className="absolute right-5 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.a>

              <motion.a
                href="mailto:appykod@gmail.com"
                className="flex items-center gap-3 md:gap-4 p-4 md:p-5 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02, x: 8 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-danger/5 to-warning/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                <motion.div
                  className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-danger to-warning rounded-2xl flex items-center justify-center"
                  whileHover={{ rotate: -10 }}
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(255, 75, 123, 0)',
                      '0 0 20px 5px rgba(255, 75, 123, 0.3)',
                      '0 0 0 0 rgba(255, 75, 123, 0)',
                    ],
                  }}
                  transition={{
                    boxShadow: { duration: 2, repeat: Infinity, delay: 0.5 },
                  }}
                >
                  <Mail className="w-6 h-6 text-white" />
                </motion.div>
                <div className="relative z-10">
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('contact.info.email')}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">appykod@gmail.com</p>
                </div>
                <motion.span
                  className="absolute right-5 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            ref={formRef}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl shadow-2xl p-5 md:p-6 lg:p-8 border border-gray-100 dark:border-gray-700 relative overflow-hidden"
          >
            {/* Decorative corner gradient */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/20 to-info/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-danger/20 to-warning/20 rounded-full blur-3xl" />

            <form className="space-y-4 md:space-y-5 relative z-10" onSubmit={handleSubmit}>
              {/* Name Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 }}
                className="relative"
              >
                <label
                  htmlFor="name"
                  className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                    focusedField === 'name' ? 'text-primary' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {t('contact.form.name')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder={t('contact.form.namePlaceholder')}
                    className="w-full px-4 py-3 md:px-5 md:py-4 rounded-xl md:rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary focus:ring-0 outline-none transition-all duration-300 text-sm md:text-base"
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                  />
                  {/* Glow effect on focus */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    animate={{
                      boxShadow: focusedField === 'name'
                        ? '0 0 0 4px rgba(94, 111, 234, 0.15), 0 0 30px rgba(94, 111, 234, 0.1)'
                        : '0 0 0 0px rgba(94, 111, 234, 0)',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <label
                  htmlFor="email"
                  className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                    focusedField === 'email' ? 'text-info' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {t('contact.form.email')}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder={t('contact.form.emailPlaceholder')}
                    className="w-full px-4 py-3 md:px-5 md:py-4 rounded-xl md:rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:border-info focus:ring-0 outline-none transition-all duration-300 text-sm md:text-base"
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    animate={{
                      boxShadow: focusedField === 'email'
                        ? '0 0 0 4px rgba(0, 206, 209, 0.15), 0 0 30px rgba(0, 206, 209, 0.1)'
                        : '0 0 0 0px rgba(0, 206, 209, 0)',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>

              {/* Message Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                <label
                  htmlFor="content"
                  className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                    focusedField === 'content' ? 'text-success' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {t('contact.form.message')}
                </label>
                <div className="relative">
                  <textarea
                    id="content"
                    name="content"
                    required
                    rows={5}
                    placeholder={t('contact.form.messagePlaceholder')}
                    className="w-full px-4 py-3 md:px-5 md:py-4 rounded-xl md:rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:border-success focus:ring-0 outline-none transition-all duration-300 resize-none text-sm md:text-base"
                    onFocus={() => setFocusedField('content')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    animate={{
                      boxShadow: focusedField === 'content'
                        ? '0 0 0 4px rgba(71, 207, 134, 0.15), 0 0 30px rgba(71, 207, 134, 0.1)'
                        : '0 0 0 0px rgba(71, 207, 134, 0)',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  whileHover={{ scale: 1.02, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className={`relative w-full flex items-center justify-center px-6 py-4 md:px-8 md:py-5 text-base md:text-lg font-extrabold rounded-xl md:rounded-2xl text-white transition-all duration-500 overflow-hidden ${
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
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary via-info via-success to-danger"
                      style={{ backgroundSize: '300% 100%' }}
                      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    />
                  )}
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                  />
                  {/* Glow */}
                  <motion.div
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
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Send size={22} />
                        </motion.span>
                      </>
                    )}
                    {status === 'loading' && (
                      <>
                        {t('contact.form.sending')}
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Loader2 size={22} />
                        </motion.span>
                      </>
                    )}
                    {status === 'success' && (
                      <>
                        {t('contact.form.success')}
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <CheckCircle size={22} />
                        </motion.span>
                      </>
                    )}
                    {status === 'error' && (
                      <>
                        {t('contact.form.error')}
                        <motion.span
                          animate={{ x: [-2, 2, -2, 2, 0] }}
                          transition={{ duration: 0.4 }}
                        >
                          <AlertCircle size={22} />
                        </motion.span>
                      </>
                    )}
                  </span>
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
