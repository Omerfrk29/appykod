import { useEffect, useRef, useState, useCallback } from 'react';

interface UseAnimationOnViewOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

// Check for reduced motion preference
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useAnimationOnView(options: UseAnimationOnViewOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
    delay = 0,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    // If user prefers reduced motion, show immediately
    if (prefersReducedMotion()) {
      setIsVisible(true);
      setHasTriggered(true);
      return;
    }

    if (triggerOnce && hasTriggered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => {
              setIsVisible(true);
              setHasTriggered(true);
            }, delay);
          } else {
            setIsVisible(true);
            setHasTriggered(true);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, delay, hasTriggered]);

  return { ref, isVisible };
}

// Hook for staggered children animations
export function useStaggerAnimation(
  itemCount: number,
  options: UseAnimationOnViewOptions & { staggerDelay?: number } = {}
) {
  const { staggerDelay = 100, ...viewOptions } = options;
  const { ref, isVisible } = useAnimationOnView(viewOptions);

  const getItemDelay = useCallback(
    (index: number) => (isVisible ? index * staggerDelay : 0),
    [isVisible, staggerDelay]
  );

  const getItemStyle = useCallback(
    (index: number) => ({
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
      transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * staggerDelay}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * staggerDelay}ms`,
    }),
    [isVisible, staggerDelay]
  );

  return { ref, isVisible, getItemDelay, getItemStyle };
}





