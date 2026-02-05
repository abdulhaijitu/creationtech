import { Sparkles, Zap, Shield, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import CountUp from '@/components/common/CountUp';

const stats = [
  { value: 500, suffix: '+', labelEn: 'Active Users', labelBn: 'সক্রিয় ব্যবহারকারী', icon: Zap },
  { value: 99.9, suffix: '%', labelEn: 'Uptime', labelBn: 'আপটাইম', icon: Shield },
  { value: 3, suffix: 'x', labelEn: 'Faster Growth', labelBn: 'দ্রুত বৃদ্ধি', icon: TrendingUp },
];

const ProductHero = () => {
  const { language } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/8 py-20 lg:py-28">
      {/* Animated Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                           linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating Gradient Orbs */}
      <div className="absolute top-10 left-[10%] h-72 w-72 rounded-full bg-primary/8 blur-[100px] animate-[floatSlow_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-10 right-[10%] h-96 w-96 rounded-full bg-accent/10 blur-[120px] animate-[floatSlow_10s_ease-in-out_infinite_reverse]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-primary/5 to-accent/5 blur-[150px]" />

      {/* Decorative Elements */}
      <div className="absolute top-20 right-[15%] w-20 h-20 border border-primary/10 rounded-2xl rotate-12 hero-animate hero-animate-delay-3" />
      <div className="absolute bottom-32 left-[12%] w-16 h-16 border border-accent/15 rounded-xl -rotate-12 hero-animate hero-animate-delay-4" />
      <div className="absolute top-1/3 right-[8%] w-3 h-3 bg-primary/30 rounded-full animate-pulse" />
      <div className="absolute bottom-1/3 left-[8%] w-2 h-2 bg-accent/40 rounded-full animate-pulse delay-500" />

      <div className="container-custom relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge with glow effect */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2.5 text-sm font-medium text-primary ring-1 ring-primary/20 shadow-lg shadow-primary/5 hero-animate hero-animate-delay-0 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span>
              {language === 'en'
                ? 'Enterprise-Grade Solutions'
                : 'এন্টারপ্রাইজ-গ্রেড সমাধান'}
            </span>
          </div>

          {/* Main Title with gradient */}
          <h1
            className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl hero-animate hero-animate-delay-1"
            style={{ letterSpacing: '-0.025em' }}
          >
            <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              {language === 'en' ? 'Powerful Software' : 'শক্তিশালী সফটওয়্যার'}
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              {language === 'en' ? 'For Modern Business' : 'আধুনিক ব্যবসার জন্য'}
            </span>
          </h1>

          {/* Enhanced Description */}
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed hero-animate hero-animate-delay-2">
            {language === 'en'
              ? 'AI-powered, scalable solutions designed to automate operations, increase efficiency, and drive growth for businesses of all sizes.'
              : 'AI-চালিত, স্কেলযোগ্য সমাধান যা অপারেশন স্বয়ংক্রিয় করতে, দক্ষতা বাড়াতে এবং সব আকারের ব্যবসার বৃদ্ধি চালাতে ডিজাইন করা হয়েছে।'}
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 hero-animate hero-animate-delay-3">
            <Button size="xl" asChild className="group shadow-lg shadow-primary/20 min-w-[180px]">
              <Link to="/contact?type=quote">
                {language === 'en' ? 'Get Started' : 'শুরু করুন'}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild className="min-w-[180px] backdrop-blur-sm">
              <a href="#products-showcase">
                {language === 'en' ? 'Explore Products' : 'প্রোডাক্ট দেখুন'}
              </a>
            </Button>
          </div>

          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto hero-animate hero-animate-delay-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex flex-col items-center p-4 sm:p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/20 transition-colors duration-300">
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary mb-2 sm:mb-3" />
                  <span className="text-2xl sm:text-3xl font-bold text-foreground">
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {language === 'en' ? stat.labelEn : stat.labelBn}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default ProductHero;
