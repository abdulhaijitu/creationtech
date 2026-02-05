 import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
 import ScrollReveal from '@/components/common/ScrollReveal';
import { cn } from '@/lib/utils';
import { ClipboardList, Palette, Code, Bug, Rocket, Headphones } from 'lucide-react';
 
 const processSteps = [
   {
     number: '01',
     titleEn: 'Requirement Analysis',
     titleBn: 'প্রয়োজনীয়তা বিশ্লেষণ',
     descEn: 'Understand your needs, objectives, and the challenges the software aims to address.',
    descBn: 'আপনার প্রয়োজন, উদ্দেশ্য এবং সফ্টওয়্যার যে চ্যালেঞ্জগুলি সমাধান করতে চায় তা বোঝা।',
    icon: ClipboardList,
    detailTitleEn: 'Understanding Your Vision',
    detailTitleBn: 'আপনার ভিশন বোঝা',
    detailDescEn: 'We start by deeply understanding your business goals, target audience, and technical requirements. Our team conducts thorough stakeholder interviews, market analysis, and competitive research to create a comprehensive project blueprint.',
    detailDescBn: 'আমরা আপনার ব্যবসায়িক লক্ষ্য, টার্গেট অডিয়েন্স এবং প্রযুক্তিগত প্রয়োজনীয়তা গভীরভাবে বোঝার মাধ্যমে শুরু করি। আমাদের টিম স্টেকহোল্ডার ইন্টারভিউ, মার্কেট অ্যানালাইসিস এবং প্রতিযোগিতামূলক গবেষণা পরিচালনা করে।',
    features: ['Stakeholder Interviews', 'Market Research', 'Technical Assessment', 'Project Roadmap']
   },
   {
     number: '02',
     titleEn: 'Planning & Product Design',
     titleBn: 'পরিকল্পনা ও প্রোডাক্ট ডিজাইন',
     descEn: 'Create detailed blueprints and UI/UX designs that align with your vision.',
    descBn: 'আপনার দৃষ্টিভঙ্গির সাথে সামঞ্জস্যপূর্ণ বিস্তারিত ব্লুপ্রিন্ট এবং UI/UX ডিজাইন তৈরি।',
    icon: Palette,
    detailTitleEn: 'Crafting the Perfect Design',
    detailTitleBn: 'পারফেক্ট ডিজাইন তৈরি',
    detailDescEn: 'Our designers create intuitive, user-centered interfaces that not only look stunning but also provide seamless user experiences. We deliver wireframes, prototypes, and detailed design specifications.',
    detailDescBn: 'আমাদের ডিজাইনাররা সহজাত, ব্যবহারকারী-কেন্দ্রিক ইন্টারফেস তৈরি করে যা শুধু দেখতে চমৎকার নয়, বরং নির্বিঘ্ন ব্যবহারকারীর অভিজ্ঞতাও প্রদান করে।',
    features: ['Wireframing', 'UI/UX Design', 'Prototyping', 'Design System']
   },
   {
     number: '03',
     titleEn: 'Agile Development',
     titleBn: 'অ্যাজাইল ডেভেলপমেন্ট',
     descEn: 'Code software, ensuring each module aligns with the design and functions seamlessly.',
    descBn: 'সফ্টওয়্যার কোড করা, প্রতিটি মডিউল ডিজাইনের সাথে সামঞ্জস্যপূর্ণ এবং নির্বিঘ্নে কাজ করে।',
    icon: Code,
    detailTitleEn: 'Building with Excellence',
    detailTitleBn: 'উৎকৃষ্টতার সাথে তৈরি',
    detailDescEn: 'Using agile methodology, we develop your software in iterative sprints, ensuring transparency and flexibility. Regular demos and feedback sessions keep you involved throughout the process.',
    detailDescBn: 'অ্যাজাইল পদ্ধতি ব্যবহার করে, আমরা আপনার সফ্টওয়্যার পুনরাবৃত্তিমূলক স্প্রিন্টে ডেভেলপ করি, স্বচ্ছতা এবং নমনীয়তা নিশ্চিত করি।',
    features: ['Sprint Planning', 'Code Reviews', 'Daily Standups', 'Continuous Integration']
   },
   {
     number: '04',
     titleEn: 'QA Testing & Bug Fixing',
     titleBn: 'QA টেস্টিং ও বাগ ফিক্সিং',
     descEn: 'Rigorously evaluate the software for bugs, performance issues, and reliability.',
    descBn: 'বাগ, পারফরম্যান্স সমস্যা এবং নির্ভরযোগ্যতার জন্য সফ্টওয়্যার কঠোরভাবে মূল্যায়ন।',
    icon: Bug,
    detailTitleEn: 'Ensuring Quality',
    detailTitleBn: 'গুণমান নিশ্চিতকরণ',
    detailDescEn: 'Our QA team performs comprehensive testing including functional, performance, security, and user acceptance testing to ensure your software is bug-free and performs optimally.',
    detailDescBn: 'আমাদের QA টিম ফাংশনাল, পারফরম্যান্স, সিকিউরিটি এবং ইউজার অ্যাকসেপ্টেন্স টেস্টিং সহ ব্যাপক টেস্টিং করে।',
    features: ['Unit Testing', 'Integration Testing', 'Performance Testing', 'Security Audit']
   },
   {
     number: '05',
     titleEn: 'Deployment & Go-Live',
     titleBn: 'ডিপ্লয়মেন্ট ও গো-লাইভ',
     descEn: 'Launch the software in a live environment, making it accessible to end-users.',
    descBn: 'লাইভ পরিবেশে সফ্টওয়্যার চালু করা, এন্ড-ইউজারদের কাছে অ্যাক্সেসযোগ্য করা।',
    icon: Rocket,
    detailTitleEn: 'Launch Day',
    detailTitleBn: 'লঞ্চ ডে',
    detailDescEn: 'We handle the complete deployment process including server setup, database migration, DNS configuration, and SSL certificates. Our team ensures zero-downtime deployment for smooth transitions.',
    detailDescBn: 'আমরা সার্ভার সেটআপ, ডেটাবেস মাইগ্রেশন, DNS কনফিগারেশন এবং SSL সার্টিফিকেট সহ সম্পূর্ণ ডিপ্লয়মেন্ট প্রক্রিয়া পরিচালনা করি।',
    features: ['Server Setup', 'Database Migration', 'SSL Configuration', 'Launch Monitoring']
   },
   {
     number: '06',
     titleEn: 'Maintenance & Support',
     titleBn: 'রক্ষণাবেক্ষণ ও সাপোর্ট',
     descEn: 'Provide ongoing support, addressing any updates, issues, or improvements to keep the software optimal.',
    descBn: 'চলমান সাপোর্ট প্রদান, আপডেট, সমস্যা বা উন্নতির সমাধান করা।',
    icon: Headphones,
    detailTitleEn: 'Always Here for You',
    detailTitleBn: 'সবসময় আপনার জন্য',
    detailDescEn: 'Our relationship doesn\'t end at launch. We provide continuous monitoring, regular updates, security patches, and dedicated support to ensure your software stays current and secure.',
    detailDescBn: 'আমাদের সম্পর্ক লঞ্চে শেষ হয় না। আমরা ক্রমাগত মনিটরিং, নিয়মিত আপডেট, সিকিউরিটি প্যাচ এবং ডেডিকেটেড সাপোর্ট প্রদান করি।',
    features: ['24/7 Monitoring', 'Regular Updates', 'Security Patches', 'Priority Support']
   }
 ];
 
 const DevelopmentProcessSection = () => {
   const { language } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);

  const currentStep = processSteps[activeStep];
  const Icon = currentStep.icon;
 
   return (
     <section className="py-12 lg:py-16 bg-gradient-to-br from-accent/5 via-background to-primary/5 relative overflow-hidden">
       {/* Decorative circles */}
       <div className="absolute left-0 top-1/4 w-[200px] h-[200px] rounded-full border-[30px] border-accent/10 -translate-x-1/2" />
       <div className="absolute left-0 bottom-1/4 w-[120px] h-[120px] rounded-full border-[20px] border-primary/10 -translate-x-1/2" />
 
       <div className="container-custom relative">
         {/* Header */}
         <ScrollReveal animation="fade-up">
          <div className="text-center mb-8 lg:mb-10">
             <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
               {language === 'en' ? 'Custom ' : 'কাস্টম '}
               <span className="italic text-primary">
                 {language === 'en' ? 'Development' : 'ডেভেলপমেন্ট'}
               </span>
               {language === 'en' ? ' Process' : ' প্রসেস'}
             </h2>
             <p className="mt-3 text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed sm:text-base">
               {language === 'en'
                 ? 'We follow a streamlined and transparent development process to ensure your software meets your expectations and business goals.'
                 : 'আমরা একটি সুষ্ঠু এবং স্বচ্ছ ডেভেলপমেন্ট প্রক্রিয়া অনুসরণ করি যাতে আপনার সফ্টওয়্যার আপনার প্রত্যাশা এবং ব্যবসায়িক লক্ষ্য পূরণ করে।'}
             </p>
           </div>
         </ScrollReveal>
 
         {/* Content Grid */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10 items-start">
          {/* Left - Step Details */}
          <ScrollReveal animation="fade-right" className="hidden lg:block order-2 lg:order-1">
            <div className="sticky top-24">
              <div className="relative rounded-2xl border border-border/50 bg-card p-6 lg:p-8 shadow-lg overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
                
                <div className="relative">
                  {/* Icon & Step Number */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg">
                      <Icon className="h-7 w-7" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">
                        {language === 'en' ? 'Step' : 'ধাপ'} {currentStep.number}
                      </span>
                      <h3 className="text-xl font-bold text-foreground">
                        {language === 'en' ? currentStep.detailTitleEn : currentStep.detailTitleBn}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    {language === 'en' ? currentStep.detailDescEn : currentStep.detailDescBn}
                  </p>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-2">
                    {currentStep.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 rounded-lg bg-primary/8 px-3 py-2 text-xs font-medium text-foreground"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Decorative */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-accent/10 blur-2xl" />
               </div>
             </div>
           </ScrollReveal>
 
           {/* Right - Process Steps */}
          <div className="relative order-1 lg:order-2">
             {/* Vertical line */}
             <div className="absolute left-[27px] top-8 bottom-8 w-px border-l-2 border-dashed border-primary/30 hidden sm:block" />
 
             <div className="space-y-5 sm:space-y-6">
               {processSteps.map((step, index) => (
                 <ScrollReveal
                   key={step.number}
                   animation="fade-up"
                   delay={index * 80}
                 >
                  <button
                    onClick={() => setActiveStep(index)}
                    className={cn(
                      "w-full flex gap-4 sm:gap-5 group text-left rounded-xl p-3 -m-3 transition-all duration-300",
                      activeStep === index
                        ? "bg-primary/8"
                        : "hover:bg-muted/50"
                    )}
                  >
                     {/* Step Number */}
                     <div className="relative z-10 flex-shrink-0">
                      <div className={cn(
                        "flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl font-bold text-lg shadow-lg transition-all duration-300",
                        activeStep === index
                          ? "bg-primary text-primary-foreground scale-110"
                          : "bg-muted text-foreground group-hover:bg-primary/80 group-hover:text-primary-foreground"
                      )}>
                         {step.number}
                       </div>
                     </div>
 
                     {/* Content */}
                     <div className="flex-1 pt-1">
                      <h3 className={cn(
                        "font-semibold text-base sm:text-lg mb-1 transition-colors duration-300",
                        activeStep === index ? "text-primary" : "text-foreground"
                      )}>
                         {language === 'en' ? step.titleEn : step.titleBn}
                       </h3>
                       <p className="text-sm text-muted-foreground leading-relaxed">
                         {language === 'en' ? step.descEn : step.descBn}
                       </p>
                     </div>
                  </button>
                 </ScrollReveal>
               ))}
             </div>
           </div>
         </div>

        {/* Mobile Detail Card */}
        <div className="mt-8 lg:hidden">
          <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-primary/70">
                    {language === 'en' ? 'Step' : 'ধাপ'} {currentStep.number}
                  </span>
                  <h3 className="text-base font-bold text-foreground">
                    {language === 'en' ? currentStep.detailTitleEn : currentStep.detailTitleBn}
                  </h3>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                {language === 'en' ? currentStep.detailDescEn : currentStep.detailDescBn}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {currentStep.features.map((feature, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-medium text-foreground"
                  >
                    <span className="h-1 w-1 rounded-full bg-primary" />
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
       </div>
     </section>
   );
 };
 
 export default DevelopmentProcessSection;