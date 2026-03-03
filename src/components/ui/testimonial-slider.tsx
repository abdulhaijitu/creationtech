import React, { useState, useCallback } from 'react';
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

export const TestimonialSlider = ({ testimonials, className }: TestimonialSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  }, [testimonials.length]);

  const handlePrevious = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  const currentTestimonial = testimonials[currentIndex];

  const slideVariants = {
    hidden: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    visible: {
      x: '0%',
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 260, damping: 30 },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      transition: { type: 'spring' as const, stiffness: 260, damping: 30 },
    }),
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-xl">
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
              {/* Image Section */}
              <div className="relative h-64 w-full md:h-auto md:w-2/5 flex-shrink-0">
                <img
                  src={currentTestimonial.image}
                  alt={currentTestimonial.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Text & Controls Section */}
              <div className="flex flex-col justify-between p-6 sm:p-8 md:p-10 flex-1">
                <div>
                  <StarRating rating={currentTestimonial.rating} className="mb-4" />
                  <blockquote className="text-lg font-medium leading-relaxed text-foreground sm:text-xl">
                    "{currentTestimonial.quote}"
                  </blockquote>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-foreground">{currentTestimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{currentTestimonial.role}</p>
                  </div>
                  {/* Navigation Controls */}
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrevious}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary"
                      aria-label="Previous testimonial"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary"
                      aria-label="Next testimonial"
                    >
                      <ChevronRight className="h-5 w-5" />
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
