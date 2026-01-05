import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, HelpCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

  return (
    <>
      <Helmet>
        <title>Pricing - Creation Tech | Transparent IT Service Pricing</title>
        <meta
          name="description"
          content="View Creation Tech's transparent pricing for web development, mobile apps, cloud solutions, and IT services. Get a quote for your project."
        />
      </Helmet>
      <Layout>
        {/* Hero */}
        <section className="gradient-hero py-20 lg:py-28">
          <div className="container-custom text-center">
            <h1 className="mb-4 text-4xl font-bold text-primary-foreground sm:text-5xl">
              {t('pricing.title')}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-primary-foreground/80">
              {t('pricing.subtitle')}
            </p>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid gap-8 lg:grid-cols-3">
              {pricingPlans.map((plan, index) => (
                <Card
                  key={index}
                  className={`relative ${plan.popular ? 'border-2 border-accent shadow-lg' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-accent text-accent-foreground">
                        {language === 'en' ? 'Most Popular' : 'সবচেয়ে জনপ্রিয়'}
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl">
                      {language === 'en' ? plan.nameEn : plan.nameBn}
                    </CardTitle>
                    <CardDescription>
                      {language === 'en' ? plan.descEn : plan.descBn}
                    </CardDescription>
                    <div className="mt-4 text-3xl font-bold text-primary">
                      {language === 'en' ? plan.priceEn : plan.priceBn}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="mb-6 space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                          <span className="text-sm">
                            {language === 'en' ? feature.en : feature.bn}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={plan.popular ? 'default' : 'outline'}
                      asChild
                    >
                      <Link to="/contact?type=quote">
                        {t('common.getQuote')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="section-padding bg-section-alt">
          <div className="container-custom">
            <h2 className="mb-12 text-center text-3xl font-bold">
              {language === 'en' ? 'Frequently Asked Questions' : 'সাধারণ প্রশ্নাবলী'}
            </h2>
            <div className="mx-auto max-w-3xl space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <div>
                        <h3 className="mb-2 font-semibold">
                          {language === 'en' ? faq.questionEn : faq.questionBn}
                        </h3>
                        <p className="text-sm text-muted-foreground">
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

        {/* CTA */}
        <section className="section-padding">
          <div className="container-custom text-center">
            <h2 className="mb-4 text-3xl font-bold">
              {language === 'en' ? 'Need a Custom Quote?' : 'কাস্টম কোটেশন প্রয়োজন?'}
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              {language === 'en'
                ? "Every project is unique. Contact us to discuss your specific requirements and get a tailored quote."
                : 'প্রতিটি প্রকল্প অনন্য। আপনার নির্দিষ্ট প্রয়োজনীয়তা আলোচনা করতে এবং একটি কাস্টম কোটেশন পেতে যোগাযোগ করুন।'}
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

export default Pricing;
