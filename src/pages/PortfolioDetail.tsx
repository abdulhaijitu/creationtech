import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowRight, Award, TrendingUp, Calendar, Building2, Tag } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ScrollReveal from '@/components/common/ScrollReveal';
import PortfolioSection from '@/components/home/PortfolioSection';
import { supabase } from '@/integrations/supabase/client';

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

const PortfolioDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();

  const { data: project, isLoading } = useQuery({
    queryKey: ['portfolio-detail', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .eq('slug', slug!)
        .eq('is_active', true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const title = project ? (language === 'en' ? project.title_en : (project.title_bn || project.title_en)) : '';
  const desc = project ? (language === 'en' ? project.description_en : (project.description_bn || project.description_en)) : '';
  const client = project ? (language === 'en' ? project.client_en : (project.client_bn || project.client_en)) : '';
  const result = project ? (language === 'en' ? project.result_en : (project.result_bn || project.result_en)) : '';
  const tags = project && Array.isArray(project.tags) ? project.tags as string[] : [];
  const imgSrc = project ? (project.image_url || fallbackImages[project.slug] || '') : '';

  if (isLoading) {
    return (
      <Layout>
        <section className="py-16 lg:py-24">
          <div className="container-custom max-w-4xl">
            <Skeleton className="h-8 w-48 mb-6" />
            <Skeleton className="h-64 w-full rounded-2xl mb-8" />
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        </section>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <section className="py-24 lg:py-32">
          <div className="container-custom text-center">
            <h1 className="text-3xl font-bold mb-4 text-foreground">
              {language === 'en' ? 'Project Not Found' : 'প্রজেক্ট পাওয়া যায়নি'}
            </h1>
            <p className="text-muted-foreground mb-8">
              {language === 'en'
                ? 'The project you\'re looking for doesn\'t exist or has been removed.'
                : 'আপনি যে প্রজেক্টটি খুঁজছেন সেটি পাওয়া যায়নি।'}
            </p>
            <Button asChild>
              <Link to="/portfolio">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {language === 'en' ? 'Back to Portfolio' : 'পোর্টফোলিওতে ফিরুন'}
              </Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${title} | Case Study | Creation Tech`}</title>
        <meta name="description" content={desc || `Case study: ${title}`} />
        <link rel="canonical" href={`https://creationtechbd.com/portfolio/${slug}`} />
      </Helmet>
      <Layout>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 py-12 lg:py-20">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-primary-foreground/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-accent/10 blur-3xl" />
          </div>
          <div className="container-custom relative max-w-4xl">
            <ScrollReveal animation="fade-up">
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-1.5 text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                {language === 'en' ? 'All Projects' : 'সকল প্রজেক্ট'}
              </Link>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={50}>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {project.is_featured && (
                  <Badge className="bg-accent text-accent-foreground gap-1">
                    <Award className="h-3 w-3" />
                    {language === 'en' ? 'Featured Project' : 'বৈশিষ্ট্যযুক্ত প্রজেক্ট'}
                  </Badge>
                )}
                {project.category && (
                  <Badge variant="secondary" className="bg-primary-foreground/10 text-primary-foreground border-0">
                    {project.category}
                  </Badge>
                )}
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={100}>
              <h1 className="text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl mb-3" style={{ letterSpacing: '-0.02em' }}>
                {title}
              </h1>
            </ScrollReveal>

            {client && (
              <ScrollReveal animation="fade-up" delay={150}>
                <div className="flex items-center gap-2 text-primary-foreground/60">
                  <Building2 className="h-4 w-4" />
                  <span className="text-sm font-medium">{client}</span>
                </div>
              </ScrollReveal>
            )}
          </div>
        </section>

        {/* Featured Image */}
        {imgSrc && (
          <section className="py-0 -mt-6 relative z-10">
            <div className="container-custom max-w-4xl">
              <ScrollReveal animation="fade-up">
                <div className="rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
                  <img
                    src={imgSrc}
                    alt={title}
                    className="w-full h-auto object-cover"
                    loading="eager"
                  />
                </div>
              </ScrollReveal>
            </div>
          </section>
        )}

        {/* Content */}
        <section className="py-12 lg:py-16">
          <div className="container-custom max-w-4xl">
            <div className="grid gap-10 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Overview */}
                <ScrollReveal animation="fade-up">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-3">
                      {language === 'en' ? 'Project Overview' : 'প্রজেক্ট ওভারভিউ'}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed text-[15px]">
                      {desc}
                    </p>
                  </div>
                </ScrollReveal>

                {/* Result */}
                {result && (
                  <ScrollReveal animation="fade-up" delay={100}>
                    <div className="rounded-xl bg-accent/8 border border-accent/15 p-6">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 flex-shrink-0">
                          <TrendingUp className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">
                            {language === 'en' ? 'Key Result' : 'মূল ফলাফল'}
                          </h3>
                          <p className="text-accent font-medium">
                            {result}
                          </p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Project Info Card */}
                <ScrollReveal animation="fade-up" delay={50}>
                  <div className="rounded-xl border border-border/50 bg-card p-5 space-y-4">
                    <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
                      {language === 'en' ? 'Project Details' : 'প্রজেক্ট বিবরণ'}
                    </h3>

                    {client && (
                      <div className="flex items-start gap-3">
                        <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">{language === 'en' ? 'Client' : 'ক্লায়েন্ট'}</p>
                          <p className="text-sm font-medium text-foreground">{client}</p>
                        </div>
                      </div>
                    )}

                    {project.category && (
                      <div className="flex items-start gap-3">
                        <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">{language === 'en' ? 'Category' : 'ক্যাটাগরি'}</p>
                          <p className="text-sm font-medium text-foreground">{project.category}</p>
                        </div>
                      </div>
                    )}

                    {project.created_at && (
                      <div className="flex items-start gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">{language === 'en' ? 'Completed' : 'সম্পন্ন'}</p>
                          <p className="text-sm font-medium text-foreground">
                            {new Date(project.created_at).toLocaleDateString(language === 'en' ? 'en-US' : 'bn-BD', { year: 'numeric', month: 'long' })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollReveal>

                {/* Tags */}
                {tags.length > 0 && (
                  <ScrollReveal animation="fade-up" delay={100}>
                    <div className="rounded-xl border border-border/50 bg-card p-5">
                      <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider mb-3">
                        {language === 'en' ? 'Technologies' : 'প্রযুক্তি'}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {/* CTA */}
                <ScrollReveal animation="fade-up" delay={150}>
                  <div className="rounded-xl bg-primary/5 border border-primary/15 p-5 text-center space-y-3">
                    <p className="text-sm font-medium text-foreground">
                      {language === 'en' ? 'Interested in a similar project?' : 'অনুরূপ প্রজেক্টে আগ্রহী?'}
                    </p>
                    <Button asChild size="sm" className="w-full font-semibold">
                      <Link to="/contact?type=quote">
                        {language === 'en' ? 'Get a Free Quote' : 'ফ্রি কোটেশন নিন'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Related Projects */}
        <PortfolioSection
          limit={3}
          title={language === 'en' ? 'More Projects' : 'আরও প্রজেক্ট'}
          subtitle={language === 'en' ? 'Explore other solutions we\'ve delivered' : 'আমাদের অন্যান্য সমাধান দেখুন'}
          showViewAll
          className="bg-muted/30"
        />
      </Layout>
    </>
  );
};

export default PortfolioDetail;
