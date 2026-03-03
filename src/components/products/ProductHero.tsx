import { Sparkles, Zap, Shield, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import CountUp from '@/components/common/CountUp';
import ispManagerImg from '@/assets/products/isp-manager.jpg';
import somityAppImg from '@/assets/products/somity-app.jpg';
import restaurantAppImg from '@/assets/products/restaurant-app.jpg';

const stats = [
  { value: 500, suffix: '+', labelEn: 'Active Users', labelBn: 'সক্রিয় ব্যবহারকারী', icon: Zap },
  { value: 99.9, suffix: '%', labelEn: 'Uptime', labelBn: 'আপটাইম', icon: Shield },
  { value: 3, suffix: 'x', labelEn: 'Faster Growth', labelBn: 'দ্রুত বৃদ্ধি', icon: TrendingUp },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

const floatingVariants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

const ProductHero = () => {
  const { language } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-hero-background">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div
          className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full opacity-30 blur-3xl animate-gradient-shift"
          style={{ background: 'radial-gradient(circle, rgba(20, 184, 166, 0.4) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl animate-gradient-shift"
          style={{ background: 'radial-gradient(circle, rgba(6, 78, 59, 0.5) 0%, transparent 70%)', animationDelay: '4s' }}
        />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 70% 40%, rgba(20, 184, 166, 0.15) 0%, transparent 60%),
                        radial-gradient(ellipse 60% 50% at 20% 80%, rgba(6, 78, 59, 0.2) 0%, transparent 50%)`
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(20, 184, 166, 0.3) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(20, 184, 166, 0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* SVG Network Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25" aria-hidden="true">
        <defs>
          <linearGradient id="prodLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(20, 184, 166, 0.6)" />
            <stop offset="100%" stopColor="rgba(20, 184, 166, 0)" />
          </linearGradient>
        </defs>
        <line x1="50%" y1="30%" x2="70%" y2="20%" stroke="url(#prodLineGrad)" strokeWidth="1" className="animate-pulse-slow" />
        <line x1="55%" y1="50%" x2="75%" y2="45%" stroke="url(#prodLineGrad)" strokeWidth="1" className="animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <line x1="60%" y1="70%" x2="80%" y2="75%" stroke="url(#prodLineGrad)" strokeWidth="1" className="animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <circle cx="70%" cy="20%" r="4" fill="rgba(20, 184, 166, 0.5)" className="animate-float-slow" />
        <circle cx="75%" cy="45%" r="3" fill="rgba(20, 184, 166, 0.4)" className="animate-float-medium" />
        <circle cx="80%" cy="75%" r="3" fill="rgba(20, 184, 166, 0.45)" className="animate-float-slow" style={{ animationDelay: '1.5s' }} />
      </svg>

      <div className="container-custom relative z-10">
        <div className="grid min-h-[calc(100vh-5rem)] items-center gap-8 py-6 lg:min-h-[640px] lg:grid-cols-2 lg:gap-12 lg:py-8">
          {/* Left Column */}
          <motion.div
            className="flex flex-col justify-center text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-teal-400 backdrop-blur-sm shadow-lg shadow-teal-500/10 sm:text-sm">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                {language === 'en' ? 'Enterprise-Grade Solutions' : 'এন্টারপ্রাইজ-গ্রেড সমাধান'}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={itemVariants}
              className="mb-6 text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.5rem]"
              style={{ letterSpacing: '-0.02em' }}
            >
              {language === 'en' ? 'Powerful Software' : 'শক্তিশালী সফটওয়্যার'}
              <br />
              <span className="text-teal-400">
                {language === 'en' ? 'For Modern Business' : 'আধুনিক ব্যবসার জন্য'}
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p variants={itemVariants} className="mb-10 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg mx-auto lg:mx-0">
              {language === 'en'
                ? 'AI-powered, scalable solutions designed to automate operations, increase efficiency, and drive growth for businesses of all sizes.'
                : 'AI-চালিত, স্কেলযোগ্য সমাধান যা অপারেশন স্বয়ংক্রিয় করতে, দক্ষতা বাড়াতে এবং সব আকারের ব্যবসার বৃদ্ধি চালাতে ডিজাইন করা হয়েছে।'}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col items-center gap-4 sm:flex-row sm:gap-4 lg:justify-start">
              <Button
                size="lg"
                asChild
                className="group min-w-[160px] bg-gradient-to-r from-teal-500 to-teal-400 text-white shadow-xl shadow-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/40 hover:-translate-y-1 active:scale-[0.96] transition-all duration-300 border-0"
              >
                <Link to="/contact?type=quote">
                  {language === 'en' ? 'Get Started' : 'শুরু করুন'}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="min-w-[160px] border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 active:scale-[0.96] transition-all duration-300 backdrop-blur-sm"
              >
                <a href="#products-showcase">
                  {language === 'en' ? 'Explore Products' : 'প্রোডাক্ট দেখুন'}
                </a>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="mt-12 grid grid-cols-3 gap-3 max-w-md mx-auto lg:mx-0">
              {stats.map((stat, index) => {
                const StatIcon = stat.icon;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center rounded-xl border border-teal-500/20 bg-gradient-to-br from-teal-900/40 to-teal-900/20 p-3 sm:p-4 backdrop-blur-sm"
                  >
                    <StatIcon className="h-4 w-4 text-teal-400/70 mb-2" />
                    <span className="text-lg sm:text-xl font-bold text-white">
                      <CountUp end={stat.value} suffix={stat.suffix} />
                    </span>
                    <span className="text-[10px] text-white/50 uppercase tracking-wider mt-1">
                      {language === 'en' ? stat.labelEn : stat.labelBn}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Right Column — 3-Image Collage */}
          <motion.div
            className="relative hidden lg:flex items-center justify-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="relative w-full h-[480px]">
              {/* Decorative Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-teal-500/15 rounded-full blur-[100px] animate-pulse-slow" />

              {/* Large Image — Top Left */}
              <motion.div
                variants={imageVariants}
                className="absolute top-0 left-0 w-[55%] rounded-2xl overflow-hidden border border-teal-500/20 shadow-2xl shadow-teal-900/40"
              >
                <img
                  src={ispManagerImg}
                  alt="ISP Manager - Network Management Solution"
                  className="w-full h-56 object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/40 via-transparent to-transparent" />
              </motion.div>

              {/* Medium Image — Top Right */}
              <motion.div
                variants={imageVariants}
                className="absolute top-12 right-0 w-[42%] rounded-2xl overflow-hidden border border-teal-500/20 shadow-2xl shadow-teal-900/40"
              >
                <img
                  src={somityAppImg}
                  alt="Somity App - Microfinance Management"
                  className="w-full h-48 object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/40 via-transparent to-transparent" />
              </motion.div>

              {/* Small Image — Bottom Center */}
              <motion.div
                variants={imageVariants}
                className="absolute bottom-0 left-[15%] w-[50%] rounded-2xl overflow-hidden border border-teal-500/20 shadow-2xl shadow-teal-900/40"
              >
                <img
                  src={restaurantAppImg}
                  alt="Restaurant App - POS & Order Management"
                  className="w-full h-44 object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/40 via-transparent to-transparent" />
              </motion.div>

              {/* Floating Badge — AI-Powered */}
              <motion.div
                variants={floatingVariants}
                animate="animate"
                className="absolute top-2 right-4 bg-gradient-to-r from-teal-500 to-teal-400 text-white rounded-xl px-4 py-2 text-sm font-semibold shadow-lg shadow-teal-500/30 z-10"
              >
                {language === 'en' ? '🚀 AI-Powered' : '🚀 AI-চালিত'}
              </motion.div>

              {/* Floating Badge — Uptime */}
              <motion.div
                variants={floatingVariants}
                animate="animate"
                className="absolute bottom-6 right-4 bg-[#0a1628]/90 backdrop-blur-md border border-teal-500/20 rounded-xl px-4 py-2 text-sm font-medium text-white shadow-lg z-10"
                style={{ animationDelay: '1.5s' }}
              >
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
                  {language === 'en' ? '99.9% Uptime' : '৯৯.৯% আপটাইম'}
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a1628] to-transparent" />
    </section>
  );
};

export default ProductHero;
