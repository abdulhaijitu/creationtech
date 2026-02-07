import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ScrollReveal from '@/components/common/ScrollReveal';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

// Fallback illustrations for when no featured_image_url exists
import softwareDevIllustration from '@/assets/services/software-dev-illustration.png';
import mobileAppIllustration from '@/assets/services/mobile-app-illustration.png';
import productDesignIllustration from '@/assets/services/product-design-illustration.png';
import itConsultingIllustration from '@/assets/services/it-consulting-illustration.png';

const fallbackImages = [
  softwareDevIllustration,
  mobileAppIllustration,
  productDesignIllustration,
  itConsultingIllustration,
];

const ServicesSection = () => {
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const { data: services, isLoading } = useQuery({
    queryKey: ['homepage-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('id, slug, title_en, title_bn, short_description_en, short_description_bn, description_en, description_bn, featured_image_url')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(4);
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <section className="py-12 lg:py-16">
        <div className="container-custom">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <Skeleton className="h-10 w-48" />
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
            <Skeleton className="h-80 w-full rounded-3xl" />
          </div>
        </div>
      </section>
    );
  }

  if (!services || services.length === 0) return null;

  const currentService = services[activeIndex] || services[0];
  const illustration = (currentService as any).featured_image_url || fallbackImages[activeIndex % fallbackImages.length];

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-br from-primary/[0.02] via-background to-primary/[0.04] relative overflow-hidden">
      <div className="container-custom relative">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Side - Services List */}
          <ScrollReveal animation="fade-right" className="order-2 lg:order-1">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {language === 'en' ? 'Our Services' : 'আমাদের সেবাসমূহ'}
              </h2>
            </div>

            <div className="space-y-0">
              {services.map((service, index) => {
                const isActive = activeIndex === index;
                const title = language === 'en' ? service.title_en : (service.title_bn || service.title_en);
                const desc = language === 'en'
                  ? ((service as any).short_description_en || service.description_en || '')
                  : ((service as any).short_description_bn || (service as any).short_description_en || service.description_bn || service.description_en || '');

                return (
                  <div
                    key={service.id}
                    className={cn(
                      'group cursor-pointer border-t border-border/50 transition-all duration-300',
                      index === services.length - 1 && 'border-b',
                      isActive && 'border-t-primary/30'
                    )}
                    onClick={() => setActiveIndex(index)}
                    onKeyDown={(e) => e.key === 'Enter' && setActiveIndex(index)}
                    tabIndex={0}
                    role="button"
                    aria-expanded={isActive}
                  >
                    <div
                      className={cn(
                        'flex items-center gap-4 py-5 transition-all duration-300',
                        isActive ? 'py-6' : 'hover:pl-2'
                      )}
                    >
                      <Sparkles
                        className={cn(
                          'h-5 w-5 flex-shrink-0 transition-all duration-300',
                          isActive
                            ? 'text-primary scale-110'
                            : 'text-primary/40 group-hover:text-primary/70 group-hover:rotate-12'
                        )}
                      />
                      <h3
                        className={cn(
                          'text-lg font-semibold transition-colors duration-300 sm:text-xl',
                          isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                        )}
                      >
                        {title}
                      </h3>
                    </div>

                    <div
                      className={cn(
                        'overflow-hidden transition-all duration-300 ease-out',
                        isActive ? 'max-h-32 opacity-100 pb-5' : 'max-h-0 opacity-0'
                      )}
                    >
                      <p className="pl-9 text-muted-foreground leading-relaxed pr-4">
                        {desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>

          {/* Right Side - Illustration */}
          <ScrollReveal animation="fade-left" className="order-1 lg:order-2">
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-primary/[0.02] to-emerald-500/10 p-4 sm:p-6 lg:p-8">
                <div className="animate-float">
                  <img
                    src={illustration}
                    alt={language === 'en' ? currentService.title_en : (currentService.title_bn || currentService.title_en)}
                    className="w-full h-auto rounded-2xl shadow-lg transition-all duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl" />
              </div>

              <div className="mt-6 flex justify-center lg:justify-start">
                <Link
                  to={`/services#${currentService.slug}`}
                  className="group inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
                >
                  <span className="uppercase tracking-wider">
                    {language === 'en' ? 'Learn More' : 'আরও জানুন'}
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
