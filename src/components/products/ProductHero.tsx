import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ProductHero = () => {
  const { language } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/8 via-background to-accent/5 py-16 lg:py-20">
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
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div 
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary hero-animate hero-animate-delay-0"
          >
            <Sparkles className="h-4 w-4" />
            {language === 'en' ? 'Built for scalability & performance' : 'স্কেলযোগ্যতা এবং পারফরম্যান্সের জন্য তৈরি'}
          </div>
          
          {/* Page Title */}
          <h1 
            className="mb-5 text-4xl font-bold tracking-tight sm:text-5xl hero-animate hero-animate-delay-1"
            style={{ letterSpacing: '-0.02em' }}
          >
            <span className="bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text">
              {language === 'en' ? 'Our Products' : 'আমাদের প্রোডাক্টস'}
            </span>
          </h1>
          
          {/* Description */}
          <p 
            className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed hero-animate hero-animate-delay-2"
          >
            {language === 'en'
              ? 'AI-powered software products designed to solve real business problems.'
              : 'বাস্তব ব্যবসায়িক সমস্যা সমাধানের জন্য ডিজাইন করা AI-পাওয়ার্ড সফটওয়্যার প্রোডাক্ট।'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProductHero;
