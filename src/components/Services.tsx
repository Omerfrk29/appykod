'use client';

import { Layout, Palette, Code, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const services = [
  {
    id: 'uxui',
    title: 'Flawless',
    subtitle: 'UX/UI',
    description:
      'An exceptional user experience is essential for a product to work. In this regard we strive to deliver outstanding experiences.',
    icon: Layout,
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-600',
    hoverBg: 'group-hover:bg-cyan-500',
    featured: false,
  },
  {
    id: 'graphics',
    title: 'Custom',
    subtitle: 'Graphics',
    description:
      'A unique design must align to the brand\'s personality and stand out in the market through originality, visual balance and awesome information flow.',
    icon: Palette,
    iconBg: 'bg-white/20',
    iconColor: 'text-white',
    hoverBg: '',
    featured: true,
  },
  {
    id: 'development',
    title: 'Best',
    subtitle: 'Developers',
    description:
      'We have the best developers on every project in hand. They are professionals offering code quality and maintenance after the jobs done.',
    icon: Code,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    hoverBg: 'group-hover:bg-purple-500',
    featured: false,
  },
];

export default function Services() {
  const { t } = useLanguage();

  return (
    <section id="services" className="py-24 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-16 mb-20">
          {/* Left Label */}
          <div className="flex-shrink-0">
            <h3 className="text-lg font-bold text-gray-400 uppercase tracking-wider">
              Our
              <br />
              Approach
            </h3>
          </div>

          {/* Right Title */}
          <div className="flex-1 max-w-3xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              We Make Every Project Feel
              <br />
              Personal because
              <br />
              <span className="inline-flex items-center gap-4">
                <span className="text-secondary relative">
                  Our Clients Matter.
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-secondary/30" />
                </span>
                <svg
                  className="w-8 h-8 lg:w-10 lg:h-10 text-cyan-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>
            </h2>
          </div>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isFeatured = service.featured;

            return (
              <div
                key={service.id}
                className={`group relative rounded-[32px] p-8 transition-all duration-500 ${
                  isFeatured
                    ? 'bg-secondary hover:bg-secondary-dark text-white shadow-2xl shadow-secondary/20 md:-mt-8 md:mb-8 scale-[1.02]'
                    : 'bg-white hover:shadow-2xl shadow-lg border border-gray-100 md:mt-8'
                }`}
              >
                {/* Decorative circle for featured card */}
                {isFeatured && (
                  <div className="absolute top-4 right-4 opacity-20">
                    <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="6 6"
                        className="animate-spin-slow"
                        style={{ animationDuration: '20s' }}
                      />
                    </svg>
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 ${
                    isFeatured
                      ? 'bg-white/20 border-2 border-white/30 border-dashed'
                      : `${service.iconBg} ${service.hoverBg} group-hover:text-white`
                  }`}
                >
                  <Icon
                    size={28}
                    className={isFeatured ? 'text-white' : service.iconColor}
                  />
                </div>

                {/* Title */}
                <h3
                  className={`text-2xl font-bold mb-4 ${
                    isFeatured ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {service.title}
                  <br />
                  {service.subtitle}
                </h3>

                {/* Description */}
                <p
                  className={`leading-relaxed mb-8 text-sm ${
                    isFeatured ? 'text-white/80' : 'text-gray-500'
                  }`}
                >
                  {service.description}
                </p>

                {/* Arrow Button */}
                <div
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 cursor-pointer ${
                    isFeatured
                      ? 'border-white/30 text-white hover:bg-white hover:text-secondary'
                      : `border-gray-200 text-gray-400 ${service.hoverBg} group-hover:text-white group-hover:border-transparent`
                  }`}
                >
                  <ArrowRight size={16} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
