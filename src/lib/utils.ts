import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind sınıflarını birleştirmek için utility fonksiyon
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Smooth scroll ile bir elemente kaydırma yapar
 * @param href - Hedef elementin selector'ı (örn: '#contact')
 * @param offset - Navbar için üstten offset (varsayılan: 80px)
 */
export function smoothScrollTo(href: string, offset = 80): void {
  if (!href.startsWith('#')) return;
  
  const element = document.querySelector(href);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
}

/**
 * React event handler için smooth scroll wrapper
 * @param e - React MouseEvent
 * @param href - Hedef elementin selector'ı
 * @param offset - Navbar için üstten offset
 * @param callback - Scroll sonrası çalışacak callback (örn: mobil menüyü kapatmak)
 */
export function handleSmoothScroll(
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string,
  offset = 80,
  callback?: () => void
): void {
  if (href.startsWith('#')) {
    e.preventDefault();
    smoothScrollTo(href, offset);
    callback?.();
  }
}

