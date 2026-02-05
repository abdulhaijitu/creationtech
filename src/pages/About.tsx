import { Helmet } from 'react-helmet-async';
import { Target, Eye, Users, Award, Heart, Linkedin, Twitter, Sparkles } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { useCMSContent } from '@/hooks/useCMSContent';
import ScrollReveal from '@/components/common/ScrollReveal';
import CountUp from '@/components/common/CountUp';
import { cn } from '@/lib/utils';

// Images
import aboutOfficeImg from '@/assets/about-office.jpg';
import ceoImg from '@/assets/team/ceo.jpg';
import ctoImg from '@/assets/team/cto.jpg';
import headEngineeringImg from '@/assets/team/head-engineering.jpg';
import headDesignImg from '@/assets/team/head-design.jpg';

const values = [
  {
    icon: Target,
    titleEn: 'Innovation',
    titleBn: 'উদ্ভাবন',
    descEn: 'We constantly push boundaries to deliver cutting-edge solutions.',
    descBn: 'আমরা সর্বদা অত্যাধুনিক সমাধান সরবরাহ করতে সীমানা ভাঙি।',
  },
  {
    icon: Award,
    titleEn: 'Excellence',
    titleBn: 'শ্রেষ্ঠত্ব',
    descEn: 'Quality is at the core of everything we create.',
    descBn: 'আমরা যা তৈরি করি তার মূলে মান রয়েছে।',
  },
  {
    icon: Users,
    titleEn: 'Collaboration',
    titleBn: 'সহযোগিতা',
    descEn: 'We work as partners with our clients to achieve shared success.',
    descBn: 'আমরা সাফল্য অর্জনে আমাদের ক্লায়েন্টদের সাথে অংশীদার হিসেবে কাজ করি।',
  },
  {
    icon: Heart,
    titleEn: 'Integrity',
    titleBn: 'সততা',
    descEn: 'Transparency and honesty guide all our business relationships.',
    descBn: 'স্বচ্ছতা এবং সততা আমাদের সমস্ত ব্যবসায়িক সম্পর্ককে পরিচালিত করে।',
  },
];

const teamMembers = [
  {
    id: 'ceo',
    nameEn: 'Rafiq Ahmed',
    nameBn: 'রফিক আহমেদ',
    roleEn: 'CEO & Founder',
    roleBn: 'সিইও ও প্রতিষ্ঠাতা',
    image: ceoImg,
    linkedin: '#',
    twitter: '#',
  },
  {
    id: 'cto',
    nameEn: 'Fatima Rahman',
    nameBn: 'ফাতিমা রহমান',
    roleEn: 'Chief Technology Officer',
    roleBn: 'চিফ টেকনোলজি অফিসার',
    image: ctoImg,
    linkedin: '#',
    twitter: '#',
  },
  {
    id: 'head-engineering',
    nameEn: 'Karim Hassan',
    nameBn: 'করিম হাসান',
    roleEn: 'Head of Engineering',
    roleBn: 'হেড অব ইঞ্জিনিয়ারিং',
    image: headEngineeringImg,
    linkedin: '#',
    twitter: '#',
  },
  {
    id: 'head-design',
    nameEn: 'Nusrat Jahan',
    nameBn: 'নুসরাত জাহান',
    roleEn: 'Head of Design',
    roleBn: 'হেড অব ডিজাইন',
    image: headDesignImg,
    linkedin: '#',
    twitter: '#',
  },
];

const stats = [
  { value: 10, suffix: '+', labelEn: 'Years Experience', labelBn: 'বছরের অভিজ্ঞতা' },
  { value: 500, suffix: '+', labelEn: 'Projects Delivered', labelBn: 'প্রজেক্ট সম্পন্ন' },
  { value: 100, suffix: '+', labelEn: 'Team Members', labelBn: 'টিম মেম্বার' },
  { value: 15, suffix: '+', labelEn: 'Countries Served', labelBn: 'দেশে সেবা' },
];

const timeline = [
  { year: '2015', titleEn: 'Company Founded', titleBn: 'কোম্পানি প্রতিষ্ঠা', descEn: 'Started with a vision to transform businesses through technology.', descBn: 'প্রযুক্তির মাধ্যমে ব্যবসা রূপান্তরের দৃষ্টিভঙ্গি নিয়ে শুরু।' },
  { year: '2017', titleEn: 'First Major Client', titleBn: 'প্রথম বড় ক্লায়েন্ট', descEn: 'Secured enterprise contract, expanding our service offerings.', descBn: 'এন্টারপ্রাইজ চুক্তি সুরক্ষিত করে সেবার পরিধি বাড়ানো।' },
  { year: '2019', titleEn: 'Team Expansion', titleBn: 'দল সম্প্রসারণ', descEn: 'Grew to 30+ professionals across multiple domains.', descBn: 'একাধিক ডোমেনে ৩০+ পেশাদারে বৃদ্ধি।' },
  { year: '2021', titleEn: 'Cloud Partnership', titleBn: 'ক্লাউড পার্টনারশিপ', descEn: 'Became certified partners with major cloud providers.', descBn: 'প্রধান ক্লাউড প্রদানকারীদের সাথে সার্টিফাইড পার্টনার।' },
  { year: '2024', titleEn: 'International Growth', titleBn: 'আন্তর্জাতিক বৃদ্ধি', descEn: 'Expanded services to clients across 15+ countries.', descBn: '১৫+ দেশে ক্লায়েন্টদের কাছে সেবা সম্প্রসারণ।' },
];

const About = () => {
  const { t, language } = useLanguage();
  const { getSection, getSectionText, getMetaTitle, getMetaDescription } = useCMSContent({ pageSlug: 'about' });

  const heroSection = getSection('hero', {
    title: language === 'en' ? 'About Us' : 'আমাদের সম্পর্কে',
    content: language === 'en' ? 'Learn about our journey and mission' : 'আমাদের যাত্রা এবং মিশন সম্পর্কে জানুন',
  });

  const storyContent = getSectionText(
    'story',
    'content',
    language === 'en'
      ? 'Creation Tech was founded in 2015 with a simple yet powerful mission: to help businesses harness the power of technology for growth and success. What started as a small team of passionate developers has grown into a full-service IT company serving clients across Bangladesh and beyond.\n\nToday, we are proud to be a trusted technology partner for over 200 businesses, delivering innovative solutions that drive real results. Our team of 50+ experts brings together diverse skills in development, design, cloud computing, and cybersecurity.'
      : 'Creation Tech ২০১৫ সালে একটি সহজ কিন্তু শক্তিশালী মিশন নিয়ে প্রতিষ্ঠিত হয়েছিল: ব্যবসাগুলিকে বৃদ্ধি এবং সাফল্যের জন্য প্রযুক্তির শক্তি কাজে লাগাতে সাহায্য করা।\n\nআজ, আমরা ২০০+ ব্যবসার জন্য একটি বিশ্বস্ত প্রযুক্তি অংশীদার হতে পেরে গর্বিত, প্রকৃত ফলাফল চালিত উদ্ভাবনী সমাধান সরবরাহ করছি।'
  );

  const missionContent = getSectionText(
    'mission',
    'content',
    language === 'en'
      ? 'To empower businesses with innovative technology solutions that drive growth, efficiency, and competitive advantage.'
      : 'উদ্ভাবনী প্রযুক্তি সমাধান দিয়ে ব্যবসাগুলিকে ক্ষমতায়ন করা যা বৃদ্ধি, দক্ষতা এবং প্রতিযোগিতামূলক সুবিধা চালিত করে।'
  );

  const visionContent = getSectionText(
    'vision',
    'content',
    language === 'en'
      ? 'To be the leading IT solutions provider in Bangladesh and Southeast Asia, recognized for innovation and quality.'
      : 'বাংলাদেশ এবং দক্ষিণ-পূর্ব এশিয়ায় শীর্ষস্থানীয় আইটি সলিউশন প্রদানকারী হওয়া।'
  );

  return (
    <>
      <Helmet>
        <title>{getMetaTitle('Trusted Software Company in Bangladesh | About Creation Tech')}</title>
        <meta
          name="description"
          content={getMetaDescription("Creation Tech is a trusted software company in Bangladesh serving enterprise clients with custom software development, technology partnerships, and digital solutions since 2014.")}
        />
        <meta name="keywords" content="trusted software company Bangladesh, software clients Bangladesh, technology partners, enterprise software provider" />
        <link rel="canonical" href="https://creationtechbd.com/about" />
      </Helmet>
      <Layout>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 py-16 lg:py-24">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-white/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-accent/10 blur-3xl" />
          </div>
          
          <div className="container-custom relative">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <div className="text-center lg:text-left">
                <ScrollReveal animation="fade-up">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                    <Sparkles className="h-4 w-4" />
                    {language === 'en' ? 'About Creation Tech' : 'Creation Tech সম্পর্কে'}
                  </div>
                </ScrollReveal>
                
                <ScrollReveal animation="fade-up" delay={100}>
                  <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl" style={{ letterSpacing: '-0.02em' }}>
                    {language === 'en' ? 'Trusted Software Company in Bangladesh' : 'বাংলাদেশের বিশ্বস্ত সফটওয়্যার কোম্পানি'}
                  </h1>
                </ScrollReveal>
                
                <ScrollReveal animation="fade-up" delay={150}>
                  <p className="text-base text-white/70 leading-relaxed max-w-xl mx-auto lg:mx-0 sm:text-lg">
                    {heroSection.content || t('about.subtitle')}
                  </p>
                </ScrollReveal>
                
                <ScrollReveal animation="fade-up" delay={200}>
                  <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat, index) => (
                      <div key={index} className="text-center lg:text-left">
                        <div className="text-xl font-bold text-white sm:text-2xl">
                          <CountUp end={stat.value} duration={2000} />{stat.suffix}
                        </div>
                        <div className="text-xs text-white/60 sm:text-sm">
                          {language === 'en' ? stat.labelEn : stat.labelBn}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollReveal>
              </div>
              
              <ScrollReveal animation="fade-left" className="hidden lg:block">
                <div className="relative">
                  <div className="overflow-hidden rounded-2xl shadow-2xl">
                    <img src={aboutOfficeImg} alt="Creation Tech Office" className="w-full h-auto object-cover" loading="lazy" />
                  </div>
                  <div className="absolute -inset-3 rounded-2xl border border-white/10 -z-10" />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-12 lg:py-16">
          <div className="container-narrow">
            <ScrollReveal animation="fade-up">
              <h2 className="mb-6 text-center text-2xl font-bold tracking-tight sm:text-3xl">
                {getSectionText('story', 'title', language === 'en' ? 'Our Story' : 'আমাদের গল্প')}
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={100}>
              <div className="space-y-5">
                {storyContent.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-base text-muted-foreground leading-relaxed text-center">
                    {paragraph}
                  </p>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-12 lg:py-16 bg-muted/30">
          <div className="container-custom">
            <div className="grid gap-6 lg:grid-cols-2">
              <ScrollReveal animation="fade-right">
                <Card className="h-full border-0 bg-primary text-primary-foreground shadow-xl">
                  <CardContent className="p-6 lg:p-8">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-foreground/15">
                      <Target className="h-5 w-5" />
                    </div>
                    <h3 className="mb-3 text-xl font-bold">{getSectionText('mission', 'title', t('about.mission'))}</h3>
                    <p className="text-primary-foreground/80 leading-relaxed text-sm">{missionContent}</p>
                  </CardContent>
                </Card>
              </ScrollReveal>
              <ScrollReveal animation="fade-left" delay={100}>
                <Card className="h-full border-0 bg-accent text-accent-foreground shadow-xl">
                  <CardContent className="p-6 lg:p-8">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-foreground/15">
                      <Eye className="h-5 w-5" />
                    </div>
                    <h3 className="mb-3 text-xl font-bold">{getSectionText('vision', 'title', t('about.vision'))}</h3>
                    <p className="text-accent-foreground/80 leading-relaxed text-sm">{visionContent}</p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-12 lg:py-16">
          <div className="container-custom">
            <ScrollReveal animation="fade-up">
              <div className="text-center mb-10">
                <span className="inline-block mb-2 text-xs font-semibold uppercase tracking-widest text-primary/80">
                  {language === 'en' ? 'OUR TEAM' : 'আমাদের টিম'}
                </span>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {language === 'en' ? 'Meet the Leadership' : 'নেতৃত্বের সাথে পরিচিত হোন'}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
                  {language === 'en' 
                    ? 'Passionate professionals driving innovation and excellence.'
                    : 'উদ্ভাবন এবং শ্রেষ্ঠত্ব চালিত করা উত্সাহী পেশাদাররা।'}
                </p>
              </div>
            </ScrollReveal>
            
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {teamMembers.map((member, index) => (
                <ScrollReveal key={member.id} animation="fade-up" delay={index * 80}>
                  <div className={cn(
                    'group relative overflow-hidden rounded-2xl bg-card border border-border/50',
                    'shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1'
                  )}>
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={member.image}
                        alt={language === 'en' ? member.nameEn : member.nameBn}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                        <div className="flex gap-2">
                          <a href={member.linkedin} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-foreground hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="LinkedIn">
                            <Linkedin className="h-4 w-4" />
                          </a>
                          <a href={member.twitter} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-foreground hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="Twitter">
                            <Twitter className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="font-semibold text-foreground text-sm">{language === 'en' ? member.nameEn : member.nameBn}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{language === 'en' ? member.roleEn : member.roleBn}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-12 lg:py-16 bg-muted/30">
          <div className="container-custom">
            <ScrollReveal animation="fade-up">
              <h2 className="mb-8 text-center text-2xl font-bold tracking-tight sm:text-3xl">
                {language === 'en' ? 'Our Values' : 'আমাদের মূল্যবোধ'}
              </h2>
            </ScrollReveal>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <ScrollReveal key={index} animation="fade-up" delay={index * 80}>
                    <Card className="h-full text-center border-border/40 hover:border-primary/30 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                      <CardContent className="p-5">
                        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="mb-2 text-sm font-semibold">{language === 'en' ? value.titleEn : value.titleBn}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{language === 'en' ? value.descEn : value.descBn}</p>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-12 lg:py-16">
          <div className="container-custom">
            <ScrollReveal animation="fade-up">
              <h2 className="mb-8 text-center text-2xl font-bold tracking-tight sm:text-3xl">
                {language === 'en' ? 'Our Journey' : 'আমাদের যাত্রা'}
              </h2>
            </ScrollReveal>
            <div className="relative mx-auto max-w-3xl">
              <div className="absolute left-4 top-0 h-full w-0.5 bg-border/60 md:left-1/2 md:-ml-px" />
              {timeline.map((item, index) => (
                <ScrollReveal key={index} animation="fade-up" delay={index * 80}>
                  <div className={`relative mb-6 flex items-start md:items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className="absolute left-4 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm md:left-1/2 md:-ml-3.5">
                      {item.year.slice(-2)}
                    </div>
                    <div className={`ml-14 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'}`}>
                      <Card className="border-border/40 hover:border-primary/30 hover:shadow-md transition-all duration-300">
                        <CardContent className="p-4">
                          <span className="text-xs font-bold text-primary">{item.year}</span>
                          <h3 className="font-semibold mt-0.5 text-sm">{language === 'en' ? item.titleEn : item.titleBn}</h3>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{language === 'en' ? item.descEn : item.descBn}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default About;
