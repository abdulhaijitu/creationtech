import { Sparkles, Zap, Shield, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import CountUp from '@/components/common/CountUp';
import productsHeroImg from '@/assets/products-hero.jpg';

const stats = [
  { value: 500, suffix: '+', labelEn: 'Active Users', labelBn: 'সক্রিয় ব্যবহারকারী', icon: Zap },
  { value: 99.9, suffix: '%', labelEn: 'Uptime', labelBn: 'আপটাইম', icon: Shield },
  { value: 3, suffix: 'x', labelEn: 'Faster Growth', labelBn: 'দ্রুত বৃদ্ধি', icon: TrendingUp },
];

const ProductHero = () => {
  const { language } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--primary)/0.08)] via-background to-[hsl(var(--accent)/0.06)] py-16 lg:py-24">
      {/* Animated Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                           linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Floating Gradient Orbs */}
      <div className="absolute top-10 left-[10%] h-72 w-72 rounded-full bg-primary/8 blur-[100px] animate-[floatSlow_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-10 right-[10%] h-96 w-96 rounded-full bg-accent/10 blur-[120px] animate-[floatSlow_10s_ease-in-out_infinite_reverse]" />

      {/* Decorative Elements */}
      <div className="absolute top-20 right-[15%] w-20 h-20 border border-primary/10 rounded-2xl rotate-12 hero-animate hero-animate-delay-3" />
      <div className="absolute bottom-32 left-[12%] w-16 h-16 border border-accent/15 rounded-xl -rotate-12 hero-animate hero-animate-delay-4" />

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Text Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2.5 text-sm font-medium text-primary ring-1 ring-primary/20 shadow-lg shadow-primary/5 hero-animate hero-animate-delay-0 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>
                {language === 'en'
                  ? 'Enterprise-Grade Solutions'
                  : 'এন্টারপ্রাইজ-গ্রেড সমাধান'}
              </span>
            </div>

            {/* Main Title */}
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

            {/* Description */}
            <p className="max-w-xl text-lg text-muted-foreground leading-relaxed hero-animate hero-animate-delay-2 mx-auto lg:mx-0">
              {language === 'en'
                ? 'AI-powered, scalable solutions designed to automate operations, increase efficiency, and drive growth for businesses of all sizes.'
                : 'AI-চালিত, স্কেলযোগ্য সমাধান যা অপারেশন স্বয়ংক্রিয় করতে, দক্ষতা বাড়াতে এবং সব আকারের ব্যবসার বৃদ্ধি চালাতে ডিজাইন করা হয়েছে।'}
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 hero-animate hero-animate-delay-3">
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

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-3 sm:gap-6 max-w-md mx-auto lg:mx-0 hero-animate hero-animate-delay-4">
              {stats.map((stat, index) => (
                <div key={index} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex flex-col items-center p-3 sm:p-5 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/20 transition-colors duration-300">
                    <stat.icon className="h-5 w-5 text-primary mb-2" />
                    <span className="text-xl sm:text-2xl font-bold text-foreground">
                      <CountUp end={stat.value} suffix={stat.suffix} />
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {language === 'en' ? stat.labelEn : stat.labelBn}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Hero Image */}
          <div className="relative hero-animate hero-animate-delay-2 hidden lg:block">
            <div className="relative">
              {/* Glow behind image */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/15 to-primary/20 rounded-3xl blur-2xl opacity-60" />
              
              {/* Image container */}
              <div className="relative rounded-2xl overflow-hidden border border-border/30 shadow-2xl shadow-primary/10">
                <img
                  src={productsHeroImg}
                  alt="CreationTech Software Products - ISP Manager, Somity App, Restaurant App"
                  className="w-full h-auto object-cover"
                  loading="eager"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
              </div>

              {/* Floating badge top-right */}
              <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground rounded-xl px-4 py-2 text-sm font-semibold shadow-lg shadow-primary/30 animate-[floatSlow_6s_ease-in-out_infinite]">
                {language === 'en' ? '🚀 AI-Powered' : '🚀 AI-চালিত'}
              </div>

              {/* Floating badge bottom-left */}
              <div className="absolute -bottom-3 -left-3 bg-background/90 backdrop-blur-md border border-border/50 rounded-xl px-4 py-2 text-sm font-medium shadow-lg animate-[floatSlow_7s_ease-in-out_infinite_reverse]">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  {language === 'en' ? '99.9% Uptime' : '৯৯.৯% আপটাইম'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default ProductHero;
