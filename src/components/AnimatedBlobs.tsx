'use client';

import { useEffect, useRef } from 'react';

interface Blob {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  color1: string;
  color2: string;
}

export default function AnimatedBlobs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const blobsRef = useRef<Blob[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize blobs
    const initBlobs = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      blobsRef.current = [
        {
          x: width * 0.7,
          y: height * 0.3,
          radius: Math.min(width, height) * 0.35,
          vx: 0.3,
          vy: 0.2,
          color1: '#FFB067',
          color2: '#FF6B4E',
        },
        {
          x: width * 0.6,
          y: height * 0.7,
          radius: Math.min(width, height) * 0.25,
          vx: -0.2,
          vy: 0.3,
          color1: '#52C1B8',
          color2: '#8489F0',
        },
        {
          x: width * 0.8,
          y: height * 0.5,
          radius: Math.min(width, height) * 0.2,
          vx: 0.25,
          vy: -0.15,
          color1: '#E89E92',
          color2: '#FFD5A3',
        },
      ];
    };
    initBlobs();

    // Animation loop
    const animate = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      ctx.clearRect(0, 0, width, height);

      blobsRef.current.forEach((blob) => {
        // Update position
        blob.x += blob.vx;
        blob.y += blob.vy;

        // Bounce off edges
        if (blob.x - blob.radius < 0 || blob.x + blob.radius > width) {
          blob.vx *= -1;
        }
        if (blob.y - blob.radius < 0 || blob.y + blob.radius > height) {
          blob.vy *= -1;
        }

        // Keep within bounds
        blob.x = Math.max(blob.radius, Math.min(width - blob.radius, blob.x));
        blob.y = Math.max(blob.radius, Math.min(height - blob.radius, blob.y));

        // Draw blob with gradient
        const gradient = ctx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          blob.radius
        );
        gradient.addColorStop(0, blob.color1 + 'CC');
        gradient.addColorStop(0.5, blob.color2 + '66');
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (!prefersReducedMotion) {
      animate();
    } else {
      // Draw static blobs for reduced motion
      blobsRef.current.forEach((blob) => {
        const gradient = ctx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          blob.radius
        );
        gradient.addColorStop(0, blob.color1 + 'CC');
        gradient.addColorStop(0.5, blob.color2 + '66');
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ filter: 'blur(60px)' }}
    />
  );
}
