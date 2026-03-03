import { useLanguage } from '@/contexts/LanguageContext';
import ScrollReveal from '@/components/common/ScrollReveal';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Feature197 } from '@/components/ui/accordion-feature-section';

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
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }

  if (!services || services.length === 0) return null;

  const features = services.map((service, index) => ({
    id: service.id,
    title: language === 'en' ? service.title_en : (service.title_bn || service.title_en),
    description: language === 'en'
      ? (service.short_description_en || service.description_en || '')
      : (service.short_description_bn || service.short_description_en || service.description_bn || service.description_en || ''),
    image: service.featured_image_url || fallbackImages[index % fallbackImages.length],
  }));

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-br from-primary/[0.02] via-background to-primary/[0.04] relative overflow-hidden">
      <div className="container-custom relative">
        <ScrollReveal animation="fade-up">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-10">
            {language === 'en' ? 'Our Services' : 'আমাদের সেবাসমূহ'}
          </h2>
        </ScrollReveal>
        <ScrollReveal animation="fade-up" delay={100}>
          <Feature197 features={features} />
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ServicesSection;
