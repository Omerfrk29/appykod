'use client';

import { Globe, Smartphone, Palette, Code, Database, Shield, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ScrollReveal, { StaggerContainer, StaggerItem } from './ScrollReveal';

const services = [
  {
    id: 'web',
    title: 'Web Geliştirme',
    description:
      'Modern web teknolojileri ile hızlı, güvenli ve ölçeklenebilir web uygulamaları geliştiriyoruz. Next.js, React ve Node.js ile tam kapsamlı çözümler.',
    icon: Globe,
    featured: true,
    span: 'md:col-span-2 md:row-span-2',
  },
  {
    id: 'mobile',
    title: 'Mobil Uygulama',
    description:
      'iOS ve Android için native performanslı, kullanıcı dostu mobil uygulamalar.',
    icon: Smartphone,
    featured: false,
    span: 'md:col-span-1',
  },
  {
    id: 'uxui',
    title: 'UI/UX Tasarım',
    description:
      'Kullanıcı deneyimini ön plana alan, modern ve şık arayüz tasarımları.',
    icon: Palette,
    featured: false,
    span: 'md:col-span-1',
  },
  {
    id: 'backend',
    title: 'Backend Sistemler',
    description:
      'Güçlü ve güvenilir API\'lar, veritabanı tasarımı ve sunucu altyapısı.',
    icon: Database,
    featured: false,
    span: 'md:col-span-1',
  },
  {
    id: 'security',
    title: 'Güvenlik Danışmanlığı',
    description:
      'Penetrasyon testleri, güvenlik denetimleri ve en iyi güvenlik uygulamaları.',
    icon: Shield,
    featured: false,
    span: 'md:col-span-1',
  },
];

export default function Services() {
  const { t } = useLanguage();

  return (
    <section id="services" className="py-24 bg-bg-base relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-warm-glow opacity-30" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(245,158,11,0.03)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-accent-amber/10 border border-accent-amber/20 rounded-full text-accent-amber text-sm font-medium mb-4">
            Hizmetlerimiz
          </span>
          <h2 className="text-h2 font-bold text-text-primary mb-4">
            Dijital Dönüşümünüzü{' '}
            <span className="text-transparent bg-gradient-warm bg-clip-text">
              Hızlandırıyoruz
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-body-lg text-text-secondary">
            Modern teknolojiler ve yaratıcı çözümlerle işletmenizi geleceğe taşıyoruz.
          </p>
        </ScrollReveal>

        {/* Bento Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={100}>
          {services.map((service, index) => {
            const Icon = service.icon;
            const isFeatured = service.featured;

            return (
              <StaggerItem key={service.id} index={index} className={service.span}>
              <div
                className={`group relative rounded-3xl p-8 transition-all duration-500 cursor-pointer h-full ${
                  isFeatured
                    ? 'bg-glass-bg backdrop-blur-xl border border-accent-amber/30 shadow-glass-card hover:shadow-glass-card-hover hover:border-accent-amber/50'
                    : 'bg-bg-elevated/50 backdrop-blur-md border border-white/5 hover:border-glass-border-hover hover:bg-bg-elevated'
                }`}
                style={{
                  transform: 'perspective(1000px)',
                }}
              >
                {/* Gradient Glow for Featured */}
                {isFeatured && (
                  <div className="absolute inset-0 rounded-3xl bg-gradient-warm opacity-5 group-hover:opacity-10 transition-opacity" />
                )}

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
                    isFeatured
                      ? 'bg-gradient-warm shadow-glow-amber'
                      : 'bg-bg-surface border border-white/10 group-hover:bg-gradient-warm group-hover:border-transparent group-hover:shadow-glow-amber'
                  }`}
                >
                  <Icon
                    size={28}
                    className={`${
                      isFeatured
                        ? 'text-white'
                        : 'text-text-secondary group-hover:text-white'
                    } transition-colors`}
                  />
                </div>

                {/* Title */}
                <h3
                  className={`font-bold mb-3 transition-colors ${
                    isFeatured ? 'text-h3 text-text-primary' : 'text-xl text-text-primary'
                  }`}
                >
                  {service.title}
                </h3>

                {/* Description */}
                <p
                  className={`leading-relaxed mb-6 ${
                    isFeatured ? 'text-body text-text-secondary' : 'text-body-sm text-text-muted'
                  }`}
                >
                  {service.description}
                </p>

                {/* Arrow Button */}
                <div
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
                    isFeatured
                      ? 'border-accent-amber/30 text-accent-amber group-hover:bg-gradient-warm group-hover:text-white group-hover:border-transparent group-hover:shadow-glow-amber'
                      : 'border-white/10 text-text-muted group-hover:border-accent-amber/30 group-hover:text-accent-amber'
                  }`}
                >
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </div>

                {/* Hover Tilt Effect */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
                </div>
              </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
