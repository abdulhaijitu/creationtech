import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const ProductHero = () => {
  const { language } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/8 via-background to-accent/5 py-20 lg:py-28">
      {/* Animated Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl animate-[floatSlow_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-20 right-10 h-80 w-80 rounded-full bg-accent/5 blur-3xl animate-[floatSlow_10s_ease-in-out_infinite_reverse]" />
      
      <div className="container-custom relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div 
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary hero-animate hero-animate-delay-0"
          >
            <Sparkles className="h-4 w-4" />
            {language === 'en' ? 'Next-Gen Technology Platform' : 'পরবর্তী প্রজন্মের প্রযুক্তি প্ল্যাটফর্ম'}
          </div>
          
          {/* Product Name */}
          <h1 
            className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl hero-animate hero-animate-delay-1"
            style={{ letterSpacing: '-0.02em' }}
          >
            <span className="bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text">
              {language === 'en' ? 'CreationOS' : 'ক্রিয়েশনওএস'}
            </span>
          </h1>
          
          {/* Tagline */}
          <p 
            className="mb-4 text-xl font-medium text-foreground/80 sm:text-2xl hero-animate hero-animate-delay-2"
          >
            {language === 'en'
              ? 'The All-in-One Business Automation Suite'
              : 'অল-ইন-ওয়ান বিজনেস অটোমেশন স্যুট'}
          </p>
          
          {/* Value Proposition */}
          <p 
            className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground leading-relaxed hero-animate hero-animate-delay-3"
          >
            {language === 'en'
              ? 'Streamline operations, automate workflows, and scale effortlessly with our enterprise-grade platform built for modern businesses.'
              : 'আধুনিক ব্যবসার জন্য তৈরি আমাদের এন্টারপ্রাইজ-গ্রেড প্ল্যাটফর্ম দিয়ে অপারেশন সুবিন্যস্ত করুন, ওয়ার্কফ্লো অটোমেট করুন এবং সহজে স্কেল করুন।'}
          </p>
          
          {/* CTAs */}
          <div 
            className="flex flex-col items-center justify-center gap-4 sm:flex-row hero-animate hero-animate-delay-4"
          >
            <Button size="xl" asChild className="group shadow-lg hover:shadow-xl">
              <Link to="/contact?type=quote">
                {language === 'en' ? 'Get Started' : 'শুরু করুন'}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild className="group">
              <Link to="/contact?type=meeting">
                <Play className="mr-2 h-5 w-5" />
                {language === 'en' ? 'Request Demo' : 'ডেমো রিকোয়েস্ট'}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductHero;
