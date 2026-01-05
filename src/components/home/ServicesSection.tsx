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
    descEn: 'Custom websites and web applications built with modern technologies for optimal performance.',
    descBn: 'আধুনিক প্রযুক্তি দিয়ে তৈরি কাস্টম ওয়েবসাইট এবং ওয়েব অ্যাপ্লিকেশন।',
    href: '/services#web',
  },
  {
    icon: Smartphone,
    titleEn: 'Mobile Apps',
    titleBn: 'মোবাইল অ্যাপস',
    descEn: 'Native and cross-platform mobile applications for iOS and Android devices.',
    descBn: 'iOS এবং Android ডিভাইসের জন্য নেটিভ এবং ক্রস-প্ল্যাটফর্ম মোবাইল অ্যাপ্লিকেশন।',
    href: '/services#mobile',
  },
  {
    icon: Cloud,
    titleEn: 'Cloud Solutions',
    titleBn: 'ক্লাউড সলিউশন',
    descEn: 'Scalable cloud infrastructure and migration services for business growth.',
    descBn: 'ব্যবসায়িক বৃদ্ধির জন্য স্কেলেবল ক্লাউড ইনফ্রাস্ট্রাকচার এবং মাইগ্রেশন সেবা।',
    href: '/services#cloud',
  },
  {
    icon: Shield,
    titleEn: 'Cybersecurity',
    titleBn: 'সাইবার সিকিউরিটি',
    descEn: 'Comprehensive security solutions to protect your digital assets.',
    descBn: 'আপনার ডিজিটাল সম্পদ রক্ষা করতে ব্যাপক নিরাপত্তা সমাধান।',
    href: '/services#security',
  },
  {
    icon: Cog,
    titleEn: 'IT Consulting',
    titleBn: 'আইটি পরামর্শ',
    descEn: 'Strategic technology consulting to align IT with your business goals.',
    descBn: 'আপনার ব্যবসায়িক লক্ষ্যের সাথে আইটি সামঞ্জস্য করতে কৌশলগত প্রযুক্তি পরামর্শ।',
    href: '/services#consulting',
  },
  {
    icon: BarChart,
    titleEn: 'Data Analytics',
    titleBn: 'ডেটা অ্যানালিটিক্স',
    descEn: 'Transform your data into actionable insights with our analytics solutions.',
    descBn: 'আমাদের অ্যানালিটিক্স সমাধান দিয়ে আপনার ডেটাকে কার্যকরী অন্তর্দৃষ্টিতে রূপান্তর করুন।',
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
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{sectionTitle}</h2>
          <p className="text-lg text-muted-foreground">{sectionSubtitle}</p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={index}
                className="group border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">
                    {language === 'en' ? service.titleEn : service.titleBn}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {language === 'en' ? service.descEn : service.descBn}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    to={service.href}
                    className="inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    {t('common.learnMore')}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link to="/services">
              {t('common.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
