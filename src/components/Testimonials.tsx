'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { testimonialsApi } from '@/lib/api/client';
import type { Testimonial, LocalizedText } from '@/lib/db';
import ScrollReveal, { StaggerContainer, StaggerItem } from './ScrollReveal';

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
    <section className="py-24 bg-bg-elevated relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-warm-glow opacity-10" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(245,158,11,0.02)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-accent-amber/10 border border-accent-amber/20 rounded-full text-accent-amber text-sm font-medium mb-4">
            Referanslar
          </span>
          <h2 className="text-h2 font-bold text-text-primary mb-4">
            Müşterilerimiz{' '}
            <span className="text-transparent bg-gradient-warm bg-clip-text">
              Ne Diyor?
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-body-lg text-text-secondary">
            Birlikte çalıştığımız müşterilerimizin değerli görüşleri.
          </p>
        </ScrollReveal>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-accent-amber border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={100}>
            {testimonials.map((testimonial, index) => (
              <StaggerItem key={testimonial.id} index={index}>
              <div
                className="group relative bg-glass-bg backdrop-blur-xl p-8 rounded-3xl border border-white/5 hover:border-glass-border-hover transition-all duration-500 hover:shadow-glass-card-hover h-full"
              >
                {/* Quote Icon - Amber Gradient */}
                <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-40 transition-opacity">
                  <Quote size={40} className="text-accent-amber" />
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="text-accent-amber fill-accent-amber"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-text-secondary mb-8 leading-relaxed relative z-10">
                  &ldquo;{getLocalizedText(testimonial.content, language)}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  {/* Avatar with Amber Ring */}
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-warm rounded-full opacity-50 blur-sm group-hover:opacity-80 transition-opacity" />
                    <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-accent-amber/30 group-hover:ring-accent-amber/60 transition-all">
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
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary group-hover:text-transparent group-hover:bg-gradient-warm group-hover:bg-clip-text transition-all">
                      {getLocalizedText(testimonial.name, language)}
                    </h4>
                    <p className="text-sm text-text-muted">
                      {getLocalizedText(testimonial.role, language)}
                    </p>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-amber/5 to-transparent rounded-3xl" />
                </div>
              </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
}
