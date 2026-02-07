import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Code, Smartphone, Cloud, Shield, Cog, BarChart, ArrowRight, Sparkles,
  CheckCircle, Palette, Zap, Users, Clock, Award, Headphones,
  Globe, Database, Cpu, Layers, Monitor, Server, Wifi,
  type LucideIcon,
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCMSContent } from '@/hooks/useCMSContent';
import ScrollReveal from '@/components/common/ScrollReveal';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

// Icon map for dynamic icon resolution
const iconMap: Record<string, LucideIcon> = {
  Code, Smartphone, Cloud, Shield, Cog, BarChart, Palette, Headphones,
  Globe, Database, Cpu, Layers, Monitor, Server, Wifi, Zap, Users,
  Clock, Award, ArrowRight, CheckCircle, Sparkles,
};

const getIcon = (iconName: string | null): LucideIcon => {
  if (!iconName) return Cog;
  return iconMap[iconName] || Cog;
};

const whyChooseUs = [
  {
    icon: Zap,
    titleEn: 'Fast Delivery',
    titleBn: 'দ্রুত ডেলিভারি',
    descEn: 'Agile methodology ensures quick turnaround times.',
    descBn: 'অ্যাজাইল পদ্ধতি দ্রুত ফলাফল নিশ্চিত করে।',
  },
  {
    icon: Users,
    titleEn: 'Expert Team',
    titleBn: 'বিশেষজ্ঞ দল',
    descEn: '100+ skilled professionals across all domains.',
    descBn: 'সকল ক্ষেত্রে ১০০+ দক্ষ পেশাদার।',
  },
  {
    icon: Clock,
    titleEn: '24/7 Support',
    titleBn: '২৪/৭ সাপোর্ট',
    descEn: 'Round-the-clock assistance for all clients.',
    descBn: 'সকল ক্লায়েন্টদের জন্য সার্বক্ষণিক সহায়তা।',
  },
  {
    icon: Award,
    titleEn: 'Quality Assured',
    titleBn: 'মান নিশ্চিত',
    descEn: 'Rigorous testing and quality control processes.',
    descBn: 'কঠোর টেস্টিং এবং মান নিয়ন্ত্রণ প্রক্রিয়া।',
  },
];

const Services = () => {
  const { t, language } = useLanguage();
  const { getSectionText, getMetaTitle, getMetaDescription } = useCMSContent({ pageSlug: 'services' });

  const { data: services, isLoading } = useQuery({
    queryKey: ['public-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const heroSubtitle = getSectionText('hero', 'content', language === 'en' ? 'Comprehensive IT solutions tailored to your business needs' : 'আপনার ব্যবসার প্রয়োজন অনুযায়ী ব্যাপক আইটি সমাধান');
  const ctaTitle = getSectionText('cta', 'title', language === 'en' ? "Can't Find What You Need?" : 'আপনার প্রয়োজনীয় সেবা খুঁজে পাচ্ছেন না?');
  const ctaContent = getSectionText('cta', 'content', language === 'en' ? 'We offer custom solutions tailored to your specific requirements. Let us know what you need.' : 'আমরা আপনার নির্দিষ্ট প্রয়োজনীয়তা অনুযায়ী কাস্টম সমাধান অফার করি।');

  return (
    <>
      <Helmet>
        <title>{getMetaTitle('Custom Software Development Services | Creation Tech Bangladesh')}</title>
        <meta
          name="description"
          content={getMetaDescription("Expert custom software development services including web application development, mobile app development, IT consulting, and enterprise software solutions in Bangladesh.")}
        />
        <meta name="keywords" content="custom software development services, web application development, mobile app development company, IT consulting services, enterprise software solutions" />
        <link rel="canonical" href="https://creationtechbd.com/services" />
      </Helmet>
      <Layout>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 py-16 lg:py-24">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-white/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-accent/10 blur-3xl" />
          </div>
          <div className="container-custom relative text-center">
            <ScrollReveal animation="fade-up">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                {language === 'en' ? 'What We Offer' : 'আমরা যা অফার করি'}
              </div>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={100}>
              <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl" style={{ letterSpacing: '-0.02em' }}>
                {language === 'en' ? 'Custom Software Development Services' : 'কাস্টম সফটওয়্যার ডেভেলপমেন্ট সেবা'}
              </h1>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={150}>
              <p className="mx-auto max-w-2xl text-base text-white/70 leading-relaxed sm:text-lg">
                {heroSubtitle}
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12 lg:py-16">
          <div className="container-custom">
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="h-72">
                    <CardContent className="p-6 space-y-4">
                      <Skeleton className="h-12 w-12 rounded-xl" />
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : services && services.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {services.map((service, index) => {
                  const Icon = getIcon(service.icon);
                  const features = Array.isArray(service.features) ? service.features as string[] : [];
                  const shortDesc = language === 'en'
                    ? (service as any).short_description_en || service.description_en
                    : (service as any).short_description_bn || service.description_bn || (service as any).short_description_en || service.description_en;
                  const ctaText = language === 'en'
                    ? ((service as any).cta_text_en || 'Get Quote')
                    : ((service as any).cta_text_bn || 'কোটেশন নিন');
                  const ctaLink = (service as any).cta_link || `/contact?service=${service.slug}`;

                  return (
                    <ScrollReveal key={service.id} animation="fade-up" delay={index * 50}>
                      <Card
                        id={service.slug}
                        className={cn(
                          "group h-full border-border/50 bg-card",
                          "hover:border-primary/30 hover:shadow-xl hover:-translate-y-1",
                          "transition-all duration-300",
                          (service as any).is_featured && "ring-2 ring-primary/20 border-primary/30"
                        )}
                      >
                        <CardContent className="p-6">
                          {/* Featured badge */}
                          {(service as any).is_featured && (
                            <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              <Sparkles className="h-3 w-3" /> Featured
                            </div>
                          )}

                          {/* Icon */}
                          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                            <Icon className="h-6 w-6" strokeWidth={1.5} />
                          </div>

                          {/* Title */}
                          <h3 className="mb-2 text-lg font-semibold text-foreground">
                            {language === 'en' ? service.title_en : (service.title_bn || service.title_en)}
                          </h3>

                          {/* Short Description */}
                          {shortDesc && (
                            <p className="mb-4 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                              {shortDesc}
                            </p>
                          )}

                          {/* Features */}
                          {features.length > 0 && (
                            <ul className="mb-5 space-y-2">
                              {features.slice(0, 3).map((feature, i) => (
                                <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <CheckCircle className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                                  <span>{String(feature)}</span>
                                </li>
                              ))}
                              {features.length > 3 && (
                                <li className="text-xs text-muted-foreground/70">
                                  +{features.length - 3} {language === 'en' ? 'more' : 'আরও'}
                                </li>
                              )}
                            </ul>
                          )}

                          {/* CTA */}
                          <Link
                            to={ctaLink}
                            className="inline-flex items-center text-sm font-medium text-primary hover:underline group/link"
                          >
                            {ctaText}
                            <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-0.5" />
                          </Link>
                        </CardContent>
                      </Card>
                    </ScrollReveal>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                {language === 'en' ? 'No services available at the moment.' : 'এই মুহূর্তে কোনো সেবা উপলব্ধ নেই।'}
              </div>
            )}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-12 lg:py-16 bg-muted/30">
          <div className="container-custom">
            <ScrollReveal animation="fade-up">
              <div className="text-center mb-10">
                <span className="inline-block mb-2 text-xs font-semibold uppercase tracking-widest text-primary/80">
                  {language === 'en' ? 'WHY CHOOSE US' : 'কেন আমাদের বেছে নেবেন'}
                </span>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {language === 'en' ? 'The Creation Tech Advantage' : 'Creation Tech সুবিধা'}
                </h2>
              </div>
            </ScrollReveal>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {whyChooseUs.map((item, index) => {
                const Icon = item.icon;
                return (
                  <ScrollReveal key={index} animation="fade-up" delay={index * 80}>
                    <div className="text-center p-6 rounded-2xl bg-background border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mb-2 font-semibold text-foreground">
                        {language === 'en' ? item.titleEn : item.titleBn}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language === 'en' ? item.descEn : item.descBn}
                      </p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 lg:py-16 bg-gradient-to-br from-primary via-primary/95 to-primary/90 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-[300px] h-[300px] rounded-full bg-white/5 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] rounded-full bg-accent/10 blur-3xl" />
          </div>
          <div className="container-custom relative text-center">
            <ScrollReveal animation="fade-up">
              <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
                {ctaTitle}
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={100}>
              <p className="mx-auto mb-8 max-w-xl text-base text-white/70 leading-relaxed">
                {ctaContent}
              </p>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={150}>
              <Button size="lg" variant="secondary" asChild className="font-semibold">
                <Link to="/contact">{t('common.contactUs')}</Link>
              </Button>
            </ScrollReveal>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Services;
