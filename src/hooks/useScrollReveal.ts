import { useEffect, useRef, useState } from 'react';

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  fallbackDelay?: number;
}

export const useScrollReveal = (options: UseScrollRevealOptions = {}) => {
  const { 
    threshold = 0.1, 
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    fallbackDelay = 1200,
  } = options;
  
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    // Safety net: if observer never triggers, force visible after delay
    const fallbackTimer = setTimeout(() => {
      setIsVisible(true);
    }, fallbackDelay);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          clearTimeout(fallbackTimer);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, fallbackDelay]);

  return { ref, isVisible };
};

// Hook for staggered children animations
export const useStaggerReveal = (
  itemCount: number, 
  options: UseScrollRevealOptions & { staggerDelay?: number } = {}
) => {
  const { staggerDelay = 80, ...revealOptions } = options;
  const { ref, isVisible } = useScrollReveal(revealOptions);

  const getItemDelay = (index: number) => ({
    transitionDelay: isVisible ? `${index * staggerDelay}ms` : '0ms'
  });

  return { ref, isVisible, getItemDelay };
};
