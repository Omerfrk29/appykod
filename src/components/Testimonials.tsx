'use client';

import Image from 'next/image';
import { Star, Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'CEO, TechStart',
    content: 'Appykod transformed our vision into reality. Their attention to detail and technical expertise is unmatched. Highly recommended!',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Founder, GrowthIO',
    content: 'The team delivered our project on time and within budget. The animations and dark mode implementation blew us away.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
  },
  {
    id: 3,
    name: 'Emily Davis',
    role: 'Marketing Director, CreativeMinds',
    content: 'Professional, responsive, and incredibly talented. Our new website has significantly increased our conversion rates.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
  },
];

export default function Testimonials() {
  const { t } = useLanguage();
  
  const gradients = [
    'bg-gradient-to-br from-primary/10 to-info/10',
    'bg-gradient-to-br from-success/10 to-primary/10',
    'bg-gradient-to-br from-danger/10 to-warning/10',
  ];
  const quoteColors = ['text-primary/30', 'text-success/30', 'text-danger/30'];
  const glowColors = ['group-hover:shadow-[0_0_30px_rgba(94,111,234,0.2)]', 'group-hover:shadow-[0_0_30px_rgba(71,207,134,0.2)]', 'group-hover:shadow-[0_0_30px_rgba(255,75,123,0.2)]'];

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
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                
                <div className="flex items-center space-x-4 relative z-10">
                  <div className="relative w-12 h-12 hover:scale-110 hover:rotate-3 transition-transform duration-200">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      sizes="48px"
                      className="rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
