'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { testimonialsApi } from '@/lib/api/client';
import type { Testimonial, LocalizedText } from '@/lib/db';

const defaultImages = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
];

function getLocalizedText(text: LocalizedText | string | undefined, lang: 'tr' | 'en'): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  return text[lang] || text.tr || '';
}

export default function Testimonials() {
  const { t, language } = useLanguage();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const response = await testimonialsApi.getAll();
        if (response.success && response.data) {
          setTestimonials(response.data);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  const gradients = [
    'bg-gradient-to-br from-primary/10 to-info/10',
    'bg-gradient-to-br from-success/10 to-primary/10',
    'bg-gradient-to-br from-danger/10 to-warning/10',
  ];
  const quoteColors = ['text-primary/30', 'text-success/30', 'text-danger/30'];
  const glowColors = ['group-hover:shadow-[0_0_30px_rgba(94,111,234,0.2)]', 'group-hover:shadow-[0_0_30px_rgba(71,207,134,0.2)]', 'group-hover:shadow-[0_0_30px_rgba(255,75,123,0.2)]'];

  // Don't render section if no testimonials
  if (!loading && testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            {t('testimonials.subtitle')}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 animate-pulse"
              >
                <div className="flex space-x-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded" />
                  ))}
                </div>
                <div className="space-y-3 mb-8">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
              >
                <div
                  className={`bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl relative border border-gray-100 dark:border-gray-800 overflow-hidden group hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 ${glowColors[index % glowColors.length]}`}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${gradients[index % gradients.length]}`} />
                  
                  {/* Quote icon */}
                  <div className={`absolute top-8 right-8 ${quoteColors[index % quoteColors.length]} group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300`}>
                    <Quote size={48} />
                  </div>
                  
                  {/* Stars */}
                  <div className="flex items-center space-x-1 mb-6 relative z-10">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="hover:scale-125 hover:rotate-12 transition-transform duration-200"
                        style={{ animationDelay: `${index * 100 + i * 100}ms` }}
                      >
                        <Star size={20} fill="#FB6B4E" className="text-warning" />
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed italic relative z-10">
                    &ldquo;{getLocalizedText(testimonial.content, language)}&rdquo;
                  </p>
                  
                  <div className="flex items-center space-x-4 relative z-10">
                    <div className="relative w-12 h-12 hover:scale-110 hover:rotate-3 transition-transform duration-200">
                      <Image
                        src={testimonial.imageUrl || defaultImages[index % defaultImages.length]}
                        alt={getLocalizedText(testimonial.name, language)}
                        fill
                        sizes="48px"
                        className="rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        {getLocalizedText(testimonial.name, language)}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {getLocalizedText(testimonial.role, language)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
