import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Award, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ScrollReveal from '@/components/common/ScrollReveal';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

// Local fallback images
import ispImg from '@/assets/portfolio/isp-billing.jpg';
import restaurantImg from '@/assets/portfolio/restaurant-pos.jpg';
import somityImg from '@/assets/portfolio/somity-app.jpg';
import ecommerceImg from '@/assets/portfolio/ecommerce.jpg';
import healthcareImg from '@/assets/portfolio/healthcare-ehr.jpg';
import logisticsImg from '@/assets/portfolio/logistics-tracker.jpg';

const fallbackImages: Record<string, string> = {
  'isp-billing-system': ispImg,
  'restaurant-pos': restaurantImg,
  'somity-microfinance': somityImg,
  'ecommerce-platform': ecommerceImg,
  'healthcare-ehr': healthcareImg,
  'logistics-tracker': logisticsImg,
};

const Portfolio = () => {
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('All');

  const { data: projects, isLoading } = useQuery({
    queryKey: ['portfolio-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(projects?.map(p => p.category).filter(Boolean) as string[]))];

  const filtered = activeCategory === 'All'
    ? projects
    : projects?.filter(p => p.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>Software Development Case Studies & Portfolio | Creation Tech Bangladesh</title>
        <meta
          name="description"
          content="Explore our software development portfolio and case studies. See successful web applications, mobile apps, cloud migrations, and enterprise solutions delivered in Bangladesh."
        />
        <meta name="keywords" content="software development portfolio, case studies Bangladesh, web development projects, mobile app case studies" />
        <link rel="canonical" href="https://creationtechbd.com/portfolio" />
      </Helmet>
      <Layout>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 py-16 lg:py-24">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-primary-foreground/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-accent/10 blur-3xl" />
          </div>
          <div className="container-custom relative text-center">
            <ScrollReveal animation="fade-up">
              <h1 className="mb-4 text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl" style={{ letterSpacing: '-0.02em' }}>
                {language === 'en' ? 'Our Portfolio' : 'আমাদের পোর্টফোলিও'}
              </h1>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={100}>
              <p className="mx-auto max-w-2xl text-base text-primary-foreground/70 leading-relaxed sm:text-lg">
                {language === 'en'
                  ? 'Real solutions we\'ve built for real businesses — explore our case studies and project highlights.'
                  : 'বাস্তব ব্যবসার জন্য আমাদের তৈরি সমাধান — আমাদের কেস স্টাডি ও প্রজেক্ট হাইলাইট দেখুন।'}
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Category Filter */}
        <section className="border-b border-border/50 py-5 bg-background sticky top-0 z-10">
          <div className="container-custom">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-12 lg:py-16">
          <div className="container-custom">
            {isLoading ? (
              <div className="grid gap-8 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-56 w-full rounded-none" />
                    <CardContent className="p-6 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filtered && filtered.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2">
                {filtered.map((project, index) => {
                  const imgSrc = project.image_url || fallbackImages[project.slug] || '';
                  const title = language === 'en' ? project.title_en : (project.title_bn || project.title_en);
                  const desc = language === 'en' ? project.description_en : (project.description_bn || project.description_en);
                  const client = language === 'en' ? project.client_en : (project.client_bn || project.client_en);
                  const result = language === 'en' ? project.result_en : (project.result_bn || project.result_en);
                  const tags = Array.isArray(project.tags) ? project.tags as string[] : [];

                  return (
                    <ScrollReveal key={project.id} animation="fade-up" delay={index * 80}>
                      <Card
                        id={project.slug}
                        className={cn(
                          'group overflow-hidden h-full border-border/50',
                          'hover:border-primary/30 hover:shadow-xl hover:-translate-y-1',
                          'transition-all duration-300',
                          project.is_featured && 'ring-2 ring-primary/20 border-primary/30',
                        )}
                      >
                        {/* Image */}
                        <div className="relative h-56 overflow-hidden bg-muted">
                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={title}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                              <ExternalLink className="h-12 w-12 text-primary/30" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          {project.is_featured && (
                            <div className="absolute top-3 left-3">
                              <Badge variant="default" className="bg-primary text-primary-foreground text-xs shadow-md gap-1">
                                <Award className="h-3 w-3" />
                                {language === 'en' ? 'Featured' : 'বৈশিষ্ট্যযুক্ত'}
                              </Badge>
                            </div>
                          )}
                          {project.category && (
                            <div className="absolute top-3 right-3">
                              <Badge variant="secondary" className="text-xs shadow-md bg-background/90 backdrop-blur-sm">
                                {project.category}
                              </Badge>
                            </div>
                          )}
                        </div>

                        <CardContent className="p-6">
                          {/* Client */}
                          {client && (
                            <p className="mb-1 text-xs font-medium text-primary/70 uppercase tracking-wider">
                              {client}
                            </p>
                          )}

                          {/* Title */}
                          <h3 className="mb-2 text-xl font-semibold text-foreground">
                            {title}
                          </h3>

                          {/* Description */}
                          {desc && (
                            <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                              {desc}
                            </p>
                          )}

                          {/* Tags */}
                          {tags.length > 0 && (
                            <div className="mb-4 flex flex-wrap gap-1.5">
                              {tags.map((tag, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="text-[10px] font-medium px-2 py-0.5"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Result */}
                          {result && (
                            <div className="rounded-lg bg-accent/8 border border-accent/15 p-3 flex items-start gap-2">
                              <TrendingUp className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                              <p className="text-sm font-medium text-accent">
                                {result}
                              </p>
                            </div>
                          )}

                          {/* CTA */}
                          <Link
                            to={`/portfolio/${project.slug}`}
                            className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline group/link"
                          >
                            {language === 'en' ? 'View Case Study' : 'কেস স্টাডি দেখুন'}
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
                {language === 'en' ? 'No projects found in this category.' : 'এই ক্যাটাগরিতে কোনো প্রজেক্ট পাওয়া যায়নি।'}
              </div>
            )}
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
                {language === 'en' ? 'Ready to Start Your Project?' : 'আপনার প্রকল্প শুরু করতে প্রস্তুত?'}
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={100}>
              <p className="mx-auto mb-8 max-w-xl text-base text-white/70 leading-relaxed">
                {language === 'en'
                  ? "Let's discuss how we can help bring your ideas to life."
                  : 'আসুন আলোচনা করি কীভাবে আমরা আপনার ধারণাগুলি বাস্তবায়িত করতে পারি।'}
              </p>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={150}>
              <Button size="lg" variant="secondary" asChild className="font-semibold">
                <Link to="/contact">
                  {t('common.getQuote')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </ScrollReveal>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Portfolio;
