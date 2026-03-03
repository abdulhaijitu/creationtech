import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Testimonial {
  image: string;
  quote: string;
  name: string;
  role: string;
  rating: number;
}

interface TestimonialSliderProps {
  testimonials: Testimonial[];
  className?: string;
  autoplayDelay?: number;
}

const StarRating = ({ rating, className }: { rating: number; className?: string }) => {
  return (
    <div className={cn("flex gap-0.5", className)}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
          )}
        />
      ))}
    </div>
  );
};

export const TestimonialSlider = ({ testimonials, className, autoplayDelay = 5000 }: TestimonialSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const isPaused = useRef(false);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  }, [testimonials.length]);

  const handlePrevious = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  // Autoplay
  useEffect(() => {
    if (autoplayDelay <= 0) return;
    const interval = setInterval(() => {
      if (!isPaused.current) handleNext();
    }, autoplayDelay);
    return () => clearInterval(interval);
  }, [handleNext, autoplayDelay]);

  const currentTestimonial = testimonials[currentIndex];

  // Disable slide animation on mobile for performance
  const slideVariants = {
    hidden: (direction: number) => ({
      x: window.innerWidth < 768 ? 0 : (direction > 0 ? '100%' : '-100%'),
      opacity: 0,
    }),
    visible: {
      x: '0%',
      opacity: 1,
      transition: window.innerWidth < 768
        ? { duration: 0.2 }
        : { type: 'spring' as const, stiffness: 260, damping: 30 },
    },
    exit: (direction: number) => ({
      x: window.innerWidth < 768 ? 0 : (direction < 0 ? '100%' : '-100%'),
      opacity: 0,
      transition: window.innerWidth < 768
        ? { duration: 0.15 }
        : { type: 'spring' as const, stiffness: 260, damping: 30 },
    }),
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className="relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-xl"
        onMouseEnter={() => { isPaused.current = true; }}
        onMouseLeave={() => { isPaused.current = false; }}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex flex-col md:flex-row">
              {/* Image Section — compact on mobile */}
              <div className="relative h-48 w-full sm:h-56 md:h-auto md:w-2/5 flex-shrink-0">
                <img
                  src={currentTestimonial.image}
                  alt={currentTestimonial.name}
                  className="h-full w-full object-cover"
                />
                {/* Mobile: overlay author info on image */}
                <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 bg-gradient-to-t from-black/70 to-transparent p-4 md:hidden">
                  <div>
                    <p className="text-sm font-bold text-white">{currentTestimonial.name}</p>
                    <p className="text-xs text-white/70">{currentTestimonial.role}</p>
                  </div>
                </div>
              </div>

              {/* Text & Controls Section */}
              <div className="flex flex-col justify-between p-4 sm:p-6 md:p-10 flex-1">
                <div>
                  <StarRating rating={currentTestimonial.rating} className="mb-3 md:mb-4" />
                  <blockquote className="text-base font-medium leading-relaxed text-foreground sm:text-lg md:text-xl line-clamp-5 md:line-clamp-none">
                    "{currentTestimonial.quote}"
                  </blockquote>
                </div>

                <div className="mt-4 md:mt-6 flex items-center justify-between">
                  {/* Author — hidden on mobile (shown on image overlay instead) */}
                  <div className="hidden md:block">
                    <p className="font-bold text-foreground">{currentTestimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{currentTestimonial.role}</p>
                  </div>
                  {/* Navigation Controls */}
                  <div className="flex gap-2 ml-auto">
                    <button
                      onClick={handlePrevious}
                      className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary active:scale-95"
                      aria-label="Previous testimonial"
                    >
                      <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary active:scale-95"
                      aria-label="Next testimonial"
                    >
                      <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot Indicators */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "h-2 w-2 rounded-full transition-all duration-300",
              currentIndex === index ? 'w-4 bg-primary' : 'bg-muted-foreground/50'
            )}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
