import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePageContent } from '@/hooks/usePageContent';

const HeroSection = () => {
  const { t, language } = useLanguage();
  const { data: homeContent } = usePageContent('home');

  const heroSection = homeContent?.find((c) => c.section_key === 'hero');
  const badgeSection = homeContent?.find((c) => c.section_key === 'hero_badge');

  const title = language === 'en' 
    ? heroSection?.title_en || t('hero.title')
    : heroSection?.title_bn || t('hero.title');

  const subtitle = language === 'en'
    ? heroSection?.content_en || t('hero.subtitle')
    : heroSection?.content_bn || t('hero.subtitle');

  const badge = language === 'en'
    ? badgeSection?.title_en || 'Trusted by 100+ businesses worldwide'
    : badgeSection?.title_bn || '১০০+ ব্যবসা বিশ্বব্যাপী বিশ্বস্ত';

  return (
    <section className="relative overflow-hidden gradient-hero">
      {/* Refined background pattern */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4) 0%, transparent 40%),
                             radial-gradient(circle at 80% 70%, rgba(255,255,255,0.3) 0%, transparent 40%)`
          }} 
        />
        {/* Subtle grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '64px 64px'
          }}
        />
      </div>
      
      <div className="container-custom relative">
        <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center py-24 text-center lg:min-h-[680px]">
          <div className="max-w-4xl">
            {/* Badge - refined styling */}
            <div 
              className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-5 py-2 text-sm text-primary-foreground/90 backdrop-blur-sm animate-fade-in"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              <span className="font-medium">{badge}</span>
            </div>

            {/* Title - improved typography */}
            <h1 
              className="mb-8 text-4xl font-bold leading-[1.1] tracking-tight text-primary-foreground sm:text-5xl md:text-6xl lg:text-7xl animate-fade-up"
              style={{ letterSpacing: '-0.03em' }}
            >
              {title}
            </h1>

            {/* Subtitle - better readability */}
            <p 
              className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-primary-foreground/75 sm:text-xl animate-fade-up animation-delay-100"
            >
              {subtitle}
            </p>

            {/* CTA Buttons - refined spacing and styling */}
            <div 
              className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-fade-up animation-delay-200"
            >
              <Button
                size="lg"
                variant="accent"
                asChild
                className="min-w-[180px] shadow-lg hover:shadow-xl"
              >
                <Link to="/contact?type=quote">
                  {t('hero.cta.primary')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="min-w-[180px] border-primary-foreground/20 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/30"
              >
                <Link to="/contact?type=meeting">{t('hero.cta.secondary')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Refined wave transition */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-auto w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 100L60 87.5C120 75 240 50 360 37.5C480 25 600 25 720 31.25C840 37.5 960 50 1080 56.25C1200 62.5 1320 62.5 1380 62.5L1440 62.5V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V100Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
