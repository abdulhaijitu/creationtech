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
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' as const },
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
    <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--primary)/0.08)] via-background to-[hsl(var(--accent)/0.06)] py-16 lg:py-24">
      {/* Background Grid */}
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

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <motion.div
            className="text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2.5 text-sm font-medium text-primary ring-1 ring-primary/20 shadow-lg shadow-primary/5 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>
                {language === 'en' ? 'Enterprise-Grade Solutions' : 'এন্টারপ্রাইজ-গ্রেড সমাধান'}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={itemVariants}
              className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
              style={{ letterSpacing: '-0.025em' }}
            >
              <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                {language === 'en' ? 'Powerful Software' : 'শক্তিশালী সফটওয়্যার'}
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                {language === 'en' ? 'For Modern Business' : 'আধুনিক ব্যবসার জন্য'}
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p variants={itemVariants} className="max-w-xl text-lg text-muted-foreground leading-relaxed mx-auto lg:mx-0">
              {language === 'en'
                ? 'AI-powered, scalable solutions designed to automate operations, increase efficiency, and drive growth for businesses of all sizes.'
                : 'AI-চালিত, স্কেলযোগ্য সমাধান যা অপারেশন স্বয়ংক্রিয় করতে, দক্ষতা বাড়াতে এবং সব আকারের ব্যবসার বৃদ্ধি চালাতে ডিজাইন করা হয়েছে।'}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="mt-8 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
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
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              {stats.map((stat, index) => (
                <div key={index} className="relative group min-w-0">
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
            </motion.div>
          </motion.div>

          {/* Right Column — 3-Image Collage */}
          <motion.div
            className="relative hidden lg:block h-[520px]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Decorative Circles */}
            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="absolute -top-6 -left-6 h-48 w-48 rounded-full bg-primary/10 blur-2xl"
            />
            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="absolute bottom-10 -right-8 h-40 w-40 rounded-full bg-accent/15 blur-2xl"
              style={{ animationDelay: '1s' }}
            />
            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full bg-primary/8 blur-xl"
              style={{ animationDelay: '2s' }}
            />

            {/* Large Image — Top Left */}
            <motion.div
              variants={imageVariants}
              className="absolute top-0 left-0 w-[58%] rounded-2xl overflow-hidden border border-border/30 shadow-2xl shadow-primary/10"
            >
              <img
                src={ispManagerImg}
                alt="ISP Manager - Network Management Solution"
                className="w-full h-64 object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
            </motion.div>

            {/* Medium Image — Top Right (offset down) */}
            <motion.div
              variants={imageVariants}
              className="absolute top-16 right-0 w-[46%] rounded-2xl overflow-hidden border border-border/30 shadow-2xl shadow-accent/10"
            >
              <img
                src={somityAppImg}
                alt="Somity App - Microfinance Management"
                className="w-full h-52 object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
            </motion.div>

            {/* Small Image — Bottom Center */}
            <motion.div
              variants={imageVariants}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[52%] rounded-2xl overflow-hidden border border-border/30 shadow-2xl shadow-primary/10"
            >
              <img
                src={restaurantAppImg}
                alt="Restaurant App - POS & Order Management"
                className="w-full h-48 object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
            </motion.div>

            {/* Floating Badge */}
            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="absolute -top-3 right-8 bg-primary text-primary-foreground rounded-xl px-4 py-2 text-sm font-semibold shadow-lg shadow-primary/30 z-10"
            >
              {language === 'en' ? '🚀 AI-Powered' : '🚀 AI-চালিত'}
            </motion.div>

            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="absolute bottom-8 left-4 bg-background/90 backdrop-blur-md border border-border/50 rounded-xl px-4 py-2 text-sm font-medium shadow-lg z-10"
              style={{ animationDelay: '1.5s' }}
            >
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                {language === 'en' ? '99.9% Uptime' : '৯৯.৯% আপটাইম'}
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default ProductHero;
