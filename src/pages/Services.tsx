import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Code, Smartphone, Cloud, Shield, Cog, BarChart, ArrowRight,
  CheckCircle, Database, Globe, Headphones, LineChart, Palette
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const services = [
  {
    id: 'web',
    icon: Code,
    titleEn: 'Web Development',
    titleBn: 'ওয়েব ডেভেলপমেন্ট',
    descEn: 'Custom websites and web applications built with modern technologies.',
    descBn: 'আধুনিক প্রযুক্তি দিয়ে তৈরি কাস্টম ওয়েবসাইট এবং ওয়েব অ্যাপ্লিকেশন।',
    features: ['Custom Web Applications', 'E-commerce Solutions', 'CMS Development', 'API Integration', 'Performance Optimization'],
  },
  {
    id: 'mobile',
    icon: Smartphone,
    titleEn: 'Mobile App Development',
    titleBn: 'মোবাইল অ্যাপ ডেভেলপমেন্ট',
    descEn: 'Native and cross-platform mobile applications for iOS and Android.',
    descBn: 'iOS এবং Android এর জন্য নেটিভ এবং ক্রস-প্ল্যাটফর্ম মোবাইল অ্যাপ্লিকেশন।',
    features: ['iOS Development', 'Android Development', 'React Native Apps', 'Flutter Apps', 'App Maintenance'],
  },
  {
    id: 'cloud',
    icon: Cloud,
    titleEn: 'Cloud Solutions',
    titleBn: 'ক্লাউড সলিউশন',
    descEn: 'Scalable cloud infrastructure and migration services.',
    descBn: 'স্কেলেবল ক্লাউড ইনফ্রাস্ট্রাকচার এবং মাইগ্রেশন সেবা।',
    features: ['Cloud Migration', 'AWS Services', 'Azure Solutions', 'Google Cloud', 'DevOps & CI/CD'],
  },
  {
    id: 'security',
    icon: Shield,
    titleEn: 'Cybersecurity',
    titleBn: 'সাইবার সিকিউরিটি',
    descEn: 'Comprehensive security solutions to protect your digital assets.',
    descBn: 'আপনার ডিজিটাল সম্পদ রক্ষা করতে ব্যাপক নিরাপত্তা সমাধান।',
    features: ['Security Audits', 'Penetration Testing', 'Compliance Solutions', 'Incident Response', 'Security Training'],
  },
  {
    id: 'consulting',
    icon: Cog,
    titleEn: 'IT Consulting',
    titleBn: 'আইটি পরামর্শ',
    descEn: 'Strategic technology consulting to align IT with your business.',
    descBn: 'আপনার ব্যবসার সাথে আইটি সামঞ্জস্য করতে কৌশলগত প্রযুক্তি পরামর্শ।',
    features: ['Technology Strategy', 'Digital Transformation', 'Process Optimization', 'Vendor Selection', 'IT Roadmapping'],
  },
  {
    id: 'analytics',
    icon: BarChart,
    titleEn: 'Data Analytics',
    titleBn: 'ডেটা অ্যানালিটিক্স',
    descEn: 'Transform your data into actionable insights.',
    descBn: 'আপনার ডেটাকে কার্যকরী অন্তর্দৃষ্টিতে রূপান্তর করুন।',
    features: ['Business Intelligence', 'Data Visualization', 'Predictive Analytics', 'Machine Learning', 'Custom Dashboards'],
  },
  {
    id: 'uiux',
    icon: Palette,
    titleEn: 'UI/UX Design',
    titleBn: 'UI/UX ডিজাইন',
    descEn: 'User-centered design that delights and converts.',
    descBn: 'ব্যবহারকারী-কেন্দ্রিক ডিজাইন যা আনন্দিত করে এবং রূপান্তর করে।',
    features: ['User Research', 'Wireframing', 'Prototyping', 'Visual Design', 'Usability Testing'],
  },
  {
    id: 'support',
    icon: Headphones,
    titleEn: 'IT Support & Maintenance',
    titleBn: 'আইটি সাপোর্ট ও রক্ষণাবেক্ষণ',
    descEn: '24/7 technical support and system maintenance.',
    descBn: '২৪/৭ প্রযুক্তিগত সহায়তা এবং সিস্টেম রক্ষণাবেক্ষণ।',
    features: ['24/7 Support', 'System Monitoring', 'Bug Fixes', 'Updates & Patches', 'Performance Tuning'],
  },
];

const Services = () => {
  const { t, language } = useLanguage();

  return (
    <>
      <Helmet>
        <title>Our Services - Creation Tech | IT Solutions & Development</title>
        <meta
          name="description"
          content="Explore Creation Tech's comprehensive IT services including web development, mobile apps, cloud solutions, cybersecurity, and IT consulting."
        />
      </Helmet>
      <Layout>
        {/* Hero */}
        <section className="gradient-hero py-20 lg:py-28">
          <div className="container-custom text-center">
            <h1 className="mb-4 text-4xl font-bold text-primary-foreground sm:text-5xl">
              {t('services.title')}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-primary-foreground/80">
              {t('services.subtitle')}
            </p>
          </div>
        </section>

        {/* Services List */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="space-y-16">
              {services.map((service, index) => {
                const Icon = service.icon;
                const isEven = index % 2 === 0;
                return (
                  <div
                    key={service.id}
                    id={service.id}
                    className={`flex flex-col gap-8 lg:flex-row lg:items-center ${
                      isEven ? '' : 'lg:flex-row-reverse'
                    }`}
                  >
                    {/* Icon Card */}
                    <div className="lg:w-1/3">
                      <div className="flex aspect-square max-w-xs items-center justify-center rounded-2xl bg-primary/10 mx-auto lg:mx-0">
                        <Icon className="h-24 w-24 text-primary" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="lg:w-2/3">
                      <h2 className="mb-4 text-3xl font-bold">
                        {language === 'en' ? service.titleEn : service.titleBn}
                      </h2>
                      <p className="mb-6 text-lg text-muted-foreground">
                        {language === 'en' ? service.descEn : service.descBn}
                      </p>
                      <ul className="mb-6 grid gap-2 sm:grid-cols-2">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-accent" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button asChild>
                        <Link to={`/contact?service=${service.id}`}>
                          {language === 'en' ? 'Get Quote' : 'কোটেশন নিন'}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-section-alt">
          <div className="container-custom text-center">
            <h2 className="mb-4 text-3xl font-bold">
              {language === 'en' ? "Can't Find What You Need?" : 'আপনার প্রয়োজনীয় সেবা খুঁজে পাচ্ছেন না?'}
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              {language === 'en'
                ? 'We offer custom solutions tailored to your specific requirements. Let us know what you need.'
                : 'আমরা আপনার নির্দিষ্ট প্রয়োজনীয়তা অনুযায়ী কাস্টম সমাধান অফার করি।'}
            </p>
            <Button size="lg" asChild>
              <Link to="/contact">{t('common.contactUs')}</Link>
            </Button>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Services;
