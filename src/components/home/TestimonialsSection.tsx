import { useLanguage } from '@/contexts/LanguageContext';
import { useTestimonials } from '@/hooks/useTestimonials';
import { Card, CardContent } from '@/components/ui/card';
import { Quote, Star, MessageSquareQuote } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ScrollReveal from '@/components/common/ScrollReveal';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';

const TestimonialsSection = () => {
  const { language } = useLanguage();
  const { data: testimonials, isLoading } = useTestimonials();
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  if (isLoading) {
    return (
      <section className="py-12 lg:py-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container-custom">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <Skeleton className="mx-auto mb-5 h-10 w-72" />
            <Skeleton className="mx-auto h-6 w-56" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-72 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!testimonials?.length) return null;

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
      <div className="container-custom">
        {/* Section Header */}
        <ScrollReveal className="mx-auto mb-10 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <MessageSquareQuote className="h-4 w-4" />
            {language === 'en' ? 'Testimonials' : 'প্রশংসাপত্র'}
          </div>
          <h2 className="mb-5 text-3xl font-bold tracking-tight sm:text-4xl">
            {language === 'en' ? 'What Our Clients Say' : 'আমাদের ক্লায়েন্টরা কী বলেন'}
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {language === 'en'
              ? 'Trusted by businesses across industries'
              : 'বিভিন্ন শিল্পের ব্যবসায়ীদের বিশ্বস্ত অংশীদার'}
          </p>
        </ScrollReveal>

        {/* Testimonials Carousel */}
        <ScrollReveal animation="fade-in">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            plugins={[plugin.current]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="group h-full border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
                    <CardContent className="flex h-full flex-col p-7">
                      {/* Quote Icon & Stars */}
                      <div className="mb-5 flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-primary/10">
                          <Quote className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      
                      {/* Quote Text */}
                      <blockquote className="mb-6 flex-1 text-muted-foreground leading-relaxed">
                        "{language === 'en' ? testimonial.quote_en : (testimonial.quote_bn || testimonial.quote_en)}"
                      </blockquote>
                      
                      {/* Author */}
                      <div className="flex items-center gap-4 border-t border-border/40 pt-5">
                        {testimonial.avatar_url ? (
                          <img
                            src={testimonial.avatar_url}
                            alt={testimonial.name_en}
                            className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-base font-semibold text-primary-foreground shadow-md">
                            {testimonial.company?.charAt(0) || testimonial.name_en.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-foreground">
                            {language === 'en' ? testimonial.name_en : (testimonial.name_bn || testimonial.name_en)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {language === 'en' ? testimonial.role_en : (testimonial.role_bn || testimonial.role_en)}
                            {testimonial.company && (
                              <span className="text-primary/70"> · {testimonial.company}</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-8 flex items-center justify-center gap-4">
              <CarouselPrevious className="static translate-y-0 h-10 w-10 border-border/60 bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors" />
              <CarouselNext className="static translate-y-0 h-10 w-10 border-border/60 bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors" />
            </div>
          </Carousel>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default TestimonialsSection;
