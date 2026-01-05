import { useLanguage } from '@/contexts/LanguageContext';
import { useTestimonials } from '@/hooks/useTestimonials';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const TestimonialsSection = () => {
  const { language } = useLanguage();
  const { data: testimonials, isLoading } = useTestimonials();

  if (isLoading) {
    return (
      <section className="section-padding bg-section-light">
        <div className="container-custom">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <Skeleton className="mx-auto mb-4 h-10 w-64" />
            <Skeleton className="mx-auto h-6 w-48" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!testimonials?.length) return null;

  return (
    <section className="section-padding bg-section-light">
      <div className="container-custom">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            {language === 'en' ? 'What Our Clients Say' : 'আমাদের ক্লায়েন্টরা কী বলেন'}
          </h2>
          <p className="text-lg text-muted-foreground">
            {language === 'en'
              ? 'Trusted by businesses across industries'
              : 'বিভিন্ন শিল্পের ব্যবসায়ীদের বিশ্বস্ত অংশীদার'}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="border-border/50 bg-card transition-all duration-300 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <Quote className="mb-4 h-8 w-8 text-primary/30" />
                <blockquote className="mb-6 text-muted-foreground">
                  "{language === 'en' ? testimonial.quote_en : (testimonial.quote_bn || testimonial.quote_en)}"
                </blockquote>
                <div className="flex items-center gap-3">
                  {testimonial.avatar_url ? (
                    <img
                      src={testimonial.avatar_url}
                      alt={testimonial.name_en}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                      {testimonial.company?.charAt(0) || testimonial.name_en.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">
                      {language === 'en' ? testimonial.name_en : (testimonial.name_bn || testimonial.name_en)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' ? testimonial.role_en : (testimonial.role_bn || testimonial.role_en)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
