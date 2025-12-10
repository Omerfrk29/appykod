'use client';

import Logo from './Logo';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="flex items-center space-x-2">
              <Logo />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {t('footer.tagline')}
            </p>
          </div>

          <div className="flex items-center space-x-6">
            {/* Social Links placeholder */}
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 text-center md:text-left">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} Appykod. {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
