'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Code, Smartphone, Globe, Database, ArrowLeft, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Service } from '@/lib/db';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  code: Code,
  smartphone: Smartphone,
  globe: Globe,
  database: Database,
};

export default function ServiceDetailPage() {
  const params = useParams();
  const { t, language } = useLanguage();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    async function fetchService() {
      try {
        const res = await fetch(`/api/services/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setService(data);
        }
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchService();
  }, [params.id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="animate-pulse space-y-8">
              <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl w-1/3" />
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!service) {
    notFound();
  }

  const Icon = iconMap[service.icon] || Code;

  const colorSchemes = [
    { gradient: 'from-primary via-info to-success', iconBg: 'bg-primary/15', iconColor: 'text-primary', glow: 'rgba(94, 111, 234, 0.3)' },
    { gradient: 'from-success via-primary to-info', iconBg: 'bg-success/15', iconColor: 'text-success', glow: 'rgba(71, 207, 134, 0.3)' },
    { gradient: 'from-danger via-warning to-primary', iconBg: 'bg-danger/15', iconColor: 'text-danger', glow: 'rgba(255, 75, 123, 0.3)' },
  ];

  const colorScheme = colorSchemes[parseInt(service.id) % colorSchemes.length] || colorSchemes[0];

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
                  {service.title}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  {service.fullDescription || service.description}
                </p>
              </motion.div>

              {/* Right - Features */}
              {service.features && service.features.length > 0 && (
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
                    {service.features.map((feature, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${colorScheme.iconBg}`}>
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
                      alt={`${service.title} ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${colorScheme.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {service.faq && service.faq.length > 0 && (
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
                {service.faq.map((item, index) => (
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
                      animate={{ height: openFaq === index ? 'auto' : 0, opacity: openFaq === index ? 1 : 0 }}
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
                  <span className="text-lg text-gray-500 dark:text-gray-400">{t('serviceDetail.startingFrom')}</span>
                  <span className={`text-5xl font-black bg-gradient-to-r ${colorScheme.gradient} bg-clip-text text-transparent`}>
                    {service.pricing.startingFrom}
                  </span>
                  <span className="text-2xl font-bold text-gray-700 dark:text-gray-300">{service.pricing.currency}</span>
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

        {/* CTA Section */}
        <section className="py-16 bg-white dark:bg-gray-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t('serviceDetail.ctaTitle')}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                {t('serviceDetail.ctaSubtitle')}
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r from-primary to-info hover:shadow-lg hover:scale-105 transition-all duration-300"
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


