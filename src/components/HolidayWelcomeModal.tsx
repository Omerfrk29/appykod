'use client';

import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

const STORAGE_KEY = 'holiday_modal_seen_2025';

const CONFETTI_COLORS = [
  '#ff0000', '#00ff00', '#ffd700', '#ff69b4',
  '#00bfff', '#ff8c00', '#9400d3', '#00fa9a',
];

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  drift: number;
  size: number;
  shape: 'square' | 'circle' | 'triangle';
}

export default function HolidayWelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const generateConfetti = useCallback(() => {
    const pieces: ConfettiPiece[] = [];
    const shapes: Array<'square' | 'circle' | 'triangle'> = ['square', 'circle', 'triangle'];

    for (let i = 0; i < 100; i++) {
      pieces.push({
        id: i,
        x: Math.random() * 100,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 2,
        drift: (Math.random() - 0.5) * 200,
        size: 8 + Math.random() * 8,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      });
    }

    setConfetti(pieces);
  }, []);

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Check if modal was already seen
    const hasSeenModal = localStorage.getItem(STORAGE_KEY);

    if (!hasSeenModal && !mediaQuery.matches) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
        generateConfetti();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [generateConfetti]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  if (!isOpen || prefersReducedMotion) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="holiday-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className="absolute animate-confetti-fall"
            style={{
              left: `${piece.x}%`,
              top: '-20px',
              width: piece.size,
              height: piece.size,
              backgroundColor: piece.color,
              borderRadius: piece.shape === 'circle' ? '50%' : piece.shape === 'triangle' ? '0' : '2px',
              clipPath: piece.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              ['--confetti-drift' as string]: `${piece.drift}px`,
            }}
          />
        ))}
      </div>

      {/* Modal Content */}
      <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-green-700
                      rounded-3xl p-1 shadow-2xl max-w-md mx-4 animate-fade-in-up">
        <div className="bg-white dark:bg-gray-900 rounded-[22px] p-8 text-center">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600
                       dark:hover:text-gray-300 transition-colors p-1 rounded-full
                       hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Kapat"
          >
            <X size={24} />
          </button>

          {/* Decorations */}
          <div className="text-6xl mb-4 animate-bounce-gentle">
            🎄
          </div>

          {/* Title */}
          <h2
            id="holiday-modal-title"
            className="text-3xl font-bold mb-3 animate-holiday-shimmer"
          >
            Mutlu Yıllar!
          </h2>

          {/* Subtitle */}
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
            2025 yılının size sağlık, mutluluk ve başarı getirmesini diliyoruz!
          </p>

          {/* Emoji row */}
          <div className="flex justify-center gap-3 text-3xl mb-6">
            <span className="animate-bounce-gentle" style={{ animationDelay: '0s' }}>🎅</span>
            <span className="animate-bounce-gentle" style={{ animationDelay: '0.2s' }}>🎁</span>
            <span className="animate-bounce-gentle" style={{ animationDelay: '0.4s' }}>⛄</span>
            <span className="animate-bounce-gentle" style={{ animationDelay: '0.6s' }}>🎉</span>
            <span className="animate-bounce-gentle" style={{ animationDelay: '0.8s' }}>✨</span>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleClose}
            className="w-full py-3 px-6 bg-gradient-to-r from-red-600 to-green-600
                       text-white font-semibold rounded-xl
                       hover:from-red-700 hover:to-green-700
                       transform hover:scale-105 transition-all duration-300
                       shadow-lg hover:shadow-xl"
          >
            Hadi Başlayalım! 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
