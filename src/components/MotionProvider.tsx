'use client';

import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion';
import { ReactNode } from 'react';

interface MotionProviderProps {
  children: ReactNode;
}

/**
 * MotionProvider - Framer Motion performans optimizasyonu
 * 
 * LazyMotion: DOM animasyonları için gerekli özellikleri lazy load eder
 * MotionConfig: Reduced motion tercihini otomatik olarak uygular
 * 
 * Not: strict mode kaldırıldı çünkü mevcut componentler motion kullanıyor.
 * Full tree-shaking için tüm motion -> m değişikliği gerekir.
 */
export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}

