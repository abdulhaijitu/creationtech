import { Helmet } from 'react-helmet-async';
import { Target, Eye, Users, Award, Clock, Heart } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';

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

const timeline = [
  { year: '2015', titleEn: 'Company Founded', titleBn: 'কোম্পানি প্রতিষ্ঠা', descEn: 'Started with a vision to transform businesses through technology.', descBn: 'প্রযুক্তির মাধ্যমে ব্যবসা রূপান্তরের দৃষ্টিভঙ্গি নিয়ে শুরু।' },
  { year: '2017', titleEn: 'First Major Client', titleBn: 'প্রথম বড় ক্লায়েন্ট', descEn: 'Secured enterprise contract, expanding our service offerings.', descBn: 'এন্টারপ্রাইজ চুক্তি সুরক্ষিত করে সেবার পরিধি বাড়ানো।' },
  { year: '2019', titleEn: 'Team Expansion', titleBn: 'দল সম্প্রসারণ', descEn: 'Grew to 30+ professionals across multiple domains.', descBn: 'একাধিক ডোমেনে ৩০+ পেশাদারে বৃদ্ধি।' },
  { year: '2021', titleEn: 'Cloud Partnership', titleBn: 'ক্লাউড পার্টনারশিপ', descEn: 'Became certified partners with major cloud providers.', descBn: 'প্রধান ক্লাউড প্রদানকারীদের সাথে সার্টিফাইড পার্টনার।' },
  { year: '2024', titleEn: 'International Growth', titleBn: 'আন্তর্জাতিক বৃদ্ধি', descEn: 'Expanded services to clients across 15+ countries.', descBn: '১৫+ দেশে ক্লায়েন্টদের কাছে সেবা সম্প্রসারণ।' },
];

const About = () => {
  const { t, language } = useLanguage();

  return (
    <>
      <Helmet>
        <title>About Us - Creation Tech | Our Story & Mission</title>
        <meta
          name="description"
          content="Learn about Creation Tech's journey, mission, vision, and the values that drive us to deliver exceptional IT solutions to businesses worldwide."
        />
      </Helmet>
      <Layout>
        {/* Hero */}
        <section className="gradient-hero py-20 lg:py-28">
          <div className="container-custom text-center">
            <h1 className="mb-4 text-4xl font-bold text-primary-foreground sm:text-5xl">
              {t('about.title')}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-primary-foreground/80">
              {t('about.subtitle')}
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold">
                {language === 'en' ? 'Our Story' : 'আমাদের গল্প'}
              </h2>
              <p className="mb-6 text-lg text-muted-foreground leading-relaxed">
                {language === 'en'
                  ? 'Creation Tech was founded in 2015 with a simple yet powerful mission: to help businesses harness the power of technology for growth and success. What started as a small team of passionate developers has grown into a full-service IT company serving clients across Bangladesh and beyond.'
                  : 'Creation Tech ২০১৫ সালে একটি সহজ কিন্তু শক্তিশালী মিশন নিয়ে প্রতিষ্ঠিত হয়েছিল: ব্যবসাগুলিকে বৃদ্ধি এবং সাফল্যের জন্য প্রযুক্তির শক্তি কাজে লাগাতে সাহায্য করা।'}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {language === 'en'
                  ? 'Today, we are proud to be a trusted technology partner for over 200 businesses, delivering innovative solutions that drive real results. Our team of 50+ experts brings together diverse skills in development, design, cloud computing, and cybersecurity.'
                  : 'আজ, আমরা ২০০+ ব্যবসার জন্য একটি বিশ্বস্ত প্রযুক্তি অংশীদার হতে পেরে গর্বিত, প্রকৃত ফলাফল চালিত উদ্ভাবনী সমাধান সরবরাহ করছি।'}
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="section-padding bg-section-alt">
          <div className="container-custom">
            <div className="grid gap-8 lg:grid-cols-2">
              <Card className="border-0 bg-primary text-primary-foreground">
                <CardContent className="p-8">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-foreground/20">
                    <Target className="h-6 w-6" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold">{t('about.mission')}</h3>
                  <p className="text-primary-foreground/80 leading-relaxed">
                    {language === 'en'
                      ? 'To empower businesses with innovative technology solutions that drive growth, efficiency, and competitive advantage. We are committed to delivering excellence in every project while building lasting partnerships based on trust and mutual success.'
                      : 'উদ্ভাবনী প্রযুক্তি সমাধান দিয়ে ব্যবসাগুলিকে ক্ষমতায়ন করা যা বৃদ্ধি, দক্ষতা এবং প্রতিযোগিতামূলক সুবিধা চালিত করে।'}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 bg-accent text-accent-foreground">
                <CardContent className="p-8">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent-foreground/20">
                    <Eye className="h-6 w-6" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold">{t('about.vision')}</h3>
                  <p className="text-accent-foreground/80 leading-relaxed">
                    {language === 'en'
                      ? 'To be the leading IT solutions provider in Bangladesh and Southeast Asia, recognized for our innovation, quality, and commitment to client success. We envision a future where every business, regardless of size, can leverage technology to achieve their full potential.'
                      : 'বাংলাদেশ এবং দক্ষিণ-পূর্ব এশিয়ায় শীর্ষস্থানীয় আইটি সলিউশন প্রদানকারী হওয়া, আমাদের উদ্ভাবন, গুণমান এবং ক্লায়েন্ট সাফল্যের প্রতিশ্রুতির জন্য স্বীকৃত।'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding">
          <div className="container-custom">
            <h2 className="mb-12 text-center text-3xl font-bold">
              {language === 'en' ? 'Our Values' : 'আমাদের মূল্যবোধ'}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} className="text-center">
                    <CardContent className="p-6">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-7 w-7" />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold">
                        {language === 'en' ? value.titleEn : value.titleBn}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language === 'en' ? value.descEn : value.descBn}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="section-padding bg-section-alt">
          <div className="container-custom">
            <h2 className="mb-12 text-center text-3xl font-bold">
              {language === 'en' ? 'Our Journey' : 'আমাদের যাত্রা'}
            </h2>
            <div className="relative mx-auto max-w-3xl">
              <div className="absolute left-4 top-0 h-full w-0.5 bg-border md:left-1/2 md:-ml-px" />
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`relative mb-8 flex items-start md:items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className="absolute left-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground md:left-1/2 md:-ml-4">
                    {item.year.slice(-2)}
                  </div>
                  <div className={`ml-16 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <Card>
                      <CardContent className="p-4">
                        <span className="text-sm font-bold text-primary">{item.year}</span>
                        <h3 className="font-semibold">
                          {language === 'en' ? item.titleEn : item.titleBn}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {language === 'en' ? item.descEn : item.descBn}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default About;
