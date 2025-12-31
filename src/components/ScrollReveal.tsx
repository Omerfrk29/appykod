'use client';

import { ReactNode, CSSProperties } from 'react';
import { useAnimationOnView } from '@/hooks/useAnimationOnView';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  style?: CSSProperties;
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 30,
  duration = 600,
  threshold = 0.1,
  once = true,
  style = {},
}: ScrollRevealProps) {
  const { ref, isVisible } = useAnimationOnView({
    threshold,
    triggerOnce: once,
    delay,
  });

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0)';

    switch (direction) {
      case 'up':
        return `translate3d(0, ${distance}px, 0)`;
      case 'down':
        return `translate3d(0, -${distance}px, 0)`;
      case 'left':
        return `translate3d(${distance}px, 0, 0)`;
      case 'right':
        return `translate3d(-${distance}px, 0, 0)`;
      case 'none':
        return 'translate3d(0, 0, 0)';
      default:
        return `translate3d(0, ${distance}px, 0)`;
    }
  };

  const animationStyle: CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: getTransform(),
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
    willChange: isVisible ? 'auto' : 'opacity, transform',
    ...style,
  };

  return (
    <div ref={ref} className={className} style={animationStyle}>
      {children}
    </div>
  );
}

// Stagger container for multiple items
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  threshold?: number;
}

export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 100,
  threshold = 0.1,
}: StaggerContainerProps) {
  const { ref, isVisible } = useAnimationOnView({ threshold, triggerOnce: true });

  return (
    <div
      ref={ref}
      className={className}
      style={{
        '--stagger-delay': `${staggerDelay}ms`,
        '--is-visible': isVisible ? '1' : '0',
      } as CSSProperties}
      data-visible={isVisible}
    >
      {children}
    </div>
  );
}

// Individual stagger item
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  index: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  duration?: number;
}

export function StaggerItem({
  children,
  className = '',
  index,
  direction = 'up',
  distance = 30,
  duration = 600,
}: StaggerItemProps) {
  const getTransformOrigin = () => {
    switch (direction) {
      case 'up':
        return `translate3d(0, ${distance}px, 0)`;
      case 'down':
        return `translate3d(0, -${distance}px, 0)`;
      case 'left':
        return `translate3d(${distance}px, 0, 0)`;
      case 'right':
        return `translate3d(-${distance}px, 0, 0)`;
      default:
        return `translate3d(0, ${distance}px, 0)`;
    }
  };

  return (
    <div
      className={`stagger-item ${className}`}
      style={{
        '--index': index,
        '--transform-origin': getTransformOrigin(),
        '--duration': `${duration}ms`,
      } as CSSProperties}
    >
      {children}
    </div>
  );
}
