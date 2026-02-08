import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ScrollReveal from '@/components/common/ScrollReveal';
import { cn } from '@/lib/utils';

// Local fallback images keyed by slug
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

interface PortfolioSectionProps {
  /** Max number of items to show */
  limit?: number;
  /** Section heading override */
  title?: string;
  subtitle?: string;
  /** Show "View All" CTA at bottom */
  showViewAll?: boolean;
  /** Filter by category */
  filterCategory?: string;
  /** Additional className */
  className?: string;
}

const PortfolioSection = ({
  limit = 6,
  title,
  subtitle,
  showViewAll = false,
  filterCategory,
  className,
}: PortfolioSectionProps) => {
  const { language } = useLanguage();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['portfolio-projects', limit, filterCategory],
    queryFn: async () => {
      let query = supabase
        .from('portfolio_projects')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('display_order', { ascending: true })
        .limit(limit);

      if (filterCategory) {
        query = query.eq('category', filterCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const sectionTitle = title || (language === 'en' ? 'Our Portfolio' : 'আমাদের পোর্টফোলিও');
  const sectionSubtitle = subtitle || (language === 'en'
    ? 'Real solutions we\'ve built for real businesses'
    : 'বাস্তব ব্যবসার জন্য আমাদের তৈরি সমাধান');

  return (
    <section className={cn('py-12 lg:py-16', className)}>
      <div className="container-custom">
        {/* Header */}
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-10">
            <span className="inline-block mb-2 text-xs font-semibold uppercase tracking-widest text-primary/80">
              {language === 'en' ? 'PORTFOLIO' : 'পোর্টফোলিও'}
            </span>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
              {sectionTitle}
            </h2>
            <p className="mt-3 mx-auto max-w-2xl text-muted-foreground leading-relaxed">
              {sectionSubtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* Grid */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: Math.min(limit, 3) }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full rounded-none" />
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => {
              const imgSrc = project.image_url || fallbackImages[project.slug] || '';
              const projectTitle = language === 'en'
                ? project.title_en
                : (project.title_bn || project.title_en);
              const projectDesc = language === 'en'
                ? project.description_en
                : (project.description_bn || project.description_en);
              const tags = Array.isArray(project.tags) ? project.tags as string[] : [];

              return (
                <ScrollReveal key={project.id} animation="fade-up" delay={index * 80}>
                  <Card className={cn(
                    'group overflow-hidden h-full border-border/50',
                    'hover:border-primary/30 hover:shadow-xl hover:-translate-y-1',
                    'transition-all duration-300',
                  )}>
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-muted">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={projectTitle}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                          <ExternalLink className="h-10 w-10 text-primary/30" />
                        </div>
                      )}
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {/* Featured badge */}
                      {project.is_featured && (
                        <div className="absolute top-3 left-3">
                          <Badge variant="default" className="bg-primary text-primary-foreground text-xs shadow-md">
                            {language === 'en' ? 'Featured' : 'বৈশিষ্ট্যযুক্ত'}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-5">
                      {/* Title */}
                      <h3 className="mb-2 text-lg font-semibold text-foreground line-clamp-1">
                        {projectTitle}
                      </h3>

                      {/* Description */}
                      {projectDesc && (
                        <p className="mb-3 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {projectDesc}
                        </p>
                      )}

                      {/* Tags */}
                      {tags.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-1.5">
                          {tags.slice(0, 4).map((tag, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-[10px] font-medium px-2 py-0.5"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* CTA */}
                      <Link
                        to={`/portfolio#${project.slug}`}
                        className="inline-flex items-center text-sm font-medium text-primary hover:underline group/link"
                      >
                        {language === 'en' ? 'View Project' : 'প্রজেক্ট দেখুন'}
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-0.5" />
                      </Link>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {language === 'en' ? 'Portfolio coming soon.' : 'পোর্টফোলিও শীঘ্রই আসছে।'}
          </div>
        )}

        {/* View All CTA */}
        {showViewAll && projects && projects.length > 0 && (
          <ScrollReveal animation="fade-up" delay={200}>
            <div className="mt-10 text-center">
              <Button variant="outline" size="lg" asChild className="font-semibold">
                <Link to="/portfolio">
                  {language === 'en' ? 'View All Projects' : 'সকল প্রজেক্ট দেখুন'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
};

export default PortfolioSection;
