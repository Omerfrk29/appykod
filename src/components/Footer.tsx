'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe, Twitter } from 'lucide-react';
import { settingsApi } from '@/lib/api/client';
import { handleSmoothScroll } from '@/lib/utils';
import { analytics } from '@/lib/analytics';
import type { SiteSettings } from '@/lib/db';

export default function Footer() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await settingsApi.get();
        if (response.success && response.data) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
    loadSettings();
  }, []);

  return (
    <footer className="bg-[#0F1117] text-white">
      {/* CTA Section */}
      <div className="py-24 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight">
            Ready to transform your
            <br />
            business?
          </h2>
          <p className="text-gray-400 mb-10 text-lg max-w-2xl mx-auto">
            Join hundreds of companies using AppyKod to build faster, safer, and
            smarter software.
          </p>
          <a
            href="#contact"
            onClick={(e) => {
              handleSmoothScroll(e, '#contact');
              analytics.ctaClick('footer-start-project');
            }}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-dark text-white px-10 py-4 rounded-lg font-bold text-lg shadow-lg shadow-secondary/25 hover:shadow-secondary/40 transition-all duration-300 hover:scale-[1.02]"
          >
            Start Your Project
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="font-bold text-xl tracking-tight">AppyKod</span>
            </div>

            {/* Copyright */}
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} AppyKod Inc. All rights reserved.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-gray-700 hover:border-gray-500 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                aria-label="Website"
              >
                <Globe size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-gray-700 hover:border-gray-500 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
