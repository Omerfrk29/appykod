'use client';

import { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );

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
    <section id="contact" className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
              {t('contact.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {t('contact.subtitle')}
            </p>
            {/* İletişim Bilgileri */}
            <div className="space-y-6">
              <motion.a
                href="tel:+905326102957"
                className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02, x: 10 }}
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-info rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('contact.info.phone')}</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">+90 (532) 610 2957</p>
                </div>
              </motion.a>

              <motion.a
                href="mailto:appykod@gmail.com"
                className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02, x: 10 }}
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-danger to-warning rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('contact.info.email')}</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">appykod@gmail.com</p>
                </div>
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700"
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <motion.label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  {t('contact.form.name')}
                </motion.label>
                <motion.input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder={t('contact.form.namePlaceholder')}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200 relative"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  whileFocus={{ scale: 1.02, borderColor: '#5E6FEA' }}
                  style={{
                    boxShadow: '0 0 0 0px rgba(94, 111, 234, 0)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(94, 111, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 0 0px rgba(94, 111, 234, 0)';
                  }}
                />
              </div>

              <div>
                <motion.label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  {t('contact.form.email')}
                </motion.label>
                <motion.input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder={t('contact.form.emailPlaceholder')}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  whileFocus={{ scale: 1.02, borderColor: '#00CED1' }}
                  style={{
                    boxShadow: '0 0 0 0px rgba(0, 206, 209, 0)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 206, 209, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 0 0px rgba(0, 206, 209, 0)';
                  }}
                />
              </div>

              <div>
                <motion.label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  {t('contact.form.message')}
                </motion.label>
                <motion.textarea
                  id="content"
                  name="content"
                  required
                  rows={5}
                  placeholder={t('contact.form.messagePlaceholder')}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200 resize-none"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  whileFocus={{ scale: 1.02, borderColor: '#47CF86' }}
                  style={{
                    boxShadow: '0 0 0 0px rgba(71, 207, 134, 0)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(71, 207, 134, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 0 0px rgba(71, 207, 134, 0)';
                  }}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className={`relative w-full flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-white transition-all duration-300 overflow-hidden ${
                  status === 'success'
                    ? 'bg-success hover:bg-success/90'
                    : status === 'error'
                    ? 'bg-danger hover:bg-danger/90'
                    : 'bg-gradient-to-r from-primary via-info to-danger shadow-lg hover:shadow-xl'
                }`}
                style={status === 'idle' ? {
                  backgroundSize: '200% 200%',
                } : {}}
                disabled={status === 'loading' || status === 'success'}
                animate={status === 'idle' ? {
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                } : {}}
                transition={status === 'idle' ? {
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                } : { type: "spring", stiffness: 400, damping: 17 }}
              >
                {status === 'idle' && (
                  <>
                    {t('contact.form.send')} <Send size={20} className="ml-2" />
                  </>
                )}
                {status === 'loading' && t('contact.form.sending')}
                {status === 'success' && (
                  <>
                    {t('contact.form.success')} <CheckCircle size={20} className="ml-2" />
                  </>
                )}
                {status === 'error' && (
                  <>
                    {t('contact.form.error')} <AlertCircle size={20} className="ml-2" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
