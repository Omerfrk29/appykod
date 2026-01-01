'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Globe, Smartphone, Palette, Database, Shield, ArrowRight, Loader2, Code, Cloud, Zap, Layout, Server, Cpu, Wifi, Monitor } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ScrollReveal, { StaggerContainer, StaggerItem } from './ScrollReveal';
import type { Service } from '@/lib/db';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  globe: Globe,
  smartphone: Smartphone,
  palette: Palette,
  database: Database,
  shield: Shield,
  code: Code,
  cloud: Cloud,
  zap: Zap,
  layout: Layout,
  server: Server,
  cpu: Cpu,
  wifi: Wifi,
  monitor: Monitor,
};

const serviceConfig: Record<string, { span: string }> = {
  web: { span: 'md:col-span-2 md:row-span-2' },
  mobile: { span: 'md:col-span-1' },
  uxui: { span: 'md:col-span-1' },
  backend: { span: 'md:col-span-1' },
  security: { span: 'md:col-span-1' },
};

// Fallback service IDs for backward compatibility
const fallbackServiceIds = ['web', 'mobile', 'uxui', 'backend', 'security'];

export default function Services() {
  const { t, language } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (data.success && data.data?.length > 0) {
          setServices(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  // Use fetched services or fallback to locale-based services
  const displayServices = services.length > 0
    ? services.map((s) => ({
        id: s.id,
        title: typeof s.title === 'object' ? s.title[language] : s.title,
        description: typeof s.description === 'object' ? s.description[language] : s.description,
        icon: iconMap[s.icon] || Globe,
        featured: s.id === 'web',
        span: serviceConfig[s.id]?.span || 'md:col-span-1',
      }))
    : fallbackServiceIds.map((id) => ({
        id,
        title: t(`services.items.${id}.title`),
        description: t(`services.items.${id}.description`),
        icon: iconMap[id === 'web' ? 'globe' : id === 'mobile' ? 'smartphone' : id === 'uxui' ? 'palette' : id === 'backend' ? 'database' : 'shield'] || Globe,
        featured: id === 'web',
        span: serviceConfig[id]?.span || 'md:col-span-1',
      }));

  if (loading) {
    return (
      <section id="services" className="py-24 bg-bg-base relative overflow-hidden flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-accent-amber" />
      </section>
    );
  }

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
            {t('services.badge')}
          </span>
          <h2 className="text-h2 font-bold text-text-primary mb-4">
            {t('services.titleMain')}{' '}
            <span className="text-transparent bg-gradient-warm bg-clip-text">
              {t('services.titleHighlight')}
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-body-lg text-text-secondary">
            {t('services.subtitleText')}
          </p>
        </ScrollReveal>

        {/* Bento Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={100}>
          {displayServices.map((service, index) => {
            const Icon = service.icon;
            const isFeatured = service.featured;

            return (
              <StaggerItem key={service.id} index={index} className={service.span}>
              <Link
                href={`/services/${service.id}`}
                className="block h-full"
              >
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
              </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
