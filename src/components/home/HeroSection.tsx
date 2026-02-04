import { Link } from 'react-router-dom';
import { ArrowRight, Users, Package, Award, Clock, Brain, Cpu, Sparkles, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import CountUp from '@/components/common/CountUp';
import { useState, useEffect } from 'react';
import heroOffice1 from '@/assets/hero-office-1.jpg';
import heroOffice2 from '@/assets/hero-office-2.jpg';
import heroOffice3 from '@/assets/hero-office-3.jpg';

const stats = [
  { 
    value: 10, 
    suffix: 'M+', 
    label: 'USERS',
    labelBn: 'ইউজার',
    icon: Users 
  },
  { 
    value: 12, 
    suffix: '+', 
    label: 'PRODUCTS',
    labelBn: 'প্রোডাক্ট',
    icon: Package 
  },
  { 
    value: 100, 
    suffix: '+', 
    label: 'TALENTS',
    labelBn: 'ট্যালেন্ট',
    icon: Award 
  },
  { 
    value: 10, 
    suffix: '+', 
    label: 'EXPERIENCE',
    labelBn: 'অভিজ্ঞতা',
    icon: Clock 
  },
];

// Rotating words for typewriter effect
const rotatingWordsEn = ['AI-Powered', 'Innovative', 'Scalable', 'Modern'];
const rotatingWordsBn = ['AI-চালিত', 'উদ্ভাবনী', 'স্কেলযোগ্য', 'আধুনিক'];

const HeroSection = () => {
  const { language } = useLanguage();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const rotatingWords = language === 'en' ? rotatingWordsEn : rotatingWordsBn;

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [rotatingWords.length]);

  const badge = language === 'en' 
    ? 'DIGITIZE YOUR IMAGINATION'
    : 'আপনার কল্পনাকে ডিজিটাইজ করুন';

  const headlineStart = language === 'en' 
    ? ''
    : '';

  const headlineEnd = language === 'en' 
    ? 'Software Development Company in Bangladesh'
    : 'সফটওয়্যার ডেভেলপমেন্ট কোম্পানি বাংলাদেশে';

  const subheadline = language === 'en'
    ? 'We build AI-driven, scalable software solutions for modern businesses and industries across B2B and B2C sectors.'
    : 'আমরা B2B এবং B2C সেক্টরে আধুনিক ব্যবসা ও শিল্পের জন্য AI-চালিত, স্কেলযোগ্য সফটওয়্যার সমাধান তৈরি করি।';

  const ctaPrimary = language === 'en' ? 'Company Deck' : 'কোম্পানি ডেক';
  const ctaSecondary = language === 'en' ? 'Our Products' : 'আমাদের প্রোডাক্ট';

  return (
    <section className="relative overflow-hidden bg-[#0a1628]">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        {/* Primary gradient orbs */}
        <div 
          className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full opacity-30 blur-3xl animate-gradient-shift"
          style={{
            background: 'radial-gradient(circle, rgba(20, 184, 166, 0.4) 0%, transparent 70%)'
          }}
        />
        <div 
          className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl animate-gradient-shift"
          style={{
            background: 'radial-gradient(circle, rgba(6, 78, 59, 0.5) 0%, transparent 70%)',
            animationDelay: '4s'
          }}
        />
        
        {/* Gradient overlays */}
        <div 
          className="absolute inset-0 opacity-60"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 70% 40%, rgba(20, 184, 166, 0.15) 0%, transparent 60%),
                        radial-gradient(ellipse 60% 50% at 20% 80%, rgba(6, 78, 59, 0.2) 0%, transparent 50%)`
          }}
        />
        
        {/* Animated grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(20, 184, 166, 0.3) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(20, 184, 166, 0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
        
        {/* Animated noise texture */}
        <div className="absolute inset-0 opacity-[0.015] bg-noise" />
      </div>

      {/* AI Network Lines - Enhanced */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25" aria-hidden="true">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(20, 184, 166, 0.6)" />
            <stop offset="100%" stopColor="rgba(20, 184, 166, 0)" />
          </linearGradient>
          <linearGradient id="lineGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(20, 184, 166, 0.4)" />
            <stop offset="100%" stopColor="rgba(20, 184, 166, 0)" />
          </linearGradient>
        </defs>
        {/* Connecting lines */}
        <line x1="50%" y1="30%" x2="70%" y2="20%" stroke="url(#lineGradient)" strokeWidth="1" className="animate-pulse-slow" />
        <line x1="55%" y1="50%" x2="75%" y2="45%" stroke="url(#lineGradient)" strokeWidth="1" className="animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <line x1="60%" y1="70%" x2="80%" y2="75%" stroke="url(#lineGradient)" strokeWidth="1" className="animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <line x1="30%" y1="20%" x2="45%" y2="35%" stroke="url(#lineGradient2)" strokeWidth="1" className="animate-pulse-slow" style={{ animationDelay: '0.5s' }} />
        <line x1="25%" y1="60%" x2="40%" y2="50%" stroke="url(#lineGradient2)" strokeWidth="1" className="animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        {/* Floating nodes */}
        <circle cx="70%" cy="20%" r="4" fill="rgba(20, 184, 166, 0.5)" className="animate-float-slow" />
        <circle cx="75%" cy="45%" r="3" fill="rgba(20, 184, 166, 0.4)" className="animate-float-medium" />
        <circle cx="80%" cy="75%" r="3" fill="rgba(20, 184, 166, 0.45)" className="animate-float-slow" style={{ animationDelay: '1.5s' }} />
        <circle cx="30%" cy="20%" r="2.5" fill="rgba(20, 184, 166, 0.35)" className="animate-float-medium" style={{ animationDelay: '0.8s' }} />
        <circle cx="25%" cy="60%" r="2" fill="rgba(20, 184, 166, 0.3)" className="animate-float-slow" style={{ animationDelay: '2s' }} />
      </svg>
      
      <div className="container-custom relative">
        <div className="grid min-h-[calc(100vh-5rem)] items-center gap-8 py-8 lg:min-h-[700px] lg:grid-cols-2 lg:gap-16 lg:py-12">
          {/* Left: Text + CTA */}
          <div className="flex flex-col justify-center text-center lg:text-left">
            {/* Badge */}
            <div className="mb-6 hero-animate hero-animate-delay-0">
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-teal-400 backdrop-blur-sm sm:text-sm shadow-lg shadow-teal-500/10">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                {badge}
              </span>
            </div>

            {/* Headline with Rotating Word */}
            <h1 
              className="mb-6 text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.5rem] hero-animate hero-animate-delay-1"
              style={{ letterSpacing: '-0.02em' }}
            >
              <span 
                className={`inline-block text-teal-400 transition-all duration-300 ${
                  isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                }`}
              >
                {rotatingWords[currentWordIndex]}
              </span>
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              {headlineEnd}
            </h1>

            {/* Subheadline */}
            <p className="mb-10 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg hero-animate hero-animate-delay-2 mx-auto lg:mx-0">
              {subheadline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-4 lg:justify-start hero-animate hero-animate-delay-3">
              <Button
                size="lg"
                asChild
                className="group min-w-[160px] bg-gradient-to-r from-teal-500 to-teal-400 text-white shadow-xl shadow-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/40 hover:-translate-y-1 active:scale-[0.96] transition-all duration-300 border-0"
              >
                <Link to="/about">
                  <Play className="h-4 w-4 mr-2 fill-current" />
                  {ctaPrimary}
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="min-w-[160px] border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 active:scale-[0.96] transition-all duration-300 group backdrop-blur-sm"
              >
                <Link to="/products">
                  {ctaSecondary}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex items-center justify-center gap-6 lg:justify-start hero-animate hero-animate-delay-4">
              <div className="flex items-center gap-2 text-white/40">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className="h-8 w-8 rounded-full border-2 border-[#0a1628] bg-gradient-to-br from-teal-400 to-teal-600"
                    />
                  ))}
                </div>
                <span className="text-sm">
                  {language === 'en' ? '500+ Happy Clients' : '৫০০+ সন্তুষ্ট ক্লায়েন্ট'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: AI Visual Collage */}
          <div className="relative hidden lg:block">
            <div className="relative w-full max-w-[560px] mx-auto hero-animate hero-animate-delay-2">
              {/* Glow effect behind cards */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-teal-500/20 rounded-full blur-[100px] animate-pulse-slow" />
              
              {/* Stat Card - Top Left */}
              <div className="absolute -left-4 top-8 z-20 hero-card hero-card-delay-0">
                <div className="flex flex-col items-center justify-center rounded-2xl border border-teal-500/20 bg-gradient-to-br from-teal-900/50 to-teal-900/30 p-5 backdrop-blur-md shadow-xl shadow-teal-900/20 hover:border-teal-500/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-float-slow min-w-[120px]">
                  <Brain className="h-5 w-5 text-teal-400/70 mb-2" />
                  <span className="text-2xl font-bold text-white">
                    <CountUp end={stats[0].value} duration={2000} />{stats[0].suffix}
                  </span>
                  <span className="text-xs text-white/50 uppercase tracking-wider mt-1">
                    {language === 'en' ? stats[0].label : stats[0].labelBn}
                  </span>
                </div>
              </div>

              {/* Main Image Card - Top Right */}
              <div className="ml-auto w-[280px] hero-card hero-card-delay-1">
                <div className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl hover:border-teal-500/30 hover:-translate-y-1 transition-all duration-300 animate-float-medium" style={{ animationDelay: '0.5s' }}>
                  <img 
                    src={heroOffice1} 
                    alt="AI-powered tech workspace" 
                    className="w-full h-[180px] object-cover"
                    loading="lazy"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-900/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>

              {/* Middle Row */}
              <div className="flex items-center gap-4 mt-4">
                {/* Second Image */}
                <div className="w-[200px] hero-card hero-card-delay-2">
                  <div className="overflow-hidden rounded-2xl border border-white/10 shadow-xl hover:border-teal-500/30 hover:-translate-y-1 transition-all duration-300 animate-float-slow" style={{ animationDelay: '1s' }}>
                    <img 
                      src={heroOffice2} 
                      alt="Team collaboration" 
                      className="w-full h-[200px] object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Stat Cards Column */}
                <div className="flex flex-col gap-4 flex-1">
                  {/* Products Stat */}
                  <div className="hero-card hero-card-delay-3">
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-teal-500/20 bg-gradient-to-br from-teal-900/50 to-teal-900/30 p-4 backdrop-blur-md shadow-xl shadow-teal-900/20 hover:border-teal-500/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-float-medium" style={{ animationDelay: '0.3s' }}>
                      <Package className="h-4 w-4 text-teal-400/70 mb-1" />
                      <span className="text-xl font-bold text-white">
                        <CountUp end={stats[1].value} duration={2000} />{stats[1].suffix}
                      </span>
                      <span className="text-[10px] text-white/50 uppercase tracking-wider">
                        {language === 'en' ? stats[1].label : stats[1].labelBn}
                      </span>
                    </div>
                  </div>

                  {/* Talents Stat */}
                  <div className="hero-card hero-card-delay-4">
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-teal-500/20 bg-gradient-to-br from-teal-900/50 to-teal-900/30 p-4 backdrop-blur-md shadow-xl shadow-teal-900/20 hover:border-teal-500/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-float-slow" style={{ animationDelay: '0.8s' }}>
                      <Award className="h-4 w-4 text-teal-400/70 mb-1" />
                      <span className="text-xl font-bold text-white">
                        <CountUp end={stats[2].value} duration={2500} />{stats[2].suffix}
                      </span>
                      <span className="text-[10px] text-white/50 uppercase tracking-wider">
                        {language === 'en' ? stats[2].label : stats[2].labelBn}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="flex items-end gap-4 mt-4">
                {/* Third Image */}
                <div className="w-[180px] hero-card hero-card-delay-5">
                  <div className="overflow-hidden rounded-2xl border border-white/10 shadow-xl hover:border-teal-500/30 hover:-translate-y-1 transition-all duration-300 animate-float-medium" style={{ animationDelay: '1.5s' }}>
                    <img 
                      src={heroOffice3} 
                      alt="Modern tech team" 
                      className="w-full h-[120px] object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Experience Stat - Bottom Right */}
                <div className="flex-1 hero-card hero-card-delay-6">
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-teal-500/20 bg-gradient-to-br from-teal-900/50 to-teal-900/30 p-5 backdrop-blur-md shadow-xl shadow-teal-900/20 hover:border-teal-500/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-float-slow" style={{ animationDelay: '2s' }}>
                    <Cpu className="h-5 w-5 text-teal-400/70 mb-2" />
                    <span className="text-2xl font-bold text-white">
                      <CountUp end={stats[3].value} duration={2000} />{stats[3].suffix}
                    </span>
                    <span className="text-xs text-white/50 uppercase tracking-wider mt-1">
                      {language === 'en' ? stats[3].label : stats[3].labelBn}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Mobile Stats Row */}
          <div className="grid grid-cols-2 gap-4 lg:hidden hero-animate hero-animate-delay-4">
            {stats.map((stat, index) => {
              const StatIcon = stat.icon;
              return (
                <div 
                  key={index}
                  className="flex flex-col items-center justify-center rounded-xl border border-teal-500/20 bg-gradient-to-br from-teal-900/40 to-teal-900/20 p-4 backdrop-blur-sm"
                >
                  <StatIcon className="h-4 w-4 text-teal-400/70 mb-2" />
                  <span className="text-xl font-bold text-white">
                    <CountUp end={stat.value} duration={2000} />{stat.suffix}
                  </span>
                  <span className="text-[10px] text-white/50 uppercase tracking-wider mt-1">
                    {language === 'en' ? stat.label : stat.labelBn}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a1628] to-transparent" />
    </section>
  );
};

export default HeroSection;
