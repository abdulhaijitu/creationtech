import { Link } from 'react-router-dom';
import { ArrowRight, Code, Smartphone, Cloud, Shield, Cog, BarChart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePageContent } from '@/hooks/usePageContent';
import ScrollReveal from '@/components/common/ScrollReveal';

const services = [
  {
    icon: Code,
    titleEn: 'Web Development',
    titleBn: 'ওয়েব ডেভেলপমেন্ট',
    descEn: 'Get a professional website that attracts customers and drives sales.',
    descBn: 'একটি পেশাদার ওয়েবসাইট পান যা গ্রাহকদের আকৃষ্ট করে এবং বিক্রয় বাড়ায়।',
    href: '/services#web',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    iconBg: 'bg-blue-500/10 group-hover:bg-blue-500',
    iconColor: 'text-blue-500 group-hover:text-white',
  },
  {
    icon: Smartphone,
    titleEn: 'Mobile Apps',
    titleBn: 'মোবাইল অ্যাপস',
    descEn: 'Reach your customers on their phones with a custom iOS or Android app.',
    descBn: 'কাস্টম iOS বা Android অ্যাপ দিয়ে আপনার গ্রাহকদের কাছে পৌঁছান।',
    href: '/services#mobile',
    gradient: 'from-purple-500/20 to-pink-500/20',
    iconBg: 'bg-purple-500/10 group-hover:bg-purple-500',
    iconColor: 'text-purple-500 group-hover:text-white',
  },
  {
    icon: Cloud,
    titleEn: 'Cloud Solutions',
    titleBn: 'ক্লাউড সলিউশন',
    descEn: 'Scale your operations seamlessly with reliable cloud infrastructure.',
    descBn: 'নির্ভরযোগ্য ক্লাউড অবকাঠামো দিয়ে আপনার কার্যক্রম সহজে স্কেল করুন।',
    href: '/services#cloud',
    gradient: 'from-sky-500/20 to-indigo-500/20',
    iconBg: 'bg-sky-500/10 group-hover:bg-sky-500',
    iconColor: 'text-sky-500 group-hover:text-white',
  },
  {
    icon: Shield,
    titleEn: 'Cybersecurity',
    titleBn: 'সাইবার সিকিউরিটি',
    descEn: 'Protect your business data from threats with enterprise-grade security.',
    descBn: 'এন্টারপ্রাইজ-গ্রেড নিরাপত্তা দিয়ে আপনার ব্যবসার তথ্য সুরক্ষিত করুন।',
    href: '/services#security',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    iconBg: 'bg-emerald-500/10 group-hover:bg-emerald-500',
    iconColor: 'text-emerald-500 group-hover:text-white',
  },
  {
    icon: Cog,
    titleEn: 'IT Consulting',
    titleBn: 'আইটি পরামর্শ',
    descEn: 'Make smarter technology decisions with expert guidance.',
    descBn: 'বিশেষজ্ঞ নির্দেশনায় স্মার্ট প্রযুক্তি সিদ্ধান্ত নিন।',
    href: '/services#consulting',
    gradient: 'from-orange-500/20 to-amber-500/20',
    iconBg: 'bg-orange-500/10 group-hover:bg-orange-500',
    iconColor: 'text-orange-500 group-hover:text-white',
  },
  {
    icon: BarChart,
    titleEn: 'Data Analytics',
    titleBn: 'ডেটা অ্যানালিটিক্স',
    descEn: 'Turn your business data into insights that drive growth.',
    descBn: 'আপনার ব্যবসার তথ্যকে বৃদ্ধি-চালিত অন্তর্দৃষ্টিতে রূপান্তর করুন।',
    href: '/services#analytics',
    gradient: 'from-rose-500/20 to-red-500/20',
    iconBg: 'bg-rose-500/10 group-hover:bg-rose-500',
    iconColor: 'text-rose-500 group-hover:text-white',
  },
];

const ServicesSection = () => {
  const { t, language } = useLanguage();
  const { data: homeContent } = usePageContent('home');

  const servicesSection = homeContent?.find((c) => c.section_key === 'services_section');

  const sectionTitle = language === 'en'
    ? servicesSection?.title_en || t('services.title')
    : servicesSection?.title_bn || t('services.title');

  const sectionSubtitle = language === 'en'
    ? servicesSection?.content_en || t('services.subtitle')
    : servicesSection?.content_bn || t('services.subtitle');

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      <div className="container-custom relative">
        {/* Section Header */}
        <ScrollReveal className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            {language === 'en' ? 'What We Offer' : 'আমরা কি অফার করি'}
          </div>
          <h2 className="mb-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem]" style={{ letterSpacing: '-0.02em' }}>
            {sectionTitle}
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {sectionSubtitle}
          </p>
        </ScrollReveal>

        {/* Services Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <ScrollReveal key={index} delay={index * 80} duration={450}>
                <Link 
                  to={service.href}
                  className="group relative block h-full"
                >
                  {/* Card */}
                  <div className="relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-border hover:shadow-xl hover:-translate-y-1 lg:p-7">
                    {/* Gradient Overlay on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                    
                    {/* Content */}
                    <div className="relative">
                      {/* Icon */}
                      <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl ${service.iconBg} transition-all duration-300`}>
                        <Icon className={`h-6 w-6 ${service.iconColor} transition-colors duration-300`} />
                      </div>
                      
                      {/* Title */}
                      <h3 className="mb-3 text-lg font-semibold text-foreground transition-colors duration-200">
                        {language === 'en' ? service.titleEn : service.titleBn}
                      </h3>
                      
                      {/* Description */}
                      <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                        {language === 'en' ? service.descEn : service.descBn}
                      </p>
                      
                      {/* Link */}
                      <div className="inline-flex items-center text-sm font-medium text-primary transition-colors duration-200">
                        {t('common.learnMore')}
                        <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </div>
                    </div>
                    
                    {/* Corner Accent */}
                    <div className="absolute -bottom-12 -right-12 h-24 w-24 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>

        {/* View All Button */}
        <ScrollReveal delay={500} className="mt-14 text-center">
          <Button 
            size="lg" 
            asChild 
            className="group shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
          >
            <Link to="/services">
              {language === 'en' ? 'Explore All Services' : 'সব সেবা দেখুন'}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ServicesSection;
