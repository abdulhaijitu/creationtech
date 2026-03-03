import { useLanguage } from '@/contexts/LanguageContext';
import { useTestimonials } from '@/hooks/useTestimonials';
import { MessageSquareQuote } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ScrollReveal from '@/components/common/ScrollReveal';
import { TestimonialSlider, type Testimonial as SliderTestimonial } from '@/components/ui/testimonial-slider';

import rafiqImg from '@/assets/testimonials/rafiq-ahmed.jpg';
import sarahImg from '@/assets/testimonials/sarah-rahman.jpg';
import hassanImg from '@/assets/testimonials/mohammad-hassan.jpg';
import kamalImg from '@/assets/testimonials/kamal-hossain.jpg';
import nusratImg from '@/assets/testimonials/nusrat-jahan.jpg';
import tariqImg from '@/assets/testimonials/tariq-islam.jpg';
import arifImg from '@/assets/testimonials/arif-chowdhury.jpg';

const fallbackAvatars: Record<string, string> = {
  'Rafiq Ahmed': rafiqImg,
  'Sarah Rahman': sarahImg,
  'Mohammad Hassan': hassanImg,
  'Kamal Hossain': kamalImg,
  'Nusrat Jahan': nusratImg,
  'Tariq Islam': tariqImg,
  'Arif Chowdhury': arifImg,
};

const TestimonialsSection = () => {
  const { language } = useLanguage();
  const { data: testimonials, isLoading } = useTestimonials();

  if (isLoading) {
    return (
      <section className="py-12 lg:py-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container-custom">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <Skeleton className="mx-auto mb-5 h-10 w-72" />
            <Skeleton className="mx-auto h-6 w-56" />
          </div>
          <Skeleton className="mx-auto h-80 max-w-4xl rounded-2xl" />
        </div>
      </section>
    );
  }

  if (!testimonials?.length) return null;

  // Map DB testimonials to slider format
  const sliderData: SliderTestimonial[] = testimonials.map((t) => ({
    image: t.avatar_url || fallbackAvatars[t.name_en] || '',
    quote: language === 'en' ? t.quote_en : (t.quote_bn || t.quote_en),
    name: language === 'en' ? t.name_en : (t.name_bn || t.name_en),
    role: [
      language === 'en' ? t.role_en : (t.role_bn || t.role_en),
      t.company,
    ].filter(Boolean).join(' · '),
    rating: 5,
  }));

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

        {/* Testimonial Slider */}
        <ScrollReveal animation="fade-in">
          <div className="mx-auto max-w-4xl">
            <TestimonialSlider testimonials={sliderData} />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default TestimonialsSection;
