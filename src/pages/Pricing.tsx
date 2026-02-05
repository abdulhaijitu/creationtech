 import { Helmet } from 'react-helmet-async';
 import { Link } from 'react-router-dom';
 import { Check, ArrowRight, HelpCircle, Sparkles, X, Zap, Shield, Users, Headphones } from 'lucide-react';
 import Layout from '@/components/layout/Layout';
 import { useLanguage } from '@/contexts/LanguageContext';
 import { Card, CardContent } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { useCMSContent } from '@/hooks/useCMSContent';
 import ScrollReveal from '@/components/common/ScrollReveal';
 import { cn } from '@/lib/utils';
 
 const pricingPlans = [
   {
     nameEn: 'Starter',
     nameBn: 'স্টার্টার',
     descEn: 'Perfect for small businesses',
     descBn: 'ছোট ব্যবসার জন্য উপযুক্ত',
     priceEn: '$999',
     priceBn: '৯৯,০০০',
     periodEn: 'starting from',
     periodBn: 'শুরু',
     popular: false,
     icon: Zap,
     color: 'from-blue-500 to-cyan-500',
     features: [
       { en: 'Basic Website (5-10 pages)', bn: 'বেসিক ওয়েবসাইট (৫-১০ পেজ)' },
       { en: 'Responsive Design', bn: 'রেসপন্সিভ ডিজাইন' },
       { en: 'Contact Form Integration', bn: 'কন্টাক্ট ফর্ম ইন্টিগ্রেশন' },
       { en: 'Basic SEO Setup', bn: 'বেসিক SEO সেটআপ' },
       { en: '3 Months Support', bn: '৩ মাস সাপোর্ট' }
     ]
   },
   {
     nameEn: 'Professional',
     nameBn: 'প্রফেশনাল',
     descEn: 'Ideal for growing businesses',
     descBn: 'বৃদ্ধিশীল ব্যবসার জন্য আদর্শ',
     priceEn: '$2,999',
     priceBn: '২,৯৯,০০০',
     periodEn: 'starting from',
     periodBn: 'শুরু',
     popular: true,
     icon: Shield,
     color: 'from-primary to-accent',
     features: [
       { en: 'Custom Web Application', bn: 'কাস্টম ওয়েব অ্যাপ্লিকেশন' },
       { en: 'Database Integration', bn: 'ডেটাবেস ইন্টিগ্রেশন' },
       { en: 'Admin Dashboard', bn: 'অ্যাডমিন ড্যাশবোর্ড' },
       { en: 'Advanced SEO', bn: 'অ্যাডভান্সড SEO' },
       { en: 'Payment Integration', bn: 'পেমেন্ট ইন্টিগ্রেশন' },
       { en: '6 Months Support', bn: '৬ মাস সাপোর্ট' }
     ]
   },
   {
     nameEn: 'Enterprise',
     nameBn: 'এন্টারপ্রাইজ',
     descEn: 'For large-scale solutions',
     descBn: 'বড় মাপের সলিউশনের জন্য',
     priceEn: 'Custom',
     priceBn: 'কাস্টম',
     periodEn: 'contact us',
     periodBn: 'যোগাযোগ করুন',
     popular: false,
     icon: Users,
     color: 'from-purple-500 to-pink-500',
     features: [
       { en: 'Enterprise Architecture', bn: 'এন্টারপ্রাইজ আর্কিটেকচার' },
       { en: 'Cloud Infrastructure', bn: 'ক্লাউড ইনফ্রাস্ট্রাকচার' },
       { en: 'API Development', bn: 'API ডেভেলপমেন্ট' },
       { en: 'Security Implementation', bn: 'সিকিউরিটি বাস্তবায়ন' },
       { en: 'DevOps Setup', bn: 'DevOps সেটআপ' },
       { en: 'Dedicated Support Team', bn: 'ডেডিকেটেড সাপোর্ট টিম' },
       { en: 'SLA Guarantee', bn: 'SLA গ্যারান্টি' }
     ]
   }
 ];
 
 const comparisonFeatures = [
   {
     categoryEn: 'Development',
     categoryBn: 'ডেভেলপমেন্ট',
     features: [
       { nameEn: 'Custom Design', nameBn: 'কাস্টম ডিজাইন', starter: true, professional: true, enterprise: true },
       { nameEn: 'Responsive Layout', nameBn: 'রেসপন্সিভ লেআউট', starter: true, professional: true, enterprise: true },
       { nameEn: 'CMS Integration', nameBn: 'CMS ইন্টিগ্রেশন', starter: false, professional: true, enterprise: true },
       { nameEn: 'E-commerce Features', nameBn: 'ই-কমার্স ফিচার', starter: false, professional: true, enterprise: true },
       { nameEn: 'Custom API Development', nameBn: 'কাস্টম API', starter: false, professional: false, enterprise: true }
     ]
   },
   {
     categoryEn: 'Security & Performance',
     categoryBn: 'সিকিউরিটি ও পারফরম্যান্স',
     features: [
       { nameEn: 'SSL Certificate', nameBn: 'SSL সার্টিফিকেট', starter: true, professional: true, enterprise: true },
       { nameEn: 'DDoS Protection', nameBn: 'DDoS প্রোটেকশন', starter: false, professional: true, enterprise: true },
       { nameEn: 'Daily Backups', nameBn: 'দৈনিক ব্যাকআপ', starter: false, professional: true, enterprise: true },
       { nameEn: 'Load Balancing', nameBn: 'লোড ব্যালান্সিং', starter: false, professional: false, enterprise: true },
       { nameEn: 'Penetration Testing', nameBn: 'পেনিট্রেশন টেস্টিং', starter: false, professional: false, enterprise: true }
     ]
   },
   {
     categoryEn: 'Support & Maintenance',
     categoryBn: 'সাপোর্ট ও রক্ষণাবেক্ষণ',
     features: [
       { nameEn: 'Email Support', nameBn: 'ইমেইল সাপোর্ট', starter: true, professional: true, enterprise: true },
       { nameEn: 'Phone Support', nameBn: 'ফোন সাপোর্ট', starter: false, professional: true, enterprise: true },
       { nameEn: 'Priority Response', nameBn: 'প্রায়োরিটি রেসপন্স', starter: false, professional: true, enterprise: true },
       { nameEn: 'Dedicated Manager', nameBn: 'ডেডিকেটেড ম্যানেজার', starter: false, professional: false, enterprise: true },
       { nameEn: '24/7 Support', nameBn: '২৪/৭ সাপোর্ট', starter: false, professional: false, enterprise: true }
     ]
   }
 ];
 
 const faqs = [
   {
     questionEn: 'How do you determine project pricing?',
     questionBn: 'আপনারা কীভাবে প্রকল্পের মূল্য নির্ধারণ করেন?',
     answerEn: 'Pricing is based on project scope, complexity, timeline, and specific requirements.',
     answerBn: 'মূল্য নির্ধারণ প্রকল্পের পরিধি, জটিলতা, সময়সীমা এবং নির্দিষ্ট প্রয়োজনীয়তার উপর ভিত্তি করে।'
   },
   {
     questionEn: 'What payment methods do you accept?',
     questionBn: 'আপনারা কোন পেমেন্ট পদ্ধতি গ্রহণ করেন?',
     answerEn: 'We accept bank transfers, credit cards, and popular mobile payment methods.',
     answerBn: 'আমরা ব্যাংক ট্রান্সফার, ক্রেডিট কার্ড এবং জনপ্রিয় মোবাইল পেমেন্ট পদ্ধতি গ্রহণ করি।'
   },
   {
     questionEn: 'Do you offer ongoing maintenance?',
     questionBn: 'আপনারা কি চলমান রক্ষণাবেক্ষণ অফার করেন?',
     answerEn: 'Yes, we offer monthly maintenance packages starting from $199/month.',
     answerBn: 'হ্যাঁ, আমরা $১৯৯/মাস থেকে শুরু করে মাসিক রক্ষণাবেক্ষণ প্যাকেজ অফার করি।'
   },
   {
     questionEn: 'What is your typical project timeline?',
     questionBn: 'আপনাদের সাধারণ প্রকল্প সময়সীমা কত?',
     answerEn: 'Basic website: 2-4 weeks, custom apps: 2-4 months, enterprise: 4-12 months.',
     answerBn: 'বেসিক ওয়েবসাইট ২-৪ সপ্তাহ, কাস্টম অ্যাপ্লিকেশন ২-৪ মাস, এন্টারপ্রাইজ ৪-১২ মাস।'
   }
 ];
 
 const FeatureIcon = ({ included }: { included: boolean }) => (
   included ? (
     <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20">
       <Check className="h-3.5 w-3.5 text-accent" />
     </div>
   ) : (
     <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
       <X className="h-3.5 w-3.5 text-muted-foreground/50" />
     </div>
   )
 );
 
 const Pricing = () => {
   const { t, language } = useLanguage();
   const { getSectionText, getMetaTitle, getMetaDescription } = useCMSContent({ pageSlug: 'pricing' });
 
   const heroTitle = getSectionText('hero', 'title', language === 'en' ? 'Pricing' : 'মূল্য');
   const heroSubtitle = getSectionText('hero', 'content', language === 'en' ? 'Transparent pricing for quality solutions' : 'মানসম্মত সমাধানের জন্য স্বচ্ছ মূল্য');
   const ctaTitle = getSectionText('cta', 'title', language === 'en' ? 'Need a Custom Quote?' : 'কাস্টম কোটেশন প্রয়োজন?');
   const ctaContent = getSectionText('cta', 'content', language === 'en' ? 'Every project is unique. Contact us to discuss your specific requirements.' : 'প্রতিটি প্রকল্প অনন্য। আপনার নির্দিষ্ট প্রয়োজনীয়তা আলোচনা করতে যোগাযোগ করুন।');
 
   return (
     <>
       <Helmet>
        <title>{getMetaTitle('Software Development Pricing & Packages | Creation Tech Bangladesh')}</title>
         <meta
           name="description"
          content={getMetaDescription("Transparent custom software development pricing packages. Get affordable web application, mobile app, and enterprise software development quotes in Bangladesh.")}
         />
        <meta name="keywords" content="software development pricing, custom software cost, web development packages, mobile app development cost Bangladesh" />
        <link rel="canonical" href="https://creationtechbd.com/pricing" />
       </Helmet>
       <Layout>
         {/* Hero Section */}
         <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 py-12 lg:py-20">
           <div className="absolute inset-0">
             <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-white/5 blur-3xl" />
             <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-accent/10 blur-3xl" />
           </div>
 
           <div className="container-custom relative text-center">
             <ScrollReveal animation="fade-up">
               <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                 <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                 {language === 'en' ? 'Transparent Pricing' : 'স্বচ্ছ মূল্য'}
               </div>
             </ScrollReveal>
 
             <ScrollReveal animation="fade-up" delay={100}>
               <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl" style={{ letterSpacing: '-0.02em' }}>
                  {language === 'en' ? 'Software Development Pricing' : 'সফটওয়্যার ডেভেলপমেন্ট মূল্য'}
               </h1>
             </ScrollReveal>
 
             <ScrollReveal animation="fade-up" delay={150}>
               <p className="mx-auto max-w-2xl text-base text-white/70 leading-relaxed sm:text-lg">
                 {heroSubtitle}
               </p>
             </ScrollReveal>
           </div>
         </section>
 
         {/* Pricing Plans */}
         <section className="py-12 lg:py-16 bg-muted/30">
           <div className="container-custom">
             <div className="grid gap-6 lg:grid-cols-3">
               {pricingPlans.map((plan, index) => {
                 const Icon = plan.icon;
                 return (
                   <ScrollReveal key={index} animation="fade-up" delay={index * 100}>
                     <Card
                       className={cn(
                         "group relative h-full overflow-hidden transition-all duration-300",
                         plan.popular
                           ? "border-2 border-primary shadow-2xl lg:scale-105"
                           : "border-border/50 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1"
                       )}
                     >
                       <div className={cn("h-1.5 w-full bg-gradient-to-r", plan.color)} />
 
                       {plan.popular && (
                         <div className="absolute top-0 right-4 z-10">
                           <div className="rounded-b-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg">
                             <Sparkles className="mr-1 inline h-3 w-3" />
                             {language === 'en' ? 'POPULAR' : 'জনপ্রিয়'}
                           </div>
                         </div>
                       )}
 
                       <CardContent className="p-6">
                         <div className="mb-4 flex items-center gap-3">
                           <div className={cn(
                             "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white transition-transform duration-300 group-hover:scale-110",
                             plan.color
                           )}>
                             <Icon className="h-6 w-6" />
                           </div>
                           <div>
                             <h3 className="text-xl font-bold text-foreground">
                               {language === 'en' ? plan.nameEn : plan.nameBn}
                             </h3>
                             <p className="text-xs text-muted-foreground">
                               {language === 'en' ? plan.descEn : plan.descBn}
                             </p>
                           </div>
                         </div>
 
                         <div className="mb-6 pb-6 border-b border-border/50">
                           <div className="flex items-baseline gap-1">
                             <span className="text-3xl font-bold text-foreground">
                               {language === 'en' ? plan.priceEn : plan.priceBn}
                             </span>
                             {plan.priceEn !== 'Custom' && (
                               <span className="text-sm text-muted-foreground">
                                 {language === 'en' ? ' BDT' : ' টাকা'}
                               </span>
                             )}
                           </div>
                           <p className="text-xs text-muted-foreground mt-1">
                             {language === 'en' ? plan.periodEn : plan.periodBn}
                           </p>
                         </div>
 
                         <ul className="mb-6 space-y-3">
                           {plan.features.map((feature, i) => (
                             <li key={i} className="flex items-center gap-2.5">
                               <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent/15">
                                 <Check className="h-3 w-3 text-accent" />
                               </div>
                               <span className="text-sm text-muted-foreground">
                                 {language === 'en' ? feature.en : feature.bn}
                               </span>
                             </li>
                           ))}
                         </ul>
 
                         <Button
                           className={cn("w-full font-semibold", plan.popular && "shadow-lg")}
                           variant={plan.popular ? 'default' : 'outline'}
                           size="lg"
                           asChild
                         >
                           <Link to="/contact?type=quote">
                             {t('common.getQuote')}
                             <ArrowRight className="h-4 w-4" />
                           </Link>
                         </Button>
                       </CardContent>
                     </Card>
                   </ScrollReveal>
                 );
               })}
             </div>
           </div>
         </section>
 
         {/* Feature Comparison Table */}
         <section className="py-12 lg:py-16">
           <div className="container-custom">
             <ScrollReveal animation="fade-up">
               <div className="text-center mb-10">
                 <span className="inline-block mb-2 text-xs font-semibold uppercase tracking-widest text-primary/80">
                   {language === 'en' ? 'COMPARE PLANS' : 'প্ল্যান তুলনা করুন'}
                 </span>
                 <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                   {language === 'en' ? 'Feature Comparison' : 'ফিচার তুলনা'}
                 </h2>
               </div>
             </ScrollReveal>
 
             <ScrollReveal animation="fade-up" delay={100}>
               <div className="overflow-x-auto">
                 <div className="min-w-[640px]">
                   <div className="grid grid-cols-4 gap-4 rounded-t-xl bg-muted/60 px-6 py-4 border border-border/50">
                     <div className="font-semibold text-foreground">
                       {language === 'en' ? 'Features' : 'ফিচার'}
                     </div>
                     <div className="text-center font-semibold text-foreground">Starter</div>
                     <div className="text-center font-semibold text-primary">Professional</div>
                     <div className="text-center font-semibold text-foreground">Enterprise</div>
                   </div>
 
                   {comparisonFeatures.map((category, catIndex) => (
                     <div key={catIndex}>
                       <div className="grid grid-cols-4 gap-4 bg-muted/30 px-6 py-3 border-x border-border/50">
                         <div className="col-span-4 font-semibold text-sm text-foreground">
                           {language === 'en' ? category.categoryEn : category.categoryBn}
                         </div>
                       </div>
                       
                       {category.features.map((feature, featureIndex) => (
                         <div
                           key={featureIndex}
                           className={cn(
                             "grid grid-cols-4 gap-4 px-6 py-3 border-x border-border/50",
                             featureIndex === category.features.length - 1 && catIndex === comparisonFeatures.length - 1
                               ? "border-b rounded-b-xl"
                               : "border-b border-border/30"
                           )}
                         >
                           <div className="text-sm text-muted-foreground">
                             {language === 'en' ? feature.nameEn : feature.nameBn}
                           </div>
                           <div className="flex justify-center">
                             <FeatureIcon included={feature.starter} />
                           </div>
                           <div className="flex justify-center">
                             <FeatureIcon included={feature.professional} />
                           </div>
                           <div className="flex justify-center">
                             <FeatureIcon included={feature.enterprise} />
                           </div>
                         </div>
                       ))}
                     </div>
                   ))}
                 </div>
               </div>
             </ScrollReveal>
           </div>
         </section>
 
         {/* FAQs */}
         <section className="py-12 lg:py-16 bg-muted/30">
           <div className="container-custom">
             <ScrollReveal animation="fade-up">
               <div className="text-center mb-10">
                 <span className="inline-block mb-2 text-xs font-semibold uppercase tracking-widest text-primary/80">
                   {language === 'en' ? 'GOT QUESTIONS?' : 'প্রশ্ন আছে?'}
                 </span>
                 <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                   {language === 'en' ? 'Frequently Asked Questions' : 'সাধারণ প্রশ্নাবলী'}
                 </h2>
               </div>
             </ScrollReveal>
 
             <div className="mx-auto max-w-3xl grid gap-4 sm:grid-cols-2">
               {faqs.map((faq, index) => (
                 <ScrollReveal key={index} animation="fade-up" delay={index * 50}>
                   <Card className="h-full border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                     <CardContent className="p-5">
                       <div className="flex items-start gap-3">
                         <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                           <HelpCircle className="h-4 w-4 text-primary" />
                         </div>
                         <div>
                           <h3 className="mb-1.5 text-sm font-semibold text-foreground">
                             {language === 'en' ? faq.questionEn : faq.questionBn}
                           </h3>
                           <p className="text-xs leading-relaxed text-muted-foreground">
                             {language === 'en' ? faq.answerEn : faq.answerBn}
                           </p>
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                 </ScrollReveal>
               ))}
             </div>
           </div>
         </section>
 
         {/* CTA Section */}
         <section className="py-12 lg:py-16 bg-gradient-to-br from-primary via-primary/95 to-primary/90 relative overflow-hidden">
           <div className="absolute inset-0">
             <div className="absolute top-0 left-1/4 w-[300px] h-[300px] rounded-full bg-white/5 blur-3xl" />
             <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] rounded-full bg-accent/10 blur-3xl" />
           </div>
           <div className="container-custom relative">
             <ScrollReveal animation="fade-up">
               <div className="mx-auto max-w-xl text-center">
                 <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                   <Headphones className="h-6 w-6 text-white" />
                 </div>
               </div>
             </ScrollReveal>
             <ScrollReveal animation="fade-up" delay={100}>
               <h2 className="mb-4 text-center text-2xl font-bold text-white sm:text-3xl">
                 {ctaTitle}
               </h2>
             </ScrollReveal>
             <ScrollReveal animation="fade-up" delay={150}>
               <p className="mx-auto mb-8 max-w-xl text-center text-base text-white/70 leading-relaxed">
                 {ctaContent}
               </p>
             </ScrollReveal>
             <ScrollReveal animation="fade-up" delay={200}>
               <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                 <Button
                   size="lg"
                   variant="secondary"
                   className="min-w-[160px] font-semibold"
                   asChild
                 >
                   <Link to="/contact">
                     {t('common.contactUs')}
                     <ArrowRight className="h-4 w-4" />
                   </Link>
                 </Button>
                 <Button
                   size="lg"
                   variant="outline"
                   className="min-w-[160px] border-white/30 text-white hover:bg-white/10"
                   asChild
                 >
                   <Link to="/contact?type=meeting">
                     {t('common.bookMeeting')}
                   </Link>
                 </Button>
               </div>
             </ScrollReveal>
           </div>
         </section>
       </Layout>
     </>
   );
 };
 
 export default Pricing;