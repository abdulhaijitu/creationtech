import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Cloud, Cpu, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const serviceChips = [
  { 
    icon: Code2, 
    en: 'Web Application Development', 
    bn: 'ওয়েব অ্যাপ্লিকেশন ডেভেলপমেন্ট' 
  },
  { 
    icon: Cpu, 
    en: 'AI & Automation Solutions', 
    bn: 'AI ও অটোমেশন সলিউশন' 
  },
  { 
    icon: Cloud, 
    en: 'Cloud & Backend Systems', 
    bn: 'ক্লাউড ও ব্যাকএন্ড সিস্টেম' 
  },
  { 
    icon: CreditCard, 
    en: 'Payment & Business Tools', 
    bn: 'পেমেন্ট ও বিজনেস টুলস' 
  },
];

const HeroSection = () => {
  const { language } = useLanguage();

  const headline = language === 'en' 
    ? 'Future-ready Technology Solutions for Modern Businesses'
    : 'আধুনিক ব্যবসার জন্য ভবিষ্যত-প্রস্তুত প্রযুক্তি সমাধান';

  const subheadline = language === 'en'
    ? 'We build scalable web, AI-powered systems, and automation-driven products.'
    : 'আমরা স্কেলযোগ্য ওয়েব, AI-চালিত সিস্টেম এবং অটোমেশন-ভিত্তিক পণ্য তৈরি করি।';

  const ctaPrimary = language === 'en' ? 'Start Your Project' : 'আপনার প্রজেক্ট শুরু করুন';
  const ctaSecondary = language === 'en' ? 'Explore Services' : 'সার্ভিস দেখুন';

  return (
    <section className="relative overflow-hidden gradient-hero">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-[0.08] animate-gradient-shift"
          style={{
            backgroundImage: `radial-gradient(ellipse 80% 50% at 20% 40%, rgba(255,255,255,0.5) 0%, transparent 50%),
                             radial-gradient(ellipse 60% 40% at 80% 60%, rgba(255,255,255,0.4) 0%, transparent 50%)`
          }} 
        />
        {/* Tech grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />
        {/* Floating nodes - CSS only */}
        <div className="absolute top-1/4 right-1/4 h-2 w-2 rounded-full bg-white/20 animate-float-slow" />
        <div className="absolute top-1/3 right-1/3 h-1.5 w-1.5 rounded-full bg-white/15 animate-float-medium" />
        <div className="absolute bottom-1/3 left-1/4 h-2.5 w-2.5 rounded-full bg-white/10 animate-float-slow" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="container-custom relative">
        <div className="grid min-h-[calc(100vh-5rem)] items-center gap-12 py-16 lg:min-h-[720px] lg:grid-cols-2 lg:gap-16 lg:py-24">
          {/* Left: Text + CTA */}
          <div className="flex flex-col justify-center text-center lg:text-left">
            {/* Badge */}
            <div 
              className="mb-6 inline-flex items-center justify-center gap-2.5 self-center rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-4 py-1.5 text-sm text-primary-foreground/90 backdrop-blur-sm lg:self-start hero-animate hero-animate-delay-0"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="font-medium">
                {language === 'en' ? 'Trusted by 100+ businesses' : '১০০+ ব্যবসা বিশ্বস্ত'}
              </span>
            </div>

            {/* Headline */}
            <h1 
              className="mb-6 text-3xl font-bold leading-[1.1] tracking-tight text-primary-foreground sm:text-4xl md:text-5xl lg:text-[3.5rem] hero-animate hero-animate-delay-1"
              style={{ letterSpacing: '-0.03em' }}
            >
              {headline}
            </h1>

            {/* Subheadline */}
            <p 
              className="mb-8 max-w-xl text-base leading-relaxed text-primary-foreground/75 sm:text-lg lg:text-xl hero-animate hero-animate-delay-2 mx-auto lg:mx-0"
            >
              {subheadline}
            </p>

            {/* Service Chips */}
            <div className="mb-10 flex flex-wrap justify-center gap-2 lg:justify-start hero-animate hero-animate-delay-3">
              {serviceChips.map((chip, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-2 rounded-full border border-primary-foreground/10 bg-primary-foreground/5 px-3.5 py-2 text-xs font-medium text-primary-foreground/85 backdrop-blur-sm transition-all duration-200 hover:scale-[1.03] hover:bg-primary-foreground/10 hover:shadow-lg sm:text-sm"
                >
                  <chip.icon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-6 sm:h-4 sm:w-4" />
                  <span>{language === 'en' ? chip.en : chip.bn}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div 
              className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4 lg:justify-start hero-animate hero-animate-delay-4"
            >
              <Button
                size="lg"
                variant="accent"
                asChild
                className="hero-cta-primary min-w-[180px] shadow-lg"
              >
                <Link to="/contact?type=quote">
                  {ctaPrimary}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="hero-cta-secondary min-w-[180px] border-primary-foreground/20 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/30"
              >
                <Link to="/services">{ctaSecondary}</Link>
              </Button>
            </div>
          </div>

          {/* Right: Animated Tech Visual */}
          <div className="relative hidden lg:flex lg:items-center lg:justify-center">
            <div className="relative w-full max-w-lg hero-animate hero-animate-delay-2">
              {/* Main visual container */}
              <div className="relative">
                {/* Background glow */}
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-white/10 to-transparent blur-2xl" />
                
                {/* Floating UI Cards */}
                <div className="relative space-y-4">
                  {/* Code block card */}
                  <div className="tech-card tech-card-1 ml-8 rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-5 backdrop-blur-md">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                        <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
                      </div>
                      <span className="ml-2 text-xs text-primary-foreground/50">api.ts</span>
                    </div>
                    <div className="font-mono text-xs text-primary-foreground/70 space-y-1">
                      <div><span className="text-blue-300">const</span> <span className="text-green-300">response</span> = <span className="text-yellow-300">await</span></div>
                      <div className="pl-4"><span className="text-purple-300">fetch</span>(<span className="text-orange-300">'/api/data'</span>);</div>
                      <div><span className="text-blue-300">return</span> response.<span className="text-purple-300">json</span>();</div>
                    </div>
                  </div>

                  {/* Dashboard card */}
                  <div className="tech-card tech-card-2 mr-12 rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-5 backdrop-blur-md">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-medium text-primary-foreground/80">Analytics</span>
                      <span className="text-xs text-green-400">+24.5%</span>
                    </div>
                    <div className="flex items-end gap-1 h-12">
                      {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                        <div 
                          key={i} 
                          className="flex-1 rounded-t bg-gradient-to-t from-primary-foreground/30 to-primary-foreground/10 transition-all duration-300"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* System node card */}
                  <div className="tech-card tech-card-3 ml-16 rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-5 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary-foreground/20 to-primary-foreground/5 flex items-center justify-center">
                          <Cloud className="h-5 w-5 text-primary-foreground/70" />
                        </div>
                        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-primary/50" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary-foreground/80">Cloud Connected</p>
                        <p className="text-xs text-primary-foreground/50">3 services active</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connection lines - decorative */}
                <svg className="absolute inset-0 h-full w-full pointer-events-none opacity-20" aria-hidden="true">
                  <line x1="60" y1="80" x2="120" y2="140" stroke="currentColor" strokeWidth="1" className="text-primary-foreground" />
                  <line x1="200" y1="160" x2="140" y2="220" stroke="currentColor" strokeWidth="1" className="text-primary-foreground" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave transition */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-auto w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 80L60 70C120 60 240 40 360 30C480 20 600 20 720 25C840 30 960 40 1080 45C1200 50 1320 50 1380 50L1440 50V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0V80Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
