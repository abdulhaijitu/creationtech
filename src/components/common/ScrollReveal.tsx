import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-in' | 'fade-left' | 'fade-right' | 'scale-in';
  delay?: number;
  duration?: number;
  threshold?: number;
}

const ScrollReveal = ({
  children,
  className,
  animation = 'fade-up',
  delay = 0,
  duration = 500,
  threshold = 0.1,
}: ScrollRevealProps) => {
  const { ref, isVisible } = useScrollReveal({ threshold });

  const animationClasses = {
    'fade-up': 'translate-y-8 opacity-0',
    'fade-in': 'opacity-0',
    'fade-left': 'translate-x-8 opacity-0',
    'fade-right': '-translate-x-8 opacity-0',
    'scale-in': 'scale-95 opacity-0',
  };

  const visibleClasses = 'translate-y-0 translate-x-0 scale-100 opacity-100';

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(
        'transition-all ease-out',
        isVisible ? visibleClasses : animationClasses[animation],
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
