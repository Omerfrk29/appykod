'use client';

import Logo from './Logo';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Heart, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub', color: '#333' },
    { icon: Twitter, href: '#', label: 'Twitter', color: '#1DA1F2' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: '#0A66C2' },
  ];

  return (
    <footer className="bg-white dark:bg-gray-950 transition-colors duration-300 relative overflow-hidden">
      {/* Animated gradient divider at top */}
      <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden">
        <motion.div
          className="h-full w-full"
          style={{
            background: 'linear-gradient(90deg, #5E6FEA, #00CED1, #47CF86, #FB6B4E, #FF4B7B, #5E6FEA)',
            backgroundSize: '200% 100%',
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -bottom-32 -left-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 w-64 h-64 bg-info/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 18, repeat: Infinity }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Logo & Tagline */}
          <motion.div
            className="flex flex-col items-center md:items-start space-y-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <Logo />
            </motion.div>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs text-center md:text-left">
              {t('footer.tagline')}
            </p>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-white transition-all duration-300 relative overflow-hidden group"
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Hover background */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: social.color }}
                />
                <social.icon size={20} className="relative z-10" />
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Bottom section with animated border */}
        <motion.div
          className="mt-6 md:mt-8 pt-6 md:pt-8 relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {/* Gradient border line */}
          <div className="absolute top-0 left-1/4 right-1/4 h-px overflow-hidden">
            <motion.div
              className="h-full w-full"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(94, 111, 234, 0.5), rgba(0, 206, 209, 0.5), transparent)',
              }}
            />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-center md:text-left">
            <motion.p
              className="text-sm text-gray-400 dark:text-gray-500 flex items-center gap-1"
              whileHover={{ scale: 1.02 }}
            >
              &copy; {new Date().getFullYear()} Appykod. {t('footer.copyright')}
            </motion.p>

            <motion.p
              className="text-sm text-gray-400 dark:text-gray-500 flex items-center gap-1"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Made with
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Heart size={14} className="text-danger fill-danger" />
              </motion.span>
              in Turkey
            </motion.p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
