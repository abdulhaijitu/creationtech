import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, HelpCircle, Sparkles } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCMSContent } from '@/hooks/useCMSContent';

const pricingPlans = [
  {
    nameEn: 'Starter',
    nameBn: 'স্টার্টার',
    descEn: 'Perfect for small businesses getting started',
    descBn: 'শুরু করা ছোট ব্যবসার জন্য উপযুক্ত',
    priceEn: 'From $999',
    priceBn: '৯৯,০০০ টাকা থেকে',
    popular: false,
    features: [
      { en: 'Basic Website (5-10 pages)', bn: 'বেসিক ওয়েবসাইট (৫-১০ পেজ)' },
      { en: 'Responsive Design', bn: 'রেসপন্সিভ ডিজাইন' },
      { en: 'Contact Form Integration', bn: 'কন্টাক্ট ফর্ম ইন্টিগ্রেশন' },
      { en: 'Basic SEO Setup', bn: 'বেসিক SEO সেটআপ' },
      { en: '3 Months Support', bn: '৩ মাস সাপোর্ট' },
    ],
  },
  {
    nameEn: 'Professional',
    nameBn: 'প্রফেশনাল',
    descEn: 'Ideal for growing businesses',
    descBn: 'বৃদ্ধিশীল ব্যবসার জন্য আদর্শ',
    priceEn: 'From $2,999',
    priceBn: '২,৯৯,০০০ টাকা থেকে',
    popular: true,
    features: [
      { en: 'Custom Web Application', bn: 'কাস্টম ওয়েব অ্যাপ্লিকেশন' },
      { en: 'Database Integration', bn: 'ডেটাবেস ইন্টিগ্রেশন' },
      { en: 'Admin Dashboard', bn: 'অ্যাডমিন ড্যাশবোর্ড' },
      { en: 'Advanced SEO', bn: 'অ্যাডভান্সড SEO' },
      { en: 'Payment Integration', bn: 'পেমেন্ট ইন্টিগ্রেশন' },
      { en: '6 Months Support', bn: '৬ মাস সাপোর্ট' },
    ],
  },
  {
    nameEn: 'Enterprise',
    nameBn: 'এন্টারপ্রাইজ',
    descEn: 'For large-scale enterprise solutions',
    descBn: 'বড় মাপের এন্টারপ্রাইজ সলিউশনের জন্য',
    priceEn: 'Custom',
    priceBn: 'কাস্টম',
    popular: false,
    features: [
      { en: 'Enterprise Architecture', bn: 'এন্টারপ্রাইজ আর্কিটেকচার' },
      { en: 'Cloud Infrastructure', bn: 'ক্লাউড ইনফ্রাস্ট্রাকচার' },
      { en: 'API Development', bn: 'API ডেভেলপমেন্ট' },
      { en: 'Security Implementation', bn: 'সিকিউরিটি বাস্তবায়ন' },
      { en: 'DevOps Setup', bn: 'DevOps সেটআপ' },
      { en: 'Dedicated Support Team', bn: 'ডেডিকেটেড সাপোর্ট টিম' },
      { en: 'SLA Guarantee', bn: 'SLA গ্যারান্টি' },
    ],
  },
];

const faqs = [
  {
    questionEn: 'How do you determine project pricing?',
    questionBn: 'আপনারা কীভাবে প্রকল্পের মূল্য নির্ধারণ করেন?',
    answerEn: 'Pricing is based on project scope, complexity, timeline, and specific requirements. We provide detailed quotes after understanding your needs.',
    answerBn: 'মূল্য নির্ধারণ প্রকল্পের পরিধি, জটিলতা, সময়সীমা এবং নির্দিষ্ট প্রয়োজনীয়তার উপর ভিত্তি করে। আপনার প্রয়োজন বোঝার পরে আমরা বিস্তারিত কোটেশন প্রদান করি।',
  },
  {
    questionEn: 'What payment methods do you accept?',
    questionBn: 'আপনারা কোন পেমেন্ট পদ্ধতি গ্রহণ করেন?',
    answerEn: 'We accept bank transfers, credit cards, and popular mobile payment methods. For large projects, we offer milestone-based payment plans.',
    answerBn: 'আমরা ব্যাংক ট্রান্সফার, ক্রেডিট কার্ড এবং জনপ্রিয় মোবাইল পেমেন্ট পদ্ধতি গ্রহণ করি।',
  },
  {
    questionEn: 'Do you offer ongoing maintenance?',
    questionBn: 'আপনারা কি চলমান রক্ষণাবেক্ষণ অফার করেন?',
    answerEn: 'Yes, we offer monthly maintenance packages starting from $199/month that include updates, backups, security monitoring, and technical support.',
    answerBn: 'হ্যাঁ, আমরা $১৯৯/মাস থেকে শুরু করে মাসিক রক্ষণাবেক্ষণ প্যাকেজ অফার করি।',
  },
  {
    questionEn: 'What is your typical project timeline?',
    questionBn: 'আপনাদের সাধারণ প্রকল্প সময়সীমা কত?',
    answerEn: 'Timelines vary by project. A basic website takes 2-4 weeks, custom applications 2-4 months, and enterprise solutions 4-12 months.',
    answerBn: 'প্রকল্প অনুযায়ী সময়সীমা পরিবর্তিত হয়। একটি বেসিক ওয়েবসাইট ২-৪ সপ্তাহ, কাস্টম অ্যাপ্লিকেশন ২-৪ মাস এবং এন্টারপ্রাইজ সলিউশন ৪-১২ মাস সময় নেয়।',
  },
];

const Pricing = () => {
  const { t, language } = useLanguage();
  const { getSectionText, getMetaTitle, getMetaDescription } = useCMSContent({ pageSlug: 'pricing' });

  // CMS content with fallbacks
  const heroTitle = getSectionText('hero', 'title', language === 'en' ? 'Pricing' : 'মূল্য');
  const heroSubtitle = getSectionText('hero', 'content', language === 'en' ? 'Transparent pricing for quality solutions' : 'মানসম্মত সমাধানের জন্য স্বচ্ছ মূল্য');
  const ctaTitle = getSectionText('cta', 'title', language === 'en' ? 'Need a Custom Quote?' : 'কাস্টম কোটেশন প্রয়োজন?');
  const ctaContent = getSectionText('cta', 'content', language === 'en' ? 'Every project is unique. Contact us to discuss your specific requirements and get a tailored quote.' : 'প্রতিটি প্রকল্প অনন্য। আপনার নির্দিষ্ট প্রয়োজনীয়তা আলোচনা করতে এবং একটি কাস্টম কোটেশন পেতে যোগাযোগ করুন।');

  return (
    <>
      <Helmet>
        <title>{getMetaTitle('Pricing - Creation Tech | Transparent IT Service Pricing')}</title>
        <meta
          name="description"
          content={getMetaDescription("View Creation Tech's transparent pricing for web development, mobile apps, cloud solutions, and IT services. Get a quote for your project.")}
        />
      </Helmet>
      <Layout>
        {/* Hero Section */}
        <section className="relative overflow-hidden gradient-hero section-padding">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }} />
          </div>
          
          <div className="container-custom relative">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-6 bg-white/10 text-primary-foreground border-white/20 backdrop-blur-sm">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                {language === 'en' ? 'Transparent Pricing' : 'স্বচ্ছ মূল্য'}
              </Badge>
              
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
                {heroTitle}
              </h1>
              
              <p className="text-lg leading-relaxed text-primary-foreground/80 sm:text-xl">
                {heroSubtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="section-padding bg-section-light">
          <div className="container-custom">
            <div className="grid gap-8 lg:grid-cols-3">
              {pricingPlans.map((plan, index) => (
                <Card
                  key={index}
                  className={`group relative transition-all duration-300 hover:shadow-card-hover ${
                    plan.popular 
                      ? 'border-2 border-primary shadow-lg ring-1 ring-primary/10 scale-[1.02] lg:scale-105' 
                      : 'border-border/40 hover:border-border/60'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground shadow-md px-4 py-1">
                        <Sparkles className="mr-1.5 h-3 w-3" />
                        {language === 'en' ? 'Most Popular' : 'সবচেয়ে জনপ্রিয়'}
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4 pt-8">
                    <CardTitle className="text-2xl font-bold">
                      {language === 'en' ? plan.nameEn : plan.nameBn}
                    </CardTitle>
                    <CardDescription className="mt-2 text-muted-foreground">
                      {language === 'en' ? plan.descEn : plan.descBn}
                    </CardDescription>
                    <div className="mt-6">
                      <span className="text-4xl font-bold text-foreground">
                        {language === 'en' ? plan.priceEn : plan.priceBn}
                      </span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-2 pb-8">
                    <ul className="mb-8 space-y-4">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <Check className="h-3 w-3 text-primary" />
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {language === 'en' ? feature.en : feature.bn}
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      className="w-full"
                      variant={plan.popular ? 'default' : 'outline'}
                      size="lg"
                      asChild
                    >
                      <Link to="/contact?type=quote">
                        {t('common.getQuote')}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                {language === 'en' ? 'Frequently Asked Questions' : 'সাধারণ প্রশ্নাবলী'}
              </h2>
              <p className="text-lg text-muted-foreground">
                {language === 'en' 
                  ? 'Everything you need to know about our pricing and process'
                  : 'আমাদের মূল্য এবং প্রক্রিয়া সম্পর্কে আপনার জানা দরকার সবকিছু'}
              </p>
            </div>
            
            <div className="mx-auto max-w-3xl space-y-4">
              {faqs.map((faq, index) => (
                <Card 
                  key={index} 
                  className="border-border/40 transition-all duration-200 hover:border-border/60 hover:shadow-card"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/8">
                        <HelpCircle className="h-5 w-5 text-primary" />
                      </span>
                      <div>
                        <h3 className="mb-2 text-base font-semibold text-foreground">
                          {language === 'en' ? faq.questionEn : faq.questionBn}
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {language === 'en' ? faq.answerEn : faq.answerBn}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden gradient-hero section-padding">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }} />
          </div>
          
          <div className="container-custom relative">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-5 text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                {ctaTitle}
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-primary-foreground/80">
                {ctaContent}
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="min-w-[180px] bg-white text-primary hover:bg-white/90"
                  asChild
                >
                  <Link to="/contact">
                    {t('common.contactUs')}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="min-w-[180px] border-white/30 text-primary-foreground hover:bg-white/10"
                  asChild
                >
                  <Link to="/contact?tab=meeting">
                    {t('common.bookMeeting')}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Pricing;
