import { Link } from 'react-router-dom';
import { ArrowRight, Code, Smartphone, Cloud, Shield, Cog, BarChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePageContent } from '@/hooks/usePageContent';

const services = [
  {
    icon: Code,
    titleEn: 'Web Development',
    titleBn: 'ওয়েব ডেভেলপমেন্ট',
    descEn: 'Get a professional website that attracts customers and drives sales.',
    descBn: 'একটি পেশাদার ওয়েবসাইট পান যা গ্রাহকদের আকৃষ্ট করে এবং বিক্রয় বাড়ায়।',
    href: '/services#web',
  },
  {
    icon: Smartphone,
    titleEn: 'Mobile Apps',
    titleBn: 'মোবাইল অ্যাপস',
    descEn: 'Reach your customers on their phones with a custom iOS or Android app.',
    descBn: 'কাস্টম iOS বা Android অ্যাপ দিয়ে আপনার গ্রাহকদের কাছে পৌঁছান।',
    href: '/services#mobile',
  },
  {
    icon: Cloud,
    titleEn: 'Cloud Solutions',
    titleBn: 'ক্লাউড সলিউশন',
    descEn: 'Scale your operations seamlessly with reliable cloud infrastructure.',
    descBn: 'নির্ভরযোগ্য ক্লাউড অবকাঠামো দিয়ে আপনার কার্যক্রম সহজে স্কেল করুন।',
    href: '/services#cloud',
  },
  {
    icon: Shield,
    titleEn: 'Cybersecurity',
    titleBn: 'সাইবার সিকিউরিটি',
    descEn: 'Protect your business data from threats with enterprise-grade security.',
    descBn: 'এন্টারপ্রাইজ-গ্রেড নিরাপত্তা দিয়ে আপনার ব্যবসার তথ্য সুরক্ষিত করুন।',
    href: '/services#security',
  },
  {
    icon: Cog,
    titleEn: 'IT Consulting',
    titleBn: 'আইটি পরামর্শ',
    descEn: 'Make smarter technology decisions with expert guidance.',
    descBn: 'বিশেষজ্ঞ নির্দেশনায় স্মার্ট প্রযুক্তি সিদ্ধান্ত নিন।',
    href: '/services#consulting',
  },
  {
    icon: BarChart,
    titleEn: 'Data Analytics',
    titleBn: 'ডেটা অ্যানালিটিক্স',
    descEn: 'Turn your business data into insights that drive growth.',
    descBn: 'আপনার ব্যবসার তথ্যকে বৃদ্ধি-চালিত অন্তর্দৃষ্টিতে রূপান্তর করুন।',
    href: '/services#analytics',
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
    <section className="section-padding bg-section-light">
      <div className="container-custom">
        {/* Section Header - refined spacing and typography */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-5 text-3xl font-bold tracking-tight sm:text-4xl">
            {sectionTitle}
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {sectionSubtitle}
          </p>
        </div>

        {/* Services Grid - improved card styling */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={index}
                className="group card-interactive border-border/40 hover:border-border/60"
              >
                <CardHeader className="pb-4">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/8 text-primary transition-all duration-250 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg font-semibold">
                    {language === 'en' ? service.titleEn : service.titleBn}
                  </CardTitle>
                  <CardDescription className="leading-relaxed">
                    {language === 'en' ? service.descEn : service.descBn}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    to={service.href}
                    className="inline-flex items-center text-sm font-medium text-primary transition-colors duration-200 hover:text-primary/80"
                  >
                    {t('common.learnMore')}
                    <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* View All Button - refined styling */}
        <div className="mt-14 text-center">
          <Button variant="outline" size="lg" asChild className="group">
            <Link to="/services">
              {t('common.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
