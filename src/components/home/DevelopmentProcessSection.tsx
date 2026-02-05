 import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
 import ScrollReveal from '@/components/common/ScrollReveal';
import { cn } from '@/lib/utils';
 import { ClipboardList, Palette, Code, Bug, Rocket, Headphones, CheckCircle2, ArrowRight } from 'lucide-react';
 
 const processSteps = [
   {
     number: '01',
     titleEn: 'Requirement Analysis',
     titleBn: 'প্রয়োজনীয়তা বিশ্লেষণ',
     descEn: 'Understand your needs, objectives, and the challenges the software aims to address.',
     descBn: 'আপনার প্রয়োজন, উদ্দেশ্য এবং সফ্টওয়্যার যে চ্যালেঞ্জগুলি সমাধান করতে চায় তা বোঝা।',
     icon: ClipboardList,
     color: 'from-blue-500 to-cyan-500',
     bgColor: 'bg-blue-500/10',
     detailTitleEn: 'Understanding Your Vision',
     detailTitleBn: 'আপনার ভিশন বোঝা',
     detailDescEn: 'We start by deeply understanding your business goals, target audience, and technical requirements. Our team conducts thorough stakeholder interviews, market analysis, and competitive research to create a comprehensive project blueprint.',
     detailDescBn: 'আমরা আপনার ব্যবসায়িক লক্ষ্য, টার্গেট অডিয়েন্স এবং প্রযুক্তিগত প্রয়োজনীয়তা গভীরভাবে বোঝার মাধ্যমে শুরু করি।',
     features: ['Stakeholder Interviews', 'Market Research', 'Technical Assessment', 'Project Roadmap']
   },
   {
     number: '02',
     titleEn: 'Planning & Product Design',
     titleBn: 'পরিকল্পনা ও প্রোডাক্ট ডিজাইন',
     descEn: 'Create detailed blueprints and UI/UX designs that align with your vision.',
     descBn: 'আপনার দৃষ্টিভঙ্গির সাথে সামঞ্জস্যপূর্ণ বিস্তারিত ব্লুপ্রিন্ট এবং UI/UX ডিজাইন তৈরি।',
     icon: Palette,
     color: 'from-violet-500 to-purple-500',
     bgColor: 'bg-violet-500/10',
     detailTitleEn: 'Crafting the Perfect Design',
     detailTitleBn: 'পারফেক্ট ডিজাইন তৈরি',
     detailDescEn: 'Our designers create intuitive, user-centered interfaces that not only look stunning but also provide seamless user experiences. We deliver wireframes, prototypes, and detailed design specifications.',
     detailDescBn: 'আমাদের ডিজাইনাররা সহজাত, ব্যবহারকারী-কেন্দ্রিক ইন্টারফেস তৈরি করে।',
     features: ['Wireframing', 'UI/UX Design', 'Prototyping', 'Design System']
   },
   {
     number: '03',
     titleEn: 'Agile Development',
     titleBn: 'অ্যাজাইল ডেভেলপমেন্ট',
     descEn: 'Code software, ensuring each module aligns with the design and functions seamlessly.',
     descBn: 'সফ্টওয়্যার কোড করা, প্রতিটি মডিউল ডিজাইনের সাথে সামঞ্জস্যপূর্ণ।',
     icon: Code,
     color: 'from-emerald-500 to-teal-500',
     bgColor: 'bg-emerald-500/10',
     detailTitleEn: 'Building with Excellence',
     detailTitleBn: 'উৎকৃষ্টতার সাথে তৈরি',
     detailDescEn: 'Using agile methodology, we develop your software in iterative sprints, ensuring transparency and flexibility. Regular demos and feedback sessions keep you involved throughout the process.',
     detailDescBn: 'অ্যাজাইল পদ্ধতি ব্যবহার করে, আমরা আপনার সফ্টওয়্যার পুনরাবৃত্তিমূলক স্প্রিন্টে ডেভেলপ করি।',
     features: ['Sprint Planning', 'Code Reviews', 'Daily Standups', 'Continuous Integration']
   },
   {
     number: '04',
     titleEn: 'QA Testing & Bug Fixing',
     titleBn: 'QA টেস্টিং ও বাগ ফিক্সিং',
     descEn: 'Rigorously evaluate the software for bugs, performance issues, and reliability.',
     descBn: 'বাগ, পারফরম্যান্স সমস্যা এবং নির্ভরযোগ্যতার জন্য সফ্টওয়্যার মূল্যায়ন।',
     icon: Bug,
     color: 'from-amber-500 to-orange-500',
     bgColor: 'bg-amber-500/10',
     detailTitleEn: 'Ensuring Quality',
     detailTitleBn: 'গুণমান নিশ্চিতকরণ',
     detailDescEn: 'Our QA team performs comprehensive testing including functional, performance, security, and user acceptance testing to ensure your software is bug-free and performs optimally.',
     detailDescBn: 'আমাদের QA টিম ফাংশনাল, পারফরম্যান্স, সিকিউরিটি এবং ইউজার অ্যাকসেপ্টেন্স টেস্টিং করে।',
     features: ['Unit Testing', 'Integration Testing', 'Performance Testing', 'Security Audit']
   },
   {
     number: '05',
     titleEn: 'Deployment & Go-Live',
     titleBn: 'ডিপ্লয়মেন্ট ও গো-লাইভ',
     descEn: 'Launch the software in a live environment, making it accessible to end-users.',
     descBn: 'লাইভ পরিবেশে সফ্টওয়্যার চালু করা, এন্ড-ইউজারদের কাছে অ্যাক্সেসযোগ্য করা।',
     icon: Rocket,
     color: 'from-rose-500 to-pink-500',
     bgColor: 'bg-rose-500/10',
     detailTitleEn: 'Launch Day',
     detailTitleBn: 'লঞ্চ ডে',
     detailDescEn: 'We handle the complete deployment process including server setup, database migration, DNS configuration, and SSL certificates. Our team ensures zero-downtime deployment.',
     detailDescBn: 'আমরা সার্ভার সেটআপ, ডেটাবেস মাইগ্রেশন, DNS কনফিগারেশন সহ সম্পূর্ণ ডিপ্লয়মেন্ট প্রক্রিয়া পরিচালনা করি।',
     features: ['Server Setup', 'Database Migration', 'SSL Configuration', 'Launch Monitoring']
   },
   {
     number: '06',
     titleEn: 'Maintenance & Support',
     titleBn: 'রক্ষণাবেক্ষণ ও সাপোর্ট',
     descEn: 'Provide ongoing support, addressing any updates, issues, or improvements.',
     descBn: 'চলমান সাপোর্ট প্রদান, আপডেট, সমস্যা বা উন্নতির সমাধান করা।',
     icon: Headphones,
     color: 'from-indigo-500 to-blue-500',
     bgColor: 'bg-indigo-500/10',
     detailTitleEn: 'Always Here for You',
     detailTitleBn: 'সবসময় আপনার জন্য',
     detailDescEn: 'Our relationship doesn\'t end at launch. We provide continuous monitoring, regular updates, security patches, and dedicated support to ensure your software stays current and secure.',
     detailDescBn: 'আমাদের সম্পর্ক লঞ্চে শেষ হয় না। আমরা ক্রমাগত মনিটরিং, নিয়মিত আপডেট এবং সিকিউরিটি প্যাচ প্রদান করি।',
     features: ['24/7 Monitoring', 'Regular Updates', 'Security Patches', 'Priority Support']
   }
 ];
 
 const DevelopmentProcessSection = () => {
   const { language } = useLanguage();
   const [activeStep, setActiveStep] = useState(0);
 
   const currentStep = processSteps[activeStep];
   const Icon = currentStep.icon;
 
   return (
     <section className="py-16 lg:py-24 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden">
       {/* Modern decorative elements */}
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute -left-32 top-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-3xl" />
         <div className="absolute -right-32 bottom-1/4 w-96 h-96 rounded-full bg-gradient-to-bl from-accent/10 to-transparent blur-3xl" />
         <div className="absolute left-1/2 top-0 w-px h-full bg-gradient-to-b from-transparent via-border/50 to-transparent" />
       </div>
 
       <div className="container-custom relative">
         {/* Header */}
         <ScrollReveal animation="fade-up">
           <div className="text-center mb-12 lg:mb-16">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
               </span>
               {language === 'en' ? 'Our Process' : 'আমাদের প্রক্রিয়া'}
             </div>
             <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
               {language === 'en' ? 'How We Build ' : 'কিভাবে আমরা তৈরি করি '}
               <span className="relative">
                 <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]">
                   {language === 'en' ? 'Excellence' : 'উৎকৃষ্টতা'}
                 </span>
                 <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                   <path d="M1 5.5Q50 1 100 5.5T199 5.5" stroke="currentColor" strokeWidth="2" className="text-primary/30" strokeLinecap="round"/>
                 </svg>
               </span>
             </h2>
             <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed lg:text-lg">
               {language === 'en'
                 ? 'A streamlined, transparent approach that transforms your vision into reality'
                 : 'একটি সুষ্ঠু, স্বচ্ছ পদ্ধতি যা আপনার ভিশনকে বাস্তবে রূপান্তরিত করে'}
             </p>
           </div>
         </ScrollReveal>
 
         {/* Content Grid */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
           {/* Left - Step Details Card */}
          <ScrollReveal animation="fade-right" className="hidden lg:flex order-2 lg:order-1">
            <div className="relative group w-full h-full">
              {/* Glow effect */}
              <div className={cn(
                "absolute -inset-1 rounded-3xl bg-gradient-to-r opacity-50 blur-xl transition-all duration-500 group-hover:opacity-75",
                currentStep.color
              )} />
              
              <div className="relative rounded-2xl border border-border/50 bg-card/95 backdrop-blur-xl p-8 shadow-2xl overflow-hidden h-full flex flex-col">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                    backgroundSize: '24px 24px'
                  }} />
                </div>
                
                <div className="relative flex-1 flex flex-col">
                  {/* Step indicator */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition-transform duration-300 group-hover:scale-110",
                        currentStep.color
                      )}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn(
                            "text-xs font-bold uppercase tracking-widest bg-gradient-to-r bg-clip-text text-transparent",
                            currentStep.color
                          )}>
                            {language === 'en' ? 'Step' : 'ধাপ'} {currentStep.number}
                          </span>
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                         </div>
                        <h3 className="text-2xl font-bold text-foreground">
                          {language === 'en' ? currentStep.detailTitleEn : currentStep.detailTitleBn}
                        </h3>
                       </div>
                     </div>
                    <div className="text-6xl font-black text-muted/20">
                      {currentStep.number}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed mb-6 text-base">
                    {language === 'en' ? currentStep.detailDescEn : currentStep.detailDescBn}
                  </p>

                  {/* Features Grid */}
                  <div className="space-y-3 flex-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {language === 'en' ? 'Key Deliverables' : 'মূল ডেলিভারেবল'}
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      {currentStep.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "flex items-center gap-2.5 rounded-xl px-4 py-3 transition-all duration-200 hover:scale-[1.02]",
                            currentStep.bgColor
                          )}
                        >
                          <CheckCircle2 className={cn(
                            "h-4 w-4 flex-shrink-0 bg-gradient-to-r bg-clip-text",
                            currentStep.color.replace('from-', 'text-').split(' ')[0]
                          )} />
                          <span className="text-sm font-medium text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Progress indicator */}
                  <div className="mt-auto pt-6 border-t border-border/50">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span>{language === 'en' ? 'Progress' : 'অগ্রগতি'}</span>
                      <span>{activeStep + 1} / {processSteps.length}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-500", currentStep.color)}
                        style={{ width: `${((activeStep + 1) / processSteps.length) * 100}%` }}
                      />
                    </div>
                   </div>
                 </div>
               </div>
             </div>
           </ScrollReveal>
 
           {/* Right - Process Steps */}
           <div className="relative order-1 lg:order-2">
             {/* Modern vertical connector */}
             <div className="absolute left-7 top-12 bottom-12 w-0.5 bg-gradient-to-b from-primary/50 via-accent/50 to-primary/50 hidden sm:block" />
 
             <div className="space-y-4">
               {processSteps.map((step, index) => {
                 const StepIcon = step.icon;
                 const isActive = activeStep === index;
                 const isPast = index < activeStep;
                 
                 return (
                   <ScrollReveal
                     key={step.number}
                     animation="fade-up"
                     delay={index * 60}
                   >
                     <button
                       onClick={() => setActiveStep(index)}
                       className={cn(
                         "w-full flex gap-5 group text-left rounded-2xl p-4 transition-all duration-300 border",
                         isActive
                           ? "bg-card border-primary/30 shadow-lg shadow-primary/5"
                           : "bg-transparent border-transparent hover:bg-card/50 hover:border-border/50"
                       )}
                     >
                       {/* Step Number/Icon */}
                       <div className="relative z-10 flex-shrink-0">
                         <div className={cn(
                           "relative flex h-14 w-14 items-center justify-center rounded-xl font-bold text-lg transition-all duration-300",
                           isActive
                             ? `bg-gradient-to-br ${step.color} text-white shadow-lg scale-110`
                             : isPast
                               ? "bg-primary/20 text-primary"
                               : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                         )}>
                           {isPast && !isActive ? (
                             <CheckCircle2 className="h-6 w-6" />
                           ) : (
                             <StepIcon className="h-6 w-6" />
                           )}
                           
                           {/* Active pulse */}
                           {isActive && (
                             <span className="absolute inset-0 rounded-xl animate-ping bg-primary/30" style={{ animationDuration: '2s' }} />
                           )}
                         </div>
                         
                         {/* Connector dot */}
                         {index < processSteps.length - 1 && (
                           <div className={cn(
                             "absolute left-1/2 -translate-x-1/2 top-full mt-4 h-2 w-2 rounded-full hidden sm:block transition-colors duration-300",
                             isPast ? "bg-primary" : "bg-muted"
                           )} />
                         )}
                       </div>
 
                       {/* Content */}
                       <div className="flex-1 min-w-0 pt-1">
                         <div className="flex items-start justify-between gap-2">
                           <div>
                             <h3 className={cn(
                               "font-semibold text-lg mb-1 transition-colors duration-300",
                               isActive ? "text-foreground" : "text-foreground/80 group-hover:text-foreground"
                             )}>
                               {language === 'en' ? step.titleEn : step.titleBn}
                             </h3>
                             <p className={cn(
                               "text-sm leading-relaxed transition-colors duration-300",
                               isActive ? "text-muted-foreground" : "text-muted-foreground/70"
                             )}>
                               {language === 'en' ? step.descEn : step.descBn}
                             </p>
                           </div>
                           
                           {/* Arrow indicator */}
                           <ArrowRight className={cn(
                             "h-5 w-5 flex-shrink-0 mt-1 transition-all duration-300",
                             isActive 
                               ? "text-primary translate-x-0 opacity-100" 
                               : "text-muted-foreground -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                           )} />
                         </div>
                       </div>
                     </button>
                   </ScrollReveal>
                 );
               })}
             </div>
           </div>
         </div>
 
         {/* Mobile Detail Card */}
         <div className="mt-8 lg:hidden">
           <div className="relative">
             <div className={cn(
               "absolute -inset-1 rounded-2xl bg-gradient-to-r opacity-30 blur-lg",
               currentStep.color
             )} />
             <div className="relative rounded-2xl border border-border/50 bg-card/95 backdrop-blur-xl p-6 shadow-xl overflow-hidden">
               <div className="flex items-center gap-4 mb-4">
                 <div className={cn(
                   "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg",
                   currentStep.color
                 )}>
                   <Icon className="h-6 w-6" />
                 </div>
                 <div>
                   <span className={cn(
                     "text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r bg-clip-text text-transparent",
                     currentStep.color
                   )}>
                     {language === 'en' ? 'Step' : 'ধাপ'} {currentStep.number}
                   </span>
                   <h3 className="text-lg font-bold text-foreground">
                     {language === 'en' ? currentStep.detailTitleEn : currentStep.detailTitleBn}
                   </h3>
                 </div>
               </div>
               <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                 {language === 'en' ? currentStep.detailDescEn : currentStep.detailDescBn}
               </p>
               <div className="flex flex-wrap gap-2">
                 {currentStep.features.map((feature, idx) => (
                   <span
                     key={idx}
                     className={cn(
                       "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-foreground",
                       currentStep.bgColor
                     )}
                   >
                     <CheckCircle2 className="h-3 w-3" />
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