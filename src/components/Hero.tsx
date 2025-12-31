'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { handleSmoothScroll } from '@/lib/utils';
import { analytics } from '@/lib/analytics';
import AnimatedBlobs from './AnimatedBlobs';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden bg-[#0F1117]">
      {/* Animated Gradient Blobs - Canvas Based */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatedBlobs />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight">
              Discover the
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-accent-gold to-secondary">
                Projects
              </span>{' '}
              that We
              <br />
              Are Proud Of.
            </h1>

            <p className="text-lg text-gray-400 max-w-lg leading-relaxed">
              Aside from showing your experience and skill, case studies give
              your potential client or employer an idea of how you work and
              think.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="#contact"
                onClick={(e) => {
                  handleSmoothScroll(e, '#contact');
                  analytics.ctaClick('hero-get-in-touch');
                }}
                className="group inline-flex items-center gap-2 bg-secondary hover:bg-secondary-dark text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg shadow-secondary/25 hover:shadow-secondary/40 hover:scale-[1.02]"
              >
                Get In Touch
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button className="w-12 h-12 rounded-full border border-gray-700 hover:border-gray-500 flex items-center justify-center text-gray-400 hover:text-white transition-all hover:scale-105">
                <span className="text-2xl leading-none">+</span>
              </button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3 pt-4">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
                <span className="text-sm">+</span>
              </div>
              <p className="text-sm text-gray-500">
                Want to see the live website?{' '}
                <span className="text-secondary hover:underline cursor-pointer">
                  Visit company.com
                </span>
              </p>
            </div>
          </div>

          {/* Right Visual - Abstract Shapes */}
          <div className="relative hidden lg:flex items-center justify-center h-[600px]">
            {/* Main gradient card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-96 rounded-[40px] bg-gradient-to-b from-[#FFF5E6] to-[#E3FDF5] shadow-2xl rotate-3 z-10" />

            {/* Secondary shape */}
            <div className="absolute top-1/3 left-1/3 w-64 h-64 rounded-[32px] bg-gradient-to-br from-[#CD8C76] to-[#E89E92] shadow-xl -rotate-6 z-20 animate-float" />

            {/* Tertiary shape */}
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-[24px] bg-gradient-to-tr from-[#E89E92] to-[#FFD5A3] shadow-lg rotate-12 z-0 opacity-90" />

            {/* Small accent */}
            <div className="absolute top-1/4 right-1/3 w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-teal to-accent-purple shadow-md -rotate-12 z-30 opacity-80" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-gray-500">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-gray-500 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
