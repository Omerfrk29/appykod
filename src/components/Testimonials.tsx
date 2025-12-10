'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'CEO, TechStart',
    content:
      'Appykod transformed our vision into reality. Their attention to detail and technical expertise is unmatched. Highly recommended!',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Founder, GrowthIO',
    content:
      'The team delivered our project on time and within budget. The animations and dark mode implementation blew us away.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
  },
  {
    id: 3,
    name: 'Emily Davis',
    role: 'Marketing Director, CreativeMinds',
    content:
      'Professional, responsive, and incredibly talented. Our new website has significantly increased our conversion rates.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
  },
];

export default function Testimonials() {
  const { t } = useLanguage();
  
  return (
    <section className="py-24 bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, index) => {
            const gradients = [
              'linear-gradient(135deg, rgba(94, 111, 234, 0.1), rgba(0, 206, 209, 0.1))',
              'linear-gradient(135deg, rgba(71, 207, 134, 0.1), rgba(94, 111, 234, 0.1))',
              'linear-gradient(135deg, rgba(255, 75, 123, 0.1), rgba(251, 107, 78, 0.1))',
            ];
            const quoteColors = ['#5E6FEA', '#47CF86', '#FF4B7B'];
            const gradient = gradients[index % gradients.length];
            const quoteColor = quoteColors[index % quoteColors.length];
            
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl relative border border-gray-100 dark:border-gray-800 overflow-hidden group"
              >
                {/* Gradient Background */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: gradient }}
                />
                
                <motion.div
                  className="absolute top-8 right-8"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: index * 0.5,
                  }}
                >
                  <Quote size={48} style={{ color: `${quoteColor}30` }} />
                </motion.div>
                
                <div className="flex items-center space-x-1 mb-6 relative z-10">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + i * 0.1 }}
                      whileHover={{ scale: 1.2, rotate: 15 }}
                    >
                      <Star size={20} fill="#FB6B4E" style={{ color: '#FB6B4E' }} />
                    </motion.div>
                  ))}
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed italic relative z-10">
                  "{t.content}"
                </p>
                
                <div className="flex items-center space-x-4 relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all"
                    />
                  </motion.div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{t.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.role}</p>
                  </div>
                </div>
                
                {/* Glow Effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10"
                  style={{ backgroundColor: `${quoteColor}20` }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
