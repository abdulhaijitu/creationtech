import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Code, Smartphone, Cloud, Shield, Cog, BarChart, ArrowRight, Sparkles,
  CheckCircle, Headphones, Palette, Zap, Users, Clock, Award
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCMSContent } from '@/hooks/useCMSContent';
import ScrollReveal from '@/components/common/ScrollReveal';
import { cn } from '@/lib/utils';

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

const whyChooseUs = [
  {
    icon: Zap,
    titleEn: 'Fast Delivery',
    titleBn: 'দ্রুত ডেলিভারি',
    descEn: 'Agile methodology ensures quick turnaround times.',
    descBn: 'অ্যাজাইল পদ্ধতি দ্রুত ফলাফল নিশ্চিত করে।',
  },
  {
    icon: Users,
    titleEn: 'Expert Team',
    titleBn: 'বিশেষজ্ঞ দল',
    descEn: '100+ skilled professionals across all domains.',
    descBn: 'সকল ক্ষেত্রে ১০০+ দক্ষ পেশাদার।',
  },
  {
    icon: Clock,
    titleEn: '24/7 Support',
    titleBn: '২৪/৭ সাপোর্ট',
    descEn: 'Round-the-clock assistance for all clients.',
    descBn: 'সকল ক্লায়েন্টদের জন্য সার্বক্ষণিক সহায়তা।',
  },
  {
    icon: Award,
    titleEn: 'Quality Assured',
    titleBn: 'মান নিশ্চিত',
    descEn: 'Rigorous testing and quality control processes.',
    descBn: 'কঠোর টেস্টিং এবং মান নিয়ন্ত্রণ প্রক্রিয়া।',
  },
];

const Services = () => {
  const { t, language } = useLanguage();
  const { getSectionText, getMetaTitle, getMetaDescription } = useCMSContent({ pageSlug: 'services' });

  // CMS content with fallbacks
  const heroTitle = getSectionText('hero', 'title', language === 'en' ? 'Our Services' : 'আমাদের সেবাসমূহ');
  const heroSubtitle = getSectionText('hero', 'content', language === 'en' ? 'Comprehensive IT solutions tailored to your business needs' : 'আপনার ব্যবসার প্রয়োজন অনুযায়ী ব্যাপক আইটি সমাধান');
  const ctaTitle = getSectionText('cta', 'title', language === 'en' ? "Can't Find What You Need?" : 'আপনার প্রয়োজনীয় সেবা খুঁজে পাচ্ছেন না?');
  const ctaContent = getSectionText('cta', 'content', language === 'en' ? 'We offer custom solutions tailored to your specific requirements. Let us know what you need.' : 'আমরা আপনার নির্দিষ্ট প্রয়োজনীয়তা অনুযায়ী কাস্টম সমাধান অফার করি।');

  return (
    <>
      <Helmet>
        <title>{getMetaTitle('Custom Software Development Services | Creation Tech Bangladesh')}</title>
        <meta
          name="description"
          content={getMetaDescription("Expert custom software development services including web application development, mobile app development, IT consulting, and enterprise software solutions in Bangladesh.")}
        />
        <meta name="keywords" content="custom software development services, web application development, mobile app development company, IT consulting services, enterprise software solutions" />
        <link rel="canonical" href="https://creationtechbd.com/services" />
      </Helmet>
      <Layout>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 py-16 lg:py-24">
          {/* Background decorations */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-white/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-accent/10 blur-3xl" />
          </div>
          
          <div className="container-custom relative text-center">
            <ScrollReveal animation="fade-up">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                {language === 'en' ? 'What We Offer' : 'আমরা যা অফার করি'}
              </div>
            </ScrollReveal>
            
            <ScrollReveal animation="fade-up" delay={100}>
              <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl" style={{ letterSpacing: '-0.02em' }}>
                {heroTitle}
              </h1>
            </ScrollReveal>
            
            <ScrollReveal animation="fade-up" delay={150}>
              <p className="mx-auto max-w-2xl text-base text-white/70 leading-relaxed sm:text-lg">
                {heroSubtitle}
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12 lg:py-16">
          <div className="container-custom">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <ScrollReveal key={service.id} animation="fade-up" delay={index * 50}>
                    <Card 
                      id={service.id}
                      className={cn(
                        "group h-full border-border/50 bg-card",
                        "hover:border-primary/30 hover:shadow-xl hover:-translate-y-1",
                        "transition-all duration-300"
                      )}
                    >
                      <CardContent className="p-6">
                        {/* Icon */}
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon className="h-6 w-6" strokeWidth={1.5} />
                        </div>
                        
                        {/* Title */}
                        <h3 className="mb-2 text-lg font-semibold text-foreground">
                          {language === 'en' ? service.titleEn : service.titleBn}
                        </h3>
                        
                        {/* Description */}
                        <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                          {language === 'en' ? service.descEn : service.descBn}
                        </p>
                        
                        {/* Features */}
                        <ul className="mb-5 space-y-2">
                          {service.features.slice(0, 3).map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <CheckCircle className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                          {service.features.length > 3 && (
                            <li className="text-xs text-muted-foreground/70">
                              +{service.features.length - 3} {language === 'en' ? 'more' : 'আরও'}
                            </li>
                          )}
                        </ul>
                        
                        {/* CTA */}
                        <Link 
                          to={`/contact?service=${service.id}`}
                          className="inline-flex items-center text-sm font-medium text-primary hover:underline group/link"
                        >
                          {language === 'en' ? 'Get Quote' : 'কোটেশন নিন'}
                          <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-0.5" />
                        </Link>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-12 lg:py-16 bg-muted/30">
          <div className="container-custom">
            <ScrollReveal animation="fade-up">
              <div className="text-center mb-10">
                <span className="inline-block mb-2 text-xs font-semibold uppercase tracking-widest text-primary/80">
                  {language === 'en' ? 'WHY CHOOSE US' : 'কেন আমাদের বেছে নেবেন'}
                </span>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {language === 'en' ? 'The Creation Tech Advantage' : 'Creation Tech সুবিধা'}
                </h2>
              </div>
            </ScrollReveal>
            
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {whyChooseUs.map((item, index) => {
                const Icon = item.icon;
                return (
                  <ScrollReveal key={index} animation="fade-up" delay={index * 80}>
                    <div className="text-center p-6 rounded-2xl bg-background border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mb-2 font-semibold text-foreground">
                        {language === 'en' ? item.titleEn : item.titleBn}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language === 'en' ? item.descEn : item.descBn}
                      </p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 lg:py-16 bg-gradient-to-br from-primary via-primary/95 to-primary/90 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-[300px] h-[300px] rounded-full bg-white/5 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] rounded-full bg-accent/10 blur-3xl" />
          </div>
          <div className="container-custom relative text-center">
            <ScrollReveal animation="fade-up">
              <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
                {ctaTitle}
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={100}>
              <p className="mx-auto mb-8 max-w-xl text-base text-white/70 leading-relaxed">
                {ctaContent}
              </p>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={150}>
              <Button size="lg" variant="secondary" asChild className="font-semibold">
                <Link to="/contact">{t('common.contactUs')}</Link>
              </Button>
            </ScrollReveal>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Services;
