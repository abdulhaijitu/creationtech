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
      <section className="section-padding bg-section-alt">
        <div className="container-custom">
          <div className="mx-auto mb-16 max-w-2xl text-center">
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
    <section className="section-padding bg-section-alt">
      <div className="container-custom">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-5 text-3xl font-bold tracking-tight sm:text-4xl">
            {language === 'en' ? 'What Our Clients Say' : 'আমাদের ক্লায়েন্টরা কী বলেন'}
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {language === 'en'
              ? 'Trusted by businesses across industries'
              : 'বিভিন্ন শিল্পের ব্যবসায়ীদের বিশ্বস্ত অংশীদার'}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className="group card-interactive border-border/40 hover:border-border/60"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-7">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/8">
                  <Quote className="h-5 w-5 text-primary/60" />
                </div>
                <blockquote className="mb-6 text-muted-foreground leading-relaxed">
                  "{language === 'en' ? testimonial.quote_en : (testimonial.quote_bn || testimonial.quote_en)}"
                </blockquote>
                <div className="flex items-center gap-4">
                  {testimonial.avatar_url ? (
                    <img
                      src={testimonial.avatar_url}
                      alt={testimonial.name_en}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-border/50"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary ring-2 ring-primary/20">
                      {testimonial.company?.charAt(0) || testimonial.name_en.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-foreground">
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
