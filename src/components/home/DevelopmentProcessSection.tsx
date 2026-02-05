 import { useLanguage } from '@/contexts/LanguageContext';
 import ScrollReveal from '@/components/common/ScrollReveal';
 import aboutOfficeImg from '@/assets/about-office.jpg';
 
 const processSteps = [
   {
     number: '01',
     titleEn: 'Requirement Analysis',
     titleBn: 'প্রয়োজনীয়তা বিশ্লেষণ',
     descEn: 'Understand your needs, objectives, and the challenges the software aims to address.',
     descBn: 'আপনার প্রয়োজন, উদ্দেশ্য এবং সফ্টওয়্যার যে চ্যালেঞ্জগুলি সমাধান করতে চায় তা বোঝা।'
   },
   {
     number: '02',
     titleEn: 'Planning & Product Design',
     titleBn: 'পরিকল্পনা ও প্রোডাক্ট ডিজাইন',
     descEn: 'Create detailed blueprints and UI/UX designs that align with your vision.',
     descBn: 'আপনার দৃষ্টিভঙ্গির সাথে সামঞ্জস্যপূর্ণ বিস্তারিত ব্লুপ্রিন্ট এবং UI/UX ডিজাইন তৈরি।'
   },
   {
     number: '03',
     titleEn: 'Agile Development',
     titleBn: 'অ্যাজাইল ডেভেলপমেন্ট',
     descEn: 'Code software, ensuring each module aligns with the design and functions seamlessly.',
     descBn: 'সফ্টওয়্যার কোড করা, প্রতিটি মডিউল ডিজাইনের সাথে সামঞ্জস্যপূর্ণ এবং নির্বিঘ্নে কাজ করে।'
   },
   {
     number: '04',
     titleEn: 'QA Testing & Bug Fixing',
     titleBn: 'QA টেস্টিং ও বাগ ফিক্সিং',
     descEn: 'Rigorously evaluate the software for bugs, performance issues, and reliability.',
     descBn: 'বাগ, পারফরম্যান্স সমস্যা এবং নির্ভরযোগ্যতার জন্য সফ্টওয়্যার কঠোরভাবে মূল্যায়ন।'
   },
   {
     number: '05',
     titleEn: 'Deployment & Go-Live',
     titleBn: 'ডিপ্লয়মেন্ট ও গো-লাইভ',
     descEn: 'Launch the software in a live environment, making it accessible to end-users.',
     descBn: 'লাইভ পরিবেশে সফ্টওয়্যার চালু করা, এন্ড-ইউজারদের কাছে অ্যাক্সেসযোগ্য করা।'
   },
   {
     number: '06',
     titleEn: 'Maintenance & Support',
     titleBn: 'রক্ষণাবেক্ষণ ও সাপোর্ট',
     descEn: 'Provide ongoing support, addressing any updates, issues, or improvements to keep the software optimal.',
     descBn: 'চলমান সাপোর্ট প্রদান, আপডেট, সমস্যা বা উন্নতির সমাধান করা।'
   }
 ];
 
 const DevelopmentProcessSection = () => {
   const { language } = useLanguage();
 
   return (
     <section className="py-12 lg:py-16 bg-gradient-to-br from-accent/5 via-background to-primary/5 relative overflow-hidden">
       {/* Decorative circles */}
       <div className="absolute left-0 top-1/4 w-[200px] h-[200px] rounded-full border-[30px] border-accent/10 -translate-x-1/2" />
       <div className="absolute left-0 bottom-1/4 w-[120px] h-[120px] rounded-full border-[20px] border-primary/10 -translate-x-1/2" />
 
       <div className="container-custom relative">
         {/* Header */}
         <ScrollReveal animation="fade-up">
           <div className="text-center mb-10 lg:mb-12">
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
         <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
           {/* Left - Image */}
           <ScrollReveal animation="fade-right" className="hidden lg:block">
             <div className="relative">
               <div className="overflow-hidden rounded-2xl shadow-xl">
                 <img
                   src={aboutOfficeImg}
                   alt="Development Process"
                   className="w-full h-auto object-cover"
                   loading="lazy"
                 />
               </div>
               {/* Decorative elements */}
               <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-xl bg-accent/20 -z-10" />
               <div className="absolute -top-4 -left-4 w-16 h-16 rounded-xl bg-primary/20 -z-10" />
             </div>
           </ScrollReveal>
 
           {/* Right - Process Steps */}
           <div className="relative">
             {/* Vertical line */}
             <div className="absolute left-[27px] top-8 bottom-8 w-px border-l-2 border-dashed border-primary/30 hidden sm:block" />
 
             <div className="space-y-5 sm:space-y-6">
               {processSteps.map((step, index) => (
                 <ScrollReveal
                   key={step.number}
                   animation="fade-up"
                   delay={index * 80}
                 >
                   <div className="flex gap-4 sm:gap-5 group">
                     {/* Step Number */}
                     <div className="relative z-10 flex-shrink-0">
                       <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-lg transition-transform duration-300 group-hover:scale-110">
                         {step.number}
                       </div>
                     </div>
 
                     {/* Content */}
                     <div className="flex-1 pt-1">
                       <h3 className="font-semibold text-foreground text-base sm:text-lg mb-1">
                         {language === 'en' ? step.titleEn : step.titleBn}
                       </h3>
                       <p className="text-sm text-muted-foreground leading-relaxed">
                         {language === 'en' ? step.descEn : step.descBn}
                       </p>
                     </div>
                   </div>
                 </ScrollReveal>
               ))}
             </div>
           </div>
         </div>
       </div>
     </section>
   );
 };
 
 export default DevelopmentProcessSection;