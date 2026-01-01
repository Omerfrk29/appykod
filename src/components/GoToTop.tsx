'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function GoToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // 300px scroll sonrası butonu göster
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-glass-bg backdrop-blur-xl border border-accent-amber/30 shadow-glass-card hover:shadow-glass-card-hover hover:border-accent-amber/50 hover:bg-gradient-warm hover:text-white transition-all duration-300 flex items-center justify-center group"
      aria-label="Yukarı çık"
    >
      <ChevronUp 
        size={24} 
        className="text-accent-amber group-hover:text-white transition-colors duration-300" 
      />
    </button>
  );
}

