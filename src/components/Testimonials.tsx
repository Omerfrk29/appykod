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

function getLocalizedText(
  text: LocalizedText | string | undefined,
  lang: 'tr' | 'en'
): string {
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

  if (!loading && testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-500">
            {t('testimonials.subtitle')}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 relative group"
              >
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 text-gray-100 group-hover:text-secondary/10 transition-colors">
                  <Quote size={40} />
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="text-secondary fill-secondary"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-600 mb-8 leading-relaxed relative z-10">
                  &ldquo;{getLocalizedText(testimonial.content, language)}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                    <Image
                      src={
                        testimonial.imageUrl ||
                        defaultImages[index % defaultImages.length]
                      }
                      alt={getLocalizedText(testimonial.name, language)}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {getLocalizedText(testimonial.name, language)}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {getLocalizedText(testimonial.role, language)}
                    </p>
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
