 import { useLanguage } from '@/contexts/LanguageContext';
 import ScrollReveal from '@/components/common/ScrollReveal';
 import { Building2, Globe, Users } from 'lucide-react';
 
 // Reuse existing partner logos
 import raceLogo from '@/assets/partners/race-logo.png';
 import rioLogo from '@/assets/partners/rio-logo.png';
 import skyviewLogo from '@/assets/partners/skyview-logo.png';
 import speedtechLogo from '@/assets/partners/speedtech-logo.png';
 import dataflowLogo from '@/assets/partners/dataflow-logo.png';
 import techvisionLogo from '@/assets/partners/techvision-logo.png';
 
 const partners = [
   { name: 'Race Online', logo: raceLogo },
   { name: 'Rio International', logo: rioLogo },
   { name: 'SkyView', logo: skyviewLogo },
   { name: 'SpeedTech', logo: speedtechLogo },
   { name: 'DataFlow', logo: dataflowLogo },
   { name: 'TechVision', logo: techvisionLogo },
 ];
 
 const trustMetrics = [
   { 
     icon: Building2, 
     valueEn: '3500+', 
     valueBn: '৩৫০০+', 
     labelEn: 'Companies', 
     labelBn: 'কোম্পানি' 
   },
   { 
     icon: Globe, 
     valueEn: 'Local & Global', 
     valueBn: 'স্থানীয় ও বৈশ্বিক', 
     labelEn: 'Clients', 
     labelBn: 'ক্লায়েন্ট' 
   },
   { 
     icon: Users, 
     valueEn: '9+', 
     valueBn: '৯+', 
     labelEn: 'Industries', 
     labelBn: 'শিল্প' 
   },
 ];
 
 const TrustedBySection = () => {
   const { language } = useLanguage();
 
   const heading = language === 'en'
     ? 'Trusted by startups and enterprises across Bangladesh and beyond'
     : 'বাংলাদেশ এবং বিশ্বব্যাপী স্টার্টআপ ও এন্টারপ্রাইজের বিশ্বস্ত অংশীদার';
 
   const subtext = language === 'en'
     ? 'Partnering with growing startups and established enterprises to build scalable digital solutions.'
     : 'স্কেলযোগ্য ডিজিটাল সমাধান তৈরি করতে ক্রমবর্ধমান স্টার্টআপ এবং প্রতিষ্ঠিত এন্টারপ্রাইজের সাথে অংশীদারিত্ব।';
 
   return (
     <section className="py-10 lg:py-14 bg-muted/20">
       <div className="container-custom">
         {/* Header */}
         <ScrollReveal animation="fade-up">
           <div className="text-center mb-8 lg:mb-10">
             <h2 className="text-xl font-semibold text-foreground sm:text-2xl lg:text-[1.625rem] max-w-3xl mx-auto leading-snug">
               {heading}
             </h2>
             <p className="mt-3 text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
               {subtext}
             </p>
           </div>
         </ScrollReveal>
 
         {/* Trust Metrics Chips */}
         <ScrollReveal animation="fade-up" delay={100}>
           <div className="flex flex-wrap items-center justify-center gap-3 mb-8 lg:mb-10">
             {trustMetrics.map((metric, index) => {
               const Icon = metric.icon;
               return (
                 <div
                   key={index}
                   className="inline-flex items-center gap-2 rounded-full bg-background border border-border/60 px-4 py-2 text-sm shadow-sm"
                 >
                   <Icon className="h-4 w-4 text-primary" />
                   <span className="font-semibold text-foreground">
                     {language === 'en' ? metric.valueEn : metric.valueBn}
                   </span>
                   <span className="text-muted-foreground">
                     {language === 'en' ? metric.labelEn : metric.labelBn}
                   </span>
                 </div>
               );
             })}
           </div>
         </ScrollReveal>
 
         {/* Logo Strip */}
         <ScrollReveal animation="fade-up" delay={200}>
           <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6">
             {partners.map((partner, index) => (
               <div
                 key={index}
                 className="group flex h-14 w-24 items-center justify-center rounded-xl border border-border/50 bg-background px-3 shadow-sm transition-all duration-200 hover:scale-[1.03] hover:border-primary/30 hover:shadow-md sm:h-16 sm:w-28 lg:w-32"
                 title={partner.name}
               >
                 <img
                   src={partner.logo}
                   alt={partner.name}
                   className="h-8 w-auto max-w-[70px] object-contain grayscale opacity-70 transition-all duration-200 group-hover:grayscale-0 group-hover:opacity-100 sm:h-10 sm:max-w-[80px]"
                   loading="lazy"
                 />
               </div>
             ))}
           </div>
         </ScrollReveal>
       </div>
     </section>
   );
 };
 
 export default TrustedBySection;