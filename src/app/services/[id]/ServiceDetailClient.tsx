'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Code,
  Smartphone,
  Globe,
  Database,
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Cloud,
  Shield,
  Zap,
  Layout,
  Server,
  Cpu,
  Wifi,
  Monitor,
} from 'lucide-react';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Services from '@/components/Services';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Service, LocalizedText } from '@/lib/db';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  code: Code,
  smartphone: Smartphone,
  globe: Globe,
  database: Database,
  cloud: Cloud,
  shield: Shield,
  zap: Zap,
  layout: Layout,
  server: Server,
  cpu: Cpu,
  wifi: Wifi,
  monitor: Monitor,
};

function stableIndex(input: string, modulo: number): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return modulo === 0 ? 0 : hash % modulo;
}

// Helper to get localized text
function getLocalizedText(text: LocalizedText | string | undefined, lang: 'tr' | 'en'): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  return text[lang] || text.tr || '';
}

export default function ServiceDetailClient({ service }: { service: Service }) {
  const { t, language } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const Icon = iconMap[service.icon] || Code;

  // Get localized content
  const serviceTitle = getLocalizedText(service.title, language);
  const serviceDescription = getLocalizedText(service.description, language);
  const serviceFullDescription = getLocalizedText(service.fullDescription, language);

  // Get localized features
  const features = service.features?.map(f => getLocalizedText(f, language)) || [];

  // Get localized FAQs
  const faqs = service.faq?.map(item => ({
    question: getLocalizedText(item.question, language),
    answer: getLocalizedText(item.answer, language),
  })) || [];

  const colorSchemes = [
    {
      gradient: 'from-info via-success to-accent-primary',
      iconBg: 'bg-info/15',
      iconColor: 'text-info',
      glow: 'rgba(94, 111, 234, 0.3)',
    },
    {
      gradient: 'from-success via-info to-accent-primary',
      iconBg: 'bg-success/15',
      iconColor: 'text-success',
      glow: 'rgba(71, 207, 134, 0.3)',
    },
    {
      gradient: 'from-danger via-warning to-info',
      iconBg: 'bg-danger/15',
      iconColor: 'text-danger',
      glow: 'rgba(255, 75, 123, 0.3)',
    },
  ];

  const colorScheme = colorSchemes[stableIndex(service.id, colorSchemes.length)] || colorSchemes[0];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 bg-white dark:bg-gray-950">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-orb-drift-1" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-info/10 rounded-full blur-3xl animate-orb-drift-2" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href="/#services"
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors mb-8 group"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">{t('serviceDetail.backToServices')}</span>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div
                  className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center mb-6 ${colorScheme.iconBg}`}
                  style={{ boxShadow: `0 0 40px ${colorScheme.glow}` }}
                >
                  <Icon size={48} className={colorScheme.iconColor} />
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6">
                  {serviceTitle}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {serviceFullDescription || serviceDescription}
                </p>
              </motion.div>

              {/* Right - Features */}
              {features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8"
                >
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {t('serviceDetail.features')}
                  </h3>
                  <ul className="space-y-4">
                    {features.map((feature, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${colorScheme.iconBg}`}
                        >
                          <Check size={14} className={colorScheme.iconColor} />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        {service.gallery && service.gallery.length > 0 && (
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center"
              >
                {t('serviceDetail.gallery')}
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {service.gallery.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative aspect-video rounded-2xl overflow-hidden group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt={`${serviceTitle} ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${colorScheme.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {faqs.length > 0 && (
          <section className="py-16 bg-white dark:bg-gray-950">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center"
              >
                {t('serviceDetail.faq')}
              </motion.h2>
              <div className="space-y-4">
                {faqs.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left"
                    >
                      <span className="font-semibold text-gray-900 dark:text-white">{item.question}</span>
                      {openFaq === index ? (
                        <ChevronUp size={20} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-500" />
                      )}
                    </button>
                    <motion.div
                      initial={false}
                      animate={{
                        height: openFaq === index ? 'auto' : 0,
                        opacity: openFaq === index ? 1 : 0,
                      }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-4 text-gray-600 dark:text-gray-400">{item.answer}</p>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Pricing Section */}
        {service.pricing && (
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('serviceDetail.pricing')}
                </h2>
                <div className="flex items-baseline justify-center gap-2 mb-6">
                  <span className="text-lg text-gray-500 dark:text-gray-400">
                    {t('serviceDetail.startingFrom')}
                  </span>
                  <span
                    className={`text-5xl font-black bg-gradient-to-r ${colorScheme.gradient} bg-clip-text text-transparent`}
                  >
                    {service.pricing.startingFrom}
                  </span>
                  <span className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                    {service.pricing.currency}
                  </span>
                </div>
                <Link
                  href="/#contact"
                  className={`inline-flex items-center px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r ${colorScheme.gradient} hover:shadow-lg hover:scale-105 transition-all duration-300`}
                >
                  {t('serviceDetail.getQuote')}
                </Link>
              </motion.div>
            </div>
          </section>
        )}

        {/* Services Section */}
        <Services />

        {/* CTA Section */}
        <section className="py-16 bg-white dark:bg-gray-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t('serviceDetail.ctaTitle')}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">{t('serviceDetail.ctaSubtitle')}</p>
              <Link
                href="/#contact"
                className="inline-flex items-center px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r from-info to-accent-primary hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                {t('cta.button')}
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
